'use client';

import * as React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import * as LucideIcons from 'lucide-react';
import { Loader, Calendar } from 'lucide-react';
import DateNow from '@/components/ui/date-now';
import { useSettings } from '@/contexts/SettingsContext';
import { SidebarProvider, SidebarSeparator, SidebarInset, SidebarMenuSkeleton, SidebarTrigger, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarRail, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/animate-ui/components/radix/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/animate-ui/primitives/radix/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/animate-ui/components/radix/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useMenu } from '@/hooks/use-menu';
import { Skeleton } from '@/components/ui/skeleton';
import NotificationListener from '@/components/partials/NotificationListener';
import { cn } from '@/lib/utils';

const ThemeToggle = dynamic(() => import('@/components/partials/ThemeToggle'), {
    ssr: false,
    loading: () => (
        <div className="h-7 w-7" />
    ),
});

function LayoutContent({ children }) {
    const router = useRouter();
    const isMobile = useIsMobile();
    const pathname = usePathname();
    const { settings } = useSettings();
    const { user, logout, loading: loading_auth } = useAuth();
    const { menus, loading } = useMenu();
    // set background for training modules
    const pageName = pathname.split('/')[3] || 'home';

    const data = {
        app: {
            name: settings?.site_name || '',
            logo_type: settings?.logo_type || '',
            logo_url: settings?.logo_url || '',
            logo_icon: settings?.logo_icon ? LucideIcons[settings?.logo_icon] : LucideIcons.Box,
            logo_rectangle_url: settings?.logo_rectangle_url || '',
            description: settings?.site_description || '',
            tagline: settings?.site_tagline || '',
        },
        user: {
            name: user?.full_name || user?.name,
            initial_name: user?.initial_name,
            email: user?.email,
            avatar: user?.avatar,
        },
    };

    const isSubmenuActive = (submenu) => {
        return submenu?.some(sub => pathname === sub.path);
    };

    const isImageLogo = (data?.app?.logo_type == 'image' && data?.app?.logo_url)

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon" animateOnHover={true}>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                highlightValue="app-brand"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <div className={`flex aspect-square size-8 items-center justify-center rounded-lg ${isImageLogo ? '' : 'overflow-hidden'}`}>
                                    {isImageLogo ? (
                                        <img
                                            src={data?.app?.logo_url}
                                            className='object-cover scale-90'
                                        />
                                    ) : (
                                        <data.app.logo_icon className="size-6" />
                                    )}
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    {data.app.name ? (
                                        <span className="truncate font-semibold">
                                            {data.app.name}
                                        </span>
                                    ) : (
                                        <Skeleton className="h-[16px] w-6/12 mb-1.5" />
                                    )}
                                    {data.app.tagline ? (
                                        <span className="truncate text-xs">
                                            {data.app.tagline}
                                        </span>
                                    ) : (
                                        <Skeleton className="h-[12px] w-11/12" />
                                    )}
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu className="gap-0">
                            {loading ? (
                                <>
                                    <SidebarMenuSkeleton />
                                    <SidebarMenuSkeleton />
                                    <SidebarMenuSkeleton />
                                    <SidebarMenuSkeleton />
                                    <SidebarMenuSkeleton />
                                </>
                            ) : menus.map((menu) => {
                                const Icon = menu.icon_component;
                                const hasSubmenu = menu.submenu && menu.submenu.length > 0;
                                const isActive = hasSubmenu
                                    ? isSubmenuActive(menu.submenu)
                                    : pathname === menu.path;

                                if (menu.is_label) return (
                                    <SidebarGroupLabel key={menu?.id} className="mt-2">{menu?.name}</SidebarGroupLabel>
                                );

                                if (hasSubmenu) {
                                    return (
                                        <Collapsible
                                            key={menu.id}
                                            asChild
                                            defaultOpen={isActive}
                                            className="group/collapsible"
                                        >
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton
                                                        tooltip={menu.name}
                                                        highlightValue={`menu-${menu.id}`}
                                                        isActive={isActive}
                                                        className="cursor-pointer"
                                                    >
                                                        <Icon className="size-4" />
                                                        <span>{menu.name}</span>
                                                        <LucideIcons.ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {menu.submenu.map((subItem) => {
                                                            const isSubActive = pathname === subItem.path;

                                                            return (
                                                                <SidebarMenuSubItem key={subItem.id}>
                                                                    <SidebarMenuSubButton
                                                                        asChild
                                                                        isActive={isSubActive}
                                                                    >
                                                                        <Link href={subItem.path}>
                                                                            <span>{subItem.name}</span>
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            );
                                                        })}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    );
                                }

                                return (
                                    <SidebarMenuItem key={menu.id}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={menu.name}
                                            highlightValue={`menu-${menu.id}`}
                                            isActive={isActive}
                                        >
                                            <Link href={menu.path}>
                                                <Icon className="size-4" />
                                                <span>{menu.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenu className="gap-0 mb-2">
                        <SidebarGroupLabel key="preferences" className="mt-2">Preferences</SidebarGroupLabel>
                        <SidebarMenuButton
                            tooltip="Documentation"
                            highlightValue="preferences-documentation"
                            className="cursor-pointer"
                        >
                            <LucideIcons.BookOpenCheck className="size-4" />
                            <span>Documentation</span>
                        </SidebarMenuButton>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="General Settings"
                                highlightValue="preferences-general-settings"
                                className="cursor-pointer"
                                asChild
                            >
                                <Link href='/app/panel/general-settings'>
                                    <LucideIcons.MonitorCog className="size-4" />
                                    <span>General Settings</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>

                <SidebarSeparator className="mx-auto" />

                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        highlightValue="profile-menu-trigger"
                                        className="data-[state=open]:bg-sidebar-accent cursor-pointer data-[state=open]:text-sidebar-accent-foreground"
                                    >
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage
                                                src={data.user.avatar}
                                                alt={data.user.name}
                                            />
                                            <AvatarFallback className="rounded-lg">
                                                {loading_auth ? (<Loader className='w-4 h-4 animate-spin text-stone-500' />) : data.user.initial_name}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            {loading_auth ? (<Skeleton className="h-4.5 w-30" />) : (<span className="truncate font-semibold">{data.user.name}</span>)}
                                            {loading_auth ? (<Skeleton className="h-3 mt-1 w-36" />) : (<span className="truncate text-xs">{data.user.email}</span>)}
                                        </div>
                                        <LucideIcons.ChevronsUpDown className="ml-auto size-4" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                    side={isMobile ? 'bottom' : 'right'}
                                    align="end"
                                    sideOffset={4}
                                >
                                    <DropdownMenuLabel className="p-0 font-normal">
                                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                            <Avatar className="h-8 w-8 rounded-lg">
                                                <AvatarImage
                                                    src={data.user.avatar}
                                                    alt={data.user.name}
                                                />
                                                <AvatarFallback className="rounded-lg">
                                                    {loading_auth ? (<Loader className='w-4 h-4 animate-spin text-stone-500' />) : data.user.initial_name}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                {loading_auth ? (<Skeleton className="h-4.5 w-30" />) : (<span className="truncate font-semibold">{data.user.name}</span>)}
                                                {loading_auth ? (<Skeleton className="h-3 mt-1 w-36" />) : (<span className="truncate text-xs">{data.user.email}</span>)}
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem onClick={() => router.push('/app/panel/profile')} className="cursor-pointer">
                                            <LucideIcons.BadgeCheck />
                                            Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <LucideIcons.Settings />
                                            Settings
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => logout()}>
                                        <LucideIcons.LogOut />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>

            <SidebarInset data-page={pageName} className={cn(
                "data-[page=training-modules]:bg-sidebar dark:data-[page=training-modules]:bg-background",
                "data-[page=agenda]:bg-sidebar dark:data-[page=agenda]:bg-background" 
            )}>
                <header className="flex border-b h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="rounded-lg" />
                    </div>
                    <div className="w-full max-w-6xl mx-auto flex justify-between items-center pe-4 xl:pe-16">
                        <div className='flex gap-2 items-center'>
                            <Calendar className='w-4 h-5 text-stone-500' />
                            {loading_auth ? (<Skeleton className="h-5 w-52" />) : (<DateNow />)}
                        </div>
                        <div className='flex gap-2'>
                            {user?.uuid && (<NotificationListener userUuid={user.uuid} modelType='admin' />)}
                            <ThemeToggle />
                        </div>
                    </div>
                </header>

                {children}

                <footer className='border-t'>
                    <div className='w-full max-w-6xl mx-auto'>
                        <div className='p-4 flex justify-between items-center flex-col md:flex-row'>
                            <small>Alex AC Mobil Semarang © 2025. All rights reserved.</small>
                            <small>Made with 🧡 by <span className='text-orange-500 font-semibold'>I te team</span></small>
                        </div>
                    </div>
                </footer>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default function Layout({ children }) {
    return (
        <LayoutContent>{children}</LayoutContent>
    );
}
