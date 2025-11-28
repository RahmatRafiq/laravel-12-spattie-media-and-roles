import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PageSectionProps {
    children: ReactNode;
    sidebar?: ReactNode;
    className?: string;
    contentClassName?: string;
    contentMaxWidth?: 'none' | 'xl' | '2xl' | '4xl';
}

const contentMaxWidthClasses = {
    none: '',
    xl: 'md:max-w-xl',
    '2xl': 'md:max-w-2xl',
    '4xl': 'md:max-w-4xl',
};

/**
 * PageSection provides a consistent layout for pages with optional sidebar
 * Used for settings pages and forms that need side navigation
 * Matches the pattern in layouts/settings/layout.tsx and layouts/UserRolePermission/layout.tsx
 */
export default function PageSection({ children, sidebar, className, contentClassName, contentMaxWidth = '2xl' }: PageSectionProps) {
    if (!sidebar) {
        return <div className={cn('w-full', className)}>{children}</div>;
    }

    return (
        <div className={cn('flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0', className)}>
            {/* Sidebar - hidden on mobile, fixed width on desktop */}
            <aside className="w-full max-w-xl lg:w-48">{sidebar}</aside>

            {/* Main Content */}
            <div className={cn('flex-1 space-y-6', contentMaxWidthClasses[contentMaxWidth], contentClassName)}>{children}</div>
        </div>
    );
}
