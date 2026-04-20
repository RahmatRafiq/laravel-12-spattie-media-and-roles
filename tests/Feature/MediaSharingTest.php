<?php

use App\Models\Gallery;
use App\Models\User;
use App\Services\GalleryService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('local');
    $this->user = User::factory()->create();
    $this->galleryService = app(GalleryService::class);
});

test('media can be shared and accessed publicly via uuid', function () {
    // 1. Create a gallery item and add private media
    $gallery = Gallery::create([
        'name' => 'Secret Project',
        'user_id' => $this->user->id,
    ]);

    $media = $gallery->addMedia(UploadedFile::fake()->image('secret.jpg'))
        ->toMediaCollection('gallery', 'local');

    $uuid = $media->uuid;

    // 2. Try to access publicly while sharing is OFF (should fail)
    $response = $this->get("/s/{$uuid}");
    $response->assertStatus(404);

    // 3. Enable sharing via service
    $this->galleryService->toggleSharing($media->id, true);

    // 4. Access publicly while sharing is ON (should succeed)
    $response = $this->get("/s/{$uuid}");
    $response->assertStatus(200);

    // 5. Disable sharing
    $this->galleryService->toggleSharing($media->id, false);

    // 6. Access again (should fail)
    $response = $this->get("/s/{$uuid}");
    $response->assertStatus(404);
});

test('it redirects to signed url if shared media is in cloud disk (bucket scenario)', function () {
    // Simulate cloud disk
    Storage::fake('s3');

    $gallery = Gallery::create([
        'name' => 'Cloud Files',
        'user_id' => $this->user->id,
    ]);

    $media = $gallery->addMedia(UploadedFile::fake()->image('cloud-share.jpg'))
        ->toMediaCollection('gallery', 's3');

    // Enable sharing
    $this->galleryService->toggleSharing($media->id, true);

    $response = $this->get("/s/{$media->uuid}");

    // Should redirect to signed URL (302)
    $response->assertStatus(302);
});

test('sharing logic does not affect auth-based private access', function () {
    $gallery = Gallery::create([
        'name' => 'My Private File',
        'user_id' => $this->user->id,
    ]);

    $media = $gallery->addMedia(UploadedFile::fake()->image('private.jpg'))
        ->toMediaCollection('gallery', 'local');

    // Give permission to view gallery
    $this->user->givePermissionTo('view-gallery');

    // Access via private dashboard route (needs auth)
    $response = $this->actingAs($this->user)
        ->get("/dashboard/gallery/file/{$media->id}");

    $response->assertStatus(200);
});
