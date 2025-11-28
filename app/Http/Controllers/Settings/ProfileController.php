<?php

namespace App\Http\Controllers\Settings;

use App\Helpers\MediaLibrary;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use DB;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Storage;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $media = $request->user()->getMedia('profile-images')->first();
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
            'profile-images.*' => 'required|file|image|max:2048',
        ]);

        $file = $request->file('profile-images')[0];
        $tempPath = $file->store('', 'temp');

        return response()->json([
            'name' => basename($tempPath),
            'url' => Storage::disk('temp')->url($tempPath),
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->validate([
            'profile-images' => 'array|max:1',
            'profile-images.*' => 'string',
        ]);

        $user = $request->user();

        DB::beginTransaction();
        try {
            MediaLibrary::put(
                $user,
                'profile-images',
                $request,
                'profile-images'
            );

            $user->fill($request->validated());

            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }

            $user->save();

            DB::commit();

            return to_route('profile.edit');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error($e->getMessage());

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

        $user->clearMediaCollection('profile-images');

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function deleteFile(Request $request)
    {
        $data = $request->validate(['filename' => 'required|string']);

        if (Storage::disk('profile-images')->exists($data['filename'])) {
            Storage::disk('profile-images')->delete($data['filename']);
        }

        $media = \Spatie\MediaLibrary\MediaCollections\Models\Media::where('file_name', $data['filename'])->first();
        if ($media) {
            $media->delete();
        }

        return response()->json(['message' => 'File berhasil dihapus'], 200);
    }
}
