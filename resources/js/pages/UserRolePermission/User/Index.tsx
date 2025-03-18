// UserIndex.tsx
import React, { useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import DataTableWrapper, { DataTableWrapperRef } from '@/components/datatables';
import { BreadcrumbItem } from '@/types';
import { User } from '@/types/UserRolePermission';

const columns = [
  { data: 'id', title: 'ID' },
  { data: 'name', title: 'Name' },
  { data: 'email', title: 'Email' },
  {
    data: 'roles',
    title: 'Role(s)',
  },
  {
    data: null,
    title: 'Actions',
    orderable: false,
    searchable: false,
    render: (_: null, __: string, row: unknown) => {
      const user = row as User;
      return `
        <span class="inertia-link-cell" data-id="${user.id}"></span>
        <button class="btn-delete ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700" data-id="${user.id}">
          Delete
        </button>
      `;

    },
  },
];

export default function UserIndex({ success }: { success?: string }) {
  const breadcrumbs: BreadcrumbItem[] = [{ title: 'User Management', href: '/users' }];
  const dtRef = useRef<DataTableWrapperRef>(null);

  const handleDelete = (id: number) => {
    router.delete(route('users.destroy', id), {
      onSuccess: () => dtRef.current?.reload(),
    });
  };

  const tableOptions = {
    drawCallback: function () {
      document.querySelectorAll('.inertia-link-cell').forEach((cell) => {
        const id = cell.getAttribute('data-id')!;
        if (id) {
          const root = ReactDOM.createRoot(cell);
          root.render(
            <Link
              href={`/users/${id}/edit`}
              className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Edit
            </Link>
          );
        }
      });
    },
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />
      <div className="px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">User Management</h1>
        <div className="col-md-12">
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
            ref={dtRef}
            ajax={{
              url: route('users.json'),
              type: 'POST',
            }}
            columns={columns}
            options={tableOptions}
            onRowDelete={handleDelete}
          />
        </div>
      </div>
    </AppLayout>
  );
}
