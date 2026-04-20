<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * Get Paginated Users for DataTables
     */
    public function getPaginatedUsers(array $params): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $status = $params['filter'] ?? 'active';
        $query = $this->getDataTableQuery($status);

        return \App\Helpers\DataTable::process(
            $query,
            $params,
            searchableColumns: ['name', 'email', 'roles.name'],
        );
    }

    /**
     * Get Query Builder for DataTables
     */
    public function getDataTableQuery(string $status = 'active'): Builder
    {
        return match ($status) {
            'trashed' => User::onlyTrashed()->with('roles'),
            'all' => User::withTrashed()->with('roles'),
            default => User::with('roles'),
        };
    }

    /**
     * Get all users with roles
     */
    public function getAllUsers(): \Illuminate\Database\Eloquent\Collection
    {
        return User::with('roles')->get();
    }

    /**
     * Get user by ID with trashed
     */
    public function getUserWithTrashed(int $id): User
    {
        return User::withTrashed()->findOrFail($id);
    }

    /**
     * Create a new user
     */
    public function createUser(array $data): User
    {
        // Create user
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        // Assign role
        if (isset($data['role_id'])) {
            $user->assignRole((int) $data['role_id']);
        }

        return $user->fresh(['roles']);
    }

    /**
     * Update an existing user
     */
    public function updateUser(int $id, array $data): User
    {
        $user = User::withTrashed()->findOrFail($id);

        // Update basic info
        $updateData = [
            'name' => $data['name'],
            'email' => $data['email'],
        ];

        // Update password if provided
        if (! empty($data['password'])) {
            $updateData['password'] = Hash::make($data['password']);
        }

        $user->update($updateData);

        // Sync roles
        if (isset($data['role_id'])) {
            $user->syncRoles([(int) $data['role_id']]);
        }

        return $user->fresh(['roles']);
    }

    /**
     * Soft delete a user
     */
    public function deleteUser(int $id): bool
    {
        return User::findOrFail($id)->delete();
    }

    /**
     * Restore a soft deleted user
     */
    public function restoreUser(int $id): bool
    {
        $user = User::onlyTrashed()->find($id);

        if (! $user) {
            return false;
        }

        return $user->restore();
    }

    /**
     * Permanently delete a user
     */
    public function forceDeleteUser(int $id): bool
    {
        $user = User::onlyTrashed()->find($id);

        if (! $user) {
            return false;
        }

        return $user->forceDelete();
    }

    /**
     * Get trashed users
     */
    public function getTrashedUsers(): \Illuminate\Database\Eloquent\Collection
    {
        return User::onlyTrashed()->with('roles')->get();
    }

    /**
     * Search users
     */
    public function searchUsers(string $query): \Illuminate\Database\Eloquent\Collection
    {
        return User::with('roles')
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('email', 'like', "%{$query}%");
            })
            ->get();
    }
}
