<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseRepository implements BaseRepositoryInterface
{
    /**
     * The model instance
     */
    protected Model $model;

    /**
     * Relations to eager load
     */
    protected array $relations = [];

    /**
     * BaseRepository constructor
     *
     * @param  Model  $model
     */
    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * Get all records
     *
     * @param  array  $columns
     * @return Collection
     */
    public function all(array $columns = ['*']): Collection
    {
        $query = $this->model->newQuery();

        if (! empty($this->relations)) {
            $query->with($this->relations);
        }

        return $query->get($columns);
    }

    /**
     * Find a record by ID
     *
     * @param  int  $id
     * @param  array  $columns
     * @return Model|null
     */
    public function find(int $id, array $columns = ['*']): ?Model
    {
        $query = $this->model->newQuery();

        if (! empty($this->relations)) {
            $query->with($this->relations);
        }

        return $query->find($id, $columns);
    }

    /**
     * Find a record by ID or fail
     *
     * @param  int  $id
     * @param  array  $columns
     * @return Model
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function findOrFail(int $id, array $columns = ['*']): Model
    {
        $query = $this->model->newQuery();

        if (! empty($this->relations)) {
            $query->with($this->relations);
        }

        return $query->findOrFail($id, $columns);
    }

    /**
     * Create a new record
     *
     * @param  array  $data
     * @return Model
     */
    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    /**
     * Update a record by ID
     *
     * @param  int  $id
     * @param  array  $data
     * @return Model
     */
    public function update(int $id, array $data): Model
    {
        $model = $this->findOrFail($id);
        $model->update($data);

        return $model->fresh();
    }

    /**
     * Delete a record by ID
     *
     * @param  int  $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $model = $this->findOrFail($id);

        return $model->delete();
    }

    /**
     * Load relationships
     *
     * @param  array  $relations
     * @return self
     */
    public function with(array $relations): self
    {
        $this->relations = $relations;

        return $this;
    }

    /**
     * Paginate records
     *
     * @param  int  $perPage
     * @param  array  $columns
     * @return LengthAwarePaginator
     */
    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        $query = $this->model->newQuery();

        if (! empty($this->relations)) {
            $query->with($this->relations);
        }

        return $query->paginate($perPage, $columns);
    }

    /**
     * Find records by column value
     *
     * @param  string  $column
     * @param  mixed  $value
     * @param  array  $columns
     * @return Collection
     */
    public function findBy(string $column, mixed $value, array $columns = ['*']): Collection
    {
        $query = $this->model->newQuery();

        if (! empty($this->relations)) {
            $query->with($this->relations);
        }

        return $query->where($column, $value)->get($columns);
    }

    /**
     * Find first record by column value
     *
     * @param  string  $column
     * @param  mixed  $value
     * @param  array  $columns
     * @return Model|null
     */
    public function findFirstBy(string $column, mixed $value, array $columns = ['*']): ?Model
    {
        $query = $this->model->newQuery();

        if (! empty($this->relations)) {
            $query->with($this->relations);
        }

        return $query->where($column, $value)->first($columns);
    }

    /**
     * Count all records
     *
     * @return int
     */
    public function count(): int
    {
        return $this->model->newQuery()->count();
    }

    /**
     * Check if record exists
     *
     * @param  int  $id
     * @return bool
     */
    public function exists(int $id): bool
    {
        return $this->model->newQuery()->where('id', $id)->exists();
    }

    /**
     * Get new query builder instance
     *
     * @return Builder
     */
    protected function newQuery(): Builder
    {
        $query = $this->model->newQuery();

        if (! empty($this->relations)) {
            $query->with($this->relations);
        }

        return $query;
    }

    /**
     * Reset relations
     *
     * @return void
     */
    protected function resetRelations(): void
    {
        $this->relations = [];
    }
}
