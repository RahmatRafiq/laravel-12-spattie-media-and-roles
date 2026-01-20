<?php

namespace App\Http\Controllers\UserRolePermission;

use App\Helpers\DataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserRolePermission\StoreRoleRequest;
use App\Http\Requests\UserRolePermission\UpdateRoleRequest;
use App\Services\PermissionService;
use App\Services\RoleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * RoleController constructor
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
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreRoleRequest $request)
    {
        $this->roleService->createRole($request->validated());

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
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdateRoleRequest $request, $id)
    {
        $this->roleService->updateRole($id, $request->validated());

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
