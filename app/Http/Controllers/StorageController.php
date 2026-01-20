<?php

namespace App\Http\Controllers;

use App\Http\Requests\Storage\DeleteFileRequest;
use App\Http\Requests\Storage\StoreFileRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class StorageController extends Controller
{
    public function show($path)
    {
        return Storage::disk('temp')->response($path);
    }

    public function store(StoreFileRequest $request)
    {
        $name = Str::orderedUuid().'_'.$request->file('file')->getClientOriginalName();

        $path = Storage::disk('temp')
            ->putFileAs('', $request->file('file'), $name);

        $url = Storage::disk('temp')->url($path);

        return response()->json([
            'path' => $path,
            'name' => $name,
            'url' => $url,
        ]);
    }

    public function destroy(DeleteFileRequest $request)
    {
        try {
            $validated = $request->validated();

            Storage::disk('media')->delete($validated['filename']);

            Media::where('file_name', $validated['filename'])->first();

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
