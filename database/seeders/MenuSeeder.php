<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $dashboard = Menu::create([
            'title' => 'Dashboard',
            'route' => 'dashboard',
            'icon' => 'LayoutDashboard',
            'order' => 1,
        ]);
        $gallery = Menu::create([
            'title' => 'Gallery',
            'route' => 'gallery.index',
            'icon' => 'FileText',
            'order' => 2,
        ]);
        $users = Menu::create([
            'title' => 'Users Management',
            'icon' => 'Users',
            'order' => 3,
            'permission' => 'view-users',
        ]);
        Menu::create([
            'title' => 'Roles',
            'route' => 'roles.index',
            'icon' => 'Shield',
            'parent_id' => $users->id,
            'permission' => 'view-roles',
            'order' => 1,
        ]);
        Menu::create([
            'title' => 'Permissions',
            'route' => 'permissions.index',
            'icon' => 'Key',
            'parent_id' => $users->id,
            'permission' => 'view-permissions',
            'order' => 2,
        ]);
        Menu::create([
            'title' => 'User',
            'route' => 'users.index',
            'icon' => 'UserCheck',
            'parent_id' => $users->id,
            'permission' => 'view-users',
            'order' => 3,
        ]);
        Menu::create([
            'title' => 'App Settings',
            'route' => 'app-settings.index',
            'icon' => 'Settings',
            'permission' => 'manage-settings',
            'order' => 4,
        ]);

        Menu::create([
            'title' => 'Menu Management',
            'route' => 'menus.manage',
            'icon' => 'Settings',
            'permission' => 'manage-settings',
            'order' => 5,
        ]);
        Menu::create([
            'title' => 'Activity Logs',
            'route' => 'activity-logs.index',
            'icon' => 'ListChecks',
            'permission' => 'view-activity-logs',
            'order' => 6,
        ]);

    }
}
