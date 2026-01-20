<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

interface BaseRepositoryInterface
{
    /**
     * Get all records
     *
     * @param  array  $columns
     * @return Collection
     */
    public function all(array $columns = ['*']): Collection;

    /**
     * Find a record by ID
     *
     * @param  int  $id
     * @param  array  $columns
     * @return Model|null
     */
    public function find(int $id, array $columns = ['*']): ?Model;

    /**
     * Find a record by ID or fail
     *
     * @param  int  $id
     * @param  array  $columns
     * @return Model
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function findOrFail(int $id, array $columns = ['*']): Model;

    /**
     * Create a new record
     *
     * @param  array  $data
     * @return Model
     */
    public function create(array $data): Model;

    /**
     * Update a record by ID
     *
     * @param  int  $id
     * @param  array  $data
     * @return Model
     */
    public function update(int $id, array $data): Model;

    /**
     * Delete a record by ID
     *
     * @param  int  $id
     * @return bool
     */
    public function delete(int $id): bool;

    /**
     * Load relationships
     *
     * @param  array  $relations
     * @return self
     */
    public function with(array $relations): self;

    /**
     * Paginate records
     *
     * @param  int  $perPage
     * @param  array  $columns
     * @return LengthAwarePaginator
     */
    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator;

    /**
     * Find records by column value
     *
     * @param  string  $column
     * @param  mixed  $value
     * @param  array  $columns
     * @return Collection
     */
    public function findBy(string $column, mixed $value, array $columns = ['*']): Collection;

    /**
     * Find first record by column value
     *
     * @param  string  $column
     * @param  mixed  $value
     * @param  array  $columns
     * @return Model|null
     */
    public function findFirstBy(string $column, mixed $value, array $columns = ['*']): ?Model;

    /**
     * Count all records
     *
     * @return int
     */
    public function count(): int;

    /**
     * Check if record exists
     *
     * @param  int  $id
     * @return bool
     */
    public function exists(int $id): bool;
}
