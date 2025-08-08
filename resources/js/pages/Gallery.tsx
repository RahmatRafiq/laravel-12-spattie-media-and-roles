import * as React from 'react';
import { router, Head, Link, useForm } from '@inertiajs/react';
import ConfirmationDialog from '@/components/confirmation-dialog';
import { useConfirmation } from '@/hooks/use-confirmation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Lock, Globe2, Folder, FolderOpen } from 'lucide-react';
import CustomSelect from '../components/select';
import { toast } from '@/utils/toast';

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

export default function Gallery({ media, visibility, collections, selected_collection }: GalleryProps) {
    const { confirmationState, openConfirmation, handleConfirm, handleCancel } = useConfirmation();

    const { data, setData, post, processing, reset } = useForm({
        file: null as File | null,
        visibility: visibility,
        collection_name: selected_collection || '',
    });

    const handleDelete = (id: number, fileName: string) => {
        openConfirmation({
            title: 'Delete File Confirmation',
            message: `Are you sure you want to delete the file <b>${fileName}</b>?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'destructive',
            onConfirm: () => {
                router.delete(route('gallery.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('File deleted successfully');
                        router.reload();
                    },
                    onError: () => {
                        toast.error('Failed to delete file');
                    }
                });
            },
        });
    };

    const submitUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.file) {
            post(route('gallery.store'), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('File uploaded successfully');
                    reset();
                    router.reload();
                },
                onError: () => {
                    toast.error('Failed to upload file');
                }
            });
        }
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'File Manager', href: '/dashboard/gallery' },
    ];

    const handleFilterChange = (field: 'collection_name' | 'visibility', value: string) => {
        const params = {
            visibility: field === 'visibility' ? value : data.visibility,
            collection_name: field === 'collection_name' ? value : data.collection_name,
        };
        router.visit(route('gallery.index', params), { preserveScroll: true });
    };

    const groupedCollections = React.useMemo(() => {
        const groups: { [key: string]: string[] } = { public: [], private: [] };
        collections.forEach((col) => {
            if (col.startsWith('public:')) {
                groups.public.push(col.replace(/^public:/, ''));
            } else if (col.startsWith('private:')) {
                groups.private.push(col.replace(/^private:/, ''));
            } else {
                groups[visibility].push(col);
            }
        });
        return groups;
    }, [collections, visibility]);

    const [openAccordion, setOpenAccordion] = React.useState<'public' | 'private'>(visibility);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="File Manager" />
            <div className="flex flex-row gap-4 p-4">
                <aside className="w-56 min-w-[180px] border-r pr-4">
                    <div className="mb-2 font-semibold text-sm text-muted-foreground">Folders</div>
                    <ul className="space-y-1">
                        {(['public', 'private'] as const).map((disk) => (
                            <li key={disk}>
                                <button
                                    className={`w-full text-left px-3 py-2 rounded hover:bg-muted/70 transition text-sm font-bold ${openAccordion === disk ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
                                    onClick={() => {
                                        setOpenAccordion(disk);
                                        handleFilterChange('visibility', disk);
                                    }}
                                >
                                    <span className="inline-block align-middle mr-2">
                                        {disk === 'public' ? <Globe2 className="inline w-4 h-4 align-middle" /> : <Lock className="inline w-4 h-4 align-middle" />}
                                    </span>
                                    {disk.charAt(0).toUpperCase() + disk.slice(1)}
                                </button>
                                {openAccordion === disk && (
                                    <ul className="ml-4 mt-1 space-y-1">
                                        <li>
                                            <button
                                                className={`w-full text-left px-3 py-2 rounded hover:bg-muted/70 transition text-sm ${!data.collection_name ? 'bg-muted font-bold text-foreground' : ''}`}
                                                onClick={() => handleFilterChange('collection_name', '')}
                                            >
                                                <span className="inline-block align-middle mr-2">
                                                    <FolderOpen className="inline w-4 h-4 align-middle" />
                                                </span>
                                                All Collections
                                            </button>
                                        </li>
                                        {groupedCollections[disk].map((col) => (
                                            <li key={col}>
                                                <button
                                                    className={`w-full text-left px-3 py-2 rounded hover:bg-muted/70 transition text-sm ${data.collection_name === col ? 'bg-muted font-bold text-foreground' : ''}`}
                                                    onClick={() => handleFilterChange('collection_name', col)}
                                                >
                                                    <span className="inline-block align-middle mr-2">
                                                        <Folder className="inline w-4 h-4 align-middle" />
                                                    </span>
                                                    {col}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </aside>
                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">File Manager</h1>
                            <p className="text-muted-foreground">Manage public and private files in your application</p>
                        </div>
                    </div>
                    <form onSubmit={submitUpload} className="flex items-center gap-2 mb-4">
                        <input
                            type="file"
                            onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                            required
                        />
                        <CustomSelect
                            value={{ value: data.visibility, label: data.visibility === 'public' ? 'Public' : 'Private' }}
                            className="rounded border px-2 py-1"
                            options={[
                                { value: 'public', label: 'Public' },
                                { value: 'private', label: 'Private' }
                            ]}
                            onChange={(option) => {
                                if (option && !Array.isArray(option) && typeof option === 'object' && 'value' in option) {
                                    setData('visibility', option.value as 'public' | 'private');
                                }
                            }}
                        />
                        <CustomSelect
                            value={collections && data.collection_name ? { value: data.collection_name, label: data.collection_name } : null}
                            className="rounded border px-2 py-1 min-w-[120px]"
                            options={collections.map((c) => ({ value: c, label: c }))}
                            onChange={(option) => {
                                if (option && !Array.isArray(option) && typeof option === 'object' && 'value' in option) {
                                    setData('collection_name', option.value);
                                }
                            }}
                            placeholder="Collection"
                            isClearable
                        />
                        <Button type="submit" disabled={processing}>Upload</Button>
                    </form>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {media.data.length === 0 ? (
                            <Card className="col-span-full flex items-center justify-center h-40">
                                <CardContent className="text-center">No files yet.</CardContent>
                            </Card>
                        ) : (
                            media.data.map((item) => (
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
                                        <img
                                            src={item.original_url}
                                            alt={item.name}
                                            className="mb-2 h-32 w-full rounded object-cover border"
                                            onError={e => ((e.target as HTMLImageElement).style.display = 'none')}
                                        />
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
                            ))
                        )}
                    </div>
                    <ConfirmationDialog
                        state={confirmationState}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                    />
                    {media.links && (
                        <div className="mt-4 flex gap-2">
                            {media.links.map((link, i) =>
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
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
