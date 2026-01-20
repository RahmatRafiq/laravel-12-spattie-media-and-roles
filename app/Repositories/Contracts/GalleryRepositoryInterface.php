<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

interface GalleryRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get all unique disk names from media
     */
    public function getAllDisks(): array;

    /**
     * Get media by collection and disks
     */
    public function getByCollectionAndDisks(string $collection, array $disks): Builder;

    /**
     * Get query builder for DataTables
     */
    public function forDataTable(array $filters = []): Builder;

    /**
     * Get media by collection name
     */
    public function getByCollection(string $collection): Collection;

    /**
     * Get folders tree structure
     */
    public function getFoldersTree(): array;

    /**
     * Find media by UUID
     */
    public function findByUuid(string $uuid): ?\Spatie\MediaLibrary\MediaCollections\Models\Media;

    /**
     * Delete media and its file
     */
    public function deleteMedia(int $id): bool;

    /**
     * Get media statistics
     */
    public function getStatistics(): array;
}
