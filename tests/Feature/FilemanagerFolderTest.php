<?php

use App\Models\FilemanagerFolder;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(\Database\Seeders\PermissionSeeder::class);
});

test('admin can create folder', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $this->actingAs($admin)
        ->post(route('gallery.folder.create'), [
            'name' => 'Folder Test',
        ])
        ->assertRedirect();
    $this->assertDatabaseHas('filemanager_folders', ['name' => 'Folder Test']);
});

test('folder can have children', function () {
    $parent = FilemanagerFolder::factory()->create(['name' => 'Parent']);
    $child = FilemanagerFolder::factory()->create(['name' => 'Child', 'parent_id' => $parent->id]);
    expect($parent->children)->toHaveCount(1);
    expect($parent->children->first()->name)->toBe('Child');
});


test('cannot create folder without name (validation)', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $this->actingAs($admin)
        ->post(route('gallery.folder.create'), [
            // 'name' => 'No Name',
        ])
        ->assertSessionHasErrors('name');
});

test('non-admin cannot create folder (forbidden)', function () {
    $user = User::factory()->create();
    $this->actingAs($user)
        ->post(route('gallery.folder.create'), [
            'name' => 'Should Not Create',
        ])
        ->assertStatus(403);
});

test('deleting parent folder also deletes children (cascade)', function () {
    $parent = FilemanagerFolder::factory()->create(['name' => 'Parent']);
    $child = FilemanagerFolder::factory()->create(['name' => 'Child', 'parent_id' => $parent->id]);
    $parent->delete();
    $this->assertDatabaseMissing('filemanager_folders', ['id' => $parent->id]);
    $this->assertDatabaseMissing('filemanager_folders', ['id' => $child->id]);
});
