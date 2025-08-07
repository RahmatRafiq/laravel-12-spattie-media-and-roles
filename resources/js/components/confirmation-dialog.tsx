import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ConfirmationState } from '@/hooks/use-confirmation';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmationDialogProps {
    state: ConfirmationState;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmationDialog({ state, onConfirm, onCancel }: ConfirmationDialogProps) {
    const getDefaultIcon = () => {
        if (state.variant === 'destructive') {
            return <Trash2 className="h-6 w-6 text-red-600" />;
        }
        return <AlertTriangle className="h-6 w-6 text-amber-600" />;
    };

    const getButtonVariant = () => {
        return state.variant === 'destructive' ? 'destructive' : 'default';
    };

    return (
        <AlertDialog open={state.isOpen} onOpenChange={(open) => !open && onCancel()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                        {state.icon || getDefaultIcon()}
                        <AlertDialogTitle>{state.title}</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-left">
                        {state.message}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        {state.cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        variant={getButtonVariant()}
                        className={state.variant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                        {state.confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
