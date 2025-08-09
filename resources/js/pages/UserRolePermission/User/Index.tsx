import DataTableWrapper, { DataTableWrapperRef } from '@/components/datatables';
import HeadingSmall from '@/components/heading-small';
import ToggleTabs from '@/components/toggle-tabs';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { DataTableColumn } from '@/types/DataTables';
import { User } from '@/types/UserRolePermission';
import { Head, Link, router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';

const columns: DataTableColumn<User>[] = [
    { data: 'id', title: 'ID' },
    { data: 'name', title: 'Name' },
    { data: 'email', title: 'Email' },
    { data: 'roles', title: 'Role(s)' },
    {
        data: null,
        title: 'Actions',
        orderable: false,
        searchable: false,
        render: (data: User[keyof User] | null, type: 'display' | 'type' | 'sort' | 'export', row: User) => {
            let html = '';
            if (row.trashed) {
                html += `<button class="btn-restore ml-2 my-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium align-middle" data-id="${row.id}">Restore</button>`;
                html += `<button class="btn-force-delete ml-2 my-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium align-middle" data-id="${row.id}">Force Delete</button>`;
            } else {
                html += `<span class="inertia-link-cell" data-id="${row.id}"></span>`;
                html += `<button class="btn-delete ml-2 my-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium align-middle" data-id="${row.id}">Delete</button>`;
            }
            return html;
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

    const drawCallback = () => {
        document.querySelectorAll('.inertia-link-cell').forEach((cell) => {
            const id = cell.getAttribute('data-id');
            if (id && !cell.querySelector('a')) {
                const root = ReactDOM.createRoot(cell);
                root.render(
                    <Link
                        href={route('users.edit', id)}
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
            <Head title="Users" />
            <div className="px-4 py-6">
                <h1 className="mb-4 text-2xl font-semibold">User Management</h1>
                <div className="w-full">
                    <HeadingSmall title="Users" description="Manage application users and their roles" />
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">User List</h2>
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
                        options={{ drawCallback }}
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
                </div>
            </div>
        </AppLayout>
    );
}
