import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem, type MenuItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { FileText, Github } from 'lucide-react';
import AppLogo from './app-logo';
import { getIcon } from '@/lib/icon-registry';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Github,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
        icon: FileText,
    },
];

function mapMenuToNavItem(menu: MenuItem): NavItem {
    return {
        title: menu.title,
        href: menu.route ? route(menu.route) : '#',
        icon: menu.icon ? getIcon(menu.icon) : undefined,
        children: menu.children ? menu.children.map(mapMenuToNavItem) : undefined,
    };
}

export function AppSidebar() {
    const { sidebarMenus = [] } = usePage().props as { sidebarMenus?: MenuItem[] };
    const navItems = (sidebarMenus ?? []).map(mapMenuToNavItem);
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('dashboard')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
