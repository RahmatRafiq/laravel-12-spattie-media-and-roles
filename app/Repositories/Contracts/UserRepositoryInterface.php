<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get all active users with roles
     */
    public function getActiveUsers(): Collection;

    /**
     * Get only trashed users with roles
     */
    public function getTrashedUsers(): Collection;

    /**
     * Get all users including trashed with roles
     */
    public function getAllIncludingTrashed(): Collection;

    /**
     * Get users with their roles loaded
     */
    public function getUsersWithRoles(): Collection;

    /**
     * Search users by name or email
     */
    public function searchUsers(string $query): Collection;

    /**
     * Get query builder for DataTables
     */
    public function forDataTable(array $filters = []): Builder;

    /**
     * Find a trashed user by ID
     */
    public function findTrashed(int $id): ?User;

    /**
     * Restore a soft deleted user
     */
    public function restore(int $id): bool;

    /**
     * Permanently delete a user
     */
    public function forceDelete(int $id): bool;

    /**
     * Get total count based on filter
     */
    public function getTotalCount(?string $filter = null): int;
}
