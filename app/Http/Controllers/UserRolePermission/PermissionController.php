<?php
namespace App\Http\Controllers\UserRolePermission;

use App\Helpers\DataTable;
use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = Permission::all();
        return Inertia::render('UserRolePermission/Permission/Index', [
            'permissions' => $permissions,
        ]);
    }

    public function json(Request $request)
    {
        $search = $request->input('search.value', '');
        $query  = Permission::query();

        $columns = [
            'id',
            'name',
            'created_at',
            'updated_at',
        ];

        $recordsTotalCallback = null;
        if ($search) {
            $recordsTotalCallback = function() {
                return Permission::count();
            };
        }

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($request->filled('order')) {
            $orderColumn = $columns[$request->order[0]['column']] ?? 'id';
            $query->orderBy($orderColumn, $request->order[0]['dir']);
        }

        $data = DataTable::paginate($query, $request, $recordsTotalCallback);

        $data['data'] = collect($data['data'])->map(function ($permission) {
            return [
                'id'         => $permission->id,
                'name'       => $permission->name,
                'created_at' => $permission->created_at->toDateTimeString(),
                'updated_at' => $permission->updated_at->toDateTimeString(),
                'actions'    => '',
            ];
        });

        return response()->json($data);
    }

    public function create()
    {
        return Inertia::render('UserRolePermission/Permission/Form');
    }

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

    public function edit($id)
    {
        $permission = Permission::findOrFail($id);
        return Inertia::render('UserRolePermission/Permission/Form', [
            'permission' => $permission,
        ]);
    }

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

    public function destroy($id)
    {
        $permission = Permission::findOrFail($id);
        $permission->delete();

        return redirect()->route('permissions.index')->with('success', 'Permission berhasil dihapus.');
    }
}
