<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\SocialAuthController;
use App\Models\AppSetting;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $settings = AppSetting::getInstance();

    return Inertia::render('welcome', [
        'settings' => $settings,
    ]);
})->name('home');

Route::get('auth/{provider}', [SocialAuthController::class, 'redirectToProvider'])->name('auth.redirect');
Route::get('auth/{provider}/callback', [SocialAuthController::class, 'handleProviderCallback'])->name('auth.callback');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('dashboard')->group(function () {
        Route::get('/', function () {
            return Inertia::render('dashboard');
        })->middleware('permission:view-dashboard')->name('dashboard');

        Route::get('/activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');

        Route::post('roles/json', [\App\Http\Controllers\UserRolePermission\RoleController::class, 'json'])->name('roles.json');
        Route::resource('roles', \App\Http\Controllers\UserRolePermission\RoleController::class)
            ->middleware('permission:view-roles|create-roles|edit-roles|delete-roles');

        Route::post('permissions/json', [\App\Http\Controllers\UserRolePermission\PermissionController::class, 'json'])->name('permissions.json');
        Route::resource('permissions', \App\Http\Controllers\UserRolePermission\PermissionController::class)
            ->middleware('permission:view-permissions|assign-permissions');

        Route::post('users/json', [\App\Http\Controllers\UserRolePermission\UserController::class, 'json'])->name('users.json');
        Route::resource('users', \App\Http\Controllers\UserRolePermission\UserController::class)
            ->middleware('permission:view-users|create-users|edit-users|delete-users');
        Route::get('users/trashed', [\App\Http\Controllers\UserRolePermission\UserController::class, 'trashed'])->name('users.trashed');
        Route::post('users/{user}/restore', [\App\Http\Controllers\UserRolePermission\UserController::class, 'restore'])->name('users.restore');
        Route::delete('users/{user}/force-delete', [\App\Http\Controllers\UserRolePermission\UserController::class, 'forceDelete'])->name('users.force-delete');

        Route::get('/app-settings', [\App\Http\Controllers\AppSettingController::class, 'index'])->name('app-settings.index');
        Route::put('/app-settings', [\App\Http\Controllers\AppSettingController::class, 'update'])->name('app-settings.update');

        Route::delete('/profile/delete-file', [\App\Http\Controllers\Settings\ProfileController::class, 'deleteFile'])->name('profile.deleteFile');
        Route::post('/profile/upload', [\App\Http\Controllers\Settings\ProfileController::class, 'upload'])->name('profile.upload');
        Route::post('/storage', [\App\Http\Controllers\StorageController::class, 'store'])->name('storage.store');
        Route::delete('/storage', [\App\Http\Controllers\StorageController::class, 'destroy'])->name('storage.destroy');
        Route::get('/storage/{path}', [\App\Http\Controllers\StorageController::class, 'show'])->name('storage.show');
        Route::get('gallery', [\App\Http\Controllers\GalleryController::class, 'index'])->name('gallery.index');
        Route::middleware('role:admin')->group(function () {
            Route::post('/menus/update-order', [\App\Http\Controllers\MenuController::class, 'updateOrder'])->name('menus.updateOrder');
            Route::get('menus/manage', [\App\Http\Controllers\MenuController::class, 'manage'])->name('menus.manage');
            Route::get('menus/create', [\App\Http\Controllers\MenuController::class, 'create'])->name('menus.create');
            Route::get('menus/{menu}/edit', [\App\Http\Controllers\MenuController::class, 'edit'])->name('menus.edit');
            Route::post('menus', [\App\Http\Controllers\MenuController::class, 'store'])->name('menus.store');
            Route::put('menus/{menu}', [\App\Http\Controllers\MenuController::class, 'update'])->name('menus.update');
            Route::delete('menus/{menu}', [\App\Http\Controllers\MenuController::class, 'destroy'])->name('menus.destroy');
        });
        Route::post('gallery', [\App\Http\Controllers\GalleryController::class, 'store'])->name('gallery.store');
        Route::delete('gallery/{id}', [\App\Http\Controllers\GalleryController::class, 'destroy'])->name('gallery.destroy');
        Route::get('gallery/file/{id}', [\App\Http\Controllers\GalleryController::class, 'file'])->name('gallery.file');
        Route::post('gallery/folder', [\App\Http\Controllers\GalleryController::class, 'createFolder'])
            ->middleware('role:admin')
            ->name('gallery.folder.create');
        Route::put('gallery/folder/{id}', [\App\Http\Controllers\GalleryController::class, 'renameFolder'])->name('gallery.folder.rename');
        Route::delete('gallery/folder/{id}', [\App\Http\Controllers\GalleryController::class, 'deleteFolder'])->name('gallery.folder.delete');
    });

    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('dashboard');
        Route::get('/settings', function () {
            return Inertia::render('Admin/Settings');
        })->name('settings')->middleware('permission:manage-settings');
    });

    Route::post('logout', [SocialAuthController::class, 'logout'])->name('logout');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
