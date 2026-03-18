"use client"

import { use, useEffect } from 'react';
import { ModuleTitle } from '@/components/partials/modules/ModuleTitle';
import { ModuleSlides } from '@/components/partials/modules/ModuleSlides';
import { ModuleCoverPage } from '@/components/partials/modules/ModuleCoverPage';
import { ModuleSummary } from '@/components/partials/modules/ModuleSummary';
import { ModuleProvider, useModule } from "@/contexts/ModuleContext";
import { ModuleCategories } from '@/components/partials/modules/ModuleCategories';
import { ModuleWorkspace } from '@/components/partials/modules/ModuleWorkspace';
import { ModuleSlideWorkspace } from '@/components/partials/modules/ModuleSlideWorkspace';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ModuleRibbonMenu } from "@/components/partials/modules/ModuleRibbonMenu";
import { ModuleStatusDetail } from "@/components/partials/modules/ModuleStatusDetail";
import { ButtonGroup } from '@/components/ui/button-group';
import { PanelLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/lib/api';
import { ModuleSlideContent } from '@/components/partials/modules/ModuleSlideContent';
import { ModuleTabContent } from '@/components/partials/modules/ModuleTabContent';
import { ModuleSlideAttactments } from '@/components/partials/modules/ModuleSlideAttactments';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import StripePattern from '@/components/partials/StripePattern';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const RightPanelSlides = () => {
    const { module, moduleTemp, handleSaveModule } = useModule();

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex gap-4'>
                <ButtonGroup className="flex-1">
                    <Button
                        variant="outline"
                        className="flex-1 relative"
                        onClick={() => handleSaveModule()}
                    >
                        <Save />
                        <span>Simpan</span>
                        {Object.keys(moduleTemp).length > 0 && (
                            <div className='absolute -top-1 -right-1'>
                                <span className="relative flex size-3">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                                    <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
                                </span>
                            </div>
                        )}
                    </Button>
                </ButtonGroup>
                <Button className="flex-1">Publish</Button>
            </div>
            {/* Attactments */}
            <ModuleSlideAttactments
                key={`attactment-${module?.uuid}`}
            />
        </div>
    )
}

const RightPanelGeneral = () => {
    const { module, loading, moduleTemp, handleSaveModule } = useModule();

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex gap-4'>
                <ButtonGroup className="flex-1">
                    <Button
                        variant="outline"
                        className="flex-1 relative"
                        disabled={loading}
                        onClick={() => handleSaveModule()}
                    >
                        {loading ? (
                            <>
                                <Spinner />
                                <span>Menyimpan..</span>
                            </>
                        ) : (
                            <>
                                <Save />
                                <span>Simpan</span>
                            </>
                        )}
                        {Object.keys(moduleTemp).length > 0 && (
                            <div className='absolute -top-1 -right-1'>
                                <span className="relative flex size-3">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                                    <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
                                </span>
                            </div>
                        )}
                    </Button>
                </ButtonGroup>
                <Button className="flex-1">Publish</Button>
            </div>

            <ModuleStatusDetail />
            {/* Cover */}
            <ModuleCoverPage
                key={`cover-${module?.uuid}`}
                module={module}
                initialCoverUrl={module?.cover_page || ""}
            />
            {/* Summary */}
            <ModuleSummary
                key={`summary-${module?.uuid}`}
                initialSummary={module?.summary || ""}
            />
            {/* Categories */}
            <ModuleCategories
                key={`categories-${module?.uuid}`}
            />
        </div>
    )
}

const RenderMainContentGeneral = () => {
    const { module } = useModule();

    return (
        <div className='flex-1 p-3 max-w-5xl mx-auto my-10'>
            <div className='flex flex-col gap-5'>
                <ModuleTitle
                    key={`title-${module?.uuid}`}
                    initialTitle={module?.title || ""}
                    initialSlug={module?.slug || ""}
                />

                <div>
                    <ModuleRibbonMenu />
                </div>

                <div className='flex gap-5'>
                    <ModuleWorkspace />
                </div>
            </div>
        </div>
    )
}

const RenderMainContentSlide = () => {
    return (
        <ModuleSlideWorkspace />
    )
}

const ModuleContent = () => {
    // ambil data module
    const { setStaff, openSideSlide, openSideSlideDrawer, setOpenSideSlideDrawer, openSideTabDrawer, setOpenSideTabDrawer, rightPanel } = useModule();

    // render
    const renderRightPanelContent = () => {
        switch (rightPanel) {
            case 'general':
                return (
                    <div className='w-80 p-3 border-s border-dashed relative'>
                        <span className="border-primary/20 bg-white absolute top-0 left-0 z-30 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-xs border"></span>
                        <RightPanelGeneral />
                    </div>
                );
            case 'slide':
                return (
                    <div className='h-full w-fit relative'>
                        <span className="border-primary/20 bg-white absolute top-0 left-0 z-30 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-xs border"></span>
                        <div className='w-80 relative p-3 border-s border-dashed h-[calc(100dvh-170px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                            <RightPanelSlides />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    // render
    const renderRightPanelDrawerContent = () => {
        switch (rightPanel) {
            case 'general':
                return (
                    <div className='w-80 p-3 max-h-[calc(100dvh-48px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                        <RightPanelGeneral />
                    </div>
                );
            case 'slide':
                return (
                    <div className='w-80 p-3 max-h-[calc(100dvh-48px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                        <RightPanelSlides />
                    </div>
                );
            default:
                return null;
        }
    };

    // render
    const renderMainContent = () => {
        switch (rightPanel) {
            case 'general':
                return (
                    <RenderMainContentGeneral />
                );
            case 'slide':
                return (
                    <RenderMainContentSlide />
                );
            default:
                return null;
        }
    };

    // data staff
    const fetchDataStaff = async () => {
        try {
            const response = await api.fetch(`${API_URL}/office/employees/data`, {
                method: "GET"
            });
            // response success
            if (response?.success) {
                setStaff(response?.data);
            } else {
                toast.error(response?.message || "Error loading data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    // first fetch
    useEffect(() => {
        fetchDataStaff();
    }, []);
    // return content 
    return (
        <div className='mx-auto w-full relative'>

            <div className='border-b p-3 relative z-10'>
                <div className='flex justify-between p-2 z-1'>
                    <div className='flex gap-2  items-center'>
                        <span className='text-sm font-medium'>Detail Modul</span>
                        <Separator orientation='vertical' className="!h-5" />
                        <span className='text-xs text-gray-500'>Perbarui informasi modul pelatihan</span>
                    </div>

                    <Button
                        size="icon-sm"
                        variant="outline"
                        className="flex 2xl:hidden"
                        onClick={() => setOpenSideTabDrawer(!openSideTabDrawer)}
                    >
                        <PanelLeft />
                    </Button>
                </div>

                <StripePattern className="z-[-1]" />
            </div>


            <div className={`flex divide-x divide-dashed`}>
                <div className='flex flex-1'>
                    <div className='hidden 2xl:flex'>
                        {(rightPanel == 'slide' && openSideSlide) && (
                            <ModuleSlides />
                        )}
                    </div>

                    {renderMainContent()}

                    <div className='hidden 2xl:flex'>
                        {renderRightPanelContent()}
                    </div>
                </div>

                <div className='hidden 2xl:flex'>
                    <ModuleTabContent />
                </div>
            </div>

            {/* <div className='block xl:hidden bg-white p-3 absolute bottom-0'>
            </div> */}


            {/* Draw kiri Slide */}
            <Drawer direction="left" open={openSideSlideDrawer} onOpenChange={setOpenSideSlideDrawer}>
                <DrawerContent className="!w-50">
                    <DrawerHeader>
                        <DrawerTitle className="text-xs">Page Slides</DrawerTitle>
                    </DrawerHeader>
                    <div className={`transition-all duration-300 ease-in-out w-full max-h-[calc(100dvh-50px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
                        <div className='flex flex-col gap-3 p-3'>
                            <ModuleSlideContent />
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>

            {/* Draw Panel kanan */}
            <Drawer direction="right" open={openSideTabDrawer} onOpenChange={setOpenSideTabDrawer}>
                <DrawerContent className="!w-[384.89px] bg-gray-100">
                    <DrawerHeader>
                        <DrawerTitle className="text-xs">Panel Slides</DrawerTitle>
                    </DrawerHeader>
                    <div className='flex h-full divide-x'>
                        <div className='w-80'>
                            {renderRightPanelDrawerContent()}
                        </div>
                        <div className='w-full'>
                            <ModuleTabContent />
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default function Show({ params }) {
    // ambil data
    const { uuid } = use(params);
    // return
    return (
        <ModuleProvider uuid={uuid}>
            <ModuleContent />
        </ModuleProvider>
    )
}