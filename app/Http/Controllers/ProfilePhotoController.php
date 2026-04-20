<?php

namespace App\Http\Controllers;

use App\Services\ProfilePhotoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfilePhotoController extends Controller
{
    public function __construct(
        protected ProfilePhotoService $service
    ) {}

    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        /** @var \App\Models\User $user */
        $user = auth()->user();
        
        $this->service->update($user, $request->file('photo'));

        return response()->json(['message' => 'Profile photo updated successfully.']);
    }

    public function destroy(): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $this->service->delete($user);

        return response()->json(['message' => 'Profile photo deleted successfully.']);
    }
}
