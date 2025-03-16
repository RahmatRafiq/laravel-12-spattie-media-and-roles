<?php

namespace App\Http\Controllers\RolePermission;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
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
        return Inertia::render('UserRolePermission/Role/Form');
    }

    /**
     * Simpan role baru ke database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name',
        ]);

        Role::create([
            'name' => $request->name,
        ]);

        return redirect()->route('roles.index')->with('success', 'Role berhasil dibuat.');
    }

    /**
     * Tampilkan form untuk mengedit role.
     */
    public function edit($id)
    {
        $role = Role::findOrFail($id);
        return Inertia::render('UserRolePermission/Role/Form', [
            'role' => $role,
        ]);
    }

    /**
     * Update role di database.
     */
    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        $request->validate([
            'name' => 'required|unique:roles,name,' . $role->id,
        ]);

        $role->update([
            'name' => $request->name,
        ]);

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
