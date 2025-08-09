import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import type { Permission } from '@/types/UserRolePermission';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function PermissionForm({ permission }: { permission?: Permission }) {
    const isEdit = !!permission;
    const { data, setData, post, put, processing, errors } = useForm({
        name: permission ? permission.name : '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Permission Management', href: route('permissions.index') },
        { title: isEdit ? 'Edit Permission' : 'Create Permission', href: '#' },
    ];

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(route('permissions.update', permission!.id));
        } else {
            post(route('permissions.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Permission' : 'Create Permission'} />
            <div className="px-4 py-6">
                <h1 className="mb-4 text-2xl font-semibold">Permission Management</h1>
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                    <aside className="w-full max-w-xl lg:w-48">
                        <nav className="flex flex-col space-y-1">
                            <Button asChild variant="ghost" size="sm" className="justify-start">
                                <Link href={route('users.index')}>User List</Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm" className="justify-start">
                                <Link href={route('roles.index')}>Role Management</Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm" className="justify-start">
                                <Link href={route('permissions.index')}>Permission Management</Link>
                            </Button>
                        </nav>
                    </aside>

                    <div className="flex-1 space-y-6 md:max-w-2xl">
                        <HeadingSmall title={isEdit ? 'Edit Permission' : 'Create Permission'} description="Fill in the details below" />
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Permission Name</Label>
                                <Input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                <InputError message={errors.name} />
                            </div>
                            <div className="flex items-center space-x-4">
                                <Button disabled={processing}>{isEdit ? 'Update Permission' : 'Create Permission'}</Button>
                                <Link href={route('permissions.index')} className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400">
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
