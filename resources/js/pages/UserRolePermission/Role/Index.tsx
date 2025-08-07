import { useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem } from '@/types';
import { Role } from '@/types/UserRolePermission';
import DataTableWrapper, { DataTableWrapperRef, createExpandConfig } from '@/components/datatables';
import { DataTableColumn } from '@/types/DataTables';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Role Management', href: '/roles' },
];

export default function RoleIndexAccordion({ success }: { success?: string }) {
  const dtRef = useRef<DataTableWrapperRef>(null);

  const columns: DataTableColumn<Role>[] = [
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
      render: (data: Role[keyof Role] | null, type: 'display' | 'type' | 'sort' | 'export', row: Role) => {
        return `
          <span class="inertia-link-cell" data-id="${row.id}"></span>
          <button data-id="${row.id}" class="ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 btn-delete">
            Delete
          </button>
        `;
      },
    },
  ];

  // Expand configuration
  const expandConfig = createExpandConfig<Role>({
    enabled: true,
    expandIcon: '+',
    collapseIcon: '-',
    columnTitle: '',
    renderContent: (rowData: Role) => {
      if (!rowData.permissions || rowData.permissions.length === 0) {
        return '<div class="p-3 text-gray-500">No permissions assigned.</div>';
      }
      const listItems = rowData.permissions
        .map(
          (permission) =>
            `<li class="ml-4 list-disc text-gray-700">${permission.name}</li>`
        )
        .join('');
      return `
        <div class="p-4 bg-gray-50 border border-gray-200 rounded shadow-sm">
          <strong class="block text-gray-800 mb-2">Permissions:</strong>
          <ul>${listItems}</ul>
        </div>
      `;
    },
  });

  const handleDelete = (id: number) => {
    router.delete(route('roles.destroy', id), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => dtRef.current?.reload(),
    });
  };

  const drawCallback = () => {
    document.querySelectorAll('.inertia-link-cell').forEach((cell) => {
      const id = cell.getAttribute('data-id');
      if (id && !cell.querySelector('a')) {
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

    document.querySelectorAll('.btn-delete:not([data-listener])').forEach((btn) => {
      btn.setAttribute('data-listener', 'true');
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id) handleDelete(Number(id));
      });
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Roles" />
      <div className="px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Role Management</h1>
        <div className="w-full">
          <HeadingSmall title="Roles" description="Manage roles for your application" />
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Role List</h2>
            <Link href={route('roles.create')}>
              <Button>Create Role</Button>
            </Link>
          </div>
          {success && (
            <div className="p-2 mb-2 bg-green-100 text-green-800 rounded">{success}</div>
          )}
          <DataTableWrapper<Role>
            ref={dtRef}
            ajax={{
              url: route('roles.json'),
              type: 'POST',
            }}
            columns={columns}
            options={{ drawCallback }}
            expand={expandConfig}
          />
        </div>
      </div>
    </AppLayout>
  );
}
