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
                html += `<button class="btn-restore ml-2 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" data-id="${row.id}">Restore</button>`;
                html += `<button class="btn-force-delete ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700" data-id="${row.id}">Force Delete</button>`;
            } else {
                html += `<span class="inertia-link-cell" data-id="${row.id}"></span>`;
                html += `<button class="btn-delete ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700" data-id="${row.id}">Delete</button>`;
            }
            return html;
        },
    },
];

export default function UserIndex({ filter: initialFilter, success }: { filter: string; success?: string }) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'User Management', href: '/users' }];
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
                    <Link href={`/users/${id}/edit`} className="rounded bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-600">
                        Edit
                    </Link>,
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
        document.querySelectorAll('.btn-restore:not([data-listener])').forEach((btn) => {
            btn.setAttribute('data-listener', 'true');
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (id) handleRestore(Number(id));
            });
        });
        document.querySelectorAll('.btn-force-delete:not([data-listener])').forEach((btn) => {
            btn.setAttribute('data-listener', 'true');
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (id) handleForceDelete(Number(id));
            });
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
                    />
                </div>
            </div>
        </AppLayout>
    );
}
