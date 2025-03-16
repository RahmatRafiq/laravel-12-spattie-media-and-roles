<?php

namespace App\Http\Controllers\RolePermission;

use App\Helpers\Guards;
use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Tampilkan daftar role.
     */
    public function index()
    {
        $roles = Role::all();
        return Inertia::render('UserRolePermission/Role/Index', [
            'roles' => $roles,
        ]);
    }

    /**
     * Tampilkan form untuk membuat role baru.
     */
    public function create()
    {
        $permissions = Permission::all();
        return Inertia::render('UserRolePermission/Role/Form', [
            'permissions' => $permissions,
        ]);
    }
    

    /**
     * Simpan role baru ke database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name',
            'guard_name' => ['required', 'string', 'max:255', Rule::in(Guards::list())],
            'permissions' => 'required|array',
        ]);

        $role = Role::create([
            'name' => $request->name,
            'guard_name' => $request->guard_name,
        ]);

        $role->permissions()->sync($request->permissions);

        return redirect()->route('roles.index')->with('success', 'Role berhasil dibuat.');
    }

    /**
     * Tampilkan form untuk mengedit role.
     */
    public function edit($id)
    {
        $role = Role::with('permissions')->findOrFail($id);

        return Inertia::render('UserRolePermission/Role/Form', [
            'role' => $role->load('permissions'),
            'permissions' => Permission::all(),
            'guards' => array_keys(config('auth.guards')),
        ]);
        
    }

    /**
     * Update role di database.
     */
    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'guard_name' => ['required', 'string', 'max:255', Rule::in(Guards::list())],
            'permissions' => 'required|array',
        ]);

        $role->update([
            'name' => $request->name,
            'guard_name' => $request->guard_name,
        ]);

        $role->permissions()->sync($request->permissions);

        return redirect()->route('roles.index')->with('success', 'Role berhasil diperbarui.');
    }

    /**
     * Hapus role dari database.
     */
    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return redirect()->route('roles.index')->with('success', 'Role berhasil dihapus.');
    }
}
