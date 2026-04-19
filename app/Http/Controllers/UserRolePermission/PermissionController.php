<?php

namespace App\Http\Controllers\UserRolePermission;

use App\Helpers\DataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserRolePermission\StorePermissionRequest;
use App\Http\Requests\UserRolePermission\UpdatePermissionRequest;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    /**
     * PermissionController constructor
     */
    public function __construct(
        private PermissionService $permissionService
    ) {}

    /**
     * Display a listing of permissions
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('UserRolePermission/Permission/Index');
    }

    /**
     * Get permissions data for DataTables
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function json(Request $request)
    {
        $query = $this->permissionService->getDataTableQuery();

        $data = DataTable::process(
            $query, 
            $request,
            searchableColumns: ['name', 'guard_name'],
            orderableColumns: ['id', 'name', 'guard_name', 'created_at', 'updated_at']
        );

        $data['data'] = $data['data']->map(fn ($permission) => [
            'id' => $permission->id,
            'name' => $permission->name,
            'guard_name' => $permission->guard_name,
            'created_at' => $permission->created_at->toDateTimeString(),
            'updated_at' => $permission->updated_at->toDateTimeString(),
        ]);

        return response()->json($data);
    }

    /**
     * Show the form for creating a new permission
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('UserRolePermission/Permission/Form');
    }

    /**
     * Store a newly created permission
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StorePermissionRequest $request)
    {
        $this->permissionService->createPermission($request->validated());

        return redirect()->route('permissions.index')->with('success', 'Permission created successfully.');
    }

    /**
     * Show the form for editing the specified permission
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $permission = $this->permissionService->findPermission($id);

        return Inertia::render('UserRolePermission/Permission/Form', [
            'permission' => $permission,
        ]);
    }

    /**
     * Update the specified permission
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdatePermissionRequest $request, $id)
    {
        $this->permissionService->updatePermission($id, $request->validated());

        return redirect()->route('permissions.index')->with('success', 'Permission updated successfully.');
    }

    /**
     * Remove the specified permission
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $this->permissionService->deletePermission($id);

        return redirect()->route('permissions.index')->with('success', 'Permission deleted successfully.');
    }
}
