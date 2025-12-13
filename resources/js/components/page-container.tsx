import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type PageContainerProps = {
    children: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl' | 'full' | 'none';
    className?: string;
    centered?: boolean;
    centerWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl';
}

const maxWidthClasses = {
    sm: 'max-w-sm mx-auto',
    md: 'max-w-md mx-auto',
    lg: 'max-w-lg mx-auto',
    xl: 'max-w-xl mx-auto',
    '2xl': 'max-w-2xl mx-auto',
    '4xl': 'max-w-4xl mx-auto',
    '7xl': 'max-w-7xl mx-auto',
    full: 'w-full',
    none: '',
};

const centerWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '7xl': 'max-w-7xl',
};

/**
 * PageContainer provides consistent padding for pages within AppLayout
 * Use maxWidth prop to control content width:
 * - 'full' or 'none' for full-width content like datatables
 * - '2xl' for simple forms
 * - '4xl' for complex forms with multiple sections
 * - '7xl' for gallery/grid layouts
 *
 * Use centered prop with centerWidth for centered content within full-width container:
 * - <PageContainer maxWidth="full" centered centerWidth="2xl">
 *   This creates a full-width container with centered content limited to max-w-2xl
 */
export default function PageContainer({ children, maxWidth = 'none', className, centered = false, centerWidth = '2xl' }: PageContainerProps) {
    if (centered && (maxWidth === 'full' || maxWidth === 'none')) {
        return (
            <div className={cn('px-4 py-6', maxWidthClasses[maxWidth], className)}>
                <div className={cn('mx-auto space-y-6', centerWidthClasses[centerWidth])}>{children}</div>
            </div>
        );
    }

    return <div className={cn('px-4 py-6', maxWidthClasses[maxWidth], className)}>{children}</div>;
}
