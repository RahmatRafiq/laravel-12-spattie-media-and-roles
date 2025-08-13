<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Database\Seeders\PermissionSeeder;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
});

test('guest cannot access user index', function () {
    $this->get(route('users.index'))->assertRedirect('/login');
});

test('authenticated user can see user index', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('view-users');
    $this->actingAs($user)
        ->get(route('users.index'))
        ->assertStatus(200);
});

test('can create user', function () {
    $user = User::factory()->create();
    $user->givePermissionTo(['view-users', 'create-users']);
    $role = Role::factory()->create();
    $this->actingAs($user)
        ->post(route('users.store'), [
            'name' => 'Test User',
            'email' => 'testuser@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role_id' => $role->id,
        ])
        ->assertRedirect(route('users.index'));
    $this->assertDatabaseHas('users', ['email' => 'testuser@example.com']);
});

test('can update user', function () {
    $user = User::factory()->create();
    $user->givePermissionTo(['view-users', 'edit-users']);
    $target = User::factory()->create(['name' => 'Old Name']);
    $role = Role::factory()->create();
    $this->actingAs($user)
        ->put(route('users.update', $target->id), [
            'name' => 'Updated Name',
            'email' => $target->email,
            'role_id' => $role->id,
        ])
        ->assertRedirect(route('users.index'));
    $this->assertDatabaseHas('users', ['name' => 'Updated Name']);
});

test('can soft delete user', function () {
    $user = User::factory()->create();
    $user->givePermissionTo(['view-users', 'delete-users']);
    $target = User::factory()->create();
    $this->actingAs($user)
        ->delete(route('users.destroy', $target->id))
        ->assertRedirect(route('users.index'));
    $this->assertSoftDeleted('users', ['id' => $target->id]);
});

test('can restore soft deleted user', function () {
    $user = User::factory()->create();
    $user->givePermissionTo(['view-users', 'edit-users']);
    $target = User::factory()->create();
    $target->delete();
    $this->actingAs($user)
        ->post(route('users.restore', $target->id))
        ->assertRedirect(route('users.index'));
    $this->assertDatabaseHas('users', ['id' => $target->id, 'deleted_at' => null]);
});

test('can force delete user', function () {
    $user = User::factory()->create();
    $user->givePermissionTo(['view-users', 'delete-users']);
    $target = User::factory()->create();
    $target->delete();
    $this->actingAs($user)
        ->delete(route('users.force-delete', $target->id))
        ->assertRedirect(route('users.index'));
    $this->assertDatabaseMissing('users', ['id' => $target->id]);
});

test('admin can create user with role admin', function () {
    $admin = User::factory()->create();
    $admin->givePermissionTo(['view-users', 'create-users']);
    $role = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $this->actingAs($admin)
        ->post(route('users.store'), [
            'name' => 'Admin Baru',
            'email' => 'adminbaru@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role_id' => $role->id,
        ])
        ->assertRedirect(route('users.index'));
    $user = User::where('email', 'adminbaru@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->hasRole('admin'))->toBeTrue();
});

test('admin can create user with role user', function () {
    $admin = User::factory()->create();
    $admin->givePermissionTo(['view-users', 'create-users']);
    $role = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);
    $this->actingAs($admin)
        ->post(route('users.store'), [
            'name' => 'User Biasa',
            'email' => 'userbiasa@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role_id' => $role->id,
        ])
        ->assertRedirect(route('users.index'));
    $user = User::where('email', 'userbiasa@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->hasRole('user'))->toBeTrue();
});

test('user without permission cannot access user index', function () {
    $user = User::factory()->create();
    $this->actingAs($user)
        ->get(route('users.index'))
        ->assertStatus(403);
});

test('user without permission cannot create user', function () {
    $user = User::factory()->create();
    $role = Role::factory()->create();
    $this->actingAs($user)
        ->post(route('users.store'), [
            'name' => 'forbidden',
            'email' => 'forbidden@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role_id' => $role->id,
        ])
        ->assertStatus(403);
});

test('user without permission cannot update user', function () {
    $user = User::factory()->create();
    $target = User::factory()->create();
    $role = Role::factory()->create();
    $this->actingAs($user)
        ->put(route('users.update', $target->id), [
            'name' => 'forbidden',
            'email' => $target->email,
            'role_id' => $role->id,
        ])
        ->assertStatus(403);
});

test('user without permission cannot delete user', function () {
    $user = User::factory()->create();
    $target = User::factory()->create();
    $this->actingAs($user)
        ->delete(route('users.destroy', $target->id))
        ->assertStatus(403);
});

test('cannot create user with empty email', function () {
    $user = User::factory()->create();
    $user->givePermissionTo(['view-users', 'create-users']);
    $role = Role::factory()->create();
    $this->actingAs($user)
        ->post(route('users.store'), [
            'name' => 'No Email',
            'email' => '',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role_id' => $role->id,
        ])
        ->assertSessionHasErrors('email');
});
