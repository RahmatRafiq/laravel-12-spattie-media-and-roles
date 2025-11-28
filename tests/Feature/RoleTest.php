<?php

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);
beforeEach(function () {
    $this->seed(PermissionSeeder::class);
});

test('authenticated user can see role index', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('view-roles');
    $this->actingAs($user)
        ->get(route('roles.index'))
        ->assertStatus(200);
});

test('can create role with permissions', function () {
    $user = User::factory()->create();
    $user->givePermissionTo(['view-roles', 'create-roles']);
    $permission = Permission::factory()->create();
    $this->actingAs($user)
        ->post(route('roles.store'), [
            'name' => 'test-role',
            'guard_name' => 'web',
            'permissions' => [$permission->id],
        ])
        ->assertRedirect(route('roles.index'));
    $this->assertDatabaseHas('roles', ['name' => 'test-role']);
});

test('can update role', function () {
    $user = User::factory()->create();
    $user->givePermissionTo(['view-roles', 'edit-roles']);
    $role = Role::factory()->create(['name' => 'old-role', 'guard_name' => 'web']);
    $permission = Permission::factory()->create();
    $this->actingAs($user)
        ->put(route('roles.update', $role->id), [
            'name' => 'updated-role',
            'guard_name' => 'web',
            'permissions' => [$permission->id],
        ])
        ->assertRedirect(route('roles.index'));
    $this->assertDatabaseHas('roles', ['name' => 'updated-role']);
});

test('can delete role', function () {
    $user = User::factory()->create();
    $user->givePermissionTo(['view-roles', 'delete-roles']);
    $role = Role::factory()->create();
    $this->actingAs($user)
        ->delete(route('roles.destroy', $role->id))
        ->assertRedirect(route('roles.index'));
    $this->assertDatabaseMissing('roles', ['id' => $role->id]);
});

test('user without permission cannot access role index', function () {
    $user = User::factory()->create();
    $this->actingAs($user)
        ->get(route('roles.index'))
        ->assertStatus(403);
});

test('user without permission cannot create role', function () {
    $user = User::factory()->create();
    $permission = Permission::factory()->create();
    $this->actingAs($user)
        ->post(route('roles.store'), [
            'name' => 'forbidden-role',
            'guard_name' => 'web',
            'permissions' => [$permission->id],
        ])
        ->assertStatus(403);
});

test('user without permission cannot update role', function () {
    $user = User::factory()->create();
    $role = Role::factory()->create();
    $permission = Permission::factory()->create();
    $this->actingAs($user)
        ->put(route('roles.update', $role->id), [
            'name' => 'new-name',
            'guard_name' => 'web',
            'permissions' => [$permission->id],
        ])
        ->assertStatus(403);
});

test('user without permission cannot delete role', function () {
    $user = User::factory()->create();
    $role = Role::factory()->create();
    $this->actingAs($user)
        ->delete(route('roles.destroy', $role->id))
        ->assertStatus(403);
});

test('cannot create role with empty name', function () {
    $user = User::factory()->create();
    $user->givePermissionTo(['view-roles', 'create-roles']);
    $permission = Permission::factory()->create();
    $this->actingAs($user)
        ->post(route('roles.store'), [
            'name' => '',
            'guard_name' => 'web',
            'permissions' => [$permission->id],
        ])
        ->assertSessionHasErrors('name');
});
