import { TanstackDataTable } from '@/components/TanstackDataTable';
import Heading from '@/components/Heading';
import HeadingSmall from '@/components/HeadingSmall';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/Button';
import AppLayout from '@/layouts/AppLayout';
import type { BreadcrumbItem, InertiaPaginated, Role } from '@/types';
import { useResourceActions } from '@/hooks/use-resource-actions';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Role Management', href: route('roles.index') }];

export default function RoleIndex({ roles }: { roles: InertiaPaginated<Role> }) {
    const { deleteResource } = useResourceActions();

    const columns: ColumnDef<Role>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            meta: { className: 'hidden md:table-cell' }
        },
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'guard_name',
            header: 'Guard',
        },
        {
            id: 'permissions',
            header: 'Permissions',
            meta: { className: 'hidden md:table-cell' },
            cell: ({ row }) => {
                const permissions = (row.original.permissions as unknown as { name: string }[]).map(p => p.name);
                return (
                    <div className="flex flex-wrap gap-1">
                        {permissions.slice(0, 3).map(p => (
                            <span key={p} className="bg-muted text-muted-foreground px-2 py-0.5 text-xs rounded">
                                {p}
                            </span>
                        ))}
                        {permissions.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{permissions.length - 3} more</span>
                        )}
                    </div>
                );
            }
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const role = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={route('roles.edit', role.id)}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteResource({ url: route('roles.destroy', role.id), resourceName: 'Role' })}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

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
                <TanstackDataTable 
                    columns={columns} 
                    inertiaPaginated={roles} 
                    jsonUrl={route('roles.json')} 
                />
            </PageContainer>
        </AppLayout>
    );
}
