<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Services\ProfileService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Storage;

class ProfileController extends Controller
{
    public function __construct(
        protected ProfileService $profileService
    ) {}

    public function edit(Request $request): Response
    {
        $media = $request->user()->getMedia('profile_image')->first();
        $profileImage = $media
        ? [
            'file_name' => $media->file_name,
            'size' => $media->size,
            'url' => $media->getFullUrl(),
        ]
        : null;

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'profileImage' => $profileImage,
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'profile_image.*' => 'required|file|image|max:2048',
        ]);

        $file = $request->file('profile_image')[0];
        $tempPath = $file->store('', 'temp');

        return response()->json([
            'name' => basename($tempPath),
            'url' => Storage::disk('temp')->url($tempPath),
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->validate([
            'profile_image' => 'array|max:1',
            'profile_image.*' => 'string',
        ]);

        try {
            $this->profileService->updateProfile(
                $request->user(),
                $request->validated(),
                $request
            );

            return to_route('profile.edit');
        } catch (\Exception $e) {
            \Log::error('Profile update failed: ' . $e->getMessage());

            return back()->withErrors('Profile update failed.');
        }
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $this->profileService->deletePhoto($user);

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function deleteFile(Request $request)
    {
        $data = $request->validate(['filename' => 'required|string']);

        // Safe delete from storage if exists
        if (Storage::disk('local')->exists('profile_image/' . $data['filename'])) {
            Storage::disk('local')->delete('profile_image/' . $data['filename']);
        }

        // Also check Spatie Media
        $media = \Spatie\MediaLibrary\MediaCollections\Models\Media::where('file_name', $data['filename'])
            ->where('collection_name', 'profile_image')
            ->first();

        if ($media) {
            $media->delete();
        }

        return response()->json(['message' => 'File deleted successfully'], 200);
    }
}
