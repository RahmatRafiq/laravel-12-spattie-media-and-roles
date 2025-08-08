<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\MediaLibrary;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Inertia\Inertia;

class GalleryController extends Controller
{
    // Tampilkan galeri dengan filter privat/publik
    public function index(Request $request)
    {
        $visibility = $request->get('visibility', 'public');
        $disk = $visibility === 'private' ? 'local' : 'public';
        $media = Media::where('disk', $disk)->orderByDesc('id')->paginate(24);
        return Inertia::render('Gallery', [
            'media' => $media,
            'visibility' => $visibility,
        ]);
    }

    // Hapus file dari galeri
    public function destroy(Request $request, $id)
    {
        $media = Media::findOrFail($id);
        $media->delete();
        return back()->with('success', 'File deleted!');
    }
}
