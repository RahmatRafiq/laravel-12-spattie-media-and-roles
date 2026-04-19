import { AppContent } from '@/components/layout/AppContent';
import { AppShell } from '@/components/layout/AppShell';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppSidebarHeader } from '@/components/layout/AppSidebarHeader';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
