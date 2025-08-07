<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        if (!auth()->user()->can('view-dashboard')) {
            abort(403, 'You cannot access the admin dashboard.');
        }

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => \App\Models\User::count(),
                'total_roles' => \Spatie\Permission\Models\Role::count(),
                'total_permissions' => \Spatie\Permission\Models\Permission::count(),
            ]
        ]);
    }

    public function settings()
    {
        $user = auth()->user();
        
        if (!$user->hasRole('admin') && !$user->can('manage-settings')) {
            abort(403, 'You need admin role or manage-settings permission.');
        }

        return Inertia::render('Admin/Settings');
    }
}
