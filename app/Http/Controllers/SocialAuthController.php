<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class SocialAuthController extends Controller
{
    public function redirectToProvider($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    public function handleProviderCallback($provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();

            $user = User::where('email', $socialUser->getEmail())->first();

            if (!$user) {
                $user = User::create([
                    'name' => $socialUser->getName(),
                    'email' => $socialUser->getEmail(),
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'password' => Hash::make(uniqid()),
                ]);
            }

            Auth::login($user);

            return redirect()->route('dashboard')->with('success', 'Login successful!');
        } catch (\Exception $e) {
            return redirect('/')->with('error', 'An error occurred during login.');
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
        return redirect('/')->with('success', 'Logout successful!');
    }
}
