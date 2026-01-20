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
     *
     * @param  GalleryRepositoryInterface  $galleryRepository
     */
    public function __construct(
        private GalleryRepositoryInterface $galleryRepository
    ) {}

    /**
     * Classify disks by visibility (public/private)
     * Extracted from GalleryController::index()
     *
     * @return array
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
     *
     * @param  array|null  $diskConfig
     * @return bool
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
     *
     * @param  string  $visibility
     * @param  string  $collection
     * @return Builder
     */
    public function getMediaByVisibility(string $visibility, string $collection = 'gallery'): Builder
    {
        $disks = $this->classifyDisksByVisibility();
        $selectedDisks = $visibility === 'public' ? $disks['public'] : $disks['private'];

        return $this->galleryRepository->getByCollectionAndDisks($collection, $selectedDisks);
    }

    /**
     * Get query builder for DataTables
     *
     * @param  array  $filters
     * @return Builder
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
     *
     * @param  string  $collection
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByCollection(string $collection): \Illuminate\Database\Eloquent\Collection
    {
        return $this->galleryRepository->getByCollection($collection);
    }

    /**
     * Get all unique collections
     *
     * @return array
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
     *
     * @param  int  $id
     * @return Media
     */
    public function findMedia(int $id): Media
    {
        return $this->galleryRepository->findOrFail($id);
    }

    /**
     * Find media by UUID
     *
     * @param  string  $uuid
     * @return Media|null
     */
    public function findMediaByUuid(string $uuid): ?Media
    {
        return $this->galleryRepository->findByUuid($uuid);
    }

    /**
     * Delete media
     *
     * @param  int  $id
     * @return bool
     */
    public function deleteMedia(int $id): bool
    {
        return $this->galleryRepository->deleteMedia($id);
    }

    /**
     * Get media statistics
     *
     * @return array
     */
    public function getStatistics(): array
    {
        return $this->galleryRepository->getStatistics();
    }

    /**
     * Generate URL for media based on visibility
     *
     * @param  Media  $media
     * @return string
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
}
