<?php

namespace App\Providers;

use App\Models\AppSetting;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void {}

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Activity::created(function ($activity) {
            $activity->load('causer', 'subject');
            broadcast(new \App\Events\ActivityLogCreated($activity));
        });

        Inertia::share('appSettings', function () {
            return AppSetting::getInstance();
        });

        Inertia::share('sidebarMenus', function () {
            $user = auth()->user();
            if (! $user) {
                return [];
            }
            $menus = \App\Models\Menu::with(['children' => function ($q) {
                $q->orderBy('order');
            }])
                ->whereNull('parent_id')
                ->orderBy('order')
                ->get()
                ->filter(function ($menu) use ($user) {
                    return ! $menu->permission || $user->can($menu->permission);
                })
                ->map(function ($menu) use ($user) {
                    $menu->children = $menu->children->filter(function ($child) use ($user) {
                        return ! $child->permission || $user->can($child->permission);
                    })->values();

                    return $menu;
                })
                ->values();

            return $menus;
        });
    }
}
