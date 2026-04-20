<?php

namespace App\Http\Controllers;

use App\Http\Requests\Gallery\CreateFolderRequest;
use App\Http\Requests\Gallery\RenameFolderRequest;
use App\Http\Requests\Gallery\UploadFileRequest;
use App\Http\Resources\GalleryResource;
use App\Models\FilemanagerFolder;
use App\Services\GalleryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GalleryController extends Controller
{
    /**
     * GalleryController constructor
     */
    public function __construct(
        private GalleryService $galleryService
    ) {}

    public function index(Request $request)
    {
        $visibility = $request->query('visibility', 'public');
        $folderId = $request->query('folder_id');

        // Validate folder_id if provided
        if ($folderId && ! FilemanagerFolder::where('id', $folderId)->exists()) {
            return redirect()->route('gallery.index', ['visibility' => $visibility])
                ->with('error', 'Folder not found. Redirected to root.');
        }

        $media = $this->galleryService->getPaginatedMedia($request->all());
        $folders = $this->galleryService->getAllFolders();
        $allCollections = $this->galleryService->getAllCollections();

        return Inertia::render('Gallery/Index', [
            'media' => GalleryResource::collection($media),
            'visibility' => $visibility,
            'collections' => $allCollections,
            'selected_collection' => $request->query('collection_name'),
            'folders' => $folders,
            'selected_folder_id' => $folderId,
        ]);
    }

    public function createFolder(CreateFolderRequest $request)
    {
        $validated = $request->validated();
        $folder = $this->galleryService->createFolder(
            $validated['name'],
            $validated['parent_id'] ?? null
        );

        return redirect()->route('gallery.index', ['folder_id' => $folder->id, 'visibility' => $request->query('visibility', 'public')])
            ->with('success', 'Folder created successfully.');
    }

    public function renameFolder(RenameFolderRequest $request, $id)
    {
        $validated = $request->validated();
        $folder = $this->galleryService->renameFolder((int) $id, $validated['name']);

        return redirect()->route('gallery.index', ['folder_id' => $folder->id, 'visibility' => $request->query('visibility', 'public')])
            ->with('success', 'Folder renamed successfully.');
    }

    public function deleteFolder(Request $request, $id)
    {
        if (! $this->galleryService->canDeleteFolder((int) $id)) {
            return redirect()->back()
                ->with('error', 'Cannot delete folder that contains files or subfolders.');
        }

        $folder = FilemanagerFolder::findOrFail($id);
        $parentId = $folder->parent_id;
        
        $this->galleryService->deleteFolder((int) $id);

        return redirect()->route('gallery.index', ['folder_id' => $parentId, 'visibility' => $request->query('visibility', 'public')])
            ->with('success', 'Folder deleted successfully.');
    }

    public function store(UploadFileRequest $request)
    {
        $validated = $request->validated();
        $folderId = $request->query('folder_id');

        $this->galleryService->createMediaFromUpload(
            $request->file('file'),
            Auth::id(),
            $validated['visibility'] ?? 'public',
            $folderId
        );

        return redirect()->route('gallery.index', ['folder_id' => $folderId, 'visibility' => $validated['visibility'] ?? 'public'])
            ->with('success', 'File uploaded successfully.');
    }

    public function file(int $id)
    {
        $media = $this->galleryService->findMedia($id);

        if (! Auth::check() || ! $this->galleryService->canAccessMedia($media, Auth::user())) {
            abort(403);
        }

        return response()->file($media->getPath(), [
            'Content-Type' => $media->mime_type ?? 'application/octet-stream',
            'Content-Disposition' => 'inline; filename="'.$media->file_name.'"',
        ]);
    }

    public function destroy($id)
    {
        $media = $this->galleryService->findMedia((int) $id);
        $folderId = $media->folder_id;
        $visibility = $this->galleryService->getMediaVisibility($media);

        $this->galleryService->deleteMedia((int) $id);

        return redirect()->route('gallery.index', ['folder_id' => $folderId, 'visibility' => $visibility])
            ->with('success', 'File deleted successfully.');
    }
}
