<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfilePhotoController extends Controller
{
    public function __construct(
        protected ProfileService $service
    ) {}

    /**
     * Display the specified profile photo securely.
     */
    public function show(int $userId, string $conversion = '')
    {
        $user = User::findOrFail($userId);

        // Authorization: Admin or the owner of the account
        if (! auth()->user()->hasRole('admin') && auth()->id() !== $user->id) {
            abort(403, 'Unauthorized access to profile photo.');
        }

        $media = $user->getFirstMedia('profile_image');

        if (! $media) {
            abort(404);
        }

        // Optimized for both local and cloud storage
        if ($media->getDiskDriverName() === 'local') {
            return response()->file($media->getPath($conversion));
        }

        // For Cloud Storage (S3, etc.), stream the file securely
        return response()->streamDownload(function () use ($media, $conversion) {
            echo file_get_contents($media->getTemporaryUrl(now()->addMinutes(5), $conversion));
        }, $media->file_name);
    }

    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        /** @var \App\Models\User $user */
        $user = auth()->user();

        $this->service->updatePhoto($user, $request->file('photo'));

        return response()->json(['message' => 'Profile photo updated successfully.']);
    }

    public function destroy(): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $this->service->deletePhoto($user);

        return response()->json(['message' => 'Profile photo deleted successfully.']);
    }
}
