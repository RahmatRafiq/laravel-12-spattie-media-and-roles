<?php

namespace App\Repositories\Eloquent;

use App\Models\Menu;
use App\Models\User;
use App\Repositories\Contracts\MenuRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class MenuRepository extends BaseRepository implements MenuRepositoryInterface
{
    /**
     * MenuRepository constructor
     */
    public function __construct(Menu $model)
    {
        parent::__construct($model);
    }

    /**
     * Get root menus with children ordered
     */
    public function getRootMenusWithChildren(): Collection
    {
        return $this->model->with(['children' => function ($query) {
            $query->orderBy('order');
        }])
            ->whereNull('parent_id')
            ->orderBy('order')
            ->get();
    }

    /**
     * Get menus filtered by user permissions
     */
    public function getMenusForUser(User $user): Collection
    {
        return $this->getRootMenusWithChildren()
            ->filter(function ($menu) use ($user) {
                return ! $menu->permission || $user->can($menu->permission);
            })
            ->map(function ($menu) use ($user) {
                // Filter children by permissions
                $menu->children = $menu->children->filter(function ($child) use ($user) {
                    return ! $child->permission || $user->can($child->permission);
                })->values();

                return $menu;
            })
            ->values();
    }

    /**
     * Update menu order
     */
    public function updateOrder(array $menuOrder): bool
    {
        try {
            foreach ($menuOrder as $order => $menuId) {
                $this->model->where('id', $menuId)->update(['order' => $order]);
            }

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get all menus as flat list
     */
    public function getAllFlat(): Collection
    {
        return $this->model->orderBy('order')->get();
    }

    /**
     * Get menu by route name
     */
    public function findByRoute(string $route): ?Menu
    {
        return $this->model->where('route', $route)->first();
    }

    /**
     * Get child menus of a parent
     */
    public function getChildMenus(int $parentId): Collection
    {
        return $this->model->where('parent_id', $parentId)
            ->orderBy('order')
            ->get();
    }
}
