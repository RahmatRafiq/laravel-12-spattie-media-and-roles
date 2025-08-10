<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MenuController extends Controller
{
    public function create(Request $request)
    {
        $parent_id = $request->query('parent_id');
        $allMenus = Menu::orderBy('order')->get();
        return inertia('Menu/Form', [
            'allMenus' => $allMenus,
            'menu' => $parent_id ? ['parent_id' => (int)$parent_id] : null,
        ]);
    }
    public function edit($id)
    {
        $menu = Menu::with('children')->findOrFail($id);
        $allMenus = Menu::where('id', '!=', $id)->orderBy('order')->get();
        return inertia('Menu/Form', [
            'menu' => $menu,
            'allMenus' => $allMenus,
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

    public function index(Request $request)
    {
        $user = Auth::user();
        $menus = Menu::with(['children' => function($q) use ($user) {
            $q->orderBy('order');
        }])
        ->whereNull('parent_id')
        ->orderBy('order')
        ->get()
        ->filter(function ($menu) use ($user) {
            return !$menu->permission || $user->can($menu->permission);
        })
        ->map(function ($menu) use ($user) {
            $menu->children = $menu->children->filter(function ($child) use ($user) {
                return !$child->permission || $user->can($child->permission);
            })->values();
            return $menu;
        })
        ->values();
        return response()->json($menus);
    }

    public function manage()
    {
        $menus = Menu::with('children')->whereNull('parent_id')->orderBy('order')->get();
        return inertia('Menu/Index', [
            'menus' => $menus,
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
}
