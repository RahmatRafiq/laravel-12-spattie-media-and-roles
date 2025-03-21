<?php
namespace App\Providers;

use App\Observers\ActivityObserver;
use Illuminate\Support\ServiceProvider;
use Spatie\Activitylog\Models\Activity;
use Illuminate\Support\Facades\Broadcast;


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

    }
}
