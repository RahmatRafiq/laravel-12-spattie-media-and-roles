import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PrivateImage from '@/components/private-image';
import { Globe2, Lock } from 'lucide-react';

interface MediaItem {
    id: number;
    file_name: string;
    name: string;
    original_url: string;
    disk: string;
    collection_name: string;
}

interface GalleryGridProps {
    media: MediaItem[];
    handleDelete: (id: number, fileName: string) => void;
}

export default function GalleryGrid({ media, handleDelete }: GalleryGridProps) {
    if (media.length === 0) {
        return (
            <Card className="col-span-full flex items-center justify-center h-40">
                <CardContent className="text-center">No files yet.</CardContent>
            </Card>
        );
    }
    return (
        <>
            {media.map((item) => (
                <Card key={item.id} className="flex flex-col items-center p-2">
                    <CardHeader className="w-full flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1">
                            {(item.disk === 'public' || item.disk.includes('profile-images')) ? (
                                <Globe2 className="h-4 w-4 text-blue-500" />
                            ) : (
                                <Lock className="h-4 w-4 text-gray-500" />
                            )}
                            <span className="text-xs font-semibold text-muted-foreground">
                                {(item.disk === 'public' || item.disk.includes('profile-images')) ? 'Public' : 'Private'}
                            </span>
                        </div>
                        <CardTitle className="text-xs break-all text-center w-full">{item.file_name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center w-full">
                        {/* Use PrivateImage for private files, regular img for public files */}
                        {item.disk === 'public' || item.disk.includes('profile-images') ? (
                            <img
                                src={item.original_url}
                                alt={item.name}
                                className="mb-2 h-32 w-full rounded object-cover border"
                                onError={e => ((e.target as HTMLImageElement).style.display = 'none')}
                            />
                        ) : (
                            <PrivateImage
                                src={item.original_url}
                                alt={item.name}
                                className="mb-2 h-32 w-full rounded object-cover border"
                                onError={() => console.error(`Failed to load private image: ${item.file_name}`)}
                            />
                        )}
                        <div className="mb-2 w-full text-[10px] text-muted-foreground break-all text-center">
                            {item.original_url}
                        </div>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item.id, item.file_name)}
                            className="w-full"
                        >
                            Delete
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}
