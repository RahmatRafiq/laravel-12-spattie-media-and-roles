import DataTableWrapper, { DataTableWrapperRef } from '@/components/datatables';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { DataTableColumn } from '@/types/DataTables';
import { Role } from '@/types/UserRolePermission';
import { Head, Link, router } from '@inertiajs/react';
import { useRef } from 'react';
import ReactDOM from 'react-dom/client';
import Heading from '../../../components/heading';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Role Management', href: route('roles.index') }];

export default function RoleIndexAccordion({ success }: { success?: string }) {
    const dtRef = useRef<DataTableWrapperRef>(null);

    const columns: DataTableColumn<Role>[] = [
        { data: 'id', title: 'ID', className: 'all' },
        { data: 'name', title: 'Name', className: 'all' },
        { data: 'guard_name', title: 'Guard Name', className: 'tablet-p' },
        { data: 'created_at', title: 'Created At', className: 'tablet-l' },
        { data: 'updated_at', title: 'Updated At', className: 'desktop' },
        {
            data: 'permissions_list',
            title: 'Permissions',
            className: 'tablet-p',
            render: (data: Role[keyof Role] | null) => {
                const value = typeof data === 'string' ? data : '';
                if (!value) return '';
                return value.split(',').map((perm) =>
                    `<span class='inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 bg-primary text-primary-foreground mr-1 mb-1'>${perm.trim()}</span>`
                ).join('');
            }
        },
        {
            data: null,
            title: 'Actions',
            orderable: false,
            searchable: false,
            className: 'all',
            render: (data: Role[keyof Role] | null, type: 'display' | 'type' | 'sort' | 'export', row: Role) => {
                return `
                    <span class="inertia-link-cell" data-id="${row.id}"></span>
                    <button data-id="${row.id}" class="ml-2 my-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 btn-delete text-sm font-medium align-middle">
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
        document.querySelectorAll('.inertia-link-cell').forEach((cell) => {
            const id = cell.getAttribute('data-id');
            if (id && !cell.querySelector('a')) {
                const root = ReactDOM.createRoot(cell);
                root.render(
                    <Link
                        href={route('roles.edit', id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white rounded px-3 py-2 my-1 text-sm font-medium align-middle"
                        style={{ display: 'inline-block', minWidth: '80px', textAlign: 'center' }}
                    >
                        Edit
                    </Link>,
                );
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="px-4 py-6">
                <Heading title='Role Management' />
                <div className="w-full">
                    <HeadingSmall title="Roles" description="Manage roles for your application" />
                    <div className="mb-4 flex items-center justify-end">
                        <Link href={route('roles.create')}>
                            <Button>Create Role</Button>
                        </Link>
                    </div>
                    {success && <div className="mb-2 rounded bg-green-100 p-2 text-green-800">{success}</div>}
                    <DataTableWrapper<Role>
                        ref={dtRef}
                        ajax={{
                            url: route('roles.json'),
                            type: 'POST',
                        }}
                        columns={columns}
                        options={{ drawCallback }}
                        onRowDelete={handleDelete}
                        confirmationConfig={{
                            delete: {
                                title: 'Delete Role Confirmation',
                                message: 'Are you sure you want to delete this role? This action cannot be undone.',
                                confirmText: 'Delete',
                                cancelText: 'Cancel',
                                successMessage: 'Role deleted successfully',
                            },
                        }}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
