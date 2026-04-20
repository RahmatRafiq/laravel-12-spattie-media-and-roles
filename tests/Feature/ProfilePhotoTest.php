<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    $this->user = User::factory()->create();
});

test('user can upload profile photo', function () {
    $file = UploadedFile::fake()->image('avatar.jpg');

    $response = $this->actingAs($this->user)
        ->postJson('/settings/profile-photo', [
            'photo' => $file,
        ]);

    $response->assertStatus(200);
    expect($this->user->refresh()->hasMedia('profile_image'))->toBeTrue();
});

test('upload validation requires an image', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/settings/profile-photo', [
            'photo' => 'not-an-image',
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['photo']);
});

test('user can delete profile photo', function () {
    $this->user->addMedia(UploadedFile::fake()->image('avatar.jpg'))
        ->toMediaCollection('profile_image');
    
    expect($this->user->hasMedia('profile_image'))->toBeTrue();

    $response = $this->actingAs($this->user)
        ->deleteJson('/settings/profile-photo');

    $response->assertStatus(200);
    expect($this->user->refresh()->hasMedia('profile_image'))->toBeFalse();
});
