<?php

namespace App\Http\Controllers;

use App\Http\Requests\Menu\StoreMenuRequest;
use App\Http\Requests\Menu\UpdateMenuRequest;
use App\Http\Requests\Menu\UpdateOrderRequest;
use App\Services\MenuService;
use App\Services\PermissionService;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * MenuController constructor
     */
    public function __construct(
        private MenuService $menuService,
        private PermissionService $permissionService
    ) {}

    /**
     * Show the form for creating a new menu
     *
     * @return \Inertia\Response
     */
    public function create(Request $request)
    {
        $parentMenuId = $request->query('parent_id');
        $allMenus = $this->menuService->getAllMenus();
        $allPermissions = $this->permissionService->getAllPermissions();

        return inertia('Menu/Form', [
            'allMenus' => $allMenus,
            'permissions' => $allPermissions,
            'menu' => $parentMenuId ? ['parent_id' => (int) $parentMenuId] : null,
        ]);
    }

    /**
     * Store a newly created menu
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreMenuRequest $request)
    {
        $this->menuService->createMenu($request->validated());

        return redirect()->route('menus.manage')->with('success', 'Menu created successfully.');
    }

    /**
     * Show the form for editing the specified menu
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $menuToEdit = $this->menuService->findMenu($id);
        $otherMenus = $this->menuService->getAllMenusExcept($id);
        $allPermissions = $this->permissionService->getAllPermissions();

        return inertia('Menu/Form', [
            'menu' => $menuToEdit,
            'allMenus' => $otherMenus,
            'permissions' => $allPermissions,
        ]);
    }

    /**
     * Update the specified menu
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdateMenuRequest $request, $id)
    {
        $this->menuService->updateMenu($id, $request->validated());

        return redirect()->route('menus.manage')->with('success', 'Menu updated successfully.');
    }

    /**
     * Display menu management page
     *
     * @return \Inertia\Response
     */
    public function manage()
    {
        $rootMenus = $this->menuService->getRootMenusWithChildren();

        return inertia('Menu/Index', [
            'menus' => $rootMenus,
        ]);
    }

    /**
     * Update menu order and hierarchy
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateOrder(UpdateOrderRequest $request)
    {
        $validated = $request->validated();
        $menuTree = json_decode($validated['tree'], true);

        if (! is_array($menuTree)) {
            return response()->json(['success' => false, 'message' => 'Invalid tree data'], 422);
        }

        $this->menuService->updateMenuOrder($menuTree);

        return redirect()->route('menus.manage')
            ->with('success', 'Menu order updated successfully.');
    }

    /**
     * Remove the specified menu
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $this->menuService->deleteMenu($id);

        return redirect()->route('menus.manage')->with('success', 'Menu deleted successfully.');
    }
}
