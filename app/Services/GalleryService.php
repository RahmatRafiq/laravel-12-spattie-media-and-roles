<?php

namespace App\Services;

use App\Repositories\Contracts\GalleryRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Config;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class GalleryService
{
    /**
     * GalleryService constructor
     */
    public function __construct(
        private GalleryRepositoryInterface $galleryRepository
    ) {}

    /**
     * Classify disks by visibility (public/private)
     * Extracted from GalleryController::index()
     */
    public function classifyDisksByVisibility(): array
    {
        $allDisks = $this->galleryRepository->getAllDisks();
        $publicDisks = [];
        $privateDisks = [];

        foreach ($allDisks as $disk) {
            $diskConfig = Config::get("filesystems.disks.{$disk}");

            if ($this->isPublicDisk($diskConfig)) {
                $publicDisks[] = $disk;
            } else {
                $privateDisks[] = $disk;
            }
        }

        return [
            'public' => $publicDisks,
            'private' => $privateDisks,
        ];
    }

    /**
     * Check if disk is public based on configuration
     */
    private function isPublicDisk(?array $diskConfig): bool
    {
        if (! $diskConfig) {
            return false;
        }

        return ($diskConfig['driver'] ?? null) === 'local'
            && isset($diskConfig['url'])
            && str_contains($diskConfig['url'], '/storage');
    }

    /**
     * Get media query by visibility
     */
    public function getMediaByVisibility(string $visibility, string $collection = 'gallery'): Builder
    {
        $disks = $this->classifyDisksByVisibility();
        $selectedDisks = $visibility === 'public' ? $disks['public'] : $disks['private'];

        return $this->galleryRepository->getByCollectionAndDisks($collection, $selectedDisks);
    }

    /**
     * Get query builder for DataTables
     */
    public function getDataTableData(array $filters): Builder
    {
        $visibility = $filters['visibility'] ?? 'public';
        $collection = $filters['collection'] ?? 'gallery';

        $disks = $this->classifyDisksByVisibility();
        $selectedDisks = $visibility === 'public' ? $disks['public'] : $disks['private'];

        return $this->galleryRepository->forDataTable([
            'visibility' => $visibility,
            'collection' => $collection,
            'disks' => $selectedDisks,
        ]);
    }

    /**
     * Get media by collection
     */
    public function getByCollection(string $collection): \Illuminate\Database\Eloquent\Collection
    {
        return $this->galleryRepository->getByCollection($collection);
    }

    /**
     * Get all unique collections
     */
    public function getAllCollections(): array
    {
        return Media::select('collection_name')
            ->distinct()
            ->pluck('collection_name')
            ->toArray();
    }

    /**
     * Find media by ID
     */
    public function findMedia(int $id): Media
    {
        return $this->galleryRepository->findOrFail($id);
    }

    /**
     * Find media by UUID
     */
    public function findMediaByUuid(string $uuid): ?Media
    {
        return $this->galleryRepository->findByUuid($uuid);
    }

    /**
     * Delete media
     */
    public function deleteMedia(int $id): bool
    {
        return $this->galleryRepository->deleteMedia($id);
    }

    /**
     * Get media statistics
     */
    public function getStatistics(): array
    {
        return $this->galleryRepository->getStatistics();
    }

    /**
     * Generate URL for media based on visibility
     */
    public function getMediaUrl(Media $media): string
    {
        // For public disks or profile images, use Spatie's built-in URL
        if ($media->disk === 'public' || str_contains($media->disk, 'profile-images')) {
            return $media->getUrl();
        }

        // For private files, use protected route
        return route('gallery.file', $media->id);
    }

    /**
     * Check if user can access media file
     */
    public function canAccessMedia(Media $media, \App\Models\User $user): bool
    {
        // Public files are accessible to all authenticated users
        if ($media->disk === 'public') {
            return true;
        }

        // Admin can access all files
        if ($user->hasRole('admin')) {
            return true;
        }

        // Check ownership based on model type
        if ($media->model_type === \App\Models\Gallery::class) {
            $gallery = \App\Models\Gallery::find($media->model_id);

            return $gallery && $gallery->user_id === $user->id;
        }

        if ($media->model_type === \App\Models\User::class) {
            return $media->model_id === $user->id;
        }

        return false;
    }

    /**
     * Create media from uploaded file
     */
    public function createMediaFromUpload(
        \Illuminate\Http\UploadedFile $file,
        int $userId,
        string $visibility = 'public',
        ?int $folderId = null
    ): Media {
        $diskName = $visibility === 'public' ? 'public' : 'local';

        // Create Gallery record
        $gallery = \App\Models\Gallery::create([
            'name' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'user_id' => $userId,
            'folder_id' => $folderId,
        ]);

        // Add media to gallery
        $gallery->addMedia($file)
            ->usingName(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME))
            ->withCustomProperties(['visibility' => $visibility, 'uploaded_by' => $userId])
            ->toMediaCollection('gallery', $diskName);

        // Update media with folder_id if provided
        if ($folderId) {
            $media = $gallery->getFirstMedia('gallery');
            if ($media) {
                $media->folder_id = (int) $folderId;
                $media->save();
            }

            return $media;
        }

        return $gallery->getFirstMedia('gallery');
    }

    /**
     * Get media visibility from disk or custom properties
     */
    public function getMediaVisibility(Media $media): string
    {
        if ($media->disk === 'local' || $media->disk === 'private') {
            return 'private';
        }

        return $media->custom_properties['visibility'] ?? 'public';
    }
}
