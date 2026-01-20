<?php

namespace App\Services;

use App\Repositories\Contracts\PermissionRepositoryInterface;
use Spatie\Permission\Models\Permission;

class PermissionService
{
    /**
     * PermissionService constructor
     */
    public function __construct(
        private PermissionRepositoryInterface $permissionRepository
    ) {}

    /**
     * Get all permissions
     */
    public function getAllPermissions(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->permissionRepository->all();
    }

    /**
     * Get permissions grouped by category
     */
    public function getGroupedPermissions(): array
    {
        return $this->permissionRepository->getGroupedByCategory();
    }

    /**
     * Get permission options for dropdown
     */
    public function getPermissionOptions(): array
    {
        return $this->permissionRepository->getPermissionOptions();
    }

    /**
     * Get permissions for a specific role
     */
    public function getPermissionsByRole(int $roleId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->permissionRepository->getByRole($roleId);
    }

    /**
     * Create a new permission
     */
    public function createPermission(array $data): Permission
    {
        return $this->permissionRepository->create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);
    }

    /**
     * Bulk create permissions
     */
    public function bulkCreatePermissions(array $permissions): bool
    {
        return $this->permissionRepository->bulkCreate($permissions);
    }

    /**
     * Find permission by name
     */
    public function findByName(string $name): ?Permission
    {
        return $this->permissionRepository->findByName($name);
    }

    /**
     * Find permission by ID
     */
    public function findPermission(int $id): Permission
    {
        return $this->permissionRepository->findOrFail($id);
    }

    /**
     * Update an existing permission
     */
    public function updatePermission(int $id, array $data): Permission
    {
        return $this->permissionRepository->update($id, [
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);
    }

    /**
     * Delete a permission
     */
    public function deletePermission(int $id): bool
    {
        return $this->permissionRepository->delete($id);
    }

    /**
     * Get query builder for DataTables
     */
    public function getDataTableData(array $filters): \Illuminate\Database\Eloquent\Builder
    {
        return $this->permissionRepository->forDataTable($filters);
    }
}
