<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    /**
     * UserRepository constructor
     */
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    /**
     * Get all active users with roles
     */
    public function getActiveUsers(): Collection
    {
        return $this->newQuery()
            ->with('roles')
            ->get();
    }

    /**
     * Get only trashed users with roles
     */
    public function getTrashedUsers(): Collection
    {
        return $this->model->onlyTrashed()
            ->with('roles')
            ->get();
    }

    /**
     * Get all users including trashed with roles
     */
    public function getAllIncludingTrashed(): Collection
    {
        return $this->model->withTrashed()
            ->with('roles')
            ->get();
    }

    /**
     * Get users with their roles loaded
     */
    public function getUsersWithRoles(): Collection
    {
        return $this->newQuery()
            ->with('roles')
            ->get();
    }

    /**
     * Search users by name or email
     */
    public function searchUsers(string $query): Collection
    {
        return $this->newQuery()
            ->with('roles')
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('email', 'like', "%{$query}%");
            })
            ->get();
    }

    /**
     * Get query builder for DataTables
     */
    public function forDataTable(array $filters = []): Builder
    {
        $filter = $filters['status'] ?? 'active';
        $search = $filters['search'] ?? null;

        // Base query with filter
        $query = match ($filter) {
            'trashed' => $this->model->onlyTrashed()->with('roles'),
            'all' => $this->model->withTrashed()->with('roles'),
            default => $this->model->with('roles'),
        };

        // Apply search filter
        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return $query;
    }

    /**
     * Find a trashed user by ID
     */
    public function findTrashed(int $id): ?User
    {
        return $this->model->onlyTrashed()->find($id);
    }

    /**
     * Restore a soft deleted user
     */
    public function restore(int $id): bool
    {
        $user = $this->findTrashed($id);

        if (! $user) {
            return false;
        }

        return $user->restore();
    }

    /**
     * Permanently delete a user
     */
    public function forceDelete(int $id): bool
    {
        $user = $this->findTrashed($id);

        if (! $user) {
            return false;
        }

        return $user->forceDelete();
    }

    /**
     * Get total count based on filter
     */
    public function getTotalCount(?string $filter = null): int
    {
        return match ($filter) {
            'trashed' => $this->model->onlyTrashed()->count(),
            'all' => $this->model->withTrashed()->count(),
            default => $this->model->count(),
        };
    }
}
