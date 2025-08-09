<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class StorageController extends Controller
{
    public function show($path)
    {
        return Storage::disk('temp')->response($path);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:2048',
        ]);

        $name = Str::orderedUuid() . '_' . $request->file('file')->getClientOriginalName();

        $path = Storage::disk('temp')
            ->putFileAs('', $request->file('file'), $name);

        $url = Storage::disk('temp')->url($path);

        return response()->json([
            'path' => $path,
            'name' => $name,
            'url' => $url,
        ]);
    }

    public function destroy(Request $request)
    {
        try {
            $request->validate([
                'filename' => 'required|string',
            ]);

            Storage::disk('media')->delete($request->filename);

            Media::where('file_name', $request->filename)->first();

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
