<?php
namespace App\Http\Controllers\UserRolePermission;

use App\Helpers\DataTable;
use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role as SpatieRole;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $filter = $request->query('filter', 'active');
        
        return Inertia::render('UserRolePermission/User/Index', [
            'filter' => $filter,
            'roles'  => Role::all(),
        ]);
    }

    public function json(Request $request)
    {
        $search = $request->input('search.value', '');
        $filter = $request->query('filter') ?? $request->input('filter', 'active');

        $baseQuery = match ($filter) {
            'trashed' => User::onlyTrashed()->with('roles'),
            'all' => User::withTrashed()->with('roles'),
            default => User::with('roles'),
        };

        $recordsTotalCallback = null;
        if ($search) {
            $recordsTotalCallback = function() use ($filter) {
                return match ($filter) {
                    'trashed' => User::onlyTrashed()->count(),
                    'all' => User::withTrashed()->count(),
                    default => User::count(),
                };
            };
        }

        if ($search) {
            $baseQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $columns = ['id', 'name', 'email', 'created_at', 'updated_at'];
        if ($request->filled('order')) {
            $orderColumn = $columns[$request->order[0]['column']] ?? 'id';
            $baseQuery->orderBy($orderColumn, $request->order[0]['dir']);
        }

        $data = DataTable::paginate($baseQuery, $request, $recordsTotalCallback);

        $data['data'] = collect($data['data'])->map(function ($user) {
            return [
                'id'      => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
                'roles'   => $user->roles->pluck('name')->toArray(),
                'trashed' => !is_null($user->deleted_at),
                'actions' => '',
            ];
        });

        return response()->json($data);
    }

    public function create()
    {
        $roles = Role::all();
        return Inertia::render('UserRolePermission/User/Form', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role_id'  => 'required|exists:roles,id',
        ]);

        $user = User::create([
            'name'     => $validatedData['name'],
            'email'    => $validatedData['email'],
            'password' => bcrypt($validatedData['password']),
        ]);

        $role = SpatieRole::findById($validatedData['role_id']);
        $user->assignRole($role);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function edit($id)
    {
        $user  = User::withTrashed()->findOrFail($id);
        $roles = Role::all();
        $user->role_id = $user->roles->first()->id ?? null;
        return Inertia::render('UserRolePermission/User/Form', [
            'user'  => $user,
            'roles' => $roles,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8|confirmed',
            'role_id'  => 'required|exists:roles,id',
        ]);

        $user        = User::withTrashed()->findOrFail($id);
        $user->name  = $validatedData['name'];
        $user->email = $validatedData['email'];
        if ($request->filled('password')) {
            $user->password = bcrypt($validatedData['password']);
        }
        $user->save();

        $role = SpatieRole::findById($validatedData['role_id']);
        $user->syncRoles([$role]);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }

    public function trashed()
    {
        $users = User::onlyTrashed()->with('roles')->get();
        return Inertia::render('UserRolePermission/User/Trashed', [
            'users' => $users,
        ]);
    }

    public function restore($id)
    {
        User::onlyTrashed()->where('id', $id)->restore();
        return redirect()->route('users.index')->with('success', 'User restored successfully.');
    }

    public function forceDelete($id)
    {
        User::onlyTrashed()->where('id', $id)->forceDelete();
        return redirect()->route('users.index')->with('success', 'User permanently deleted.');
    }
}
