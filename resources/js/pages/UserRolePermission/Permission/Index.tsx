import { TanstackDataTable } from '@/components/TanstackDataTable';
import Heading from '@/components/Heading';
import HeadingSmall from '@/components/HeadingSmall';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/Button';
import AppLayout from '@/layouts/AppLayout';
import type { BreadcrumbItem, InertiaPaginated, Permission } from '@/types';
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

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Permission Management', href: route('permissions.index') }];

export default function PermissionIndex({ permissions }: { permissions: InertiaPaginated<Permission> }) {
    const { deleteResource } = useResourceActions();

    const columns: ColumnDef<Permission>[] = [
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
            accessorKey: 'created_at',
            header: 'Created At',
            meta: { className: 'hidden md:table-cell' },
            cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const permission = row.original;
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
                                <Link href={route('permissions.edit', permission.id)}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteResource({ url: route('permissions.destroy', permission.id), resourceName: 'Permission' })}>
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
            <Head title="Permissions" />
            <PageContainer maxWidth="full">
                <Heading title="Permission Management" />
                <HeadingSmall title="Permissions" description="Manage permissions for your application" />
                <div className="mb-4 flex items-center justify-end">
                    <Link href={route('permissions.create')}>
                        <Button>Create Permission</Button>
                    </Link>
                </div>
                <TanstackDataTable 
                    columns={columns} 
                    inertiaPaginated={permissions} 
                    jsonUrl={route('permissions.json')} 
                />
            </PageContainer>
        </AppLayout>
    );
}
