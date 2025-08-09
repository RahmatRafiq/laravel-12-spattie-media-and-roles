import React from 'react';
import Sidebar, { FilemanagerFolder } from './Sidebar';
import GalleryHeader from './GalleryHeader';
import GalleryUploadForm from './GalleryUploadForm';
import GalleryGrid from './GalleryGrid';
import GalleryPagination from './GalleryPagination';
import AppLayout from '../../layouts/app-layout';
import { Head, router, useForm, useRemember } from '@inertiajs/react';
import { toast } from '../../utils/toast';
import ConfirmationDialog from '../../components/confirmation-dialog';
import { useConfirmation } from '../../hooks/use-confirmation';

export default function Gallery({
    media,
    visibility,
    selected_collection,
    folders = [],
    selected_folder_id = null,
}: GalleryProps & { folders?: FilemanagerFolder[]; selected_folder_id?: number | null }) {
    const { confirmationState, openConfirmation, handleConfirm, handleCancel } = useConfirmation();

    const { data, setData, post, processing, reset } = useForm<{
        file: File | null;
        visibility: 'public' | 'private';
        collection_name: string;
    }>({
        file: null,
        visibility: visibility,
        collection_name: selected_collection || '',
    });

    const [currentFolderId, setCurrentFolderId] = React.useState<number | null>(selected_folder_id ?? null);

    const [expanded, setExpanded] = useRemember<{ [id: number]: boolean }>(
        {},
        'gallery-folders-expanded'
    );

    const createFolder = async (name: string, parent_id: number | null = null) => {
        await router.post(
            route('gallery.folder.create'),
            { name, parent_id },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Folder created successfully');
                    router.visit(route('gallery.index', { folder_id: parent_id }));
                },
                onError: () => {
                    toast.error('Failed to create folder');
                },
            }
        );
    };

    const renameFolder = async (id: number, name: string) => {
        await router.put(
            route('gallery.folder.rename', id),
            { name },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Folder renamed successfully');
                    router.visit(route('gallery.index', { folder_id: id }));
                },
                onError: () => {
                    toast.error('Failed to rename folder');
                },
            }
        );
    };

    const deleteFolder = async (id: number, parent_id: number | null = null) => {
        await router.delete(route('gallery.folder.delete', id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Folder deleted successfully');
                router.visit(route('gallery.index', { folder_id: parent_id }));
            },
            onError: () => {
                toast.error('Failed to delete folder');
            },
        });
    };

    const submitUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.file) {
            post(route('gallery.store', { folder_id: currentFolderId }), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('File uploaded successfully');
                    reset();
                    router.visit(route('gallery.index', { folder_id: currentFolderId }));
                },
                onError: () => {
                    toast.error('Failed to upload file');
                },
            });
        }
    };

    const handleFolderClick = (folderId: number | null) => {
        if (folderId === currentFolderId) return;
        setCurrentFolderId(folderId);
        router.visit(route('gallery.index', { folder_id: folderId }), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const getFolderBreadcrumbs = (): { title: string; id: number | null }[] => {
        if (!currentFolderId || !folders.length) {
            return [];
        }
        const chain: { title: string; id: number | null }[] = [];
        let folder = folders.find((f) => f.id === currentFolderId) || null;
        while (folder) {
            chain.unshift({ title: folder.name, id: folder.id });
            folder = folders.find((f) => f.id === folder?.parent_id) || null;
        }
        return chain;
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'File Manager', href: route('gallery.index') },
        ...getFolderBreadcrumbs().map((f) => ({ title: f.title, href: '#' })),
    ];

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
                        router.visit(route('gallery.index', { folder_id: currentFolderId }));
                    },
                    onError: () => {
                        toast.error('Failed to delete file');
                    },
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="File Manager" />
            <div className="flex flex-row gap-4 p-4">
                <Sidebar
                    folders={folders}
                    currentFolderId={currentFolderId}
                    onFolderClick={handleFolderClick}
                    onCreateFolder={createFolder}
                    onRenameFolder={renameFolder}
                    onDeleteFolder={deleteFolder}
                    expanded={expanded}
                    setExpanded={setExpanded}
                />

                <div className="flex-1 flex flex-col gap-4">
                    <nav className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                        {breadcrumbs.map((bc, i) => (
                            <span key={i} className="flex items-center gap-1">
                                {i > 0 && <span className="mx-1">/</span>}
                                <span>{bc.title}</span>
                            </span>
                        ))}
                    </nav>

                    <GalleryHeader />
                    <GalleryUploadForm data={data} setData={setData} processing={processing} submitUpload={submitUpload} />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        <GalleryGrid media={media.data} handleDelete={handleDelete} />
                    </div>

                    <ConfirmationDialog state={confirmationState} onConfirm={handleConfirm} onCancel={handleCancel} />
                    {media.links && <GalleryPagination links={media.links} />}
                </div>
            </div>
        </AppLayout>
    );
}
