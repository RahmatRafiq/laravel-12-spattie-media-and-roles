<?php

use App\Models\Menu;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(\Database\Seeders\PermissionSeeder::class);
});

test('admin can create menu', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $this->actingAs($admin)
        ->post(route('menus.store'), [
            'title' => 'Test Menu',
            'route' => 'dashboard',
            'icon' => 'icon-dashboard',
            'order' => 1,
        ])
        ->assertRedirect();
    $this->assertDatabaseHas('menus', ['title' => 'Test Menu']);
});

test('menu can have children', function () {
    $parent = Menu::factory()->create(['title' => 'Parent']);
    $child = Menu::factory()->create(['title' => 'Child', 'parent_id' => $parent->id]);
    expect($parent->children)->toHaveCount(1);
    expect($parent->children->first()->title)->toBe('Child');
});

test('admin can see menu manage page', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $this->actingAs($admin)
        ->get(route('menus.manage'))
        ->assertStatus(200);
});

test('admin can update menu', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $menu = Menu::factory()->create(['title' => 'Old Title']);
    $this->actingAs($admin)
        ->put(route('menus.update', $menu->id), [
            'title' => 'Updated Title',
            'route' => 'dashboard',
            'icon' => 'icon-dashboard',
            'order' => 1,
        ])
        ->assertRedirect();
    $this->assertDatabaseHas('menus', ['id' => $menu->id, 'title' => 'Updated Title']);
});

test('admin can delete menu', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $menu = Menu::factory()->create();
    $this->actingAs($admin)
        ->delete(route('menus.destroy', $menu->id))
        ->assertRedirect();
    $this->assertDatabaseMissing('menus', ['id' => $menu->id]);
});

test('admin can update menu order', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $menu1 = Menu::factory()->create(['order' => 1]);
    $menu2 = Menu::factory()->create(['order' => 2]);
    $this->actingAs($admin)
        ->post(route('menus.updateOrder'), [
            'tree' => json_encode([
                ['id' => $menu1->id],
                ['id' => $menu2->id],
            ])
        ])
        ->assertRedirect();
    $this->assertDatabaseHas('menus', ['id' => $menu1->id, 'order' => 0]);
    $this->assertDatabaseHas('menus', ['id' => $menu2->id, 'order' => 1]);
});

test('non-admin cannot access menu manage', function () {
    $user = User::factory()->create();
    $this->actingAs($user)
        ->get(route('menus.manage'))
        ->assertStatus(403);
});

test('non-admin cannot create menu', function () {
    $user = User::factory()->create();
    $this->actingAs($user)
        ->post(route('menus.store'), [
            'title' => 'Forbidden',
            'route' => 'dashboard',
            'icon' => 'icon-dashboard',
            'order' => 1,
        ])
        ->assertStatus(403);
});

test('cannot create menu with empty title', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $this->actingAs($admin)
        ->post(route('menus.store'), [
            'title' => '',
            'route' => 'dashboard',
            'icon' => 'icon-dashboard',
            'order' => 1,
        ])
        ->assertSessionHasErrors('title');
});
