import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/Breadcrumb';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link } from '@inertiajs/react';
import { Fragment } from 'react';

export function Breadcrumbs({ breadcrumbs }: { breadcrumbs: BreadcrumbItemType[] }) {
    return (
        <div className="overflow-hidden">
            {breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList className="flex-nowrap overflow-hidden whitespace-nowrap">
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            return (
                                <Fragment key={index}>
                                    <BreadcrumbItem
                                        className={cn('min-w-0', index < breadcrumbs.length - 2 ? 'hidden sm:inline-flex' : 'inline-flex')}
                                    >
                                        {isLast ? (
                                            <BreadcrumbPage className="max-w-[150px] truncate sm:max-w-none">{item.title}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild className="max-w-[100px] truncate sm:max-w-none">
                                                <Link href={item.href}>{item.title}</Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator className={index < breadcrumbs.length - 2 ? 'hidden sm:block' : 'block'} />}
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
        </div>
    );
}
