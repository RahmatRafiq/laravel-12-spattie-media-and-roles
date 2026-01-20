/**
 * Navigation & Menu Types
 * Domain: Menu items, breadcrumbs, sidebar navigation
 */

import { LucideIcon } from 'lucide-react';

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    children?: NavItem[];
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface MenuItem {
    id: number;
    title: string;
    route?: string | null;
    icon?: string | null;
    permission?: string | null;
    parent_id?: number | null;
    order?: number;
    children?: MenuItem[];
}
