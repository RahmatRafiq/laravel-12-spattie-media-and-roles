<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Admin gets all permissions
        $adminRole = Role::where('name', 'admin')->first();
        $userRole = Role::where('name', 'user')->first();

        if ($adminRole) {
            // Admin gets all permissions
            $adminPermissions = [
                'view-users',
                'create-users',
                'edit-users',
                'delete-users',
                'view-roles',
                'create-roles',
                'edit-roles',
                'delete-roles',
                'view-permissions',
                'assign-permissions',
                'view-dashboard',
                'manage-settings',
                'view-activity-logs',
            ];

            foreach ($adminPermissions as $permission) {
                $perm = Permission::where('name', $permission)->first();
                if ($perm) {
                    $adminRole->givePermissionTo($perm);
                }
            }
        }

        if ($userRole) {
            $userPermissions = [
                'view-dashboard',
            ];

            foreach ($userPermissions as $permission) {
                $perm = Permission::where('name', $permission)->first();
                if ($perm) {
                    $userRole->givePermissionTo($perm);
                }
            }
        }
    }
}
