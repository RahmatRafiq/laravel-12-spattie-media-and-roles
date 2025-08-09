interface MediaItem {
    id: number;
    file_name: string;
    name: string;
    original_url: string;
    disk: string;
    collection_name: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface GalleryProps {
    media: {
        data: MediaItem[];
        links?: PaginationLink[];
    };
    visibility: 'public' | 'private';
    collections: string[];
    selected_collection?: string | null;
}