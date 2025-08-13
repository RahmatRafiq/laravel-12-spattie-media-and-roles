<?php

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;


beforeEach(function () {
    $this->seed(\Database\Seeders\PermissionSeeder::class);
});
uses(RefreshDatabase::class);

test('user with role and permission can access protected route', function () {
    $role = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $permission = Permission::where('name', 'view-dashboard')->first();
    $role->givePermissionTo($permission);
    $user = User::factory()->create();
    $user->assignRole($role);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertStatus(200);
});

test('user without permission cannot access protected route', function () {
    $user = \App\Models\User::factory()->create();
    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertStatus(403);
});
