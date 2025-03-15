<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StorageController extends Controller
{
    // show
    public function show($path)
    {
        return Storage::disk('temp')->response($path);
    }

    // store
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:2048',
        ]);

        // rename file with unique
        $name = Str::orderedUuid() . '_' . $request->file('file')->getClientOriginalName();

        // store file to temp disk
        $path = Storage::disk('temp')
            ->putFileAs('', $request->file('file'), $name);

        // get full url
        $url = Storage::disk('temp')->url($path);

        return response()->json([
            'path' => $path,
            'name' => $name,
            'url' => $url,
        ]);
    }

    // destroy
    public function destroy(Request $request)
    {
        try {
            $request->validate([
                'filename' => 'required|string',
            ]);

            // delete file from media
            Storage::disk('media')->delete($request->filename);

            // delete from medialibrary
            \Spatie\MediaLibrary\MediaCollections\Models\Media::where('file_name', $request->filename)->first();

            return response()->json([
                'message' => 'File deleted',
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'File not found',
            ], 404);
        }
    }
}