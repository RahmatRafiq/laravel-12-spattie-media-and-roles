import Heading from '../../components/heading';
import { Button } from '@/components/ui/button';
import { Globe2, Lock } from 'lucide-react';
import { router } from '@inertiajs/react';

interface GalleryHeaderProps {
    currentVisibility: 'public' | 'private';
}

export default function GalleryHeader({ currentVisibility }: GalleryHeaderProps) {
    const handleVisibilityChange = (newVisibility: 'public' | 'private') => {
        router.get(route('gallery.index'), { visibility: newVisibility }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="w-full sm:w-auto">
                <Heading title="File Manager" />
                <p className="text-muted-foreground text-sm">Manage public and private files in your application</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <Button
                    variant={currentVisibility === 'public' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleVisibilityChange('public')}
                    className="flex-1 sm:flex-none"
                >
                    <Globe2 className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Public Files</span>
                    <span className="sm:hidden">Public</span>
                </Button>
                <Button
                    variant={currentVisibility === 'private' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleVisibilityChange('private')}
                    className="flex-1 sm:flex-none"
                >
                    <Lock className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Private Files</span>
                    <span className="sm:hidden">Private</span>
                </Button>
            </div>
        </div>
    );
}
