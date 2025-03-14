<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class SocialAuthController extends Controller
{
    /**
     * Redirect ke penyedia OAuth (Google, GitHub)
     */
    public function redirectToProvider($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    /**
     * Handle callback dari penyedia OAuth
     */
    public function handleProviderCallback($provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();

            // Cek apakah user sudah ada berdasarkan email
            $user = User::where('email', $socialUser->getEmail())->first();

            if (!$user) {
                // Jika belum ada, buat user baru
                $user = User::create([
                    'name' => $socialUser->getName(),
                    'email' => $socialUser->getEmail(),
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'password' => Hash::make(uniqid()), // Password acak
                ]);
            }

            // Login user
            Auth::login($user);

            // Redirect ke dashboard setelah login
            return redirect()->route('dashboard')->with('success', 'Login berhasil!');
        } catch (\Exception $e) {
            return redirect('/')->with('error', 'Terjadi kesalahan saat login.');
        }
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        Auth::logout();
        return redirect('/')->with('success', 'Logout berhasil!');
    }
}
