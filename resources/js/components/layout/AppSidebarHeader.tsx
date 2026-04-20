import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SidebarTrigger } from '@/components/ui/Sidebar';
import { Separator } from '@/components/ui/Separator';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="border-sidebar-border/50 bg-background/95 sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-2 sm:px-4 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 max-w-full">
            <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <div className="flex-1 min-w-0 overflow-hidden">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>
        </header>
    );
}
