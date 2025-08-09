<?php
namespace App\Providers;


use App\Observers\ActivityObserver;
use Illuminate\Support\ServiceProvider;
use Spatie\Activitylog\Models\Activity;
use Illuminate\Support\Facades\Broadcast;
use Spatie\Permission\PermissionRegistrar;
use Inertia\Inertia;
use App\Models\AppSetting;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Activity::observe(ActivityObserver::class);
        Activity::created(function ($activity) {
            broadcast(new \App\Events\ActivityLogCreated($activity));
        });

        Inertia::share('appSettings', function () {
            return AppSetting::getInstance();
        });

        Inertia::share('sidebarMenus', function () {
            $user = auth()->user();
            if (!$user) return [];
            $menus = \App\Models\Menu::with(['children' => function($q) use ($user) {
                $q->orderBy('order');
            }])
            ->whereNull('parent_id')
            ->orderBy('order')
            ->get()
            ->filter(function ($menu) use ($user) {
                return !$menu->permission || $user->can($menu->permission);
            })
            ->map(function ($menu) use ($user) {
                $menu->children = $menu->children->filter(function ($child) use ($user) {
                    return !$child->permission || $user->can($child->permission);
                })->values();
                return $menu;
            })
            ->values();
            return $menus;
        });
    }
}
