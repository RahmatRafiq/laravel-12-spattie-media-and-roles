import { useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import DataTableWrapper, { DataTableWrapperRef } from '@/components/datatables';
import { BreadcrumbItem } from '@/types';
import { Role } from '@/types/UserRolePermission';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Role Management', href: '/roles' },
];

export default function RoleIndex({ success }: { success?: string }) {
  const dtRef = useRef<DataTableWrapperRef>(null);

  const columns = [
    { data: 'id', title: 'ID' },
    { data: 'name', title: 'Name' },
    { data: 'guard_name', title: 'Guard Name' },
    { data: 'created_at', title: 'Created At' },
    { data: 'updated_at', title: 'Updated At' },
    {
      data: null,
      title: 'Actions',
      orderable: false,
      searchable: false,
      render: (_: null, __: string, row: unknown) => {
        const role = row as Role;
        return `
          <span class="inertia-link-cell" data-id="${role.id}"></span>
          <button data-id="${role.id}" class="ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 btn-delete">
            Delete
          </button>
        `;
      },
    },
  ];

  const handleDelete = (id: number) => {
    router.delete(route('roles.destroy', id), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => dtRef.current?.reload(),
    });
  };



  const drawCallback = () => {
    // Render tombol Edit dengan React
    document.querySelectorAll('.inertia-link-cell').forEach((cell) => {
      const id = cell.getAttribute('data-id');
      if (id) {
        const root = ReactDOM.createRoot(cell);
        root.render(
          <Link
            href={`/roles/${id}/edit`}
            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Edit
          </Link>
        );
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Roles" />
      <div className="px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Settings</h1>
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
          <Separator className="my-6 md:hidden" />
          <div className="col-md-12">
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
            <DataTableWrapper
              ref={dtRef}
              ajax={{
                url: route('roles.json'),
                type: 'POST',
              }}
              columns={columns}
              options={{ drawCallback }}
              onRowDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
