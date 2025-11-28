<?php

use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(\Database\Seeders\PermissionSeeder::class);
});

test('guest cannot access permission index', function () {
    $this->get(route('permissions.index'))->assertRedirect('/login');
});

test('authenticated user can see permission index', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('view-permissions');
    $this->actingAs($user)
        ->get(route('permissions.index'))
        ->assertStatus(200);
});

test('can create permission', function () {
    $user = User::factory()->create();
    $user->givePermissionTo(['view-permissions', 'assign-permissions']);
    $this->actingAs($user)
        ->post(route('permissions.store'), ['name' => 'test-permission'])
        ->assertRedirect(route('permissions.index'));
    $this->assertDatabaseHas('permissions', ['name' => 'test-permission']);
});

test('can update permission', function () {
    $user = User::factory()->create();
    $user->givePermissionTo(['view-permissions', 'assign-permissions']);
    $permission = Permission::factory()->create(['name' => 'old-name']);
    $this->actingAs($user)
        ->put(route('permissions.update', $permission->id), ['name' => 'new-name'])
        ->assertRedirect(route('permissions.index'));
    $this->assertDatabaseHas('permissions', ['name' => 'new-name']);
});

test('can delete permission', function () {
    $user = User::factory()->create();
    $user->givePermissionTo(['view-permissions', 'assign-permissions']);
    $permission = Permission::factory()->create();
    $this->actingAs($user)
        ->delete(route('permissions.destroy', $permission->id))
        ->assertRedirect(route('permissions.index'));
    $this->assertDatabaseMissing('permissions', ['id' => $permission->id]);
});

test('user without permission cannot access permission index', function () {
    $user = User::factory()->create();
    $this->actingAs($user)
        ->get(route('permissions.index'))
        ->assertStatus(403);
});

test('user without permission cannot create permission', function () {
    $user = User::factory()->create();
    $this->actingAs($user)
        ->post(route('permissions.store'), ['name' => 'forbidden-permission'])
        ->assertStatus(403);
});

test('user without permission cannot update permission', function () {
    $user = User::factory()->create();
    $permission = Permission::factory()->create(['name' => 'old-name']);
    $this->actingAs($user)
        ->put(route('permissions.update', $permission->id), ['name' => 'new-name'])
        ->assertStatus(403);
});

test('user without permission cannot delete permission', function () {
    $user = User::factory()->create();
    $permission = Permission::factory()->create();
    $this->actingAs($user)
        ->delete(route('permissions.destroy', $permission->id))
        ->assertStatus(403);
});
