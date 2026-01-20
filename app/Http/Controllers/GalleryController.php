<?php

namespace App\Http\Controllers;

use App\Models\FilemanagerFolder;
use App\Services\GalleryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class GalleryController extends Controller
{
    /**
     * GalleryController constructor
     *
     * @param  GalleryService  $galleryService
     */
    public function __construct(
        private GalleryService $galleryService
    ) {}

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

    /**
     * Display a listing of gallery media
     *
     * @param  Request  $request
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
     * @param  Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function file(int $id)
    {
        $media = $this->galleryService->findMedia($id);

        // Security check for private files
        if ($media->disk !== 'public') {
            if (! Auth::check()) {
                abort(403, 'Authentication required');
            }

            // Use service to check access
            if (! $this->galleryService->canAccessMedia($media, Auth::user())) {
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

        // Delete physical file if exists
        if (Storage::disk($media->disk)->exists($media->file_name)) {
            Storage::disk($media->disk)->delete($media->file_name);
        }

        $media->delete();

        return redirect()->route('gallery.index', ['folder_id' => $folderId, 'visibility' => $visibility])
            ->with('success', 'File deleted successfully.');
    }
}
