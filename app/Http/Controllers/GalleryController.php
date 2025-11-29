<?php

namespace App\Http\Controllers;

use App\Models\FilemanagerFolder;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

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

        // Preserve visibility from request
        $visibility = $request->query('visibility', 'public');

        return redirect()->route('gallery.index', ['folder_id' => $folder->id, 'visibility' => $visibility])
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

        // Preserve visibility from request
        $visibility = $request->query('visibility', 'public');

        return redirect()->route('gallery.index', ['folder_id' => $folder->id, 'visibility' => $visibility])
            ->with('success', 'Folder renamed successfully.');
    }

    public function deleteFolder(Request $request, $id)
    {
        $folder = FilemanagerFolder::findOrFail($id);

        // Check if folder contains files (using folder_id column instead of JSON)
        $hasFiles = Media::where('folder_id', $id)->exists();

        if ($hasFiles) {
            return redirect()->back()
                ->with('error', 'Cannot delete folder that contains files. Please delete all files first.');
        }

        // Check if folder has subfolders
        if ($folder->children()->exists()) {
            return redirect()->back()
                ->with('error', 'Cannot delete folder that contains subfolders.');
        }

        $parentId = $folder->parent_id;
        $folder->delete();

        // Preserve visibility from request
        $visibility = $request->query('visibility', 'public');

        return redirect()->route('gallery.index', ['folder_id' => $parentId, 'visibility' => $visibility])
            ->with('success', 'Folder deleted successfully.');
    }

    public function index(Request $request)
    {
        $visibility = $request->query('visibility', 'public');
        $collection = $request->query('collection_name', null);
        $folderId = $request->query('folder_id');

        // Validate folder_id exists if provided, otherwise redirect to root
        if ($folderId && ! FilemanagerFolder::where('id', $folderId)->exists()) {
            return redirect()->route('gallery.index', ['visibility' => $visibility])
                ->with('error', 'Folder not found. Redirected to root.');
        }

        $folders = FilemanagerFolder::all();
        $allCollections = Media::select('collection_name')->distinct()->pluck('collection_name')->toArray();
        $allDisks = Media::select('disk')->distinct()->pluck('disk')->toArray();
        $publicDisks = [];
        $privateDisks = [];
        foreach ($allDisks as $disk) {
            $diskConfig = config('filesystems.disks.'.$disk);
            if ($diskConfig && ($diskConfig['driver'] ?? null) === 'local' && isset($diskConfig['url']) && str_contains($diskConfig['url'], '/storage')) {
                $publicDisks[] = $disk;
            } else {
                $privateDisks[] = $disk;
            }
        }
        $selectedDisks = $visibility === 'public' ? $publicDisks : $privateDisks;
        $query = Media::query();
        $query->where('collection_name', $collection ?: 'gallery');
        if (! empty($selectedDisks)) {
            $query->whereIn('disk', $selectedDisks);
        } else {
            $query->whereRaw('1=0');
        }
        if ($folderId) {
            // Use folder_id column instead of JSON query for better performance
            $query->where('folder_id', (int) $folderId);
        }
        $paginator = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->appends($request->query());
        $items = collect($paginator->items())->map(function ($m) {
            // For public files, use Spatie's getUrl() which handles the correct path structure
            // For private files, use protected route
            $url = null;
            if ($m->disk === 'public' || str_contains($m->disk, 'profile-images')) {
                // Use Spatie's built-in URL generation for public files
                $url = $m->getUrl();
            } else {
                // Use protected route for private files
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
            'file' => [
                'required',
                'file',
                'max:10240', // 10MB
                'mimes:jpg,jpeg,png,gif,webp,svg,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,zip,rar,mp4,mov,avi',
            ],
            'visibility' => 'nullable|in:public,private',
        ]);

        $visibility = $request->input('visibility', 'public');
        $diskName = $visibility === 'public' ? 'public' : 'local';
        $uploaded = $request->file('file');
        $folderId = $request->query('folder_id');

        // Validate folder_id exists if provided
        if ($folderId && ! FilemanagerFolder::where('id', $folderId)->exists()) {
            return redirect()->route('gallery.index')
                ->with('error', 'Folder not found. Please select a valid folder or upload to root.');
        }

        // Create Gallery record to attach media
        $gallery = Gallery::create([
            'name' => pathinfo($uploaded->getClientOriginalName(), PATHINFO_FILENAME),
            'user_id' => Auth::id(),
            'folder_id' => $folderId,
        ]);

        // Add media to gallery
        $gallery->addMedia($uploaded)
            ->usingName(pathinfo($uploaded->getClientOriginalName(), PATHINFO_FILENAME))
            ->withCustomProperties(['visibility' => $visibility, 'uploaded_by' => Auth::id()])
            ->toMediaCollection('gallery', $diskName);

        // Update media with folder_id if provided (using direct column, not JSON)
        if ($folderId) {
            $media = $gallery->getFirstMedia('gallery');
            if ($media) {
                $media->folder_id = (int) $folderId;
                $media->save();
            }
        }

        return redirect()->route('gallery.index', ['folder_id' => $folderId, 'visibility' => $visibility])
            ->with('success', 'File uploaded successfully.');
    }

    public function file(int $id)
    {
        $media = Media::findOrFail($id);

        // Security check for private files
        if ($media->disk !== 'public') {
            if (! Auth::check()) {
                abort(403, 'Authentication required');
            }

            // Check ownership: only file owner or admin can access
            $user = Auth::user();
            $isAdmin = $user->hasRole('admin');
            $isOwner = false;

            // Check ownership based on model type
            if ($media->model_type === Gallery::class) {
                // Media attached to Gallery - check gallery owner
                $gallery = Gallery::find($media->model_id);
                $isOwner = $gallery && $gallery->user_id === $user->id;
            } elseif ($media->model_type === \App\Models\User::class) {
                // Media attached directly to User (e.g., profile images)
                $isOwner = $media->model_id === $user->id;
            }

            if (! $isOwner && ! $isAdmin) {
                abort(403, 'Unauthorized access to this file');
            }
        }

        $filePath = $media->file_name;
        if (! Storage::disk($media->disk)->exists($filePath)) {
            $subfolderPath = $media->id.'/'.$media->file_name;
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
            'Content-Disposition' => 'inline; filename="'.basename($filePath).'"',
        ]);
    }

    public function destroy($id)
    {
        $media = Media::find($id);

        if (! $media) {
            return redirect()->route('gallery.index')
                ->with('error', 'File not found.');
        }

        // Get folder_id from column instead of JSON
        $folderId = $media->folder_id;

        // Determine visibility from disk or custom properties
        $visibility = 'public'; // default
        if ($media->disk === 'local' || $media->disk === 'private') {
            $visibility = 'private';
        } elseif (isset($media->custom_properties['visibility'])) {
            $visibility = $media->custom_properties['visibility'];
        }

        if (Storage::disk($media->disk)->exists($media->file_name)) {
            Storage::disk($media->disk)->delete($media->file_name);
        }

        $media->delete();

        return redirect()->route('gallery.index', ['folder_id' => $folderId, 'visibility' => $visibility])
            ->with('success', 'File deleted successfully.');
    }
}
