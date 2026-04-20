<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;
use Spatie\Permission\Models\Role;

class RoleService
{
    /**
     * Get Paginated Roles for DataTables
     * 
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPaginatedRoles(array $params): \Illuminate\Contracts\Pagination\LengthAwarePaginator
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
    public function getDataTableQuery(): Builder
    {
        return Role::with('permissions');
    }

    /**
     * Get all roles with permissions
     */
    public function getAllRoles(): \Illuminate\Database\Eloquent\Collection
    {
        return Role::with('permissions')->get();
    }

    /**
     * Get role options for dropdown
     */
    public function getRoleOptions(): array
    {
        return Role::pluck('name', 'id')->toArray();
    }

    /**
     * Create a new role
     */
    public function createRole(array $data): Role
    {
        $role = Role::create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        // Sync permissions if provided
        if (isset($data['permissions']) && is_array($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role->fresh(['permissions']);
    }

    /**
     * Update an existing role
     */
    public function updateRole(int $id, array $data): Role
    {
        $role = Role::findOrFail($id);
        
        $role->update([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        // Sync permissions if provided
        if (isset($data['permissions']) && is_array($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role->fresh(['permissions']);
    }

    /**
     * Delete a role
     */
    public function deleteRole(int $id): bool
    {
        return Role::findOrFail($id)->delete();
    }

    /**
     * Find role by ID
     */
    public function findRole(int $id): Role
    {
        return Role::findOrFail($id);
    }

    /**
     * Search roles
     */
    public function searchRoles(string $query): \Illuminate\Database\Eloquent\Collection
    {
        return Role::with('permissions')
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('guard_name', 'like', "%{$query}%");
            })
            ->get();
    }
}
