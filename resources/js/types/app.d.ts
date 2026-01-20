/**
 * Application-wide Types
 * Domain: App settings, shared data, global configurations
 */

import type { Config } from 'ziggy-js';
import type { Auth } from './auth';

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
    social_links?: SocialLinks;
    maintenance_mode: boolean;
    maintenance_message?: string;
}

export interface SocialLinks {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
}

export interface SharedData {
    name: string;
    env: string;
    isLocalEnv: boolean;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    appSettings?: AppSetting;
    flash?: FlashMessage;
    [key: string]: unknown;
}

export interface FlashMessage {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}
