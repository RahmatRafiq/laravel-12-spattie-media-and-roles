<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

interface GalleryRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get all unique disk names from media
     *
     * @return array
     */
    public function getAllDisks(): array;

    /**
     * Get media by collection and disks
     *
     * @param  string  $collection
     * @param  array  $disks
     * @return Builder
     */
    public function getByCollectionAndDisks(string $collection, array $disks): Builder;

    /**
     * Get query builder for DataTables
     *
     * @param  array  $filters
     * @return Builder
     */
    public function forDataTable(array $filters = []): Builder;

    /**
     * Get media by collection name
     *
     * @param  string  $collection
     * @return Collection
     */
    public function getByCollection(string $collection): Collection;

    /**
     * Get folders tree structure
     *
     * @return array
     */
    public function getFoldersTree(): array;

    /**
     * Find media by UUID
     *
     * @param  string  $uuid
     * @return \Spatie\MediaLibrary\MediaCollections\Models\Media|null
     */
    public function findByUuid(string $uuid): ?\Spatie\MediaLibrary\MediaCollections\Models\Media;

    /**
     * Delete media and its file
     *
     * @param  int  $id
     * @return bool
     */
    public function deleteMedia(int $id): bool;

    /**
     * Get media statistics
     *
     * @return array
     */
    public function getStatistics(): array;
}
