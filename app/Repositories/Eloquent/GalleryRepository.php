<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\GalleryRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class GalleryRepository extends BaseRepository implements GalleryRepositoryInterface
{
    /**
     * GalleryRepository constructor
     *
     * @param  Media  $model
     */
    public function __construct(Media $model)
    {
        parent::__construct($model);
    }

    /**
     * Get all unique disk names from media
     *
     * @return array
     */
    public function getAllDisks(): array
    {
        return $this->model->select('disk')
            ->distinct()
            ->pluck('disk')
            ->toArray();
    }

    /**
     * Get media by collection and disks
     *
     * @param  string  $collection
     * @param  array  $disks
     * @return Builder
     */
    public function getByCollectionAndDisks(string $collection, array $disks): Builder
    {
        $query = $this->model->newQuery()
            ->where('collection_name', $collection);

        if (! empty($disks)) {
            $query->whereIn('disk', $disks);
        } else {
            // If no disks match criteria, return empty result
            $query->whereRaw('1=0');
        }

        return $query;
    }

    /**
     * Get query builder for DataTables
     *
     * @param  array  $filters
     * @return Builder
     */
    public function forDataTable(array $filters = []): Builder
    {
        $visibility = $filters['visibility'] ?? 'public';
        $collection = $filters['collection'] ?? 'gallery';
        $disks = $filters['disks'] ?? [];

        return $this->getByCollectionAndDisks($collection, $disks);
    }

    /**
     * Get media by collection name
     *
     * @param  string  $collection
     * @return Collection
     */
    public function getByCollection(string $collection): Collection
    {
        return $this->model->where('collection_name', $collection)
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * Get folders tree structure
     *
     * @return array
     */
    public function getFoldersTree(): array
    {
        // This will be implemented based on your folder structure
        // For now, return empty array as folder system needs custom implementation
        return [];
    }

    /**
     * Find media by UUID
     *
     * @param  string  $uuid
     * @return Media|null
     */
    public function findByUuid(string $uuid): ?Media
    {
        return $this->model->where('uuid', $uuid)->first();
    }

    /**
     * Delete media and its file
     *
     * @param  int  $id
     * @return bool
     */
    public function deleteMedia(int $id): bool
    {
        $media = $this->find($id);

        if (! $media) {
            return false;
        }

        return $media->delete();
    }

    /**
     * Get media statistics
     *
     * @return array
     */
    public function getStatistics(): array
    {
        $totalMedia = $this->count();
        $totalSize = $this->model->sum('size');
        $collections = $this->model->select('collection_name')
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
     *
     * @param  int  $bytes
     * @param  int  $precision
     * @return string
     */
    private function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, $precision).' '.$units[$i];
    }
}
