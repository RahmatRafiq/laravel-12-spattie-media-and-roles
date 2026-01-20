<?php

namespace App\Providers;

use App\Repositories\Contracts\ActivityLogRepositoryInterface;
use App\Repositories\Contracts\GalleryRepositoryInterface;
use App\Repositories\Contracts\MenuRepositoryInterface;
use App\Repositories\Contracts\PermissionRepositoryInterface;
use App\Repositories\Contracts\RoleRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Eloquent\ActivityLogRepository;
use App\Repositories\Eloquent\GalleryRepository;
use App\Repositories\Eloquent\MenuRepository;
use App\Repositories\Eloquent\PermissionRepository;
use App\Repositories\Eloquent\RoleRepository;
use App\Repositories\Eloquent\UserRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * All of the container bindings that should be registered.
     *
     * @var array
     */
    public array $bindings = [
        UserRepositoryInterface::class => UserRepository::class,
        RoleRepositoryInterface::class => RoleRepository::class,
        PermissionRepositoryInterface::class => PermissionRepository::class,
        GalleryRepositoryInterface::class => GalleryRepository::class,
        MenuRepositoryInterface::class => MenuRepository::class,
        ActivityLogRepositoryInterface::class => ActivityLogRepository::class,
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        // Bindings are automatically registered via $bindings property
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
