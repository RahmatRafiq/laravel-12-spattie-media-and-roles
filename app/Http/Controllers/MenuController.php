<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Permission;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function create(Request $request)
    {
        $parent_id = $request->query('parent_id');
        $allMenus = Menu::orderBy('order')->get();
        $permissions = Permission::orderBy('name')->get(['id', 'name']);

        return inertia('Menu/Form', [
            'allMenus' => $allMenus,
            'permissions' => $permissions,
            'menu' => $parent_id ? ['parent_id' => (int) $parent_id] : null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'route' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
            'permission' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:menus,id',
        ]);
        $menu = Menu::create($validated);

        return redirect()->route('menus.manage')->with('success', 'Menu created successfully.');
    }

    public function edit($id)
    {
        $menu = Menu::with('children')->findOrFail($id);
        $allMenus = Menu::where('id', '!=', $id)->orderBy('order')->get();
        $permissions = Permission::orderBy('name')->get(['id', 'name']);

        return inertia('Menu/Form', [
            'menu' => $menu,
            'allMenus' => $allMenus,
            'permissions' => $permissions,
        ]);
    }

    public function update(Request $request, $id)
    {
        $menu = Menu::findOrFail($id);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'route' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
            'permission' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:menus,id',
        ]);
        $menu->update($validated);

        return redirect()->route('menus.manage')->with('success', 'Menu updated successfully.');
    }

    public function manage()
    {
        $menus = Menu::with('children')->whereNull('parent_id')->orderBy('order')->get();

        return inertia('Menu/Index', [
            'menus' => $menus,
        ]);
    }

    public function updateOrder(Request $request)
    {
        $data = $request->validate([
            'tree' => 'required',
        ]);
        $tree = json_decode($request->input('tree'), true);
        if (! is_array($tree)) {
            return response()->json(['success' => false, 'message' => 'Invalid tree data'], 422);
        }
        $this->updateMenuTree($tree);

        return redirect()->route('menus.manage')
            ->with('success', 'Menu order updated successfully.');
    }

    private function updateMenuTree(array $tree, $parentId = null)
    {
        foreach ($tree as $order => $item) {
            Menu::where('id', $item['id'])->update([
                'order' => $order,
                'parent_id' => $parentId,
            ]);
            if (! empty($item['children']) && is_array($item['children'])) {
                $this->updateMenuTree($item['children'], $item['id']);
            }
        }
    }

    public function destroy($id)
    {
        $menu = Menu::findOrFail($id);
        $menu->delete();

        return redirect()->route('menus.manage')->with('success', 'Menu deleted successfully.');
    }
}
