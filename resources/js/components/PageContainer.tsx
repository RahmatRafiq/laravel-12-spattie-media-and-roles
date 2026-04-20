import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type PageContainerProps = {
    children: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'none';
    className?: string;
    centered?: boolean;
    centerWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl' | '6xl' | '7xl';
}

const widthClasses = {
    sm: 'max-w-sm',     // 384px
    md: 'max-w-md',     // 448px
    lg: 'max-w-lg',     // 512px
    xl: 'max-w-xl',     // 576px
    '2xl': 'max-w-2xl', // 672px
    '4xl': 'max-w-4xl', // 896px
    '5xl': 'max-w-5xl', // 1024px
    '6xl': 'max-w-6xl', // 1152px
    '7xl': 'max-w-7xl', // 1280px
    'full': 'max-w-full',
    'none': '',
};

/**
 * PageContainer provides consistent padding and max-width for pages.
 * 
 * Enterprise Standard: 
 * - Mobile: Minimal padding (px-2) for max space.
 * - Desktop: Centered with max-width 7xl for readability.
 */
export default function PageContainer({
    children,
    maxWidth = 'full',
    className,
    centered = true, // Default to true for Enterprise look
    centerWidth = '7xl',
}: PageContainerProps) {
    // Base container handling outer padding and vertical spacing
    const outerClasses = cn(
        'w-full px-2 py-4 sm:px-6 lg:px-8', 
        maxWidth !== 'none' && widthClasses[maxWidth],
        maxWidth !== 'none' && 'mx-auto',
        className
    );

    if (centered) {
        return (
            <div className={outerClasses}>
                <div className={cn('mx-auto w-full space-y-6', widthClasses[centerWidth])}>
                    {children}
                </div>
            </div>
        );
    }

    return <div className={outerClasses}>{children}</div>;
}
