import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import CustomSelect from '@/components/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import type { Role, User } from '@/types/UserRolePermission';
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
        { title: 'User Management', href: '/users' },
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
            <div className="px-4 py-6">
                <h1 className="mb-4 text-2xl font-semibold">User Management</h1>
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                    <aside className="w-full max-w-xl lg:w-48">
                        <nav className="flex flex-col space-y-1">
                            <Button asChild variant="ghost" size="sm" className="justify-start">
                                <Link href="/users">User List</Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm" className="justify-start">
                                <Link href="/roles">Role Management</Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm" className="justify-start">
                                <Link href="/permissions">Permission Management</Link>
                            </Button>
                        </nav>
                    </aside>
                    <div className="flex-1 space-y-6 md:max-w-2xl">
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

                            <div className="flex items-center space-x-4">
                                <Button disabled={processing}>{isEdit ? 'Update User' : 'Create User'}</Button>
                                <Link href={route('users.index')} className="bg-muted text-foreground hover:bg-muted/70 rounded px-4 py-2">
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
