'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { getBreadcrumbFromPath } from '@/config/menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useMenu } from '@/hooks/use-menu';
import { cn } from '@/lib/utils';

export default function PageTitle({ title, subtitle = '', className }) {
    const { userRoles } = useMenu();
    const pathname = usePathname();

    const breadcrumbs = React.useMemo(() => {
        return getBreadcrumbFromPath(pathname, userRoles);
    }, [pathname, userRoles]);

    return (
        <div className={cn('flex flex-col lg:flex-row my-5 justify-between items-start lg:items-end gap-y-3 lg:gap-y-0 pt-1 pb-5', className)}>
            <div className='flex flex-col'>
                {title ? (
                    <h2 className='text-xl font-bold z-[1]'>{title}</h2>
                ) : (
                    <Skeleton className="h-6 w-36" />
                )}
                {subtitle ? (
                    <small className='text-xs text-stone-600 z-[1]'>{subtitle}</small>
                ) : (
                    <Skeleton className="h-4 mt-1 w-56" />
                )}
            </div>
            <Breadcrumb className="z-[1]">
                <BreadcrumbList>
                    {breadcrumbs.length > 0 ? (
                        <>
                            {breadcrumbs.map((item, index) => (
                                <React.Fragment key={index}>
                                    <BreadcrumbItem>
                                        {item.path ? (
                                            <BreadcrumbLink href={item.path}>
                                                {item.name}
                                            </BreadcrumbLink>
                                        ) : (
                                            <BreadcrumbPage>{item.name}</BreadcrumbPage>
                                        )}
                                    </BreadcrumbItem>
                                    {index < breadcrumbs.length - 1 && (
                                        <BreadcrumbSeparator />
                                    )}
                                </React.Fragment>
                            ))}
                        </>
                    ) : (
                        <BreadcrumbItem>
                            <BreadcrumbPage>Dashboard</BreadcrumbPage>
                        </BreadcrumbItem>
                    )}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}