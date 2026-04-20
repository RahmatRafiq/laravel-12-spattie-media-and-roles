<?php

namespace App\Http\Controllers\UserRolePermission;

use App\Helpers\DataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserRolePermission\StorePermissionRequest;
use App\Http\Requests\UserRolePermission\UpdatePermissionRequest;
use App\Http\Resources\PermissionResource;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    public function __construct(
        private PermissionService $permissionService
    ) {}

    public function index(Request $request)
    {
        $query = $this->permissionService->getDataTableQuery();
        $permissions = DataTable::process(
            $query,
            $request,
            searchableColumns: ['name', 'guard_name'],
        );

        return Inertia::render('UserRolePermission/Permission/Index', [
            'permissions' => Inertia::defer(fn () => PermissionResource::collection($permissions)),
        ]);
    }

    public function create()
    {
        return Inertia::render('UserRolePermission/Permission/Form');
    }

    public function store(StorePermissionRequest $request)
    {
        $this->permissionService->createPermission($request->validated());

        return redirect()->route('permissions.index')->with('success', 'Permission created successfully.');
    }

    public function edit($id)
    {
        $permission = $this->permissionService->findPermission($id);

        return Inertia::render('UserRolePermission/Permission/Form', [
            'permission' => $permission,
        ]);
    }

    public function update(UpdatePermissionRequest $request, $id)
    {
        $this->permissionService->updatePermission($id, $request->validated());

        return redirect()->route('permissions.index')->with('success', 'Permission updated successfully.');
    }

    public function destroy($id)
    {
        $this->permissionService->deletePermission($id);

        return redirect()->route('permissions.index')->with('success', 'Permission deleted successfully.');
    }
}
