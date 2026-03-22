'use client'

import { Button } from "@/components/ui/button";
import { useModule } from "@/contexts/ModuleContext";
import { BookDown, Milestone, PencilRuler, FileInput, BookOpenText, Brain } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HomeRibbonIntroduction } from '@/components/partials/modules/home/HomeRibbonIntroduction';
import { HomeRibbonObjective } from '@/components/partials/modules/home/HomeRibbonObjective';
import { HomeRibbonCreator } from '@/components/partials/modules/home/HomeRibbonCreator';
import { HomeRibbonPublish } from '@/components/partials/modules/home/HomeRibbonPublish';
import { HomeRibbonMateri } from '@/components/partials/modules/home/HomeRibbonMateri';
import { HomeRibbonQuiz } from '@/components/partials/modules/home/HomeRibbonQuiz';
import StripePattern from '@/components/partials/StripePattern';
import { Separator } from "@/components/ui/separator";

export const ModuleRibbonMenu = () => {
    const { active, setActive } = useModule();

    /* Latar Belakang Default */
    const handleDescriptionSetup = () => {
        setActive(null);
    }
    /* Pendahuluan */
    const handleIntroductionSetup = () => {
        setActive({
            key: "pendahuluan",
            content: HomeRibbonIntroduction,
            title: "Pendahuluan",
            subtitle: "Buat content pendahuluan sebelum memulai materi",
            icon: PencilRuler
        });
    }

    /* Tujuan */
    const handleTujuanSetup = () => {
        setActive({
            key: "tujuan",
            content: HomeRibbonObjective,
            title: "Tujuan",
            subtitle: "Buat maksud dan tujuan dari module ini dibuat",
            icon: Milestone
        });
    }

    /* Materi */
    const handleImportMateri = () => {
        setActive({
            key: "import",
            content: HomeRibbonMateri,
            title: "Materi",
            subtitle: "Unggah atau impor materi pembelajaran dalam format PDF",
            icon: FileInput
        });
    }

    /* Quiz */
    const handleQuizSetup = () => {
        setActive({
            key: "quiz",
            content: HomeRibbonQuiz,
            title: "Quiz",
            subtitle: "Buat dan kelola soal kuis untuk evaluasi pembelajaran",
            icon: Brain
        });
    }


    return (
        <>
            <div className='p-3 border border-border w-full flex relative border-dashed justify-center'>
                <span className="border-primary/20 bg-white dark:bg-zinc-800 absolute top-0 left-0 z-30 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-xs border"></span>
                <span className="border-primary/20 bg-background absolute bottom-0 right-0 z-30 size-2.5 translate-x-1/2 translate-y-1/2 rotate-45 rounded-xs border"></span>
                <div className='z-1 flex flex-col xl:flex-row gap-2 items-center justify-center'>

                    <div className="gap-1 flex items-center justify-center flex-wrap">
                        {/* LATAR BELAKANG */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="sm"
                                    variant={active?.key === undefined ? "outline" : "ghost"}
                                    data-active={active?.key === undefined}
                                    onClick={() => handleDescriptionSetup()}
                                    className={`data-[active=true]:text-primary dark:data-[active=true]:bg-accent dark:data-[active=true]:text-primary-foreground data-[active=true]:bg-card data-[active=true]:hover:bg-accent items-center group gap-2 ${active?.key !== undefined && 'border border-transparent'}`}
                                >
                                    <BookOpenText />
                                    <span>Latar Belakang</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Penjelasan latar belakang modul</p>
                            </TooltipContent>
                        </Tooltip>

                        {/* PENDAHULUAN */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="sm"
                                    variant={active?.key === "pendahuluan" ? "outline" : "ghost"}
                                    data-active={active?.key === "pendahuluan"}
                                    onClick={() => handleIntroductionSetup()}
                                    className={`data-[active=true]:text-primary dark:data-[active=true]:bg-accent dark:data-[active=true]:text-primary-foreground data-[active=true]:bg-card data-[active=true]:hover:bg-accent items-center group gap-2 ${active?.key !== "pendahuluan" && 'border border-transparent'}`}
                                >
                                    <PencilRuler />
                                    <span>Pendahuluan</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Pengantar sebelum masuk ke materi</p>
                            </TooltipContent>
                        </Tooltip>

                        {/* TUJUAN */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="sm"
                                    variant={active?.key === "tujuan" ? "outline" : "ghost"}
                                    data-active={active?.key === "tujuan"}
                                    className={`data-[active=true]:text-primary dark:data-[active=true]:bg-accent dark:data-[active=true]:text-primary-foreground data-[active=true]:bg-card data-[active=true]:hover:bg-accent items-center group gap-2 ${active?.key !== "tujuan" && 'border border-transparent'}`}
                                    onClick={() => handleTujuanSetup()}
                                >
                                    <Milestone />
                                    <span>Tujuan</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Tujuan dari modul ini dibuat</p>
                            </TooltipContent>
                        </Tooltip>

                        {/* MATERI */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="sm"
                                    variant={active?.key === "import" ? "outline" : "ghost"}
                                    data-active={active?.key === "import"}
                                    onClick={() => handleImportMateri()}
                                    className={`data-[active=true]:text-primary dark:data-[active=true]:bg-accent dark:data-[active=true]:text-primary-foreground data-[active=true]:bg-card data-[active=true]:hover:bg-accent items-center group gap-2 ${active?.key !== "import" && 'border border-transparent'}`}
                                >
                                    <FileInput />
                                    <span>Materi</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Import atau tambah materi modul</p>
                            </TooltipContent>
                        </Tooltip>

                        {/* Quiz */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="sm"
                                    variant={active?.key === "quiz" ? "outline" : "ghost"}
                                    data-active={active?.key === "quiz"}
                                    onClick={() => handleQuizSetup()}
                                    className={`data-[active=true]:text-primary dark:data-[active=true]:bg-accent dark:data-[active=true]:text-primary-foreground data-[active=true]:bg-card data-[active=true]:hover:bg-accent items-center group gap-2 ${active?.key !== "quiz" && 'border border-transparent'}`}
                                >
                                    <Brain />
                                    <span>Quiz</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Buat Quiz untuk module ini</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="gap-1 flex items-center flex-wrap justify-center">
                        <Separator orientation="vertical" className="!h-5 mx-0.5 hidden xl:block" />

                        <HomeRibbonCreator />

                        <Separator orientation="vertical" className="!h-5 mx-0.5" />

                        <HomeRibbonPublish />
                    </div>
                </div>
                <StripePattern />
            </div>
        </>

    );
}
