<?php

namespace App\Services;

use App\Repositories\Contracts\PermissionRepositoryInterface;
use Spatie\Permission\Models\Permission;

class PermissionService
{
    /**
     * PermissionService constructor
     *
     * @param  PermissionRepositoryInterface  $permissionRepository
     */
    public function __construct(
        private PermissionRepositoryInterface $permissionRepository
    ) {}

    /**
     * Get all permissions
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllPermissions(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->permissionRepository->all();
    }

    /**
     * Get permissions grouped by category
     *
     * @return array
     */
    public function getGroupedPermissions(): array
    {
        return $this->permissionRepository->getGroupedByCategory();
    }

    /**
     * Get permission options for dropdown
     *
     * @return array
     */
    public function getPermissionOptions(): array
    {
        return $this->permissionRepository->getPermissionOptions();
    }

    /**
     * Get permissions for a specific role
     *
     * @param  int  $roleId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getPermissionsByRole(int $roleId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->permissionRepository->getByRole($roleId);
    }

    /**
     * Create a new permission
     *
     * @param  array  $data
     * @return Permission
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
     *
     * @param  array  $permissions
     * @return bool
     */
    public function bulkCreatePermissions(array $permissions): bool
    {
        return $this->permissionRepository->bulkCreate($permissions);
    }

    /**
     * Find permission by name
     *
     * @param  string  $name
     * @return Permission|null
     */
    public function findByName(string $name): ?Permission
    {
        return $this->permissionRepository->findByName($name);
    }

    /**
     * Find permission by ID
     *
     * @param  int  $id
     * @return Permission
     */
    public function findPermission(int $id): Permission
    {
        return $this->permissionRepository->findOrFail($id);
    }

    /**
     * Update an existing permission
     *
     * @param  int  $id
     * @param  array  $data
     * @return Permission
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
     *
     * @param  int  $id
     * @return bool
     */
    public function deletePermission(int $id): bool
    {
        return $this->permissionRepository->delete($id);
    }

    /**
     * Get query builder for DataTables
     *
     * @param  array  $filters
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function getDataTableData(array $filters): \Illuminate\Database\Eloquent\Builder
    {
        $searchTerm = $filters['search'] ?? null;
        $query = $this->permissionRepository->query();

        if (! empty($searchTerm)) {
            $query->where('name', 'like', "%{$searchTerm}%");
        }

        return $query;
    }
}
