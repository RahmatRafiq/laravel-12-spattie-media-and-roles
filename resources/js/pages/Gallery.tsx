
import * as React from 'react';
import { router, Head, Link } from '@inertiajs/react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Lock, Globe2 } from 'lucide-react';

interface MediaItem {
    id: number;
    file_name: string;
    name: string;
    original_url: string;
    disk: 'public' | 'local';
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
}

export default function Gallery({ media, visibility }: GalleryProps) {
    const [deleteId, setDeleteId] = React.useState<number | null>(null);
    const [open, setOpen] = React.useState(false);

    const handleDelete = (id: number) => {
        setDeleteId(id);
        setOpen(true);
    };

    const confirmDelete = () => {
        if (deleteId !== null) {
            router.delete(route('admin.gallery.destroy', deleteId));
            setOpen(false);
            setDeleteId(null);
        }
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'File Manager', href: '/admin/gallery' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="File Manager" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">File Manager</h1>
                        <p className="text-muted-foreground">Kelola file publik dan privat di aplikasi Anda</p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant={visibility === 'public' ? 'default' : 'secondary'} size="sm">
                            <Link href={route('admin.gallery.index', { visibility: 'public' })} preserveScroll>Publik</Link>
                        </Button>
                        <Button asChild variant={visibility === 'private' ? 'default' : 'secondary'} size="sm">
                            <Link href={route('admin.gallery.index', { visibility: 'private' })} preserveScroll>Privat</Link>
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {media.data.length === 0 ? (
                        <Card className="col-span-full flex items-center justify-center h-40">
                            <CardContent className="text-center">Belum ada file.</CardContent>
                        </Card>
                    ) : (
                        media.data.map((item) => (
                            <Card key={item.id} className="flex flex-col items-center p-2">
                                <CardHeader className="w-full flex flex-col items-center gap-1">
                                    <div className="flex items-center gap-1">
                                        {item.disk === 'public' ? (
                                            <Globe2 className="h-4 w-4 text-blue-500" />
                                        ) : (
                                            <Lock className="h-4 w-4 text-gray-500" />
                                        )}
                                        <span className="text-xs font-semibold text-muted-foreground">{item.disk === 'public' ? 'Publik' : 'Privat'}</span>
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
                                        {item.disk === 'public'
                                            ? `/storage/${item.file_name}`
                                            : `/private/${item.file_name}`}
                                    </div>
                                    <AlertDialog open={open && deleteId === item.id} onOpenChange={setOpen}>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(item.id)}
                                                className="w-full"
                                            >
                                                Hapus
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Yakin ingin menghapus file <b>{item.file_name}</b>?
                                            </AlertDialogDescription>
                                            <div className="flex justify-end gap-2 mt-4">
                                                <AlertDialogCancel asChild>
                                                    <Button variant="secondary">Batal</Button>
                                                </AlertDialogCancel>
                                                <AlertDialogAction asChild>
                                                    <Button variant="destructive" onClick={confirmDelete}>Hapus</Button>
                                                </AlertDialogAction>
                                            </div>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
                <div className="mt-4">
                    {/* Pagination (jika ada) */}
                    {media.links && (
                        <div className="flex gap-2">
                            {media.links.map((link, i) => (
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={`rounded px-2 py-1 ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                        preserveScroll
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        className={`rounded px-2 py-1 ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
