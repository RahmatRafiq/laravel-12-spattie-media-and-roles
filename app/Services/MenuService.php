<?php

namespace App\Services;

use App\Models\Menu;
use App\Models\User;
use App\Repositories\Contracts\MenuRepositoryInterface;

class MenuService
{
    /**
     * MenuService constructor
     */
    public function __construct(
        private MenuRepositoryInterface $menuRepository
    ) {}

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

        return collect($this->menuRepository->getMenusForUser($user));
    }

    /**
     * Get menus for a specific user
     */
    public function getMenusForUser(User $user): \Illuminate\Database\Eloquent\Collection
    {
        return $this->menuRepository->getMenusForUser($user);
    }

    /**
     * Get all root menus with children
     */
    public function getAllMenusWithChildren(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->menuRepository->getRootMenusWithChildren();
    }

    /**
     * Get all root menus with children (alias for controller usage)
     */
    public function getRootMenusWithChildren(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->menuRepository->getRootMenusWithChildren();
    }

    /**
     * Get all menus as flat list
     */
    public function getAllMenusFlat(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->menuRepository->getAllFlat();
    }

    /**
     * Get all menus ordered
     */
    public function getAllMenus(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->menuRepository->all();
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
     */
    public function deleteMenu(int $id): bool
    {
        return $this->menuRepository->delete($id);
    }

    /**
     * Update menu order
     */
    public function updateMenuOrder(array $menuOrder): bool
    {
        return $this->menuRepository->updateOrder($menuOrder);
    }

    /**
     * Find menu by ID
     */
    public function findMenu(int $id): Menu
    {
        return $this->menuRepository->findOrFail($id);
    }

    /**
     * Get child menus of a parent
     */
    public function getChildMenus(int $parentId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->menuRepository->getChildMenus($parentId);
    }
}
