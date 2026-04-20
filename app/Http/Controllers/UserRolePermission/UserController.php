<?php

namespace App\Http\Controllers\UserRolePermission;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRolePermission\StoreUserRequest;
use App\Http\Requests\UserRolePermission\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\RoleService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService,
        protected RoleService $roleService
    ) {}

    public function index(Request $request)
    {
        $users = $this->userService->getPaginatedUsers($request->all());

        return Inertia::render('UserRolePermission/User/Index', [
            'users' => Inertia::defer(fn () => UserResource::collection($users)),
            'filter' => $request->query('filter', 'active'),
        ]);
    }

    public function create()
    {
        return Inertia::render('UserRolePermission/User/Form', [
            'roles' => $this->roleService->getAllRoles(),
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $this->userService->createUser($request->validated());

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function edit($id)
    {
        $user = $this->userService->getUserWithTrashed($id);
        $user->role_id = $user->roles->first()?->id;

        return Inertia::render('UserRolePermission/User/Form', [
            'user' => $user,
            'roles' => $this->roleService->getAllRoles(),
        ]);
    }

    public function update(UpdateUserRequest $request, $id)
    {
        $this->userService->updateUser($id, $request->validated());

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $this->userService->deleteUser($user->id);

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }

    public function restore($id)
    {
        $this->userService->restoreUser($id);

        return redirect()->route('users.index')->with('success', 'User restored successfully.');
    }

    public function forceDelete($id)
    {
        $this->userService->forceDeleteUser($id);

        return redirect()->route('users.index')->with('success', 'User permanently deleted.');
    }
}
