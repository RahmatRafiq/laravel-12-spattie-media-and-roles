<?php

namespace App\Http\Controllers;

use App\Services\GalleryService;

class MediaShareController extends Controller
{
    public function __construct(
        protected GalleryService $galleryService
    ) {}

    /**
     * Serve the shared media file.
     */
    public function show(string $uuid, string $conversion = '')
    {
        $media = $this->galleryService->getSharedMedia($uuid);

        if (! $media) {
            abort(404, 'Shared file not found or sharing has been disabled.');
        }

        // Optimized for both local and cloud storage (S3, etc.)
        if ($media->getDiskDriverName() === 'local') {
            return response()->file($media->getPath($conversion));
        }

        // For Cloud, use direct secure redirect for better performance on large shared files
        return redirect($media->getTemporaryUrl(now()->addMinutes(15), $conversion));
    }
}
