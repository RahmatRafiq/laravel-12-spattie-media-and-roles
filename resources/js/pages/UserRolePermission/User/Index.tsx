import { Head, Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import HeadingSmall from '@/components/heading-small';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import DataTableWrapper from '@/components/datatables';

export default function UserIndex({ success }: { success?: string }) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'User Management', href: '/users' },
  ];

  const columns = [
    { data: 'id', title: 'ID' },
    { data: 'name', title: 'Name' },
    { data: 'email', title: 'Email' },
    { 
      data: 'roles', 
      title: 'Role(s)', 
      render: function (_: unknown, _type: unknown, row: { roles: { name: string }[] }) {
        return row.roles.map(role => role.name).join(', ');
      }
    },
    {
      data: null,
      title: 'Actions',
      orderable: false,
      searchable: false,
      render: function (_: unknown, _type: unknown, row: { id: number }) {
        return `
          <a href="/users/${row.id}/edit" class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</a>
          <button data-id="${row.id}" class="ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 btn-delete">Delete</button>
        `;
      },
    },
  ];

  const handleDelete = (id: number) => {
    Inertia.delete(route('users.destroy', id));
  };

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

          <DataTableWrapper
            ajax={{
              url: route('users.json'),
              type: 'POST',
            }}
            columns={columns}
            onRowDelete={handleDelete}
          />
        </div>
      </div>
    </AppLayout>
  );
}
