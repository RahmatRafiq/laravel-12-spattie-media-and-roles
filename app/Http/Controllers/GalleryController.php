<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Support\Facades\Auth;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $visibility = $request->query('visibility', 'public');
        $diskName = $visibility === 'public' ? 'public' : 'local';

        $paginator = Media::where('collection_name', 'gallery')
            ->where('disk', $diskName)
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->appends($request->query());

        $items = collect($paginator->items())->map(function ($m) {
            return [
                'id' => $m->id,
                'file_name' => $m->file_name,
                'name' => $m->name ?? $m->file_name,
                'original_url' => ($m->disk === 'public')
                    ? Storage::disk($m->disk)->url($m->file_name)
                    : route('gallery.file', $m->id),
                'disk' => $m->disk === 'public' ? 'public' : 'private',
            ];
        })->toArray();

        $paginationArray = $paginator->toArray();
        $links = $paginationArray['links'] ?? [];

        return Inertia::render('Gallery', [
            'media' => [
                'data' => $items,
                'links' => $links,
            ],
            'visibility' => $visibility,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240',
            'visibility' => 'nullable|in:public,private',
        ]);

        $visibility = $request->input('visibility', 'public');
        $diskName = $visibility === 'public' ? 'public' : 'local';

        $uploaded = $request->file('file');
        $name = Str::orderedUuid() . '_' . $uploaded->getClientOriginalName();

        Storage::disk($diskName)->putFileAs('', $uploaded, $name);

        $user = Auth::user();
        $media = null;

        if ($user && method_exists($user, 'addMediaFromDisk')) {
            $media = $user->addMediaFromDisk($name, $diskName)
                ->usingName(pathinfo($name, PATHINFO_FILENAME))
                ->preservingOriginal()
                ->toMediaCollection('gallery', $diskName);
        } else {
            $now = now();
            $media = Media::create([
                'model_type' => $user ? get_class($user) : \App\Models\User::class,
                'model_id' => $user ? $user->getKey() : 0,
                'collection_name' => 'gallery',
                'name' => pathinfo($name, PATHINFO_FILENAME),
                'file_name' => $name,
                'mime_type' => $uploaded->getClientMimeType(),
                'disk' => $diskName,
                'size' => $uploaded->getSize(),
                'manipulations' => json_encode([]),
                'custom_properties' => json_encode(['visibility' => $visibility]),
                'responsive_images' => json_encode([]),
                'uuid' => (string) Str::uuid(),
                'order_column' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        return redirect()->route('gallery.index')->with('success', 'File uploaded successfully.');
    }

    public function file(int $id)
    {
        $media = Media::findOrFail($id);

        if ($media->disk !== 'public') {
            if (!Auth::check()) {
                abort(403);
            }
        }

        if (!Storage::disk($media->disk)->exists($media->file_name)) {
            abort(404);
        }

        return Storage::disk($media->disk)->response($media->file_name);
    }

    public function destroy($id)
    {
        $media = Media::find($id);

        if (!$media) {
            if (request()->wantsJson()) {
                return response()->json(['message' => 'File not found.'], 404);
            }
            return redirect()->back()->with('error', 'File not found.');
        }

        if (Storage::disk($media->disk)->exists($media->file_name)) {
            Storage::disk($media->disk)->delete($media->file_name);
        }

        $media->delete();

        if (request()->wantsJson()) {
            return response()->json(['message' => 'File deleted']);
        }

        return redirect()->route('gallery.index')->with('success', 'File deleted successfully.');
    }
}
