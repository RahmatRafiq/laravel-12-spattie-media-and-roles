<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface MenuRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get root menus with children ordered
     */
    public function getRootMenusWithChildren(): Collection;

    /**
     * Get menus filtered by user permissions
     */
    public function getMenusForUser(\App\Models\User $user): Collection;

    /**
     * Update menu order
     */
    public function updateOrder(array $menuOrder): bool;

    /**
     * Get all menus as flat list
     */
    public function getAllFlat(): Collection;

    /**
     * Get menu by route name
     */
    public function findByRoute(string $route): ?\App\Models\Menu;

    /**
     * Get child menus of a parent
     */
    public function getChildMenus(int $parentId): Collection;
}
