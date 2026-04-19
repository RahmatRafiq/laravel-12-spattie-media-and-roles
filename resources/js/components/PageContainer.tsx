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
    sm: 'max-w-sm mx-auto',     // 384px
    md: 'max-w-md mx-auto',     // 448px
    lg: 'max-w-lg mx-auto',     // 512px
    xl: 'max-w-xl mx-auto',     // 576px
    '2xl': 'max-w-2xl mx-auto', // 672px
    '4xl': 'max-w-4xl mx-auto', // 896px
    '5xl': 'max-w-5xl mx-auto', // 1024px
    '6xl': 'max-w-6xl mx-auto', // 1152px
    '7xl': 'max-w-7xl mx-auto', // 1280px
    'full': 'w-full',
    'none': '',
};

const centerWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
};

/**
 * PageContainer provides consistent padding and max-width for pages.
 * 
 * By default, it uses px-4 py-6 and scales up padding on desktop.
 * Use centered={true} with centerWidth="7xl" (default) for a standard 
 * centered dashboard look that isn't too narrow.
 */
export default function PageContainer({
    children,
    maxWidth = 'none',
    className,
    centered = false,
    centerWidth = '7xl',
}: PageContainerProps) {
    const baseClasses = cn(
        'w-full px-4 py-6 sm:px-6 lg:px-8', // Responsive horizontal padding
        maxWidthClasses[maxWidth],
        className
    );

    if (centered) {
        return (
            <div className={baseClasses}>
                <div className={cn('mx-auto w-full space-y-6', centerWidthClasses[centerWidth])}>
                    {children}
                </div>
            </div>
        );
    }

    return <div className={baseClasses}>{children}</div>;
}
