<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\PermissionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Spatie\Permission\Models\Permission;

class PermissionRepository extends BaseRepository implements PermissionRepositoryInterface
{
    /**
     * PermissionRepository constructor
     */
    public function __construct(Permission $model)
    {
        parent::__construct($model);
    }

    /**
     * Get all permissions grouped by category
     */
    public function getGroupedByCategory(): array
    {
        $permissions = $this->all();

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
     * Get permissions for select dropdown
     */
    public function getPermissionOptions(): array
    {
        return $this->model->pluck('name', 'id')->toArray();
    }

    /**
     * Find permission by name
     */
    public function findByName(string $name): ?Permission
    {
        return $this->model->where('name', $name)->first();
    }

    /**
     * Get permissions assigned to a role
     */
    public function getByRole(int $roleId): Collection
    {
        return $this->model->whereHas('roles', function ($query) use ($roleId) {
            $query->where('roles.id', $roleId);
        })->get();
    }

    /**
     * Bulk create permissions
     */
    public function bulkCreate(array $permissions): bool
    {
        try {
            foreach ($permissions as $permission) {
                $this->model->firstOrCreate([
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
     * Get query builder for DataTables
     */
    public function forDataTable(array $filters = []): \Illuminate\Database\Eloquent\Builder
    {
        $search = $filters['search'] ?? null;

        $query = $this->model->newQuery();

        // Apply search filter
        if (! empty($search)) {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query;
    }
}
