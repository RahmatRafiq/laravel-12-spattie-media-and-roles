/**
 * Gallery & Media Types
 * Domain: File manager, media items, folders, galleries
 */

export interface MediaItem {
    id: number;
    file_name: string;
    name: string;
    original_url: string;
    disk: string;
    collection_name: string;
    size?: number;
    mime_type?: string;
    custom_properties?: Record<string, unknown>;
}

export interface FileManagerFolder {
    id: number;
    name: string;
    parent_id: number | null;
    path?: string | null;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface GalleryProps {
    media: {
        data: MediaItem[];
        links?: PaginationLink[];
    };
    visibility: 'public' | 'private';
    collections: string[];
    selected_collection?: string | null;
}
