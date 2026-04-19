<?php

namespace App\Http\Controllers\UserRolePermission;

use App\Helpers\DataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserRolePermission\StoreRoleRequest;
use App\Http\Requests\UserRolePermission\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use App\Services\PermissionService;
use App\Services\RoleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function __construct(
        private RoleService $roleService,
        private PermissionService $permissionService
    ) {}

    public function index(Request $request)
    {
        $query = $this->roleService->getDataTableQuery();
        $roles = DataTable::process(
            $query,
            $request,
            searchableColumns: ['name', 'guard_name'],
        )->withQueryString();

        return Inertia::render('UserRolePermission/Role/Index', [
            'roles' => RoleResource::collection($roles),
        ]);
    }

    public function create()
    {
        return Inertia::render('UserRolePermission/Role/Form', [
            'permissions' => $this->permissionService->getAllPermissions(),
        ]);
    }

    public function store(StoreRoleRequest $request)
    {
        $this->roleService->createRole($request->validated());

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role has been created successfully.');
    }

    public function edit($id)
    {
        $role = $this->roleService->findRole($id);

        return Inertia::render('UserRolePermission/Role/Form', [
            'role' => $role->load('permissions'),
            'permissions' => $this->permissionService->getAllPermissions(),
            'guards' => array_keys(config('auth.guards')),
        ]);
    }

    public function update(UpdateRoleRequest $request, $id)
    {
        $this->roleService->updateRole($id, $request->validated());

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role has been updated successfully.');
    }

    public function destroy($id)
    {
        $this->roleService->deleteRole($id);

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role has been deleted successfully.');
    }

    public function json(Request $request)
    {
        $query = $this->roleService->getDataTableQuery();
        $roles = DataTable::process(
            $query,
            $request,
            searchableColumns: ['name', 'guard_name'],
        );

        return RoleResource::collection($roles);
    }
}
