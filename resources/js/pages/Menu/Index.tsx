import Heading from '@/components/Heading';
import HeadingSmall from '@/components/HeadingSmall';
import PageContainer from '@/components/PageContainer';
import TreeDnD from '@/components/TreeDnD';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useResourceActions } from '@/hooks/use-resource-actions';
import AppLayout from '@/layouts/AppLayout';
import { toast } from '@/utils/toast';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import React from 'react';

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

function MenuIndexPage() {
    const { deleteResource } = useResourceActions();

    const handleDeleteMenu = (id: number) => {
        deleteResource({
            url: route('menus.destroy', id),
            resourceName: 'Menu',
        });
    };

    const renderMenuItem = (item: MenuTreeItem) => (
        <div className="border-border bg-background hover:bg-accent/20 group mb-2 flex min-h-[48px] flex-col gap-2 rounded-lg border px-3 py-3 shadow-sm transition-all sm:flex-row sm:items-center sm:gap-3 sm:px-4">
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                <span className="text-muted-foreground flex-shrink-0 cursor-move text-xl select-none">≡</span>
                <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                    <span className="text-foreground truncate text-sm font-semibold sm:text-base">{item.title}</span>
                    {item.route && <span className="text-muted-foreground truncate text-xs">({item.route})</span>}
                    {item.permission && <span className="bg-muted inline-block w-fit rounded px-2 py-0.5 text-xs">{item.permission}</span>}
                </div>
            </div>
            <div className="ml-auto flex gap-2 self-end sm:ml-0 sm:self-auto">
                <Link href={route('menus.edit', item.id)} title="Edit Menu">
                    <Button type="button" size="icon" variant="outline" className="h-8 w-8" aria-label="Edit Menu">
                        <Pencil size={16} />
                    </Button>
                </Link>
                <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    title="Delete Menu"
                    aria-label="Delete Menu"
                    onClick={() => handleDeleteMenu(item.id)}
                >
                    <Trash2 size={16} />
                </Button>
            </div>
        </div>
    );

    const { menus, success } = usePage().props as unknown as { menus: MenuTreeItem[]; success?: string };
    const [tree, setTree] = React.useState<MenuTreeItem[]>(menus);
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        setTree(menus);
    }, [menus]);

    function normalizeTree(items: MenuTreeItem[]): MenuTreeItem[] {
        return items.map((item) => ({
            ...item,
            children: Array.isArray(item.children) && item.children.length > 0 ? normalizeTree(item.children) : [],
        }));
    }

    const handleSaveOrder = async () => {
        setSaving(true);
        try {
            const normalized = normalizeTree(tree);
            await router.post(
                route('menus.updateOrder'),
                { tree: JSON.stringify(normalized) },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: (page) => {
                        if (typeof page.props.success === 'string') toast.success(page.props.success);
                        else toast.success('Menu order saved successfully.');
                    },
                    onError: () => {
                        toast.error('Failed to save menu order.');
                    },
                    onFinish: () => {
                        setSaving(false);
                    },
                },
            );
        } catch {
            toast.error('Failed to save menu order.');
            setSaving(false);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Menu Management', href: '#' },
            ]}
        >
            <Head title="Menu Management" />
            <PageContainer maxWidth="full">
                <Heading title="Menu Management" description="Manage your application's navigation menu structure." />
                <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <HeadingSmall title="Menu List" description="View and organize your application's menus." />
                    <Link href={route('menus.create')} className="w-full sm:w-auto">
                        <Button type="button" size="sm" className="w-full font-semibold sm:w-auto">
                            + Add Menu
                        </Button>
                    </Link>
                </div>
                {success && <div className="mb-2 text-sm font-medium text-green-600">{success}</div>}
                <div className="mb-2 flex justify-end">
                    <Button type="button" size="sm" className="flex items-center gap-2" onClick={handleSaveOrder} disabled={saving}>
                        {saving && (
                            <svg className="mr-1 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                        )}
                        {saving ? 'Saving Order...' : 'Save Order'}
                    </Button>
                </div>
                <Card>
                    <CardContent className="p-4">
                        <TreeDnD
                            items={tree}
                            onChange={setTree}
                            getId={(item) => item.id}
                            getChildren={(item) => item.children}
                            setChildren={(item, children) => ({ ...item, children })}
                            renderItem={renderMenuItem}
                        />
                    </CardContent>
                </Card>
            </PageContainer>
        </AppLayout>
    );
}

export default MenuIndexPage;
