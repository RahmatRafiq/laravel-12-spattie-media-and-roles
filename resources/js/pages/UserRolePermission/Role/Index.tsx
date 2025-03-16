import { Head, Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import HeadingSmall from '@/components/heading-small';
import { BreadcrumbItem } from '@/types';
import type { Role } from '@/types/UserRolePermission';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Role Management', href: '/roles' },
];

export default function RoleIndex({ roles, success }: { roles: Role[]; success?: string }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Roles" />

      <div className="px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Settings</h1>

        <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
          {/* <aside className="w-full max-w-xl lg:w-48">
            <nav className="flex flex-col space-y-1">
              <Button asChild variant="ghost" size="sm" className="justify-start bg-muted">
                <Link href="/roles">Role Management</Link>
              </Button>
            </nav>
          </aside> */}

          <Separator className="my-6 md:hidden" />

          {/* Content */}
          <div className="flex-1 md:max-w-2xl space-y-6">
            <HeadingSmall title="Roles" description="Manage roles for your application" />

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Role List</h2>
              <Link href={route('roles.create')}>
                <Button>Create Role</Button>
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
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="text-center">
                    <td className="p-2 border">{role.id}</td>
                    <td className="p-2 border">{role.name}</td>
                    <td className="p-2 border">
                      <Link
                        href={route('roles.edit', role.id)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure to delete this role?')) {
                            Inertia.delete(route('roles.destroy', role.id));
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
      </div>
    </AppLayout>
  );
}
