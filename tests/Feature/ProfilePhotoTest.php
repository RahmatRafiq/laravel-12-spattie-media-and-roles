<?php

use App\Models\FilemanagerFolder;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    // We use 'local' disk for private storage
    Storage::fake('local');
    $this->user = User::factory()->create();
});

test('user can upload profile photo and it is associated with file manager folder', function () {
    $file = UploadedFile::fake()->image('avatar.jpg');

    $response = $this->actingAs($this->user)
        ->postJson('/settings/profile-photo', [
            'photo' => $file,
        ]);

    $response->assertStatus(200);

    // Refresh user and get media
    $user = $this->user->refresh();
    $media = $user->getFirstMedia('profile_image');

    expect($media)->not->toBeNull();
    expect($media->disk)->toBe('local');

    // Verify folder structure
    $profileFolder = FilemanagerFolder::where('name', 'Profile Photos')->first();
    expect($profileFolder)->not->toBeNull();

    // Verify media is in the correct folder
    expect($media->folder_id)->toBe($profileFolder->id);
});

test('user can access their own profile photo', function () {
    $this->user->addMedia(UploadedFile::fake()->image('avatar.jpg'))
        ->toMediaCollection('profile_image');

    $response = $this->actingAs($this->user)
        ->get("/settings/profile-photo/{$this->user->id}");

    $response->assertStatus(200);
});

test('admin can access any user profile photo', function () {
    // Create admin
    $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $admin = User::factory()->create();
    $admin->assignRole($adminRole);

    // Add photo to regular user
    $this->user->addMedia(UploadedFile::fake()->image('avatar.jpg'))
        ->toMediaCollection('profile_image');

    $response = $this->actingAs($admin)
        ->get("/settings/profile-photo/{$this->user->id}");

    $response->assertStatus(200);
});

test('regular user cannot access other user profile photo', function () {
    $otherUser = User::factory()->create();

    $this->user->addMedia(UploadedFile::fake()->image('avatar.jpg'))
        ->toMediaCollection('profile_image');

    $response = $this->actingAs($otherUser)
        ->get("/settings/profile-photo/{$this->user->id}");

    $response->assertStatus(403);
});

test('guest cannot access any profile photo', function () {
    $response = $this->get("/settings/profile-photo/{$this->user->id}");

    $response->assertRedirect('/login');
});

test('it streams profile photo if stored in cloud disk (bucket scenario)', function () {
    // Simulate a cloud disk
    Storage::fake('s3');

    // Add media to cloud disk
    $this->user->addMedia(UploadedFile::fake()->image('cloud-avatar.jpg'))
        ->toMediaCollection('profile_image', 's3');

    $response = $this->actingAs($this->user)
        ->get("/settings/profile-photo/{$this->user->id}");

    // Should return 200 and attempt to stream the file
    $response->assertStatus(200);
    $response->assertHeader('Content-Disposition', 'attachment; filename=cloud-avatar.jpg');
});

test('user can delete profile photo', function () {
    $this->user->addMedia(UploadedFile::fake()->image('avatar.jpg'))
        ->toMediaCollection('profile_image');

    $response = $this->actingAs($this->user)
        ->deleteJson('/settings/profile-photo');

    $response->assertStatus(200);
    expect($this->user->refresh()->hasMedia('profile_image'))->toBeFalse();
});
