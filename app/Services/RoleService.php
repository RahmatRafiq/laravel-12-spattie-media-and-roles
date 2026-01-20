<?php

namespace App\Services;

use App\Repositories\Contracts\RoleRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Spatie\Permission\Models\Role;

class RoleService
{
    /**
     * RoleService constructor
     */
    public function __construct(
        private RoleRepositoryInterface $roleRepository
    ) {}

    /**
     * Get query builder for DataTables
     */
    public function getDataTableData(array $filters): Builder
    {
        return $this->roleRepository->forDataTable($filters);
    }

    /**
     * Get all roles with permissions
     */
    public function getAllRoles(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->roleRepository->getRolesWithPermissions();
    }

    /**
     * Get role options for dropdown
     */
    public function getRoleOptions(): array
    {
        return $this->roleRepository->getRoleOptions();
    }

    /**
     * Create a new role
     */
    public function createRole(array $data): Role
    {
        $role = $this->roleRepository->create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        // Sync permissions if provided
        if (isset($data['permissions']) && is_array($data['permissions'])) {
            $this->roleRepository->syncPermissions($role->id, $data['permissions']);
        }

        return $role->fresh(['permissions']);
    }

    /**
     * Update an existing role
     */
    public function updateRole(int $id, array $data): Role
    {
        $role = $this->roleRepository->update($id, [
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        // Sync permissions if provided
        if (isset($data['permissions']) && is_array($data['permissions'])) {
            $this->roleRepository->syncPermissions($role->id, $data['permissions']);
        }

        return $role->fresh(['permissions']);
    }

    /**
     * Delete a role
     */
    public function deleteRole(int $id): bool
    {
        return $this->roleRepository->delete($id);
    }

    /**
     * Find role by ID
     */
    public function findRole(int $id): Role
    {
        return $this->roleRepository->findOrFail($id);
    }

    /**
     * Search roles
     */
    public function searchRoles(string $query): \Illuminate\Database\Eloquent\Collection
    {
        return $this->roleRepository->searchRoles($query);
    }
}
