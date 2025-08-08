import * as React from 'react';
import { router, Head, Link, useForm } from '@inertiajs/react';
import ConfirmationDialog from '@/components/confirmation-dialog';
import { useConfirmation } from '@/hooks/use-confirmation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Lock, Globe2 } from 'lucide-react';
import CustomSelect from '../components/select';
import { toast } from '@/utils/toast';

interface MediaItem {
    id: number;
    file_name: string;
    name: string;
    original_url: string;
    disk: 'public' | 'private';
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
    const { confirmationState, openConfirmation, handleConfirm, handleCancel } = useConfirmation();

    const { data, setData, post, processing, reset } = useForm({
        file: null as File | null,
        visibility: visibility
    });

    const handleDelete = (id: number, fileName: string) => {
        openConfirmation({
            title: 'Konfirmasi Hapus File',
            message: `Apakah Anda yakin ingin menghapus file <b>${fileName}</b>?`,
            confirmText: 'Hapus',
            cancelText: 'Batal',
            variant: 'destructive',
            onConfirm: () => {
                router.delete(route('gallery.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('File berhasil dihapus');
                        router.reload();
                    },
                    onError: () => {
                        toast.error('Gagal menghapus file');
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
                    toast.success('File berhasil diunggah');
                    reset();
                    router.reload();
                },
                onError: () => {
                    toast.error('Gagal mengunggah file');
                }
            });
        }
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'File Manager', href: '/dashboard/gallery' },
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
                            <Link href={route('gallery.index', { visibility: 'public' })} preserveScroll>Publik</Link>
                        </Button>
                        <Button asChild variant={visibility === 'private' ? 'default' : 'secondary'} size="sm">
                            <Link href={route('gallery.index', { visibility: 'private' })} preserveScroll>Privat</Link>
                        </Button>
                    </div>
                </div>

                <form onSubmit={submitUpload} className="flex items-center gap-2 mb-4">
                    <input
                        type="file"
                        onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                        required
                    />
                    <CustomSelect
                        value={{ value: data.visibility, label: data.visibility === 'public' ? 'Publik' : 'Privat' }}
                        className="rounded border px-2 py-1"
                        options={[
                            { value: 'public', label: 'Publik' },
                            { value: 'private', label: 'Privat' }
                        ]}
                        onChange={(option) => {
                            if (option && !Array.isArray(option) && typeof option === 'object' && 'value' in option) {
                                setData('visibility', option.value as 'public' | 'private');
                            }
                        }}
                    />
                    <Button type="submit" disabled={processing}>Upload</Button>
                </form>

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
                                        <span className="text-xs font-semibold text-muted-foreground">
                                            {item.disk === 'public' ? 'Publik' : 'Privat'}
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
                                        {item.disk === 'public'
                                            ? `/storage/${item.file_name}`
                                            : `Privat file`}
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(item.id, item.file_name)}
                                        className="w-full"
                                    >
                                        Hapus
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
        </AppLayout>
    );
}
