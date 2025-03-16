import { Head, Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import HeadingSmall from '@/components/heading-small';
import { BreadcrumbItem } from '@/types';
import type { User } from '@/types/UserRolePermission';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

export default function UserIndex({ users, success }: { users: User[]; success?: string }) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'User Management', href: '/users' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />

      <div className="px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">User Management</h1>

        <div className="flex-1 md:max-w-4xl space-y-6">
          <HeadingSmall title="Users" description="Manage application users and their roles" />

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">User List</h2>
            <Link href={route('users.create')}>
              <Button>Create User</Button>
            </Link>
          </div>

          {success && (
            <div className="p-2 bg-green-100 text-green-800 rounded">{success}</div>
          )}

          <table className="min-w-full bg-white dark:bg-gray-800 border">
            <thead>
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role(s)</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="text-center">
                  <td className="p-2 border">{user.id}</td>
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">
                    {user.roles.map((role) => role.name).join(', ')}
                  </td>
                  <td className="p-2 border">
                    <Link
                      href={route('users.edit', user.id)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure to delete this user?')) {
                          Inertia.delete(route('users.destroy', user.id));
                        }
                      }}
                      className="ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
