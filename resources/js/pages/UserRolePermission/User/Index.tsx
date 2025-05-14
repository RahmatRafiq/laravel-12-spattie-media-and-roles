import { useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import DataTableWrapper, { DataTableWrapperRef } from '@/components/datatables';
import { BreadcrumbItem } from '@/types';
import { User } from '@/types/UserRolePermission';
import ToggleTabs from '@/components/toggle-tabs';

const columns = (filter: string) => [
  { data: 'id', title: 'ID' },
  { data: 'name', title: 'Name' },
  { data: 'email', title: 'Email' },
  { data: 'roles', title: 'Role(s)' },
  {
    data: null,
    title: 'Actions',
    orderable: false,
    searchable: false,
    render: (_: null, __: string, row: unknown) => {
      const user = row as User;
      let html = '';
      if (filter === 'trashed' || (filter === 'all' && user.trashed)) {
        html += `<button class="btn-restore ml-2 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" data-id="${user.id}">Restore</button>`;
        html += `<button class="btn-force-delete ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700" data-id="${user.id}">Force Delete</button>`;
      } else {
        html += `<span class="inertia-link-cell" data-id="${user.id}"></span>`;
        html += `<button class="btn-delete ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700" data-id="${user.id}">Delete</button>`;
      }
      return html;
    },
  },
];

export default function UserIndex({ filter: initialFilter, success }: { filter: string; success?: string }) {
  const breadcrumbs: BreadcrumbItem[] = [{ title: 'User Management', href: '/users' }];
  const dtRef = useRef<DataTableWrapperRef>(null);
  const [filter, setFilter] = useState(initialFilter || 'active');

  const handleDelete = (id: number) => {
    router.delete(route('users.destroy', id), {
      onSuccess: () => dtRef.current?.reload(),
    });
  };

  const handleRestore = (id: number) => {
    router.post(route('users.restore', id), {}, {
      onSuccess: () => dtRef.current?.reload(),
    });
  };

  const handleForceDelete = (id: number) => {
    router.delete(route('users.force-delete', id), {
      onSuccess: () => dtRef.current?.reload(),
    });
  };

  const drawCallback = () => {
    document.querySelectorAll('.inertia-link-cell').forEach((cell) => {
      const id = cell.getAttribute('data-id');
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

    // Attach event listener untuk tombol Delete, Restore, dan Force Delete
    document.querySelectorAll('.btn-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id) handleDelete(Number(id));
      });
    });
    document.querySelectorAll('.btn-restore').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id) handleRestore(Number(id));
      });
    });
    document.querySelectorAll('.btn-force-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id) handleForceDelete(Number(id));
      });
    });
  };


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />
      <div className="px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">User Management</h1>
        <div className="col-md-12">
          <HeadingSmall title="Users" description="Manage application users and their roles" />
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">User List</h2>
            <Link href={route('users.create')}>
              <Button>Create User</Button>
            </Link>
          </div>

          <ToggleTabs tabs={['active', 'trashed', 'all']} active={filter} onChange={setFilter} />

          {success && (
            <div className="p-2 mb-2 bg-green-100 text-green-800 rounded">{success}</div>
          )}
          <DataTableWrapper
            key={filter}
            ref={dtRef}
            ajax={{
              url: route('users.json') + '?filter=' + filter,
              type: 'POST',
            }}
            columns={columns(filter)}
            options={{ drawCallback }}
          />
        </div>
      </div>
    </AppLayout>
  );
}
