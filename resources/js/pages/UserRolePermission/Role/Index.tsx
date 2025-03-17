import { Head, Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import HeadingSmall from '@/components/heading-small';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import { useEffect } from 'react';
import "datatables.net-dt/css/dataTables.dataTables.css"; 


const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Role Management', href: '/roles' },
];

export default function RoleIndex({ success }: { success?: string }) {
  DataTable.use(DT);
  const columns = [
    { data: 'id' },
    { data: 'name' },
    { data: 'guard_name' },
    { data: 'created_at' },
    { data: 'updated_at' },
    {
      data: null,
      orderable: false,
      searchable: false,
      render: function (_: unknown, _type: unknown, row: { id: number }) {
        return `
          <a href="/roles/${row.id}/edit" class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</a>
          <button data-id="${row.id}" class="ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 btn-delete">Delete</button>
        `;
      },
    }

  ];

  useEffect(() => {
    const handleDelete = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.matches('.btn-delete')) {
        const id = target.getAttribute('data-id');
        if (id && confirm('Are you sure to delete this role?')) {
          Inertia.delete(route('roles.destroy', id));
        }
      }
    };

    document.addEventListener('click', handleDelete);

    return () => {
      document.removeEventListener('click', handleDelete);
    };
  }, []);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Roles" />

      <div className="px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Settings</h1>

        <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">

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

            {/* DataTable */}
            <DataTable
              ajax={{
                url: route('roles.json'),
                type: 'POST',
                headers: {
                  'X-Requested-With': 'XMLHttpRequest',
                  'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
              }}
              columns={columns}
              className="display min-w-full bg-white dark:bg-gray-800 border w-full"
              options={{
                processing: true,
                serverSide: true,
                paging: true,
              }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Guard Name</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Actions</th>
                </tr>
              </thead>
            </DataTable>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
