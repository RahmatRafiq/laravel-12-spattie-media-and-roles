import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Activity, FileText, Github, Key, LayoutDashboard, Settings, Shield, UserCheck, Users, type LucideIcon } from 'lucide-react';
import AppLogo from './app-logo';
import { usePage } from '@inertiajs/react';

type MenuItem = {
    id: number;
    title: string;
    route?: string | null;
    icon?: string | null;
    permission?: string | null;
    parent_id?: number | null;
    order?: number;
    children?: MenuItem[];
};

const iconMap: Record<string, LucideIcon> = {
    LayoutDashboard,
    Activity,
    Users,
    Shield,
    Key,
    UserCheck,
    Settings,
    FileText,
    Github,
};

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
        icon: menu.icon && iconMap[menu.icon] ? iconMap[menu.icon] : undefined,
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
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
