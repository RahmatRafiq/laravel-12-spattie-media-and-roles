import { useConfirm } from '@/components/providers/confirmation-provider';
import { toast } from '@/utils/toast';
import { router } from '@inertiajs/react';

interface DeleteOptions {
    url: string;
    title?: string;
    message?: string;
    resourceName?: string;
    onSuccess?: () => void;
}

export function useResourceActions() {
    const confirm = useConfirm();

    const deleteResource = async ({
        url,
        title = 'Delete Confirmation',
        message,
        resourceName = 'item',
        onSuccess,
    }: DeleteOptions) => {
        const isConfirmed = await confirm({
            title,
            message: message || `Are you sure you want to delete this ${resourceName.toLowerCase()}? This action cannot be undone.`,
            variant: 'destructive',
            confirmText: 'Delete',
        });

        if (isConfirmed) {
            router.delete(url, {
                preserveScroll: true,
                onSuccess: (page) => {
                    const msg = (page.props.success as string) || `${resourceName} deleted successfully.`;
                    toast.success(msg);
                    if (onSuccess) onSuccess();
                },
                onError: () => {
                    toast.error(`Failed to delete ${resourceName.toLowerCase()}.`);
                },
            });
        }
    };

    return {
        deleteResource,
    };
}
