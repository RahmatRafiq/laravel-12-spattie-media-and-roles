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

        Inertia::share('env', fn () => config('app.env'));
        Inertia::share('isLocalEnv', fn () => in_array(config('app.env'), ['local', 'development', 'testing']));

        Inertia::share('appSettings', function () {
            return AppSetting::getInstance();
        });

        Inertia::share('sidebarMenus', function () {
            return app(\App\Services\MenuService::class)->getMenusForCurrentUser();
        });
    }
}
