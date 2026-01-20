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
    sm: 'max-w-sm mx-auto',     // 24rem / 384px - Very narrow, single column, centered
    md: 'max-w-md mx-auto',     // 28rem / 448px - Small dialogs, centered
    lg: 'max-w-lg mx-auto',     // 32rem / 512px - Medium forms, centered
    xl: 'max-w-xl mx-auto',     // 36rem / 576px - Standard forms, centered
    '2xl': 'max-w-2xl mx-auto', // 42rem / 672px - Simple forms with sections, centered
    '4xl': 'max-w-4xl mx-auto', // 56rem / 896px - Complex forms, centered (good default for settings)
    '7xl': 'max-w-7xl mx-auto', // 80rem / 1280px - Wide layouts, centered (for very wide content)
    full: 'w-full',             // Full viewport width, no max-width
    none: '',                   // No constraints
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
 * PageContainer provides consistent padding and max-width for pages
 *
 * USAGE GUIDELINES:
 * - Use '7xl' for most pages (settings, forms, management) - RECOMMENDED DEFAULT
 * - Use 'full' for datatables and full-width content
 * - Use '4xl' only for truly narrow forms
 * - Use '2xl' for authentication/simple single-column forms
 *
 * EXAMPLES:
 * - App Settings, Menu Management, Role Management: maxWidth="7xl"
 * - DataTables (User List, Gallery): maxWidth="full"
 * - Login, Register: maxWidth="2xl"
 *
 * OVERRIDE PADDING:
 * <PageContainer className="px-8 py-10"> - className is merged after defaults
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
