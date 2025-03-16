<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = Permission::all();

        Role::all()->each(function ($role) use ($permissions) {
            // setiap role dapat 5 sampai 15 permission random
            $randomPermissions = $permissions->random(rand(5, 15));
            $role->syncPermissions($randomPermissions);
        });
    }
}
