<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * MediaLibrary Helper - Centralized Spatie Media Library abstraction
 */
class MediaLibrary
{
    /**
     * Handle media sync from temp storage or direct upload.
     * Pattern: Useful for forms where media names are sent in request.
     */
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
            'removed' => $filesToRemove,
            'added' => $addedFiles,
            'not_affected' => $files,
        ];
    }

    /**
     * Replace existing media in a collection (delete old, upload new).
     */
    public static function replace(Model $model, UploadedFile $file, string $collection, string $disk = 'public'): Media
    {
        $model->clearMediaCollection($collection);

        return $model->addMedia($file)->toMediaCollection($collection, $disk);
    }

    /**
     * Upload media with folder organization and custom properties.
     */
    public static function putWithMetadata(
        Model $model,
        UploadedFile $file,
        string $collection,
        string $disk = 'public',
        ?int $folderId = null,
        array $customProperties = []
    ): Media {
        $adder = $model->addMedia($file);

        if (! empty($customProperties)) {
            $adder->withCustomProperties($customProperties);
        }

        $media = $adder->toMediaCollection($collection, $disk);

        if ($folderId) {
            $media->folder_id = $folderId;
            $media->save();
        }

        return $media;
    }

    /**
     * Clear all media from a collection.
     */
    public static function clearCollection(Model $model, string $collection = 'default'): void
    {
        $model->clearMediaCollection($collection);
    }

    /**
     * Safe delete a single media item.
     */
    public static function deleteMedia(int|string|Media $media): bool
    {
        if (! $media instanceof Media) {
            $media = Media::find($media);
        }

        return $media ? $media->delete() : false;
    }

    /**
     * DEPRECATED: Use clearCollection or deleteMedia instead.
     */
    public static function destroy(Collection|Model $model, string $collectionName = 'default')
    {
        try {
            $model->clearMediaCollection($collectionName);

            return response()->json(['message' => 'File deleted']);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'File not found'], 404);
        }
    }
}
