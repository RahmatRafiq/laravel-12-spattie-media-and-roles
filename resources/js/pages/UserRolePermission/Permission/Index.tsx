import DataTableWrapper, { DataTableWrapperRef } from '@/components/DataTables';
import Heading from '@/components/Heading';
import HeadingSmall from '@/components/HeadingSmall';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Permission } from '@/types';
import type { DataTableColumn } from '@/types/DataTables';
import { useResourceActions } from '@/hooks/use-resource-actions';
import { Head, Link } from '@inertiajs/react';
import { useRef } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Permission Management', href: route('permissions.index') }];

export default function PermissionIndex({ success }: { success?: string }) {
    const dtRef = useRef<DataTableWrapperRef>(null);
    const { deleteResource } = useResourceActions();

    const columns: DataTableColumn<Permission>[] = [
        { data: 'id', title: 'ID', className: 'all' },
        { data: 'name', title: 'Name', className: 'all' },
        { data: 'guard_name', title: 'Guard Name', className: 'tablet-p' },
        { data: 'created_at', title: 'Created At', className: 'tablet-l' },
        { data: 'updated_at', title: 'Updated At', className: 'desktop' },
        {
            data: null,
            title: 'Actions',
            orderable: false,
            searchable: false,
            className: 'all',
            render: (_data, _type, row: Permission) => {
                const btn = 'inline-block px-3 py-2 text-sm font-medium rounded text-white transition-colors';
                return `
                    <div class="flex flex-wrap gap-2 py-1">
                        <a href="/dashboard/permissions/${row.id}/edit" class="${btn} bg-yellow-500 hover:bg-yellow-600">Edit</a>
                        <button class="btn-delete ${btn} bg-red-600 hover:bg-red-700" data-id="${row.id}">Delete</button>
                    </div>
                `;
            },
        },
    ];

    const handleDelete = (id: number | string) => {
        deleteResource({
            url: route('permissions.destroy', id),
            resourceName: 'Permission',
            onSuccess: () => dtRef.current?.reload(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <PageContainer maxWidth="full">
                <Heading title="Permission Management" />
                <HeadingSmall title="Permissions" description="Manage permissions for your application" />
                    <div className="mb-4 flex items-center justify-end">
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
                        onRowDelete={handleDelete}
                    />
            </PageContainer>
        </AppLayout>
    );
}
