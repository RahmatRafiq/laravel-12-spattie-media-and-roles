

import React from 'react';
import Sidebar from './Sidebar';
import GalleryHeader from './GalleryHeader';
import GalleryUploadForm from './GalleryUploadForm';
import GalleryGrid from './GalleryGrid';
import GalleryPagination from './GalleryPagination';
import AppLayout from '../../layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { toast } from '../../utils/toast';
import ConfirmationDialog from '../../components/confirmation-dialog';
import { useConfirmation } from '../../hooks/use-confirmation';

export default function Gallery({ media, visibility, collections, selected_collection }: GalleryProps) {
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
                <Sidebar
                    groupedCollections={groupedCollections}
                    openAccordion={openAccordion}
                    setOpenAccordion={setOpenAccordion}
                    data={data}
                    handleFilterChange={handleFilterChange}
                />
                <div className="flex-1 flex flex-col gap-4">
                    <GalleryHeader />
                    <GalleryUploadForm
                        data={data}
                        setData={setData}
                        processing={processing}
                        collections={collections}
                        submitUpload={submitUpload}
                    />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        <GalleryGrid media={media.data} handleDelete={handleDelete} />
                    </div>
                    <ConfirmationDialog
                        state={confirmationState}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                    />
                    {media.links && <GalleryPagination links={media.links} />}
                </div>
            </div>
        </AppLayout>
    );
}
