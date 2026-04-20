import PrivateImage from '@/components/PrivateImage';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
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
            <Card className="col-span-full flex h-40 items-center justify-center">
                <CardContent className="text-center">No files yet.</CardContent>
            </Card>
        );
    }
    return (
        <>
            {media.map((item) => (
                <Card key={item.id} className="flex flex-col items-center p-2">
                    <CardHeader className="flex w-full flex-col items-center gap-1">
                        <div className="flex items-center gap-1">
                            {item.disk === 'public' || item.disk.includes('profile-images') ? (
                                <Globe2 className="h-4 w-4 text-blue-500" />
                            ) : (
                                <Lock className="h-4 w-4 text-gray-500" />
                            )}
                            <span className="text-muted-foreground text-xs font-semibold">
                                {item.disk === 'public' || item.disk.includes('profile-images') ? 'Public' : 'Private'}
                            </span>
                        </div>
                        <CardTitle className="w-full text-center text-xs break-all">{item.file_name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex w-full flex-col items-center">
                        {/* Use PrivateImage for private files, regular img for public files */}
                        {item.disk === 'public' || item.disk.includes('profile-images') ? (
                            <img
                                src={item.original_url}
                                alt={item.name}
                                className="mb-2 h-32 w-full rounded border object-cover"
                                onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                            />
                        ) : (
                            <PrivateImage
                                src={item.original_url}
                                alt={item.name}
                                className="mb-2 h-32 w-full rounded border object-cover"
                                onError={() => console.error(`Failed to load private image: ${item.file_name}`)}
                            />
                        )}
                        <div className="text-muted-foreground mb-2 w-full text-center text-[10px] break-all">{item.original_url}</div>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id, item.file_name)} className="w-full">
                            Delete
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}
