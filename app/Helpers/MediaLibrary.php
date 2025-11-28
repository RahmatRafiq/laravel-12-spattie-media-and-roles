<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

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
