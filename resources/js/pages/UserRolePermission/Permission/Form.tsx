import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import UserRolePermissionLayout from '@/layouts/UserRolePermission/layout';
import { BreadcrumbItem } from '@/types';
import type { Permission } from '@/types/UserRolePermission';
import { Link, useForm } from '@inertiajs/react';
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
            <UserRolePermissionLayout
                breadcrumbs={breadcrumbs}
                title="Permission Management"
                description="Create or edit a permission"
                active="Permission Management"
            >
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
            </UserRolePermissionLayout>
        </AppLayout>
    );
}
