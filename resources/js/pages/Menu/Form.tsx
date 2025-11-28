import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import PageContainer from '@/components/page-container';
import CustomSelect from '@/components/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import type { MenuTreeItem } from './Index';
import { Permission } from '../../types/UserRolePermission';

interface MenuFormProps {
    menu?: MenuTreeItem;
    allMenus: MenuTreeItem[];
    permissions?: Permission[];
}

export default function MenuFormPage({ menu, allMenus, permissions = [] }: MenuFormProps) {
    const isEdit = !!menu;
    const { data, setData, post, put, processing, errors } = useForm({
        title: menu ? menu.title : '',
        route: menu ? menu.route : '',
        icon: menu ? menu.icon : '',
        permission: menu ? menu.permission : '',
        parent_id: menu ? menu.parent_id : '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Menu Management', href: route('menus.manage') },
        { title: isEdit ? 'Edit Menu' : 'Create Menu', href: '#' },
    ];

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(route('menus.update', menu.id), {
                onSuccess: () => router.visit(route('menus.manage')),
            });
        } else {
            post(route('menus.store'), {
                onSuccess: () => router.visit(route('menus.manage')),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Menu' : 'Create Menu'} />
            <PageContainer maxWidth="full">
                <Heading title="Menu Management" description="Manage your application menu items" />
                <div className="max-w-2xl mx-auto space-y-6">
                    <HeadingSmall title={isEdit ? 'Edit Menu' : 'Create Menu'} description="Fill in the menu details below" />
                    <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={data.title ?? ''} onChange={(e) => setData('title', e.target.value)} required />
                                <InputError message={errors.title} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="route">Route</Label>
                                <Input id="route" value={data.route ?? ''} onChange={(e) => setData('route', e.target.value)} />
                                <InputError message={errors.route} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="icon">Icon (lucide name)</Label>
                                <Input id="icon" value={data.icon ?? ''} onChange={(e) => setData('icon', e.target.value)} />
                                <InputError message={errors.icon} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="permission">Permission</Label>
                                <CustomSelect
                                    inputId="permission"
                                    isClearable
                                    options={permissions.map((p) => ({ value: p.name, label: p.name }))}
                                    value={permissions.find((p) => p.name === data.permission) ? { value: data.permission, label: data.permission } : null}
                                    onChange={(option) => setData('permission', option && !Array.isArray(option) ? (option as { value: string }).value : '')}
                                    placeholder="Select permission"
                                />
                                <InputError message={errors.permission} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="parent_id">Parent Menu</Label>
                                <CustomSelect
                                    inputId="parent_id"
                                    isClearable
                                    options={allMenus.map((m) => ({ value: m.id, label: m.title }))}
                                    value={allMenus.find((m) => m.id === Number(data.parent_id)) ? { value: Number(data.parent_id), label: allMenus.find((m) => m.id === Number(data.parent_id))?.title } : null}
                                    onChange={(option) => setData('parent_id', option && !Array.isArray(option) ? (option as { value: number }).value : null)}
                                    placeholder="Select parent"
                                />
                                <InputError message={errors.parent_id} />
                            </div>
                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {isEdit ? 'Update' : 'Create'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={route('menus.manage')}>Cancel</Link>
                                </Button>
                            </div>
                        </form>
                </div>
            </PageContainer>
        </AppLayout>
    );
}
