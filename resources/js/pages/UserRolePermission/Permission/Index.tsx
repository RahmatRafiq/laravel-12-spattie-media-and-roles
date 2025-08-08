import DataTableWrapper, { DataTableWrapperRef } from '@/components/datatables';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { DataTableColumn } from '@/types/DataTables';
import { Permission } from '@/types/UserRolePermission';
import { Head, Link, router } from '@inertiajs/react';
import { useRef } from 'react';
import ReactDOM from 'react-dom/client';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Permission Management', href: '/permissions' }];

export default function PermissionIndex({ success }: { success?: string }) {
    const dtRef = useRef<DataTableWrapperRef>(null);

    const columns: DataTableColumn<Permission>[] = [
        { data: 'id', title: 'ID' },
        { data: 'name', title: 'Name' },
        {
            data: null,
            title: 'Actions',
            orderable: false,
            searchable: false,
            render: (data: Permission[keyof Permission] | null, type: 'display' | 'type' | 'sort' | 'export', row: Permission) => {
                return `
                <span class="inertia-link-cell" data-id="${row.id}"></span>
                <button data-id="${row.id}" class="ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 btn-delete">
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
        document.querySelectorAll('.inertia-link-cell').forEach((cell) => {
            const id = cell.getAttribute('data-id');
            if (id && !cell.querySelector('a')) {
                const root = ReactDOM.createRoot(cell);
                root.render(
                    <Link href={`/permissions/${id}/edit`} className="rounded bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-600">
                        Edit
                    </Link>,
                );
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <div className="px-4 py-6">
                <h1 className="mb-4 text-2xl font-semibold">Permission Management</h1>
                <div className="w-full">
                    <HeadingSmall title="Permissions" description="Manage permissions for your application" />
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Permission List</h2>
                        <Link href={route('permissions.create')}>
                            <Button>Create Permission</Button>
                        </Link>
                    </div>
                    {success && <div className="mb-2 rounded bg-green-100 p-2 text-green-800">{success}</div>}
                    <DataTableWrapper<Permission>
                        ref={dtRef}
                        ajax={{
                            url: route('permissions.json'),
                            type: 'POST',
                        }}
                        columns={columns}
                        options={{ drawCallback }}
                        onRowDelete={handleDelete}
                        confirmationConfig={{
                            delete: {
                                title: 'Delete Permission Confirmation',
                                message: 'Are you sure you want to delete this permission? This action cannot be undone.',
                                confirmText: 'Delete',
                                cancelText: 'Cancel',
                                successMessage: 'Permission deleted successfully',
                            },
                        }}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
