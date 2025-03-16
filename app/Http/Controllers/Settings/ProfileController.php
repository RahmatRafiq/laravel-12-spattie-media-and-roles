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
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $profileImage = $request->user()->getMedia('profile-images')->first();

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status'          => $request->session()->get('status'),
            'profileImage'    => $profileImage,
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'profile-images.*' => 'required|file|max:2048|mimes:jpeg,jpg,png',
            'id'               => 'required|integer',
        ]);

        $user = $request->user();

        return response()->json(['message' => 'Profile picture uploaded'], 200);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        DB::beginTransaction();

        try {
            $request->validate([
                'profile-images' => 'array|max:3',
            ]);

            $user = $request->user();
            $user->fill($request->validated());

            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }

            if ($request->has('profile-images')) {
                MediaLibrary::put(
                    $user,
                    'profile-images',
                    $request,
                    'profile-images'
                );
            }

            $user->save();
            DB::commit();
            return to_route('profile.edit');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Profile update failed.']);
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        // Delete user's media
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
