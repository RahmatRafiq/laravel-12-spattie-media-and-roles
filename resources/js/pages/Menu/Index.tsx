import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import TreeDnD from '@/components/TreeDnD';

import { toast } from '@/utils/toast';
import { Pencil } from 'lucide-react';





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

function renderMenuItem(item: MenuTreeItem) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 mb-2 shadow-sm hover:bg-accent/20 transition-all group min-h-[48px]">
            <span className="cursor-move text-muted-foreground text-xl select-none">≡</span>
            <span className="font-semibold text-base text-foreground truncate max-w-[180px]">{item.title}</span>
            {item.route && <span className="text-xs text-muted-foreground ml-1">({item.route})</span>}
            {item.permission && <span className="text-xs bg-muted px-2 py-0.5 rounded ml-1">{item.permission}</span>}
            <div className="flex-1" />
            <Link
                className="btn btn-xs btn-outline ml-2"
                title="Edit Menu"
                href={route('menus.edit', item.id)}
            >
                <Pencil size={16} />
            </Link>
        </div>
    );
}


function MenuIndexPage() {
    const { menus, success } = (usePage().props as unknown) as { menus: MenuTreeItem[], success?: string };
    const [tree, setTree] = React.useState<MenuTreeItem[]>(menus);
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        setTree(menus);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    function normalizeTree(items: MenuTreeItem[]): MenuTreeItem[] {
        return items.map(item => ({
            ...item,
            children: Array.isArray(item.children) && item.children.length > 0
                ? normalizeTree(item.children)
                : [],
        }));
    }

    const handleSaveOrder = async () => {
        setSaving(true);
        try {
            const normalized = normalizeTree(tree);
            await router.post(route('menus.updateOrder'), { tree: JSON.stringify(normalized) }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    if (typeof page.props.success === 'string') toast.success(page.props.success);
                    else toast.success('Urutan menu berhasil disimpan.');
                },
                onError: () => {
                    toast.error('Gagal menyimpan urutan menu.');
                },
                onFinish: () => {
                    setSaving(false);
                },
                only: [],
            });
        } catch {
            toast.error('Gagal menyimpan urutan menu.');
            setSaving(false);
        }
    };
    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Menu Management', href: '#' }]}>
            <Head title="Menu Management" />
            <div className="px-4 py-6">
                <Heading title="Menu Management" description="Manage your application's navigation menu structure." />
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <HeadingSmall title="Menu List" description="View and organize your application's menus." />
                        <Link href={route('menus.create')} className="ml-4">
                            <Button type="button" size="sm" className="font-semibold">
                                + Add Menu
                            </Button>
                        </Link>
                    </div>
                    {success && <div className="mb-2 text-green-600 text-sm font-medium">{success}</div>}
                    <div className="flex justify-end mb-2">
                        <Button
                            type="button"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={handleSaveOrder}
                            disabled={saving}
                        >
                            {saving && (
                                <svg className="animate-spin h-4 w-4 mr-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                            )}
                            {saving ? 'Saving Order...' : 'Save Order'}
                        </Button>
                    </div>
                    <div className="bg-white dark:bg-card rounded shadow p-4 mt-2 border border-border">
                        <TreeDnD
                            items={tree}
                            onChange={setTree}
                            getId={item => item.id}
                            getChildren={item => item.children}
                            setChildren={(item, children) => ({ ...item, children })}
                            renderItem={renderMenuItem}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default MenuIndexPage;
