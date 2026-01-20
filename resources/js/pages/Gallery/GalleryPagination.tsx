import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface GalleryPaginationProps {
    links: PaginationLink[];
}

export default function GalleryPagination({ links }: GalleryPaginationProps) {
    if (!links) return null;

    // SECURITY: Sanitize label to prevent XSS
    const sanitizeLabel = (label: string): string => {
        // Laravel pagination typically uses &laquo; &raquo; for arrows
        // Convert HTML entities to text
        return label
            .replace(/&laquo;/g, '«')
            .replace(/&raquo;/g, '»')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/<[^>]*>/g, ''); // Remove any HTML tags
    };

    return (
        <div className="mt-4 flex gap-2">
            {links.map((link, i) =>
                link.url ? (
                    <Button
                        asChild
                        key={i}
                        variant={link.active ? "default" : "secondary"}
                        size="sm"
                        className="px-2 py-1"
                    >
                        <Link href={link.url} preserveScroll>
                            {sanitizeLabel(link.label)}
                        </Link>
                    </Button>
                ) : (
                    <Button
                        key={i}
                        variant={link.active ? "default" : "secondary"}
                        size="sm"
                        className="px-2 py-1"
                        disabled
                    >
                        {sanitizeLabel(link.label)}
                    </Button>
                )
            )}
        </div>
    );
}
