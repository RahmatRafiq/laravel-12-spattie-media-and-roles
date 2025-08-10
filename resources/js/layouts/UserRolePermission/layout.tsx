import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem, type BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    { title: 'User List', href: route('users.index'), icon: null },
    { title: 'Role Management', href: route('roles.index'), icon: null },
    { title: 'Permission Management', href: route('permissions.index'), icon: null },
];

export default function UserRolePermissionLayout({
    children,
    title,
    description,
    active,
}: PropsWithChildren<{ breadcrumbs: BreadcrumbItem[]; title: string; description?: string; active?: string }>) {
    if (typeof window === 'undefined') return null;
    const currentPath = window.location.pathname;
    return (
        <div className="px-4 py-6">
            <Heading title={title} description={description} />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1">
                        {sidebarNavItems.map((item) => (
                            <Button
                                key={item.href}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === item.href || active === item.title,
                                })}
                            >
                                <Link href={item.href}>{item.title}</Link>
                            </Button>
                        ))}
                    </nav>
                </aside>
                <Separator className="my-6 md:hidden" />
                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}