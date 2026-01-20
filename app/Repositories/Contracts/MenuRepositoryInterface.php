<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface MenuRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get root menus with children ordered
     *
     * @return Collection
     */
    public function getRootMenusWithChildren(): Collection;

    /**
     * Get menus filtered by user permissions
     *
     * @param  \App\Models\User  $user
     * @return Collection
     */
    public function getMenusForUser(\App\Models\User $user): Collection;

    /**
     * Update menu order
     *
     * @param  array  $menuOrder
     * @return bool
     */
    public function updateOrder(array $menuOrder): bool;

    /**
     * Get all menus as flat list
     *
     * @return Collection
     */
    public function getAllFlat(): Collection;

    /**
     * Get menu by route name
     *
     * @param  string  $route
     * @return \App\Models\Menu|null
     */
    public function findByRoute(string $route): ?\App\Models\Menu;

    /**
     * Get child menus of a parent
     *
     * @param  int  $parentId
     * @return Collection
     */
    public function getChildMenus(int $parentId): Collection;
}
