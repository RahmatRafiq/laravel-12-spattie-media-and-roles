<?php

namespace App\Http\Controllers\UserRolePermission;

use App\DataTransferObjects\UserData;
use App\Helpers\DataTable;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\RoleService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * UserController constructor
     */
    public function __construct(
        private UserService $userService,
        private RoleService $roleService
    ) {}

    /**
     * Display a listing of users
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $filter = $request->query('filter', 'active');

        return Inertia::render('UserRolePermission/User/Index', [
            'filter' => $filter,
            'roles' => $this->roleService->getAllRoles(),
        ]);
    }

    /**
     * Get users data for DataTables
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function json(Request $request)
    {
        $search = $request->input('search.value', '');
        $filter = $request->query('filter') ?? $request->input('filter', 'active');

        $filters = [
            'search' => $search,
            'status' => $filter,
        ];

        $query = $this->userService->getDataTableData($filters);

        $recordsTotalCallback = $search
            ? fn () => $this->userService->getTotalCount($filter)
            : null;

        $columns = ['id', 'name', 'email', 'created_at', 'updated_at'];
        if ($request->filled('order')) {
            $orderColumn = $columns[$request->order[0]['column']] ?? 'id';
            $query->orderBy($orderColumn, $request->order[0]['dir']);
        }

        $data = DataTable::paginate($query, $request, $recordsTotalCallback);

        $data['data'] = collect($data['data'])->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name')->toArray(),
                'trashed' => $user->deleted_at !== null,
                'actions' => '',
            ];
        });

        return response()->json($data);
    }

    /**
     * Show the form for creating a new user
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('UserRolePermission/User/Form', [
            'roles' => $this->roleService->getAllRoles(),
        ]);
    }

    /**
     * Store a newly created user
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role_id' => 'required|exists:roles,id',
        ]);

        $userData = UserData::fromArray($validatedData);
        $this->userService->createUser($userData->toArray());

        return redirect()
            ->route('users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Show the form for editing the specified user
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $user = $this->userService->getUserWithTrashed($id);
        $user->role_id = $user->roles->first()?->id;

        return Inertia::render('UserRolePermission/User/Form', [
            'user' => $user,
            'roles' => $this->roleService->getAllRoles(),
        ]);
    }

    /**
     * Update the specified user
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$id,
            'password' => 'nullable|string|min:8|confirmed',
            'role_id' => 'required|exists:roles,id',
        ]);

        $userData = UserData::fromArray($validatedData);
        $this->userService->updateUser($id, $userData->forUpdate());

        return redirect()
            ->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Soft delete the specified user
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(User $user)
    {
        $this->userService->deleteUser($user->id);

        return redirect()
            ->route('users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Display trashed users
     *
     * @return \Inertia\Response
     */
    public function trashed()
    {
        $users = $this->userService->getTrashedUsers();

        return Inertia::render('UserRolePermission/User/Trashed', [
            'users' => $users,
        ]);
    }

    /**
     * Restore a soft deleted user
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function restore($id)
    {
        $this->userService->restoreUser($id);

        return redirect()
            ->route('users.index')
            ->with('success', 'User restored successfully.');
    }

    /**
     * Permanently delete a user
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function forceDelete($id)
    {
        $this->userService->forceDeleteUser($id);

        return redirect()
            ->route('users.index')
            ->with('success', 'User permanently deleted.');
    }
}
