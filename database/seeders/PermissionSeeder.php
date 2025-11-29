<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // User management permissions
        $permissions = [
            'view-users',
            'create-users',
            'edit-users',
            'delete-users',

            // Role management permissions
            'view-roles',
            'create-roles',
            'edit-roles',
            'delete-roles',

            // Permission management
            'view-permissions',
            'assign-permissions',

            // General permissions
            'view-dashboard',
            'manage-settings',
            'view-activity-logs',

            // File management permissions
            'view-gallery',
            'upload-files',
            'delete-files',
            'manage-folders',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }
    }
}
