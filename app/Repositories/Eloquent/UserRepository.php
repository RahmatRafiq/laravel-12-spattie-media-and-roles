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
     * Find user by ID including trashed
     */
    public function findWithTrashed(int $id): User
    {
        return $this->model->withTrashed()->findOrFail($id);
    }

    /**
     * Get Query Builder for DataTables
     */
    public function getDataTableQuery(string $status = 'active'): Builder
    {
        return match ($status) {
            'trashed' => $this->model->onlyTrashed()->with('roles'),
            'all' => $this->model->withTrashed()->with('roles'),
            default => $this->model->with('roles'),
        };
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
}
