<?php

namespace App\Services;

use App\Models\FilemanagerFolder;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ProfilePhotoService
{
    /**
     * Update user profile photo and sync with File Manager.
     */
    public function update(User $user, UploadedFile $file): Media
    {
        // 1. Get or create folder System/Profile Photos
        $folderId = $this->getOrCreateProfilePhotosFolder();

        // 2. Upload media
        $media = $user->addMedia($file)->toMediaCollection('profile_image');

        // 3. Associate with folder_id
        $media->folder_id = $folderId;
        $media->save();

        return $media;
    }

    /**
     * Delete user profile photo.
     */
    public function delete(User $user): void
    {
        $user->clearMediaCollection('profile_image');
    }

    /**
     * Get or create the folder structure for profile photos.
     */
    private function getOrCreateProfilePhotosFolder(): int
    {
        // Find/Create root folder "System"
        $systemFolder = FilemanagerFolder::firstOrCreate(
            ['name' => 'System', 'parent_id' => null],
            ['path' => 'System']
        );

        // Find/Create subfolder "Profile Photos"
        $profileFolder = FilemanagerFolder::firstOrCreate(
            ['name' => 'Profile Photos', 'parent_id' => $systemFolder->id],
            ['path' => 'System/Profile Photos']
        );

        return $profileFolder->id;
    }
}
