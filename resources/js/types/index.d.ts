import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    children?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    profile_image?: {
        file_name: string;
        size: number;
        original_url: string;
    };
    [key: string]: unknown; // This allows for additional properties...
}

export interface AppSetting {
    id: number;
    app_name: string;
    app_description?: string;
    app_logo?: string;
    app_favicon?: string;
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
    seo_og_image?: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    theme_mode: string;
    contact_email?: string;
    contact_phone?: string;
    contact_address?: string;
    social_links?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
        youtube?: string;
    };
    maintenance_mode: boolean;
    maintenance_message?: string;
}
