/**
 * Main Type Entry Point
 * Re-exports all domain-specific types for convenient importing
 */

// Authentication & User Types
export type { Auth, Permission, ProfileImage, Role, User } from './auth';

// Navigation Types
export type { BreadcrumbItem, MenuItem, NavGroup, NavItem } from './navigation';

// Gallery & Media Types
export type { FileManagerFolder, GalleryProps, MediaItem, PaginationLink } from './gallery';

// Application Types
export type { AppSetting, FlashMessage, SharedData, SocialLinks } from './app';

// DataTable Types (keep existing comprehensive types)
export type {
    AjaxConfig,
    ConfirmationConfig,
    DataTableColumn,
    DataTableOptions,
    DataTableWrapperProps,
    DataTableWrapperRef,
    ExpandConfig,
    RenderFunction,
} from './DataTables';

export interface InertiaPaginated<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}
