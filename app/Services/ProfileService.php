<?php

namespace App\Services;

use App\Helpers\MediaLibrary;
use App\Models\FilemanagerFolder;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ProfileService
{
    /**
     * Update user profile information.
     */
    public function updateProfile(User $user, array $data, ?Request $request = null): User
    {
        return DB::transaction(function () use ($user, $data, $request) {
            // Handle profile image sync if request is provided
            if ($request) {
                MediaLibrary::put(
                    $user,
                    'profile_image',
                    $request,
                    'local'
                );
            }

            $user->fill($data);

            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }

            $user->save();

            return $user;
        });
    }

    /**
     * Update user profile photo via direct upload.
     */
    public function updatePhoto(User $user, UploadedFile $file): Media
    {
        $folderId = $this->getOrCreateProfilePhotosFolder();

        return MediaLibrary::putWithMetadata(
            $user,
            $file,
            'profile_image',
            'local',
            $folderId
        );
    }

    /**
     * Delete user profile photo.
     */
    public function deletePhoto(User $user): void
    {
        MediaLibrary::clearCollection($user, 'profile_image');
    }

    /**
     * Get or create the folder structure for profile photos.
     */
    private function getOrCreateProfilePhotosFolder(): int
    {
        $systemFolder = FilemanagerFolder::firstOrCreate(
            ['name' => 'System', 'parent_id' => null],
            ['path' => 'System']
        );

        $profileFolder = FilemanagerFolder::firstOrCreate(
            ['name' => 'Profile Photos', 'parent_id' => $systemFolder->id],
            ['path' => 'System/Profile Photos']
        );

        return $profileFolder->id;
    }
}
