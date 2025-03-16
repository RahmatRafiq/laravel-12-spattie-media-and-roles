<?php

namespace App\Http\Controllers\UserRolePermission;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    /**
     * Tampilkan daftar permission.
     */
    public function index()
    {
        $permissions = Permission::all();
        return Inertia::render('UserRolePermission/Permission/Index', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Tampilkan form untuk membuat permission baru.
     */
    public function create()
    {
        return Inertia::render('UserRolePermission/Permission/Form');
    }

    /**
     * Simpan permission baru ke database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:permissions,name',
        ]);

        Permission::create([
            'name' => $request->name,
        ]);

        return redirect()->route('permissions.index')->with('success', 'Permission berhasil dibuat.');
    }

    /**
     * Tampilkan form untuk mengedit permission.
     */
    public function edit($id)
    {
        $permission = Permission::findOrFail($id);
        return Inertia::render('UserRolePermission/Permission/Form', [
            'permission' => $permission,
        ]);
    }

    /**
     * Update permission di database.
     */
    public function update(Request $request, $id)
    {
        $permission = Permission::findOrFail($id);
        $request->validate([
            'name' => 'required|unique:permissions,name,' . $permission->id,
        ]);

        $permission->update([
            'name' => $request->name,
        ]);

        return redirect()->route('permissions.index')->with('success', 'Permission berhasil diperbarui.');
    }

    /**
     * Hapus permission dari database.
     */
    public function destroy($id)
    {
        $permission = Permission::findOrFail($id);
        $permission->delete();

        return redirect()->route('permissions.index')->with('success', 'Permission berhasil dihapus.');
    }
}
