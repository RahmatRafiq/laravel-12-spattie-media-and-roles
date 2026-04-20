<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * UserService constructor
     */
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {}

    /**
     * Get Paginated Users for DataTables
     * 
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
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
        return $this->userRepository->getDataTableQuery($status);
    }

    /**
     * Get all users with roles
     */
    public function getAllUsers(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->userRepository->getUsersWithRoles();
    }

    /**
     * Get user by ID with trashed
     */
    public function getUserWithTrashed(int $id): User
    {
        return $this->userRepository->findWithTrashed($id);
    }

    /**
     * Create a new user
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
            $user->assignRole((int) $data['role_id']);
        }

        return $user->fresh(['roles']);
    }

    /**
     * Update an existing user
     */
    public function updateUser(int $id, array $data): User
    {
        $user = $this->userRepository->findWithTrashed($id);

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
        return $this->userRepository->delete($id);
    }

    /**
     * Restore a soft deleted user
     */
    public function restoreUser(int $id): bool
    {
        return $this->userRepository->restore($id);
    }

    /**
     * Permanently delete a user
     */
    public function forceDeleteUser(int $id): bool
    {
        return $this->userRepository->forceDelete($id);
    }

    /**
     * Get trashed users
     */
    public function getTrashedUsers(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->userRepository->getTrashedUsers();
    }

    /**
     * Search users
     */
    public function searchUsers(string $query): \Illuminate\Database\Eloquent\Collection
    {
        return $this->userRepository->searchUsers($query);
    }
}
