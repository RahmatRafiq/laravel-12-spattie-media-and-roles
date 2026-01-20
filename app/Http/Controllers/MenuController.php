<?php

namespace App\Http\Controllers;

use App\Services\MenuService;
use App\Services\PermissionService;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * MenuController constructor
     *
     * @param  MenuService  $menuService
     * @param  PermissionService  $permissionService
     */
    public function __construct(
        private MenuService $menuService,
        private PermissionService $permissionService
    ) {}
    /**
     * Show the form for creating a new menu
     *
     * @param  Request  $request
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
     * @param  Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validatedMenuData = $request->validate([
            'title' => 'required|string|max:255',
            'route' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
            'permission' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:menus,id',
        ]);

        $this->menuService->createMenu($validatedMenuData);

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
     * @param  Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $validatedMenuData = $request->validate([
            'title' => 'required|string|max:255',
            'route' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
            'permission' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:menus,id',
        ]);

        $this->menuService->updateMenu($id, $validatedMenuData);

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
     * @param  Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateOrder(Request $request)
    {
        $validatedData = $request->validate([
            'tree' => 'required',
        ]);

        $menuTree = json_decode($request->input('tree'), true);

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
