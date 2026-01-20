<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

/**
 * MediaLibrary Helper - Centralized Spatie Media Library abstraction
 *
 * Current methods:
 * - put()     : Handle media sync from temp storage
 * - destroy() : Delete all media from collection
 *
 * TODO: Add specialized helper methods for common use cases
 * This will standardize media handling across the application and reduce boilerplate.
 *
 * Planned methods (implement when needed):
 *
 * @method static putFeaturedImage($model, $file, array $metadata = [])
 *         Upload featured image with SEO metadata (alt_text, caption) and responsive variants
 *         Use case: Articles, Posts, Products
 *
 * @method static putGalleryImages($model, array $files, string $collection = 'gallery')
 *         Upload multiple gallery images with ordering
 *         Use case: Product galleries, Article image sets
 *
 * @method static putPrivateDocument($model, $file, string $collection = 'attachments')
 *         Upload private documents/attachments to local disk
 *         Use case: Invoice PDFs, Contract documents, Private files
 *
 * @method static putWithFolder($model, $file, ?int $folderId, string $collection, string $visibility)
 *         Upload with folder organization and visibility control
 *         Use case: File manager, Gallery system with folders
 *
 * @method static replaceMedia($model, $file, string $collection)
 *         Replace existing media (delete old, upload new)
 *         Use case: Update profile photo, Replace document
 *
 * @method static putAvatar($model, $file)
 *         Upload user avatar (replaces existing)
 *         Use case: User profile avatar
 *
 * @method static putProfileImage($model, $file)
 *         Upload profile image with responsive variants
 *         Use case: User profile photos, Team member photos
 *
 * @method static getUrl($media): string
 *         Get media URL (automatically handles public/private routing)
 *         Use case: Display images in views
 *
 * @method static deleteMedia($media): bool
 *         Safe delete with error handling
 *         Use case: Delete single media item
 *
 * @method static clearCollection($model, string $collection): void
 *         Clear all media from a collection
 *         Use case: Reset gallery, Remove all attachments
 *
 * Benefits of adding these methods:
 * - DRY: Eliminate duplicate Spatie boilerplate across services
 * - Consistency: Standard pattern for all media operations
 * - Maintainability: Update logic in one place
 * - Testability: Easier to mock helper methods
 * - Clean Services: Services focus on business logic, not media handling details
 *
 * Pattern recommendation:
 * - Simple use cases (profile, avatar) → Use helper methods directly
 * - Complex use cases (gallery, documents) → Use Service layer that calls helper methods
 *
 * Example future usage:
 * ```php
 * // In ArticleService
 * MediaLibrary::putFeaturedImage($article, $file, ['alt_text' => 'Hero image']);
 *
 * // In GalleryService
 * MediaLibrary::putWithFolder($gallery, $file, $folderId, 'gallery', 'public');
 *
 * // In ProfileController
 * MediaLibrary::putAvatar($user, $request->file('avatar'));
 * ```
 */
class MediaLibrary
{
    public static function put(Collection|Model $model, string $collectionName, Request $request, string $disk = 'media')
    {
        // retrieve saved images
        $files = $model->getMedia($collectionName);

        // get image that will be removed if exists in $images and not exists in $request
        $filesToRemove = $files->filter(function ($file) use ($request, $collectionName) {
            if (! $request->input($collectionName)) {
                return true;
            }

            return ! in_array($file->file_name, $request->input($collectionName));
        });

        // remove images from media
        foreach ($filesToRemove as $file) {
            $file->delete();
        }

        $addedFiles = [];
        if ($request->input($collectionName)) {
            // add images from temp
            foreach ($request->input($collectionName) as $fileName) {
                if (! $files->contains('file_name', $fileName)) {
                    $model->addMediaFromDisk($fileName, 'temp')->toMediaCollection($collectionName, $disk);
                    $addedFiles[] = $fileName;
                }
            }
        }

        // file that not affected from removed and added
        $files = $files->filter(function ($file) use ($filesToRemove, $addedFiles) {
            return ! in_array($file->file_name, $filesToRemove->pluck('file_name')->toArray())
            && ! in_array($file->file_name, $addedFiles);
        });

        return [
            'model' => $model,
            // removed files
            'removed' => $filesToRemove,
            // added files
            'added' => $addedFiles,
            // files that not affected
            'not_affected' => $files,
        ];
    }

    public static function destroy(Collection|Model $model, string $collectionName = 'default')
    {
        try {
            // delete file from media
            $model->getMedia($collectionName)->each->delete();

            return response()->json([
                'message' => 'File deleted',
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'File not found',
            ]);
        }
    }
}
