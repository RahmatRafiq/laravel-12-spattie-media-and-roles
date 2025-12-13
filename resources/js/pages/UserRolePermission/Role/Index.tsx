import DataTableWrapper, { DataTableWrapperRef } from '@/components/datatables';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import PageContainer from '@/components/page-container';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { DataTableColumn } from '@/types/DataTables';
import type { Role } from '@/types/UserRolePermission';
import { Head, Link, router } from '@inertiajs/react';
import { useRef } from 'react';

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
            render: (_data, _type, row: Role) => {
                const btn = 'inline-block px-3 py-2 text-sm font-medium rounded text-white transition-colors';
                return `
                    <div class="flex flex-wrap gap-2 py-1">
                        <a href="/dashboard/roles/${row.id}/edit" class="${btn} bg-yellow-500 hover:bg-yellow-600">Edit</a>
                        <button class="btn-delete ${btn} bg-red-600 hover:bg-red-700" data-id="${row.id}">Delete</button>
                    </div>
                `;
            },
        },
    ];

    const handleDelete = (id: number | string) => {
        router.delete(route('roles.destroy', id), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => dtRef.current?.reload(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <PageContainer maxWidth="full">
                <Heading title="Role Management" />
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
            </PageContainer>
        </AppLayout>
    );
}
