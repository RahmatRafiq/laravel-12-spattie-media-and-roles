<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

interface BaseRepositoryInterface
{
    /**
     * Get all records
     */
    public function all(array $columns = ['*']): Collection;

    /**
     * Find a record by ID
     */
    public function find(int $id, array $columns = ['*']): ?Model;

    /**
     * Find a record by ID or fail
     *
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function findOrFail(int $id, array $columns = ['*']): Model;

    /**
     * Create a new record
     */
    public function create(array $data): Model;

    /**
     * Update a record by ID
     */
    public function update(int $id, array $data): Model;

    /**
     * Delete a record by ID
     */
    public function delete(int $id): bool;

    /**
     * Load relationships
     */
    public function with(array $relations): self;

    /**
     * Paginate records
     */
    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator;

    /**
     * Find records by column value
     */
    public function findBy(string $column, mixed $value, array $columns = ['*']): Collection;

    /**
     * Find first record by column value
     */
    public function findFirstBy(string $column, mixed $value, array $columns = ['*']): ?Model;

    /**
     * Count all records
     */
    public function count(): int;

    /**
     * Check if record exists
     */
    public function exists(int $id): bool;
}
