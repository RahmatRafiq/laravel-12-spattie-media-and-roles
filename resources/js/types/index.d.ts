/**
 * Main Type Entry Point
 * Re-exports all domain-specific types for convenient importing
 */

// Authentication & User Types
export type {
    User,
    ProfileImage,
    Auth,
    Role,
    Permission,
} from './auth';

// Navigation Types
export type {
    NavItem,
    NavGroup,
    BreadcrumbItem,
    MenuItem,
} from './navigation';

// Gallery & Media Types
export type {
    MediaItem,
    FileManagerFolder,
    PaginationLink,
    GalleryProps,
} from './gallery';

// Application Types
export type {
    AppSetting,
    SocialLinks,
    SharedData,
    FlashMessage,
} from './app';

// DataTable Types (keep existing comprehensive types)
export type {
    RenderFunction,
    AjaxConfig,
    ExpandConfig,
    ConfirmationConfig,
    DataTableColumn,
    DataTableOptions,
    DataTableWrapperProps,
    DataTableWrapperRef,
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
