<?php
namespace App\Http\Controllers\UserRolePermission;

use App\Helpers\DataTable;
use App\Helpers\Guards;
use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::all();
        return Inertia::render('UserRolePermission/Role/Index', [
            'roles' => $roles,
        ]);
    }

    public function json(Request $request)
    {
        $search = $request->input('search.value', '');
    $query  = Role::with('permissions');

        $columns = [
            'id',
            'name',
            'guard_name',
            'created_at',
            'updated_at',
        ];

        $recordsTotalCallback = null;
        if ($search) {
            $recordsTotalCallback = function() {
                return Role::count();
            };
        }

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('guard_name', 'like', "%{$search}%");
        }

        if ($request->filled('order')) {
            $orderColumn = $columns[$request->order[0]['column']] ?? 'id';
            $query->orderBy($orderColumn, $request->order[0]['dir']);
        }

        $data = DataTable::paginate($query, $request, $recordsTotalCallback);

        $data['data'] = collect($data['data'])->map(function ($role) {
            $permissionsList = isset($role->permissions) ? collect($role->permissions)->pluck('name')->implode(', ') : '';
            return [
                'id'               => $role->id,
                'name'             => $role->name,
                'guard_name'       => $role->guard_name,
                'created_at'       => $role->created_at->toDateTimeString(),
                'updated_at'       => $role->updated_at->toDateTimeString(),
                'permissions_list' => $permissionsList,
                'actions'          => '',
            ];
        });

        return response()->json($data);
    }

    public function create()
    {
        $permissions = Permission::all();
        return Inertia::render('UserRolePermission/Role/Form', [
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|unique:roles,name',
            'guard_name'  => ['required', 'string', 'max:255', Rule::in(Guards::list())],
            'permissions' => 'required|array',
        ]);

        $role = Role::create([
            'name'       => $request->name,
            'guard_name' => $request->guard_name,
        ]);

        $role->permissions()->sync($request->permissions);

        return redirect()->route('roles.index')->with('success', 'Role has been created successfully.');
    }

    public function edit($id)
    {
        $role = Role::with('permissions')->findOrFail($id);

        return Inertia::render('UserRolePermission/Role/Form', [
            'role'        => $role->load('permissions'),
            'permissions' => Permission::all(),
            'guards'      => array_keys(config('auth.guards')),
        ]);
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        $request->validate([
            'name'        => 'required|string|max:255|unique:roles,name,' . $role->id,
            'guard_name'  => ['required', 'string', 'max:255', Rule::in(Guards::list())],
            'permissions' => 'required|array',
        ]);

        $role->update([
            'name'       => $request->name,
            'guard_name' => $request->guard_name,
        ]);

        $role->permissions()->sync($request->permissions);

        return redirect()->route('roles.index')->with('success', 'Role has been updated successfully.');
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return redirect()->route('roles.index')->with('success', 'Role has been deleted successfully.');
    }
}
