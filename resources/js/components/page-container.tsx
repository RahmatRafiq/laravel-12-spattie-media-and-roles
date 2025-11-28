import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PageContainerProps {
    children: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl' | 'full' | 'none';
    className?: string;
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

/**
 * PageContainer provides consistent padding for pages within AppLayout
 * Use maxWidth prop to control content width:
 * - 'full' or 'none' for full-width content like datatables
 * - '2xl' for simple forms
 * - '4xl' for complex forms with multiple sections
 * - '7xl' for gallery/grid layouts
 */
export default function PageContainer({ children, maxWidth = 'none', className }: PageContainerProps) {
    return <div className={cn('px-4 py-6', maxWidthClasses[maxWidth], className)}>{children}</div>;
}
