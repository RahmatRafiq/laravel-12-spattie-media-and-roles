<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

interface RoleRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get all roles with permissions loaded
     */
    public function getRolesWithPermissions(): Collection;

    /**
     * Get query builder for DataTables
     */
    public function forDataTable(array $filters = []): Builder;

    /**
     * Search roles by name or guard name
     */
    public function searchRoles(string $query): Collection;

    /**
     * Find role by name
     */
    public function findByName(string $name): ?\Spatie\Permission\Models\Role;

    /**
     * Sync permissions for a role
     */
    public function syncPermissions(int $roleId, array $permissionIds): void;

    /**
     * Get role options for select dropdown
     */
    public function getRoleOptions(): array;
}
