import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

import CustomSelect from '@/components/select';
import AppLayout from '@/layouts/app-layout';
import UserRolePermissionLayout from '@/layouts/UserRolePermission/layout';
import { BreadcrumbItem, Permission, Role } from '@/types';

export default function RoleForm({ role, permissions }: { role?: Role; permissions: Permission[] }) {
    const isEdit = !!role;
    const { data, setData, post, put, processing, errors } = useForm({
        name: role ? role.name : '',
        guard_name: role ? role.guard_name : 'web',
        permissions: role && role.permissions ? role.permissions.map((p) => p.id) : [],
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Role Management', href: route('roles.index') },
        { title: isEdit ? 'Edit Role' : 'Create Role', href: '#' },
    ];

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(route('roles.update', role!.id));
        } else {
            post(route('roles.store'));
        }
    };

    const permissionOptions = permissions.map((p) => ({
        value: p.id,
        label: p.name,
    }));

    const guardOptions = [
        { value: 'web', label: 'web' },
        { value: 'api', label: 'api' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Role' : 'Create Role'} />
            <UserRolePermissionLayout
                breadcrumbs={breadcrumbs}
                title="Role Management"
                description="Create or edit a role and assign permissions"
                active="Role Management"
            >
                <HeadingSmall title={isEdit ? 'Edit Role' : 'Create Role'} description="Fill in the details below" />
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Role Name</Label>
                        <Input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        <InputError message={errors.name} />
                    </div>
                    <div>
                        <Label htmlFor="guard">Guard</Label>
                        <CustomSelect
                            id="guard"
                            options={guardOptions}
                            value={guardOptions.find((option) => option.value === data.guard_name)}
                            onChange={(selected) => setData('guard_name', (selected as { value: string }).value)}
                        />
                        <InputError message={errors.guard_name} />
                    </div>
                    <div>
                        <Label htmlFor="permissions">Permissions</Label>
                        <CustomSelect
                            id="permissions"
                            isMulti
                            options={permissionOptions}
                            value={permissionOptions.filter((option) => data.permissions.includes(option.value))}
                            onChange={(newValue) =>
                                setData('permissions', Array.isArray(newValue) ? newValue.map((option) => option.value) : [])
                            }
                        />
                        <InputError message={errors.permissions} />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>{isEdit ? 'Update Role' : 'Create Role'}</Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href={route('roles.index')}>Cancel</Link>
                        </Button>
                    </div>
                </form>
            </UserRolePermissionLayout>
        </AppLayout>
    );
}
