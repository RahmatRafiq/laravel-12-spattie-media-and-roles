<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

interface RoleRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get all roles with permissions loaded
     *
     * @return Collection
     */
    public function getRolesWithPermissions(): Collection;

    /**
     * Get query builder for DataTables
     *
     * @param  array  $filters
     * @return Builder
     */
    public function forDataTable(array $filters = []): Builder;

    /**
     * Search roles by name or guard name
     *
     * @param  string  $query
     * @return Collection
     */
    public function searchRoles(string $query): Collection;

    /**
     * Find role by name
     *
     * @param  string  $name
     * @return \Spatie\Permission\Models\Role|null
     */
    public function findByName(string $name): ?\Spatie\Permission\Models\Role;

    /**
     * Sync permissions for a role
     *
     * @param  int  $roleId
     * @param  array  $permissionIds
     * @return void
     */
    public function syncPermissions(int $roleId, array $permissionIds): void;

    /**
     * Get role options for select dropdown
     *
     * @return array
     */
    public function getRoleOptions(): array;
}
