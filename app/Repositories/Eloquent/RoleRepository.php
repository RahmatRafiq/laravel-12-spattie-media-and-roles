<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\RoleRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Spatie\Permission\Models\Role;

class RoleRepository extends BaseRepository implements RoleRepositoryInterface
{
    /**
     * RoleRepository constructor
     */
    public function __construct(Role $model)
    {
        parent::__construct($model);
    }

    /**
     * Get all roles with permissions loaded
     */
    public function getRolesWithPermissions(): Collection
    {
        return $this->newQuery()
            ->with('permissions')
            ->get();
    }

    /**
     * Get query builder for DataTables
     */
    public function forDataTable(array $filters = []): Builder
    {
        $search = $filters['search'] ?? null;

        $query = $this->model->with('permissions');

        // Apply search filter
        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('guard_name', 'like', "%{$search}%");
            });
        }

        return $query;
    }

    /**
     * Search roles by name or guard name
     */
    public function searchRoles(string $query): Collection
    {
        return $this->newQuery()
            ->with('permissions')
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('guard_name', 'like', "%{$query}%");
            })
            ->get();
    }

    /**
     * Find role by name
     */
    public function findByName(string $name): ?Role
    {
        return $this->model->where('name', $name)->first();
    }

    /**
     * Sync permissions for a role
     */
    public function syncPermissions(int $roleId, array $permissionIds): void
    {
        $role = $this->findOrFail($roleId);
        $role->syncPermissions($permissionIds);
    }

    /**
     * Get role options for select dropdown
     */
    public function getRoleOptions(): array
    {
        return $this->model->pluck('name', 'id')->toArray();
    }
}
