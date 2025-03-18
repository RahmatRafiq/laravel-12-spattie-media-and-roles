import { useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import DataTableWrapper, { DataTableWrapperRef } from '@/components/datatables';
import { BreadcrumbItem } from '@/types';
import { Permission } from '@/types/UserRolePermission';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Permission Management', href: '/permissions' },
];

export default function PermissionIndex({ success }: { success?: string }) {
  const dtRef = useRef<DataTableWrapperRef>(null);

  const columns = [
    { data: 'id', title: 'ID' },
    { data: 'name', title: 'Name' },
    {
      data: null,
      title: 'Actions',
      orderable: false,
      searchable: false,
      render: (_: null, __: string, row: unknown) => {
        const permission = row as Permission;
        return `
                <span class="inertia-link-cell" data-id="${permission.id}"></span>
                <button data-id="${permission.id}" class="ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 btn-delete">
                  Delete
                </button>
               `;
      },
    },
  ];

  const handleDelete = (id: number) => {
    router.delete(route('permissions.destroy', id), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => dtRef.current?.reload(),
    });
  };

  const drawCallback = () => {
    // Render tombol Edit secara dinamis menggunakan React
    document.querySelectorAll('.inertia-link-cell').forEach((cell) => {
      const id = cell.getAttribute('data-id');
      if (id) {
        const root = ReactDOM.createRoot(cell);
        root.render(
          <Link
            href={`/permissions/${id}/edit`}
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
      <Head title="Permissions" />
      <div className="px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Settings</h1>
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
          <Separator className="my-6 md:hidden" />
          <div className="col-md-12">
            <HeadingSmall title="Permissions" description="Manage permissions for your application" />
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Permission List</h2>
              <Link href={route('permissions.create')}>
                <Button>Create Permission</Button>
              </Link>
            </div>
            {success && (
              <div className="p-2 bg-green-100 text-green-800 rounded">{success}</div>
            )}
            <DataTableWrapper
              ref={dtRef}
              ajax={{
                url: route('permissions.json'),
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
