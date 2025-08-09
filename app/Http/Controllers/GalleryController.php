<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use App\Models\FilemanagerFolder;
use Illuminate\Support\Facades\Auth;

class GalleryController extends Controller
{
    public function createFolder(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:filemanager_folders,id',
        ]);
        $folder = FilemanagerFolder::create([
            'name' => $request->input('name'),
            'parent_id' => $request->input('parent_id'),
            'path' => null,
        ]);
        return redirect()->route('gallery.index', ['folder_id' => $folder->id])
            ->with('success', 'Folder created successfully.');
    }

    public function renameFolder(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $folder = FilemanagerFolder::findOrFail($id);
        $folder->name = $request->input('name');
        $folder->save();
        return redirect()->route('gallery.index', ['folder_id' => $folder->id])
            ->with('success', 'Folder renamed successfully.');
    }

    public function deleteFolder($id)
    {
        $folder = FilemanagerFolder::findOrFail($id);
        $folder->delete();
        return redirect()->route('gallery.index')->with('success', 'Folder deleted successfully.');
    }

    public function index(Request $request)
    {
        $visibility = $request->query('visibility', 'public');
        $collection = $request->query('collection_name', null);
        $folderId = $request->query('folder_id');
        $folders = FilemanagerFolder::all();
        $allCollections = Media::select('collection_name')->distinct()->pluck('collection_name')->toArray();
        $allDisks = Media::select('disk')->distinct()->pluck('disk')->toArray();
        $publicDisks = [];
        $privateDisks = [];
        foreach ($allDisks as $disk) {
            $diskConfig = config('filesystems.disks.' . $disk);
            if ($diskConfig && ($diskConfig['driver'] ?? null) === 'local' && isset($diskConfig['url']) && str_contains($diskConfig['url'], '/storage')) {
                $publicDisks[] = $disk;
            } else {
                $privateDisks[] = $disk;
            }
        }
        $selectedDisks = $visibility === 'public' ? $publicDisks : $privateDisks;
        $query = Media::query();
        $query->where('collection_name', $collection ?: 'gallery');
        if (!empty($selectedDisks)) {
            $query->whereIn('disk', $selectedDisks);
        } else {
            $query->whereRaw('1=0');
        }
        if ($folderId) {
            $query->whereJsonContains('custom_properties->folder_id', (int)$folderId);
        }
        $paginator = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->appends($request->query());
        $items = collect($paginator->items())->map(function ($m) {
            $diskConfig = config('filesystems.disks.' . $m->disk);
            $url = null;
            $filePath = $m->file_name;
            if ($diskConfig && ($diskConfig['driver'] ?? null) === 'local' && isset($diskConfig['url'])) {
                if (!Storage::disk($m->disk)->exists($filePath)) {
                    $subfolderPath = $m->id . '/' . $m->file_name;
                    if (Storage::disk($m->disk)->exists($subfolderPath)) {
                        $filePath = $subfolderPath;
                    }
                }
                $url = rtrim($diskConfig['url'], '/') . '/' . ltrim($filePath, '/');
            } else {
                $url = route('gallery.file', $m->id);
            }
            return [
                'id' => $m->id,
                'file_name' => $m->file_name,
                'name' => $m->name ?? $m->file_name,
                'original_url' => $url,
                'disk' => $m->disk,
                'collection_name' => $m->collection_name,
                'custom_properties' => $m->custom_properties,
            ];
        })->toArray();
        $paginationArray = $paginator->toArray();
        $links = $paginationArray['links'] ?? [];
        return Inertia::render('Gallery/Index', [
            'media' => [
                'data' => $items,
                'links' => $links,
            ],
            'visibility' => $visibility,
            'collections' => $allCollections,
            'selected_collection' => $collection,
            'folders' => $folders,
            'selected_folder_id' => $folderId,
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
        $user = Auth::user();
        $folderId = $request->query('folder_id');
        if ($user && method_exists($user, 'addMedia')) {
            $customProps = ['visibility' => $visibility];
            if ($folderId) {
                $customProps['folder_id'] = (int)$folderId;
            }
            $user->addMedia($uploaded)
                ->usingName(pathinfo($uploaded->getClientOriginalName(), PATHINFO_FILENAME))
                ->preservingOriginal()
                ->withCustomProperties($customProps)
                ->toMediaCollection('gallery', $diskName);
        } else {
            return redirect()->back()->with('error', 'User model must use HasMedia trait.');
        }
        return redirect()->route('gallery.index', ['folder_id' => $folderId])->with('success', 'File uploaded successfully.');

    }

    public function file(int $id)
    {
        $media = Media::findOrFail($id);
        if ($media->disk !== 'public') {
            if (!Auth::check()) {
                abort(403);
            }
        }
        $filePath = $media->file_name;
        if (!Storage::disk($media->disk)->exists($filePath)) {
            $subfolderPath = $media->id . '/' . $media->file_name;
            if (Storage::disk($media->disk)->exists($subfolderPath)) {
                $filePath = $subfolderPath;
            } else {
                abort(404);
            }
        }
        $fullPath = Storage::disk($media->disk)->path($filePath);
        $mime = $media->mime_type ?? 'application/octet-stream';
        return response()->file($fullPath, [
            'Content-Type' => $mime,
            'Content-Disposition' => 'inline; filename="' . basename($filePath) . '"',
        ]);
    }

    public function destroy($id)
    {
        $media = Media::find($id);
        $folderId = null;
        if ($media && isset($media->custom_properties['folder_id'])) {
            $folderId = $media->custom_properties['folder_id'];
        }
        if (!$media) {
            return redirect()->route('gallery.index', ['folder_id' => $folderId])->with('error', 'File not found.');

        }
        if (Storage::disk($media->disk)->exists($media->file_name)) {
            Storage::disk($media->disk)->delete($media->file_name);
        }
        $media->delete();
        
    }
}
