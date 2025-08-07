import { useState, useCallback, useRef } from 'react';

export interface ConfirmationOptions {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive';
    icon?: React.ReactNode;
}

export interface ConfirmationState extends ConfirmationOptions {
    isOpen: boolean;
}

export function useConfirmation() {
    const [state, setState] = useState<ConfirmationState>({
        isOpen: false,
        title: 'Confirm Action',
        message: 'Are you sure you want to continue?',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        variant: 'default',
    });

    const onConfirmRef = useRef<(() => void) | null>(null);
    const onCancelRef = useRef<(() => void) | null>(null);

    const openConfirmation = useCallback((
        options: ConfirmationOptions & { onConfirm: () => void; onCancel?: () => void }
    ) => {
        onConfirmRef.current = options.onConfirm;
        onCancelRef.current = options.onCancel || null;

        setState({
            isOpen: true,
            title: options.title || 'Confirm Action',
            message: options.message || 'Are you sure you want to continue?',
            confirmText: options.confirmText || 'Confirm',
            cancelText: options.cancelText || 'Cancel',
            variant: options.variant || 'default',
            icon: options.icon,
        });
    }, []);

    const closeConfirmation = useCallback(() => {
        setState(prev => ({ ...prev, isOpen: false }));
        onConfirmRef.current = null;
        onCancelRef.current = null;
    }, []);

    const handleConfirm = useCallback(() => {
        if (onConfirmRef.current) {
            onConfirmRef.current();
        }
        closeConfirmation();
    }, [closeConfirmation]);

    const handleCancel = useCallback(() => {
        if (onCancelRef.current) {
            onCancelRef.current();
        }
        closeConfirmation();
    }, [closeConfirmation]);

    return {
        confirmationState: state,
        openConfirmation,
        closeConfirmation,
        handleConfirm,
        handleCancel,
    };
}
