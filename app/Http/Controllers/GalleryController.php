<?php

namespace App\Http\Controllers;

use App\Http\Requests\Gallery\CreateFolderRequest;
use App\Http\Requests\Gallery\RenameFolderRequest;
use App\Http\Requests\Gallery\UploadFileRequest;
use App\Models\FilemanagerFolder;
use App\Services\GalleryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class GalleryController extends Controller
{
    /**
     * GalleryController constructor
     */
    public function __construct(
        private GalleryService $galleryService
    ) {}

    public function createFolder(CreateFolderRequest $request)
    {
        $validated = $request->validated();
        $folder = FilemanagerFolder::create([
            'name' => $validated['name'],
            'parent_id' => $validated['parent_id'] ?? null,
            'path' => null,
        ]);

        // Preserve visibility from request
        $visibility = $request->query('visibility', 'public');

        return redirect()->route('gallery.index', ['folder_id' => $folder->id, 'visibility' => $visibility])
            ->with('success', 'Folder created successfully.');
    }

    public function renameFolder(RenameFolderRequest $request, $id)
    {
        $validated = $request->validated();
        $folder = FilemanagerFolder::findOrFail($id);
        $folder->name = $validated['name'];
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

    /**
     * Display a listing of gallery media
     *
     * @return \Inertia\Response
     */
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
        $allCollections = $this->galleryService->getAllCollections();

        // Get disks by visibility
        $disks = $this->galleryService->classifyDisksByVisibility();
        $selectedDisks = $visibility === 'public' ? $disks['public'] : $disks['private'];

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

        // Transform media items using service
        $items = collect($paginator->items())->map(function ($media) {
            return [
                'id' => $media->id,
                'file_name' => $media->file_name,
                'name' => $media->name ?? $media->file_name,
                'original_url' => $this->galleryService->getMediaUrl($media),
                'disk' => $media->disk,
                'collection_name' => $media->collection_name,
                'custom_properties' => $media->custom_properties,
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

    /**
     * Store a newly uploaded file
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(UploadFileRequest $request)
    {
        $validated = $request->validated();
        $visibility = $validated['visibility'] ?? 'public';
        $folderId = $request->query('folder_id');

        // Validate folder_id exists if provided
        if ($folderId && ! FilemanagerFolder::where('id', $folderId)->exists()) {
            return redirect()->route('gallery.index')
                ->with('error', 'Folder not found. Please select a valid folder or upload to root.');
        }

        // Use service to create media from upload
        $this->galleryService->createMediaFromUpload(
            $request->file('file'),
            Auth::id(),
            $visibility,
            $folderId
        );

        return redirect()->route('gallery.index', ['folder_id' => $folderId, 'visibility' => $visibility])
            ->with('success', 'File uploaded successfully.');
    }

    /**
     * Serve protected media file
     *
     * @return \Illuminate\Http\Response
     */
    public function file(int $id)
    {
        $media = $this->galleryService->findMedia($id);

        // SECURITY: Always check authorization, not just for private files
        if (! Auth::check()) {
            abort(403, 'Authentication required');
        }

        // SECURITY: Check user permission to access this file
        if (! $this->galleryService->canAccessMedia($media, Auth::user())) {
            abort(403, 'Unauthorized access to this file');
        }

        // SECURITY: Prevent path traversal attacks
        $filePath = $media->file_name;

        // Validate filename doesn't contain path traversal patterns
        if (str_contains($filePath, '..') || str_contains($filePath, './') || str_contains($filePath, '\\')) {
            abort(403, 'Invalid file path');
        }

        if (! Storage::disk($media->disk)->exists($filePath)) {
            $subfolderPath = $media->id.'/'.$media->file_name;

            // Double-check subfolder path for traversal attempts
            if (str_contains($subfolderPath, '..') || str_contains($subfolderPath, './') || str_contains($subfolderPath, '\\')) {
                abort(403, 'Invalid file path');
            }

            if (Storage::disk($media->disk)->exists($subfolderPath)) {
                $filePath = $subfolderPath;
            } else {
                abort(404);
            }
        }

        $fullPath = Storage::disk($media->disk)->path($filePath);

        // SECURITY: Validate resolved path is within disk root
        $diskRoot = Storage::disk($media->disk)->path('');
        $realFullPath = realpath($fullPath);
        $realDiskRoot = realpath($diskRoot);

        if (! $realFullPath || ! $realDiskRoot || ! str_starts_with($realFullPath, $realDiskRoot)) {
            abort(403, 'Invalid file path');
        }

        $mime = $media->mime_type ?? 'application/octet-stream';

        return response()->file($realFullPath, [
            'Content-Type' => $mime,
            'Content-Disposition' => 'inline; filename="'.basename($filePath).'"',
        ]);
    }

    /**
     * Delete the specified media file
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $media = Media::find($id);

        if (! $media) {
            return redirect()->route('gallery.index')
                ->with('error', 'File not found.');
        }

        // Get folder_id and visibility before deleting
        $folderId = $media->folder_id;
        $visibility = $this->galleryService->getMediaVisibility($media);

        // SECURITY: Use database transaction to prevent race conditions
        try {
            DB::transaction(function () use ($media) {
                // Spatie Media Library handles file deletion automatically
                // when model is deleted (via observer)
                $media->delete();
            });

            return redirect()->route('gallery.index', ['folder_id' => $folderId, 'visibility' => $visibility])
                ->with('success', 'File deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('gallery.index', ['folder_id' => $folderId, 'visibility' => $visibility])
                ->with('error', 'Failed to delete file: '.$e->getMessage());
        }
    }
}
