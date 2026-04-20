<?php

namespace App\Services;

use Spatie\Permission\Models\Permission;

class PermissionService
{
    /**
     * Get all permissions
     */
    public function getAllPermissions(): \Illuminate\Database\Eloquent\Collection
    {
        return Permission::all();
    }

    /**
     * Get permissions grouped by category
     */
    public function getGroupedPermissions(): array
    {
        $permissions = Permission::all();

        $grouped = [
            'User Management' => [],
            'Role & Permission' => [],
            'File Management' => [],
            'General' => [],
        ];

        foreach ($permissions as $permission) {
            $name = $permission->name;

            if (str_contains($name, 'user')) {
                $grouped['User Management'][] = $permission;
            } elseif (str_contains($name, 'role') || str_contains($name, 'permission')) {
                $grouped['Role & Permission'][] = $permission;
            } elseif (str_contains($name, 'gallery') || str_contains($name, 'file') || str_contains($name, 'folder')) {
                $grouped['File Management'][] = $permission;
            } else {
                $grouped['General'][] = $permission;
            }
        }

        // Remove empty categories
        return array_filter($grouped, fn ($items) => ! empty($items));
    }

    /**
     * Get permission options for dropdown
     */
    public function getPermissionOptions(): array
    {
        return Permission::pluck('name', 'id')->toArray();
    }

    /**
     * Get permissions for a specific role
     */
    public function getPermissionsByRole(int $roleId): \Illuminate\Database\Eloquent\Collection
    {
        return Permission::whereHas('roles', function ($query) use ($roleId) {
            $query->where('roles.id', $roleId);
        })->get();
    }

    /**
     * Create a new permission
     */
    public function createPermission(array $data): Permission
    {
        return Permission::create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);
    }

    /**
     * Bulk create permissions
     */
    public function bulkCreatePermissions(array $permissions): bool
    {
        try {
            foreach ($permissions as $permission) {
                Permission::firstOrCreate([
                    'name' => $permission['name'],
                    'guard_name' => $permission['guard_name'] ?? 'web',
                ]);
            }
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Find permission by name
     */
    public function findByName(string $name): ?Permission
    {
        return Permission::where('name', $name)->first();
    }

    /**
     * Find permission by ID
     */
    public function findPermission(int $id): Permission
    {
        return Permission::findOrFail($id);
    }

    /**
     * Update an existing permission
     */
    public function updatePermission(int $id, array $data): Permission
    {
        $permission = Permission::findOrFail($id);
        
        $permission->update([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        return $permission;
    }

    /**
     * Delete a permission
     */
    public function deletePermission(int $id): bool
    {
        return Permission::findOrFail($id)->delete();
    }

    /**
     * Get Paginated Permissions for DataTables
     * 
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPaginatedPermissions(array $params): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $query = $this->getDataTableQuery();

        return \App\Helpers\DataTable::process(
            $query,
            $params,
            searchableColumns: ['name', 'guard_name'],
        );
    }

    /**
     * Get Query Builder for DataTables
     */
    public function getDataTableQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return Permission::query();
    }
}
