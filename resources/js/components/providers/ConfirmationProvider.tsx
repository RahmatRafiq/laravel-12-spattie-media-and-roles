import ConfirmationDialog from '@/components/ConfirmationDialog';
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

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

interface ConfirmationContextType {
    confirm: (options: ConfirmationOptions) => Promise<boolean>;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export function ConfirmationProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<ConfirmationState>({
        isOpen: false,
        title: 'Confirm Action',
        message: 'Are you sure you want to continue?',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        variant: 'default',
    });

    const resolver = useRef<((value: boolean) => void) | null>(null);

    const confirm = useCallback((options: ConfirmationOptions) => {
        setState({
            isOpen: true,
            title: options.title || 'Confirm Action',
            message: options.message || 'Are you sure you want to continue?',
            confirmText: options.confirmText || 'Confirm',
            cancelText: options.cancelText || 'Cancel',
            variant: options.variant || 'default',
            icon: options.icon,
        });

        return new Promise<boolean>((resolve) => {
            resolver.current = resolve;
        });
    }, []);

    const handleConfirm = useCallback(() => {
        setState((prev) => ({ ...prev, isOpen: false }));
        if (resolver.current) resolver.current(true);
    }, []);

    const handleCancel = useCallback(() => {
        setState((prev) => ({ ...prev, isOpen: false }));
        if (resolver.current) resolver.current(false);
    }, []);

    return (
        <ConfirmationContext.Provider value={{ confirm }}>
            {children}
            <ConfirmationDialog state={state} onConfirm={handleConfirm} onCancel={handleCancel} />
        </ConfirmationContext.Provider>
    );
}

export const useConfirm = () => {
    const context = useContext(ConfirmationContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmationProvider');
    }
    return context.confirm;
};
