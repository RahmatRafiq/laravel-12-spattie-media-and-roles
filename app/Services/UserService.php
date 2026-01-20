<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserService
{
    /**
     * UserService constructor
     *
     * @param  UserRepositoryInterface  $userRepository
     */
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {}

    /**
     * Get query builder for DataTables
     *
     * @param  array  $filters
     * @return Builder
     */
    public function getDataTableData(array $filters): Builder
    {
        return $this->userRepository->forDataTable($filters);
    }

    /**
     * Get total count for DataTables
     *
     * @param  string|null  $filter
     * @return int
     */
    public function getTotalCount(?string $filter = null): int
    {
        return $this->userRepository->getTotalCount($filter);
    }

    /**
     * Get all users with roles
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllUsers(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->userRepository->getUsersWithRoles();
    }

    /**
     * Get user by ID with trashed
     *
     * @param  int  $id
     * @return User
     */
    public function getUserWithTrashed(int $id): User
    {
        return User::withTrashed()->findOrFail($id);
    }

    /**
     * Create a new user
     *
     * @param  array  $data
     * @return User
     */
    public function createUser(array $data): User
    {
        // Create user
        $user = $this->userRepository->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        // Assign role
        if (isset($data['role_id'])) {
            $role = Role::findById($data['role_id']);
            $user->assignRole($role);
        }

        return $user->fresh(['roles']);
    }

    /**
     * Update an existing user
     *
     * @param  int  $id
     * @param  array  $data
     * @return User
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
            $role = Role::findById($data['role_id']);
            $user->syncRoles([$role]);
        }

        return $user->fresh(['roles']);
    }

    /**
     * Soft delete a user
     *
     * @param  int  $id
     * @return bool
     */
    public function deleteUser(int $id): bool
    {
        return $this->userRepository->delete($id);
    }

    /**
     * Restore a soft deleted user
     *
     * @param  int  $id
     * @return bool
     */
    public function restoreUser(int $id): bool
    {
        return $this->userRepository->restore($id);
    }

    /**
     * Permanently delete a user
     *
     * @param  int  $id
     * @return bool
     */
    public function forceDeleteUser(int $id): bool
    {
        return $this->userRepository->forceDelete($id);
    }

    /**
     * Get trashed users
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getTrashedUsers(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->userRepository->getTrashedUsers();
    }

    /**
     * Search users
     *
     * @param  string  $query
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function searchUsers(string $query): \Illuminate\Database\Eloquent\Collection
    {
        return $this->userRepository->searchUsers($query);
    }
}
