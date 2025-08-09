import * as React from 'react';
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
                        <Link
                            href={link.url}
                            preserveScroll
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    </Button>
                ) : (
                    <Button
                        key={i}
                        variant={link.active ? "default" : "secondary"}
                        size="sm"
                        className="px-2 py-1"
                        disabled
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            )}
        </div>
    );
}
