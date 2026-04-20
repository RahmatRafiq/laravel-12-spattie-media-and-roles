import { TanstackDataTable } from '@/components/TanstackDataTable';
import Heading from '@/components/Heading';
import HeadingSmall from '@/components/HeadingSmall';
import PageContainer from '@/components/PageContainer';
import ToggleTabs from '@/components/form/ToggleTabs';
import { Button } from '@/components/ui/Button';
import AppLayout from '@/layouts/AppLayout';
import type { BreadcrumbItem, InertiaPaginated, User } from '@/types';
import { useResourceActions } from '@/hooks/use-resource-actions';
import { useConfirm } from '@/components/providers/ConfirmationProvider';
import { toast } from '@/utils/toast';
import { Head, Link, router } from '@inertiajs/react';
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

export default function UserIndex({ users, filter }: { users: InertiaPaginated<User>, filter: string }) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'User Management', href: route('users.index') }];
    const { deleteResource } = useResourceActions();
    const confirm = useConfirm();

    const handleRestore = async (id: number) => {
        const isConfirmed = await confirm({
            title: 'Restore User',
            message: 'Are you sure you want to restore this user?',
            variant: 'default',
            confirmText: 'Restore',
        });
        if (isConfirmed) {
            router.post(route('users.restore', id), {}, {
                onSuccess: () => toast.success('User restored successfully'),
            });
        }
    };
    
    const handleForceDelete = (id: number) => {
        deleteResource({
            url: route('users.force-delete', id),
            resourceName: 'User',
            title: 'Permanent Deletion',
            message: 'Are you sure you want to permanently delete this user? This action cannot be undone.'
        });
    };

    const columns: ColumnDef<User>[] = [
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
            accessorKey: 'email',
            header: 'Email',
            meta: { className: 'hidden lg:table-cell' } // Hidden on mobile and tablet, show only on large screens
        },
        {
            accessorKey: 'roles',
            header: 'Roles',
            meta: { className: 'hidden md:table-cell' },
            enableSorting: false,
            cell: ({ row }) => <span>{(row.original.roles as unknown as string[]).join(', ')}</span>
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const user = row.original;
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
                            {user.trashed ? (
                                <>
                                    <DropdownMenuItem onClick={() => handleRestore(user.id)}>Restore</DropdownMenuItem>
                                    <DropdownMenuItem className='text-red-600' onClick={() => handleForceDelete(user.id)}>Force Delete</DropdownMenuItem>
                                </>
                            ) : (
                                <>
                                    <DropdownMenuItem asChild>
                                        <Link href={route('users.edit', user.id)}>Edit</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => deleteResource({ url: route('users.destroy', user.id), resourceName: 'User' })}>Delete</DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const handleFilterChange = (newFilter: string) => {
        router.get(route('users.index'), { filter: newFilter }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <PageContainer>
                <Heading title="User Management" />
                <HeadingSmall title="Users" description="Manage application users and their roles" />
                <div className="mb-4 flex items-center justify-end">
                    <Link href={route('users.create')}>
                        <Button>Create User</Button>
                    </Link>
                </div>
                <TanstackDataTable 
                    columns={columns} 
                    inertiaPaginated={users} 
                    headerContent={
                        <ToggleTabs tabs={['active', 'trashed', 'all']} active={filter} onChange={handleFilterChange} />
                    }
                />
            </PageContainer>
        </AppLayout>
    );
}
