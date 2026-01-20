<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface PermissionRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get all permissions grouped by category
     *
     * @return array
     */
    public function getGroupedByCategory(): array;

    /**
     * Get permissions for select dropdown
     *
     * @return array
     */
    public function getPermissionOptions(): array;

    /**
     * Find permission by name
     *
     * @param  string  $name
     * @return \Spatie\Permission\Models\Permission|null
     */
    public function findByName(string $name): ?\Spatie\Permission\Models\Permission;

    /**
     * Get permissions assigned to a role
     *
     * @param  int  $roleId
     * @return Collection
     */
    public function getByRole(int $roleId): Collection;

    /**
     * Bulk create permissions
     *
     * @param  array  $permissions
     * @return bool
     */
    public function bulkCreate(array $permissions): bool;
}
