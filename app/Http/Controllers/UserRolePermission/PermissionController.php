<?php

namespace App\Http\Controllers\UserRolePermission;

use App\Helpers\DataTable;
use App\Http\Controllers\Controller;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    /**
     * PermissionController constructor
     *
     * @param  PermissionService  $permissionService
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
        $permissions = $this->permissionService->getAllPermissions();

        return Inertia::render('UserRolePermission/Permission/Index', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Get permissions data for DataTables
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function json(Request $request)
    {
        $searchTerm = $request->input('search.value', '');
        $permissionsQuery = $this->permissionService->getDataTableData(['search' => $searchTerm]);

        $columns = ['id', 'name', 'created_at', 'updated_at'];

        $recordsTotalCallback = $searchTerm
            ? fn () => $this->permissionService->getAllPermissions()->count()
            : null;

        if ($request->filled('order')) {
            $orderColumnIndex = $request->order[0]['column'];
            $orderColumn = $columns[$orderColumnIndex] ?? 'id';
            $orderDirection = $request->order[0]['dir'];
            $permissionsQuery->orderBy($orderColumn, $orderDirection);
        }

        $dataTableResponse = DataTable::paginate($permissionsQuery, $request, $recordsTotalCallback);

        $dataTableResponse['data'] = collect($dataTableResponse['data'])->map(function ($permission) {
            return [
                'id' => $permission->id,
                'name' => $permission->name,
                'created_at' => $permission->created_at->toDateTimeString(),
                'updated_at' => $permission->updated_at->toDateTimeString(),
                'actions' => '',
            ];
        });

        return response()->json($dataTableResponse);
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
     * @param  Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|unique:permissions,name',
        ]);

        $this->permissionService->createPermission($validatedData);

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
     * @param  Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $permission = $this->permissionService->findPermission($id);

        $validatedData = $request->validate([
            'name' => 'required|unique:permissions,name,'.$permission->id,
        ]);

        $this->permissionService->updatePermission($id, $validatedData);

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
