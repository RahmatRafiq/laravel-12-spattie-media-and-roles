<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface PermissionRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get all permissions grouped by category
     */
    public function getGroupedByCategory(): array;

    /**
     * Get permissions for select dropdown
     */
    public function getPermissionOptions(): array;

    /**
     * Find permission by name
     */
    public function findByName(string $name): ?\Spatie\Permission\Models\Permission;

    /**
     * Get permissions assigned to a role
     */
    public function getByRole(int $roleId): Collection;

    /**
     * Bulk create permissions
     */
    public function bulkCreate(array $permissions): bool;
}
