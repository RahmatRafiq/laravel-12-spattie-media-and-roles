import ReactDOM from 'react-dom/client';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import DataTableWrapper from '@/components/datatables';
import { BreadcrumbItem } from '@/types';
import { User } from '@/types/UserRolePermission';

// Definisi tipe untuk kolom (contoh sederhana)
export interface DataTableColumn<T> {
  data: keyof T | null;
  title: string;
  render?: (data: T[keyof T] | null, type: string, row: T, meta: unknown) => string;
  orderable?: boolean;
  searchable?: boolean;
}

const columns: DataTableColumn<User>[] = [
  { data: 'id', title: 'ID' },
  { data: 'name', title: 'Name' },
  { data: 'email', title: 'Email' },
  {
    data: 'roles',
    title: 'Role(s)',
    render: (_, __, row) => row.roles.map(role => role.name).join(', ')
  },
  {
    data: null,
    title: 'Actions',
    orderable: false,
    searchable: false,
    // Placeholder untuk Edit dan Delete
    render: (_, __, row) => `
      <span class="inertia-link-cell" data-id="${row.id}"></span>
      <span class="inertia-delete-cell" data-id="${row.id}"></span>
    `,
  },
];

export default function UserIndex({ success }: { success?: string }) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'User Management', href: '/users' },
  ];

  // Opsi DataTable dengan drawCallback untuk render komponen Inertia Link
  const tableOptions = {
    processing: true,
    serverSide: true,
    paging: true,
    drawCallback: function () {
      // Render komponen Edit pada placeholder inertia-link-cell
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
      // Render komponen Delete pada placeholder inertia-delete-cell
      document.querySelectorAll('.inertia-delete-cell').forEach((cell) => {
        const id = cell.getAttribute('data-id')!;
        if (id) {
          const root = ReactDOM.createRoot(cell);
          root.render(
            <Link
              href={route('users.destroy', id)}
              method="delete"
              as="button"
              className="ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={(e) => {
                if (!confirm("Are you sure to delete this item?")) {
                  e.preventDefault();
                }
              }}
            >
              Delete
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
          <DataTableWrapper<User>
            ajax={{
              url: route('users.json'),
              type: 'POST',
            }}
            columns={columns}
            options={tableOptions}
          />
        </div>
      </div>
    </AppLayout>
  );
}
