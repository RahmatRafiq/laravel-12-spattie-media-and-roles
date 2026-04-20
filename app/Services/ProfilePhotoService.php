<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ProfilePhotoService
{
    /**
     * Update user profile photo.
     */
    public function update(User $user, UploadedFile $file): Media
    {
        return $user->addMedia($file)->toMediaCollection('profile_image');
    }

    /**
     * Delete user profile photo.
     */
    public function delete(User $user): void
    {
        $user->clearMediaCollection('profile_image');
    }
}
