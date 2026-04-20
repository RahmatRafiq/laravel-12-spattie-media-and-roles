<?php

namespace App\Services;

use App\Models\FilemanagerFolder;
use Illuminate\Support\Facades\Config;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class GalleryService
{
    /**
     * Classify disks by visibility (public/private)
     */
    public function classifyDisksByVisibility(): array
    {
        $allDisks = Media::select('disk')
            ->distinct()
            ->pluck('disk')
            ->toArray();

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
     * Get paginated media by visibility and folder
     */
    public function getPaginatedMedia(array $params): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $visibility = $params['visibility'] ?? 'public';
        $collection = $params['collection_name'] ?? 'gallery';
        $folderId = $params['folder_id'] ?? null;

        $disks = $this->classifyDisksByVisibility();
        $selectedDisks = $visibility === 'public' ? $disks['public'] : $disks['private'];

        $query = Media::where('collection_name', $collection);

        if (! empty($selectedDisks)) {
            $query->whereIn('disk', $selectedDisks);
        } else {
            $query->whereRaw('1=0');
        }

        if ($folderId) {
            $query->where('folder_id', (int) $folderId);
        }

        return $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();
    }

    /**
     * Get all folders
     */
    public function getAllFolders(): \Illuminate\Database\Eloquent\Collection
    {
        return FilemanagerFolder::all();
    }

    /**
     * Check if folder can be deleted
     */
    public function canDeleteFolder(int $id): bool
    {
        $folder = FilemanagerFolder::findOrFail($id);

        $hasFiles = Media::where('folder_id', $id)->exists();
        if ($hasFiles) {
            return false;
        }

        if ($folder->children()->exists()) {
            return false;
        }

        return true;
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
        return Media::findOrFail($id);
    }

    /**
     * Find media by UUID
     */
    public function findMediaByUuid(string $uuid): ?Media
    {
        return Media::where('uuid', $uuid)->first();
    }

    /**
     * Delete media
     */
    public function deleteMedia(int $id): bool
    {
        $media = Media::find($id);

        if (! $media) {
            return false;
        }

        return $media->delete();
    }

    /**
     * Get media statistics
     */
    public function getStatistics(): array
    {
        $totalMedia = Media::count();
        $totalSize = Media::sum('size');
        $collections = Media::select('collection_name')
            ->distinct()
            ->pluck('collection_name')
            ->toArray();

        return [
            'total_media' => $totalMedia,
            'total_size' => $totalSize,
            'total_size_formatted' => $this->formatBytes($totalSize),
            'collections' => $collections,
            'collections_count' => count($collections),
        ];
    }

    /**
     * Format bytes to human readable format
     */
    private function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, $precision).' '.$units[$i];
    }

    /**
     * Create a new folder
     */
    public function createFolder(string $name, ?int $parentId = null): FilemanagerFolder
    {
        $path = $name;
        if ($parentId) {
            $parent = FilemanagerFolder::findOrFail($parentId);
            $path = $parent->path ? "{$parent->path}/{$name}" : $name;
        }

        return FilemanagerFolder::create([
            'name' => $name,
            'parent_id' => $parentId,
            'path' => $path,
        ]);
    }

    /**
     * Rename a folder
     */
    public function renameFolder(int $id, string $newName): FilemanagerFolder
    {
        $folder = FilemanagerFolder::findOrFail($id);
        $folder->name = $newName;

        if ($folder->parent_id) {
            $parent = FilemanagerFolder::findOrFail($folder->parent_id);
            $folder->path = $parent->path ? "{$parent->path}/{$newName}" : $newName;
        } else {
            $folder->path = $newName;
        }

        $folder->save();
        $this->updateChildrenPaths($folder);

        return $folder;
    }

    /**
     * Delete a folder
     */
    public function deleteFolder(int $id): bool
    {
        $folder = FilemanagerFolder::findOrFail($id);
        $folder->galleries()->update(['folder_id' => null]);

        return $folder->delete();
    }

    /**
     * Update paths for all children recursively
     */
    public function updateChildrenPaths(FilemanagerFolder $folder): void
    {
        foreach ($folder->children as $child) {
            $child->path = $folder->path ? "{$folder->path}/{$child->name}" : $child->name;
            $child->save();
            $this->updateChildrenPaths($child);
        }
    }

    /**
     * Toggle public sharing for a media item.
     */
    public function toggleSharing(int $mediaId, bool $isShared): Media
    {
        $media = Media::findOrFail($mediaId);
        $customProperties = $media->custom_properties;
        $customProperties['is_shared'] = $isShared;

        $media->custom_properties = $customProperties;
        $media->save();

        return $media;
    }

    /**
     * Get media by UUID only if it is shared.
     */
    public function getSharedMedia(string $uuid): ?Media
    {
        $media = Media::where('uuid', $uuid)->first();

        if (! $media) {
            return null;
        }

        // Check if is_shared is true in custom properties
        if (! ($media->custom_properties['is_shared'] ?? false)) {
            return null;
        }

        return $media;
    }

    /**
     * Generate public share URL.
     */
    public function getShareUrl(Media $media): string
    {
        return route('media.share', ['uuid' => $media->uuid]);
    }

    /**
     * Generate URL for media based on visibility
     */
    public function getMediaUrl(Media $media): string
    {
        if ($media->disk === 'public') {
            return $media->getUrl();
        }

        // If private, check if it is shared
        if ($media->custom_properties['is_shared'] ?? false) {
            return $this->getShareUrl($media);
        }

        return route('gallery.file', $media->id);
    }

    /**
     * Check if user can access media file
     */
    public function canAccessMedia(Media $media, \App\Models\User $user): bool
    {
        if ($media->disk === 'public') {
            return true;
        }

        if ($user->hasRole('admin')) {
            return true;
        }

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

        $gallery = \App\Models\Gallery::create([
            'name' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'user_id' => $userId,
            'folder_id' => $folderId,
        ]);

        $gallery->addMedia($file)
            ->usingName(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME))
            ->withCustomProperties(['visibility' => $visibility, 'uploaded_by' => $userId])
            ->toMediaCollection('gallery', $diskName);

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
