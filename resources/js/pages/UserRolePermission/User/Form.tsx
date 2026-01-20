import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import CustomSelect from '@/components/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import UserRolePermissionLayout from '@/layouts/UserRolePermission/layout';
import { BreadcrumbItem, Role, User } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function UserForm({ user, roles }: { user?: User; roles: Role[] }) {
    const isEdit = !!user;

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        role_id: user?.role_id || null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'User Management', href: route('users.index') },
        { title: isEdit ? 'Edit User' : 'Create User', href: '#' },
    ];

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(route('users.update', user!.id));
        } else {
            post(route('users.store'));
        }
    };

    const roleOptions = roles.map((r) => ({
        value: r.id,
        label: r.name,
    }));

    const selectedRole = roleOptions.find((opt) => opt.value === Number(data.role_id)) || null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit User' : 'Create User'} />
            <UserRolePermissionLayout
                breadcrumbs={breadcrumbs}
                title="User Management"
                description="Create or edit a user and assign a role"
                active="User List"
            >
                <HeadingSmall title={isEdit ? 'Edit User' : 'Create User'} description="Fill in the details below" />
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        <InputError message={errors.name} />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                        <InputError message={errors.email} />
                    </div>
                    <div>
                        <Label htmlFor="password">
                            Password {isEdit && <span className="text-muted text-sm">(Leave blank if not changing)</span>}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={isEdit ? 'Leave blank if not changing' : ''}
                        />
                        <InputError message={errors.password} />
                    </div>
                    <div>
                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder={isEdit ? 'Leave blank if not changing' : ''}
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>
                    <div>
                        <Label htmlFor="role_id">Role</Label>
                        <CustomSelect
                            id="role_id"
                            isMulti={false}
                            options={roleOptions}
                            value={selectedRole}
                            onChange={(selected) => {
                                setData('role_id', (selected as { value: number })?.value ?? null);
                            }}
                        />
                        <InputError message={errors.role_id} />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>{isEdit ? 'Update User' : 'Create User'}</Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href={route('users.index')}>Cancel</Link>
                        </Button>
                    </div>
                </form>
            </UserRolePermissionLayout>
        </AppLayout>
    );
}
