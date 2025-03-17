import { Head, Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import HeadingSmall from '@/components/heading-small';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import DataTableWrapper from '@/components/datatables';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Permission Management', href: '/permissions' },
];

export default function PermissionIndex({ success }: { success?: string }) {
  const columns = [
    { data: 'id', title: 'ID' },
    { data: 'name', title: 'Name' },
    {
      data: null,
      title: 'Actions',
      orderable: false,
      searchable: false,
      render: function (_: string, _type: string, row: { id: number }) {
        return `
          <a href="/permissions/${row.id}/edit" class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</a>
          <button data-id="${row.id}" class="ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 btn-delete">Delete</button>
        `;
      },
    },
  ];

  const handleDelete = (id: number) => {
    Inertia.delete(route('permissions.destroy', id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Permissions" />

      <div className="px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Settings</h1>

        <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
          <Separator className="my-6 md:hidden" />

          <div className="flex-1 md:max-w-2xl space-y-6">
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
              ajax={{
                url: route('permissions.json'),
                type: 'POST',
              }}
              columns={columns}
              onRowDelete={handleDelete}
            />

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
