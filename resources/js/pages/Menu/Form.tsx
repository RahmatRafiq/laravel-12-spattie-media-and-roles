import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { FormEvent } from 'react';
import type { MenuTreeItem } from './Index';
import CustomSelect from '@/components/select';

interface MenuFormProps {
    menu?: MenuTreeItem;
    allMenus: MenuTreeItem[];
}

export default function MenuFormPage({ menu, allMenus }: MenuFormProps) {
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
            <div className="px-4 py-6">
                <h1 className="mb-4 text-2xl font-semibold">Menu Management</h1>
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                    <div className="w-full max-w-xl lg:w-48"></div>
                    <div className="flex-1 space-y-6 md:max-w-2xl">
                        <HeadingSmall title={isEdit ? 'Edit Menu' : 'Create Menu'} description="Fill in the menu details below" />
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={data.title ?? ''} onChange={e => setData('title', e.target.value)} required />
                                <InputError message={errors.title} />
                            </div>
                            <div>
                                <Label htmlFor="route">Route</Label>
                                <Input id="route" value={data.route ?? ''} onChange={e => setData('route', e.target.value)} />
                                <InputError message={errors.route} />
                            </div>
                            <div>
                                <Label htmlFor="icon">Icon (lucide name)</Label>
                                <Input id="icon" value={data.icon ?? ''} onChange={e => setData('icon', e.target.value)} />
                                <InputError message={errors.icon} />
                            </div>
                            <div>
                                <Label htmlFor="permission">Permission</Label>
                                <Input id="permission" value={data.permission ?? ''} onChange={e => setData('permission', e.target.value)} />
                                <InputError message={errors.permission} />
                            </div>
                            <div>
                                <Label htmlFor="parent_id">Parent Menu</Label>
                                <CustomSelect
                                    inputId="parent_id"
                                    isClearable
                                    options={allMenus.map((m) => ({ value: m.id, label: m.title }))}
                                    value={allMenus.find((m) => m.id === Number(data.parent_id)) ? { value: Number(data.parent_id), label: allMenus.find((m) => m.id === Number(data.parent_id))?.title } : null}
                                    onChange={option => setData('parent_id', option && !Array.isArray(option) ? (option as { value: number }).value : null)}
                                    placeholder="Select parent"
                                />
                                <InputError message={errors.parent_id} />
                            </div>
                            <div className="flex items-center space-x-4">
                                <Button type="submit" disabled={processing}>{isEdit ? 'Update' : 'Create'}</Button>
                                <Link href={route('menus.manage')} className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400">
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
