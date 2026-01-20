<?php

namespace App\Http\Controllers\UserRolePermission;

use App\DataTransferObjects\RoleData;
use App\Helpers\DataTable;
use App\Helpers\Guards;
use App\Http\Controllers\Controller;
use App\Services\PermissionService;
use App\Services\RoleService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * RoleController constructor
     *
     * @param  RoleService  $roleService
     * @param  PermissionService  $permissionService
     */
    public function __construct(
        private RoleService $roleService,
        private PermissionService $permissionService
    ) {}

    /**
     * Display a listing of roles
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('UserRolePermission/Role/Index', [
            'roles' => $this->roleService->getAllRoles(),
        ]);
    }

    /**
     * Get roles data for DataTables
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function json(Request $request)
    {
        $search = $request->input('search.value', '');

        $filters = [
            'search' => $search,
        ];

        $query = $this->roleService->getDataTableData($filters);

        $recordsTotalCallback = $search
            ? fn () => $this->roleService->getAllRoles()->count()
            : null;

        $columns = ['id', 'name', 'guard_name', 'created_at', 'updated_at'];
        if ($request->filled('order')) {
            $orderColumn = $columns[$request->order[0]['column']] ?? 'id';
            $query->orderBy($orderColumn, $request->order[0]['dir']);
        }

        $data = DataTable::paginate($query, $request, $recordsTotalCallback);

        $data['data'] = collect($data['data'])->map(fn ($role) => [
            'id' => $role->id,
            'name' => $role->name,
            'guard_name' => $role->guard_name,
            'created_at' => $role->created_at->toDateTimeString(),
            'updated_at' => $role->updated_at->toDateTimeString(),
            'permissions_list' => $role->permissions->pluck('name')->implode(', '),
            'actions' => '',
        ]);

        return response()->json($data);
    }

    /**
     * Show the form for creating a new role
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('UserRolePermission/Role/Form', [
            'permissions' => $this->permissionService->getAllPermissions(),
        ]);
    }

    /**
     * Store a newly created role
     *
     * @param  Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|unique:roles,name',
            'guard_name' => ['required', 'string', 'max:255', Rule::in(Guards::list())],
            'permissions' => 'required|array',
        ]);

        $roleData = RoleData::fromArray($validatedData);
        $this->roleService->createRole($roleData->forSave());

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role has been created successfully.');
    }

    /**
     * Show the form for editing the specified role
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $role = $this->roleService->findRole($id);

        return Inertia::render('UserRolePermission/Role/Form', [
            'role' => $role->load('permissions'),
            'permissions' => $this->permissionService->getAllPermissions(),
            'guards' => array_keys(config('auth.guards')),
        ]);
    }

    /**
     * Update the specified role
     *
     * @param  Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $role = $this->roleService->findRole($id);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,'.$role->id,
            'guard_name' => ['required', 'string', 'max:255', Rule::in(Guards::list())],
            'permissions' => 'required|array',
        ]);

        $roleData = RoleData::fromArray($validatedData);
        $this->roleService->updateRole($id, $roleData->forSave());

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role has been updated successfully.');
    }

    /**
     * Remove the specified role
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $this->roleService->deleteRole($id);

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role has been deleted successfully.');
    }
}
