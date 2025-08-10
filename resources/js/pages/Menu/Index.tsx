import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, Link } from '@inertiajs/react';
import { GripVertical, Pencil } from 'lucide-react';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';

export interface MenuTreeItem {
    id: number;
    title: string;
    route?: string | null;
    icon?: string | null;
    permission?: string | null;
    parent_id?: number | null;
    order?: number;
    children?: MenuTreeItem[];
}

function MenuTree({ items }: { items: MenuTreeItem[] }) {
    if (!items || items.length === 0) {
        return <div className="text-muted-foreground text-sm">No menu found.</div>;
    }
    return (
        <ul className="pl-0">
            {items.map((item) => (
                <li key={item.id} className="mb-1">
                    <div className="flex items-center gap-2 rounded border border-border bg-background px-2 py-1 hover:bg-accent/30 transition group">
                        <span className="cursor-move text-muted-foreground"><GripVertical size={16} /></span>
                        {/* TODO: Render icon if available */}
                        <span className="font-medium text-foreground">{item.title}</span>
                        {item.route && <span className="text-xs text-muted-foreground">({item.route})</span>}
                        {item.permission && <span className="text-xs bg-muted px-1 rounded">{item.permission}</span>}
                        <Link
                            className="btn btn-xs btn-outline ml-1"
                            title="Edit Menu"
                            href={route('menus.edit', item.id)}
                        ><Pencil size={14} /></Link>
                    </div>
                    {item.children && item.children.length > 0 && (
                        <div className="ml-6 mt-1">
                            <MenuTree items={item.children} />
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
}

export default function MenuManage() {
    const { menus, success } = (usePage().props as unknown) as { menus: MenuTreeItem[], success?: string };
    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Menu Management', href: '#' }]}>
            <Head title="Menu Management" />
            <div className="px-4 py-6">
                <Heading title="Menu Management" description="Manage your application's navigation menu structure." />
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <HeadingSmall title="Menu List" description="View and organize your application's menus." />
                        <Link className="btn btn-primary btn-sm ml-4" href={route('menus.create')}>+ Add Menu</Link>
                    </div>
                    {success && <div className="mb-2 text-green-600 text-sm font-medium">{success}</div>}
                    <div className="bg-card rounded shadow p-4 mt-2">
                        <MenuTree items={menus} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
