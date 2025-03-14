<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SocialAuthController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Route for login with OAuth (Google, GitHub)
Route::get('auth/{provider}', [SocialAuthController::class, 'redirectToProvider'])->name('auth.redirect');
Route::get('auth/{provider}/callback', [SocialAuthController::class, 'handleProviderCallback'])->name('auth.callback');

// Middleware for pages that require authentication
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    Route::post('logout', [SocialAuthController::class, 'logout'])->name('logout');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
