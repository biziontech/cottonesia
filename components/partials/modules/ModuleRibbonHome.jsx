'use client'

import { Button } from "@/components/ui/button";
import { useModule } from "@/contexts/ModuleContext";
import { Info, Milestone, PencilRuler, FileInput } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HomeRibbonIntroduction } from '@/components/partials/modules/home/HomeRibbonIntroduction';
import { HomeRibbonObjective } from '@/components/partials/modules/home/HomeRibbonObjective';
import { HomeRibbonCreator } from '@/components/partials/modules/home/HomeRibbonCreator';
import { HomeRibbonPublish } from '@/components/partials/modules/home/HomeRibbonPublish';
import { HomeRibbonMateri } from '@/components/partials/modules/home/HomeRibbonMateri';

export const ModuleRibbonHome = () => {
    const { active, setActive } = useModule();

    /* Pendahuluan */
    const handleIntroductionSetup = () => {
        setActive(active?.key === "pendahuluan" ? null : {
            key: "pendahuluan",
            content: HomeRibbonIntroduction,
            title: "Pendahuluan",
            subtitle: "Buat content pendahuluan sebelum memulai materi",
            icon: PencilRuler
        });
    }

    /* Tujuan */
    const handleTujuanSetup = () => {
        setActive(active?.key === "tujuan" ? null : {
            key: "tujuan",
            content: HomeRibbonObjective,
            title: "Tujuan",
            subtitle: "Buat maksud dan tujuan dari module ini dibuat",
            icon: Milestone
        });
    }

    /* Materi */
    const handleImportMateri = () => {
        setActive(active?.key === "import" ? null : {
            key: "import",
            content: HomeRibbonMateri
        });
    }


    return (
        <div className="flex bg-white divide-x divide-dotted rounded-xl shadow-sm w-fit">
            <div className="text-sm text-gray-600 flex flex-col items-center">
                <div className="flex flex-col flex-1 items-center justify-end p-2 rounded-lg gap-2">
                    <div className="flex divide-x">

                        <div className="pe-1.5">
                            <Button
                                variant="ghost"
                                data-active={active?.key === "pendahuluan"}
                                onClick={() => handleIntroductionSetup()}
                                className="data-[active=true]:text-primary data-[active=true]:bg-gray-50 data-[active=true]:hover:bg-gray-100 flex h-auto flex-col gap-1.5 items-center justify-center cursor-pointer group"
                            >
                                <PencilRuler />
                                <small>Setup</small>
                            </Button>
                        </div>

                        <div className="ps-1.5">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        data-active={active?.key === "tujuan"}
                                        className="data-[active=true]:text-primary data-[active=true]:bg-gray-50 data-[active=true]:hover:bg-gray-100 flex h-auto flex-col gap-1.5 items-center justify-center cursor-pointer group"
                                        onClick={() => handleTujuanSetup()}
                                    >
                                        <Milestone />
                                        <small>Tujuan</small>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Tujuan dari modul ini dibuat</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>

                    </div>
                </div>
                <div className="px-3 pb-1.5 pt-1 border-t w-full text-center">
                    <small className="font-semibold">Pendahuluan</small>
                </div>
            </div>

            <HomeRibbonCreator />

            <HomeRibbonPublish />

            <div className="flex gap-3">
                <div className="text-sm text-gray-600 flex flex-col items-center">
                    <div className="flex flex-col flex-1 items-center justify-end p-2 rounded-lg gap-2">
                        <div className="flex divide-x">
                            <div className="pe-1.5">
                                <Button
                                    variant="ghost"
                                    data-active={active?.key === "import"}
                                    onClick={() => handleImportMateri()}
                                    className="data-[active=true]:text-primary data-[active=true]:bg-gray-50 data-[active=true]:hover:bg-gray-100 flex h-auto flex-col gap-1.5 items-center justify-center cursor-pointer group"
                                >
                                    <FileInput />
                                    <small>Import</small>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="px-3 pb-1.5 pt-1 border-t w-full text-center">
                        <small className="font-semibold">Materi</small>
                    </div>
                </div>
            </div>
        </div>
    );
}