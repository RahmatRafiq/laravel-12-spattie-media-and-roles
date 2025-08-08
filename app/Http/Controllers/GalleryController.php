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
        $visibility = $request->query('visibility', 'public'); // 'public' or 'private'
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
            'file' => 'required|file|max:10240', // 10MB
            'visibility' => 'nullable|in:public,private',
        ]);

        $visibility = $request->input('visibility', 'public');
        $diskName = $visibility === 'public' ? 'public' : 'local';

        $uploaded = $request->file('file');
        $name = Str::orderedUuid() . '_' . $uploaded->getClientOriginalName();

        // simpan file di disk yang dipilih
        Storage::disk($diskName)->putFileAs('', $uploaded, $name);

        // attach ke user jika tersedia, atau buat record media secara aman
        $user = Auth::user();
        $media = null;

        // Jika user model memiliki method addMediaFromDisk (HasMedia trait), gunakan itu.
        if ($user && method_exists($user, 'addMediaFromDisk')) {
            // addMediaFromDisk(pathRelativeToDisk, disk)
            // path = $name karena kita simpan di root disk
            $media = $user->addMediaFromDisk($name, $diskName)
                ->usingName(pathinfo($name, PATHINFO_FILENAME))
                ->preservingOriginal()
                ->toMediaCollection('gallery', $diskName);
        } else {
            // fallback: buat record manual tetapi isi semua kolom JSON yg mungkin diwajibkan DB
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
                // pastikan JSON fields terisi agar tidak error
                'manipulations' => json_encode([]),
                'custom_properties' => json_encode(['visibility' => $visibility]),
                'responsive_images' => json_encode([]),
                'uuid' => (string) Str::uuid(),
                'order_column' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        return response()->json([
            'id' => $media->id,
            'file_name' => $media->file_name,
            'original_url' => ($diskName === 'public') ? Storage::disk($diskName)->url($name) : route('gallery.file', $media->id),
            'disk' => $diskName === 'public' ? 'public' : 'private',
        ]);
    }

    public function file(int $id)
    {
        $media = Media::findOrFail($id);

        if ($media->disk !== 'public') {
            if (!Auth::check()) {
                abort(403);
            }
            // jika perlu: owner-only check
            // if ($media->model_id !== Auth::id()) { abort(403); }
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
                return response()->json(['message' => 'File tidak ditemukan.'], 404);
            }
            return redirect()->back()->with('error', 'File tidak ditemukan.');
        }

        if (Storage::disk($media->disk)->exists($media->file_name)) {
            Storage::disk($media->disk)->delete($media->file_name);
        }

        $media->delete();

        if (request()->wantsJson()) {
            return response()->json(['message' => 'File dihapus']);
        }

        return redirect()->route('gallery.index')->with('success', 'File berhasil dihapus.');
    }
}
