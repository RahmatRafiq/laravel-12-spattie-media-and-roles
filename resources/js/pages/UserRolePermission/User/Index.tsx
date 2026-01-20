import DataTableWrapper, { DataTableWrapperRef } from '@/components/datatables';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import PageContainer from '@/components/page-container';
import ToggleTabs from '@/components/toggle-tabs';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, User } from '@/types';
import type { DataTableColumn } from '@/types/DataTables';
import { Head, Link, router } from '@inertiajs/react';
import { useRef, useState } from 'react';

const columns: DataTableColumn<User>[] = [
    { data: 'id', title: 'ID', className: 'all' },
    { data: 'name', title: 'Name', className: 'all' },
    { data: 'email', title: 'Email', className: 'tablet-p' },
    { data: 'roles', title: 'Role(s)', className: 'tablet-l' },
    {
        data: null,
        title: 'Actions',
        orderable: false,
        searchable: false,
        className: 'all',
        render: (_data, _type, row: User) => {
            const btn = 'inline-block px-3 py-2 text-sm font-medium rounded text-white transition-colors';
            if (row.trashed) {
                return `
                    <div class="flex flex-wrap gap-2 py-1">
                        <button class="btn-restore ${btn} bg-green-600 hover:bg-green-700" data-id="${row.id}">Restore</button>
                        <button class="btn-force-delete ${btn} bg-red-600 hover:bg-red-700" data-id="${row.id}">Force Delete</button>
                    </div>
                `;
            }
            return `
                <div class="flex flex-wrap gap-2 py-1">
                    <a href="/dashboard/users/${row.id}/edit" class="${btn} bg-yellow-500 hover:bg-yellow-600">Edit</a>
                    <button class="btn-delete ${btn} bg-red-600 hover:bg-red-700" data-id="${row.id}">Delete</button>
                </div>
            `;
        },
    },
];

export default function UserIndex({ filter: initialFilter, success }: { filter: string; success?: string }) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'User Management', href: route('users.index') }];
    const dtRef = useRef<DataTableWrapperRef>(null);
    const [filter, setFilter] = useState(initialFilter || 'active');

    const handleDelete = (id: number) => {
        router.delete(route('users.destroy', id), {
            onSuccess: () => dtRef.current?.reload(),
        });
    };

    const handleRestore = (id: number) => {
        router.post(
            route('users.restore', id),
            {},
            {
                onSuccess: () => dtRef.current?.reload(),
            },
        );
    };

    const handleForceDelete = (id: number) => {
        router.delete(route('users.force-delete', id), {
            onSuccess: () => dtRef.current?.reload(),
        });
    };

    const handleFilterChange = (newFilter: string) => {
        setFilter(newFilter);
        if (dtRef.current) {
            const newUrl = route('users.json') + '?filter=' + newFilter;
            dtRef.current.updateUrl(newUrl);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <PageContainer maxWidth="full">
                <Heading title="User Management" />
                    <HeadingSmall title="Users" description="Manage application users and their roles" />
                    <div className="mb-4 flex items-center justify-end">
                        <Link href={route('users.create')}>
                            <Button>Create User</Button>
                        </Link>
                    </div>

                    <ToggleTabs tabs={['active', 'trashed', 'all']} active={filter} onChange={handleFilterChange} />

                    {success && <div className="mb-2 rounded bg-green-100 p-2 text-green-800">{success}</div>}
                    <DataTableWrapper<User>
                        ref={dtRef}
                        ajax={{
                            url: route('users.json') + '?filter=' + filter,
                            type: 'POST',
                        }}
                        columns={columns}
                        onRowDelete={handleDelete}
                        onRowRestore={handleRestore}
                        onRowForceDelete={handleForceDelete}
                        confirmationConfig={{
                            delete: {
                                title: 'Delete User Confirmation',
                                message: 'Are you sure you want to delete this user? The user will be moved to trash.',
                                confirmText: 'Delete',
                                cancelText: 'Cancel',
                                successMessage: 'User deleted successfully',
                            },
                            restore: {
                                title: 'Restore User Confirmation',
                                message: 'Are you sure you want to restore this user from trash?',
                                confirmText: 'Restore',
                                cancelText: 'Cancel',
                                successMessage: 'User restored successfully',
                            },
                            forceDelete: {
                                title: 'Permanent Delete Confirmation',
                                message: 'Are you sure you want to permanently delete this user? This action cannot be undone!',
                                confirmText: 'Permanently Delete',
                                cancelText: 'Cancel',
                                successMessage: 'User permanently deleted successfully',
                            },
                        }}
                    />
            </PageContainer>
        </AppLayout>
    );
}
