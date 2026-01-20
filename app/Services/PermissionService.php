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
}
