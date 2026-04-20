<?php

namespace App\Services;

use App\Models\Menu;
use App\Models\User;

class MenuService
{
    /**
     * Get menus for current authenticated user
     * Filters by permissions
     */
    public function getMenusForCurrentUser(): \Illuminate\Support\Collection
    {
        $user = auth()->user();

        if (! $user) {
            return collect([]);
        }

        return collect($this->getMenusForUser($user));
    }

    /**
     * Get menus for a specific user
     */
    public function getMenusForUser(User $user): \Illuminate\Database\Eloquent\Collection
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
     * Get all root menus with children
     */
    public function getAllMenusWithChildren(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->getRootMenusWithChildren();
    }

    /**
     * Get all root menus with children (alias for controller usage)
     */
    public function getRootMenusWithChildren(): \Illuminate\Database\Eloquent\Collection
    {
        return Menu::with(['children' => function ($query) {
            $query->orderBy('order');
        }])
            ->whereNull('parent_id')
            ->orderBy('order')
            ->get();
    }

    /**
     * Get all menus as flat list
     */
    public function getAllMenusFlat(): \Illuminate\Database\Eloquent\Collection
    {
        return Menu::orderBy('order')->get();
    }

    /**
     * Get all menus ordered
     */
    public function getAllMenus(): \Illuminate\Database\Eloquent\Collection
    {
        return Menu::orderBy('order')->get();
    }

    /**
     * Get all menus except specified ID
     */
    public function getAllMenusExcept(int $excludeId): \Illuminate\Database\Eloquent\Collection
    {
        return Menu::where('id', '!=', $excludeId)->orderBy('order')->get();
    }

    /**
     * Create a new menu
     */
    public function createMenu(array $data): Menu
    {
        return Menu::create([
            'title' => $data['title'],
            'route' => $data['route'] ?? null,
            'icon' => $data['icon'] ?? null,
            'permission' => $data['permission'] ?? null,
            'parent_id' => $data['parent_id'] ?? null,
            'order' => $data['order'] ?? 0,
        ]);
    }

    /**
     * Update an existing menu
     */
    public function updateMenu(int $id, array $data): Menu
    {
        $menu = Menu::findOrFail($id);
        $menu->update([
            'title' => $data['title'],
            'route' => $data['route'] ?? null,
            'icon' => $data['icon'] ?? null,
            'permission' => $data['permission'] ?? null,
            'parent_id' => $data['parent_id'] ?? null,
            'order' => $data['order'] ?? 0,
        ]);

        return $menu;
    }

    /**
     * Delete a menu
     */
    public function deleteMenu(int $id): bool
    {
        return Menu::findOrFail($id)->delete();
    }

    /**
     * Update menu order
     */
    public function updateMenuOrder(array $menuOrder): bool
    {
        try {
            foreach ($menuOrder as $order => $menuId) {
                Menu::where('id', $menuId)->update(['order' => $order]);
            }

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Find menu by ID
     */
    public function findMenu(int $id): Menu
    {
        return Menu::findOrFail($id);
    }

    /**
     * Get child menus of a parent
     */
    public function getChildMenus(int $parentId): \Illuminate\Database\Eloquent\Collection
    {
        return Menu::where('parent_id', $parentId)
            ->orderBy('order')
            ->get();
    }
}
