<?php

namespace App\Services;

use App\Models\Menu;
use App\Models\User;
use App\Repositories\Contracts\MenuRepositoryInterface;

class MenuService
{
    /**
     * MenuService constructor
     *
     * @param  MenuRepositoryInterface  $menuRepository
     */
    public function __construct(
        private MenuRepositoryInterface $menuRepository
    ) {}

    /**
     * Get menus for current authenticated user
     * Filters by permissions
     *
     * @return \Illuminate\Support\Collection
     */
    public function getMenusForCurrentUser(): \Illuminate\Support\Collection
    {
        $user = auth()->user();

        if (! $user) {
            return collect([]);
        }

        return collect($this->menuRepository->getMenusForUser($user));
    }

    /**
     * Get menus for a specific user
     *
     * @param  User  $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getMenusForUser(User $user): \Illuminate\Database\Eloquent\Collection
    {
        return $this->menuRepository->getMenusForUser($user);
    }

    /**
     * Get all root menus with children
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllMenusWithChildren(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->menuRepository->getRootMenusWithChildren();
    }

    /**
     * Get all root menus with children (alias for controller usage)
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRootMenusWithChildren(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->menuRepository->getRootMenusWithChildren();
    }

    /**
     * Get all menus as flat list
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllMenusFlat(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->menuRepository->getAllFlat();
    }

    /**
     * Get all menus ordered
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllMenus(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->menuRepository->all();
    }

    /**
     * Get all menus except specified ID
     *
     * @param  int  $excludeId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllMenusExcept(int $excludeId): \Illuminate\Database\Eloquent\Collection
    {
        return Menu::where('id', '!=', $excludeId)->orderBy('order')->get();
    }

    /**
     * Create a new menu
     *
     * @param  array  $data
     * @return Menu
     */
    public function createMenu(array $data): Menu
    {
        return $this->menuRepository->create([
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
     *
     * @param  int  $id
     * @param  array  $data
     * @return Menu
     */
    public function updateMenu(int $id, array $data): Menu
    {
        return $this->menuRepository->update($id, [
            'title' => $data['title'],
            'route' => $data['route'] ?? null,
            'icon' => $data['icon'] ?? null,
            'permission' => $data['permission'] ?? null,
            'parent_id' => $data['parent_id'] ?? null,
            'order' => $data['order'] ?? 0,
        ]);
    }

    /**
     * Delete a menu
     *
     * @param  int  $id
     * @return bool
     */
    public function deleteMenu(int $id): bool
    {
        return $this->menuRepository->delete($id);
    }

    /**
     * Update menu order
     *
     * @param  array  $menuOrder
     * @return bool
     */
    public function updateMenuOrder(array $menuOrder): bool
    {
        return $this->menuRepository->updateOrder($menuOrder);
    }

    /**
     * Find menu by ID
     *
     * @param  int  $id
     * @return Menu
     */
    public function findMenu(int $id): Menu
    {
        return $this->menuRepository->findOrFail($id);
    }

    /**
     * Get child menus of a parent
     *
     * @param  int  $parentId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getChildMenus(int $parentId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->menuRepository->getChildMenus($parentId);
    }
}
