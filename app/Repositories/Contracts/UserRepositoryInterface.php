<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get all active users with roles
     *
     * @return Collection
     */
    public function getActiveUsers(): Collection;

    /**
     * Get only trashed users with roles
     *
     * @return Collection
     */
    public function getTrashedUsers(): Collection;

    /**
     * Get all users including trashed with roles
     *
     * @return Collection
     */
    public function getAllIncludingTrashed(): Collection;

    /**
     * Get users with their roles loaded
     *
     * @return Collection
     */
    public function getUsersWithRoles(): Collection;

    /**
     * Search users by name or email
     *
     * @param  string  $query
     * @return Collection
     */
    public function searchUsers(string $query): Collection;

    /**
     * Get query builder for DataTables
     *
     * @param  array  $filters
     * @return Builder
     */
    public function forDataTable(array $filters = []): Builder;

    /**
     * Find a trashed user by ID
     *
     * @param  int  $id
     * @return User|null
     */
    public function findTrashed(int $id): ?User;

    /**
     * Restore a soft deleted user
     *
     * @param  int  $id
     * @return bool
     */
    public function restore(int $id): bool;

    /**
     * Permanently delete a user
     *
     * @param  int  $id
     * @return bool
     */
    public function forceDelete(int $id): bool;

    /**
     * Get total count based on filter
     *
     * @param  string|null  $filter
     * @return int
     */
    public function getTotalCount(?string $filter = null): int;
}
