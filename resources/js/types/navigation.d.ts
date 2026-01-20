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
