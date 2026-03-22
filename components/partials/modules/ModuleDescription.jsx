'use client'

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { useModule } from "@/contexts/ModuleContext";
import { EditIcon, Eye, Loader, RotateCcw, Save } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ModuleWorkspaceTitle } from '@/components/partials/modules/ModuleWorkspaceTitle';
import { GradientGenerate } from '@/components/partials/GradientGenerate';
import { SparkleLoader } from "@/components/partials/SparkleLoader";
import { SparkleAi } from '@/components/partials/SparkleAi';
import { BookOpenText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Editor = dynamic(() => import('@/components/editor/Editor'), {
    ssr: false,
    loading: () => (
        <div className="w-full max-w-[1200px] mx-auto my-0">
            <div className="min-h-[652px] flex items-center justify-center rounded-xl bg-white shadow-sm">
                <div className="flex flex-col gap-4 items-center">
                    <Loader className="animate-spin text-gray-500" size={32} />
                    <p className="text-sm text-gray-600">Memuat Editor...</p>
                </div>
            </div>
        </div>
    ),
});

const EditorSwitchRender = ({ handleChange, editMode, description }) => {
    const { module } = useModule();

    return (
        <div className='flex flex-col'>
            {editMode ? (
                <Editor onBlur={(c) => handleChange(c)} initialContent={description ? description : module?.description} />
            ) : (
                <div className='min-h-[652px] shadow-md bg-white dark:bg-zinc-900 p-8 rounded-3xl'>
                    <article className='max-w-3xl py-10 mx-auto prose dark:prose-invert' dangerouslySetInnerHTML={{ __html: description ? description : module?.description }}>
                    </article>
                </div>
            )}
        </div>
    )
}

export const ModuleDescription = () => {
    const { module, moduleTemp, setModuleTemp } = useModule();
    const [description, setDescription] = useState(module?.description);
    const [lastSavedDescription, setLastSavedDescription] = useState(module?.description);
    const [isGenerating, setIsGenerating] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // Sync state ketika module?.description berubah (setelah fetch)
    useEffect(() => {
        if (module?.description !== undefined) {
            setDescription(module.description);
            setLastSavedDescription(module.description);
        }
    }, [module?.description]);

    // Perubahan
    const handleChange = (c) => {
        setDescription(c);
    }

    // Reset
    const handleResetDescription = () => {
        setDescription(module?.description);
        setLastSavedDescription(module?.description);
        setModuleTemp(prev => {
            const { description: _, ...rest } = prev;
            return rest;
        });

        // Check editor
        if (window.editor) {
            const defaultContent = module?.description || "";
            window.editor.commands.setContent(defaultContent);
        }
    }

    // Save
    const handleSaveDescription = () => {
        setModuleTemp(prev => ({
            ...prev,
            description: description
        }));
        setLastSavedDescription(description);
    }

    // Actions
    const ActionButton = () => {
        const hasChangedFromOriginal = description !== module?.description;
        const hasChangedFromLastSaved = description !== lastSavedDescription;
        const showButtons = hasChangedFromOriginal || hasChangedFromLastSaved;

        return (
            <>
                <div className="items-center flex justify-between md:justify-center h-full gap-2">
                    <div className='bg-gray-100 dark:bg-zinc-900 p-1 gap-1 flex rounded-lg inset-shadow-sm'>
                        <Button
                            size="sm"
                            variant={!editMode ? 'outline' : 'ghost'}
                            onClick={() => setEditMode(false)}
                            className="hover:bg-white border-0"
                        >
                            <Eye />
                            <span>Pratinjau</span>
                        </Button>
                        <Button
                            size="sm"
                            variant={editMode ? 'outline' : 'ghost'}
                            onClick={() => setEditMode(true)}
                            className="hover:bg-white border-0"
                        >
                            <EditIcon />
                            <span>Edit</span>
                        </Button>
                    </div>


                    <Separator orientation="vertical" className="!h-5 hidden md:block" />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="group"
                                disabled={isGenerating}
                                onClick={() => handleGenerateDescription()}
                            >
                                <SparkleAi />
                                <span className="text-purple-600 font-semibold">Generate</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Generate dengan AI</p>
                        </TooltipContent>
                    </Tooltip>
                    {showButtons && (
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="group"
                                        onClick={() => handleResetDescription()}
                                    >
                                        <RotateCcw className="group-hover:-rotate-90 transition-transform" />
                                        <span>Reset</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Reset ke Default</p>
                                </TooltipContent>
                            </Tooltip>

                            {hasChangedFromLastSaved && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            onClick={() => handleSaveDescription()}
                                        >
                                            <Save />
                                            <span>Simpan</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Simpan Perubahan</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </>
                    )}
                </div>
            </>
        )
    }

    // Handle Description
    const handleGenerateDescription = async () => {
        // title
        const title = module?.title ? module?.title : moduleTemp?.title ? moduleTemp?.title : null;
        // check title jika belum ada
        if (!title) {
            toast.error("Silakan buat Judul Module terlebih dahulu");
            return null;
        }
        // Generate
        try {
            setIsGenerating(true);
            // response
            const res = await fetch("https://agent.wahyuachmad.com/webhook/4f92efd7-4560-4ec5-9f2f-b6b050681bfa", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "generate_description",
                    text: "Buatkan Description untuk Module Training Berjudul: " + title
                })
            });
            // ambil json
            const data = await res.json();
            // check
            if (data?.success) {
                // set data summary
                setDescription(data?.data?.text);
                // Check editor
                if (window.editor) {
                    window.editor.commands.setContent(data?.data?.text);
                }
            }
        } catch (err) {
            console.log(err);
            toast.error("Error loading module");
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <>
            <ModuleWorkspaceTitle Action={ActionButton} active={{
                title: "Latar Belakang",
                subtitle: "Penjelasan alasan pembuatan modul ini",
                icon: BookOpenText
            }} />
            <GradientGenerate isGenerating={isGenerating} borderWidth="4px" borderRadius="15px" className='relative'>
                <div className='min-h-[696px]'>
                    {isGenerating && (
                        <>
                            <div className='absolute z-10 h-full w-full flex items-center justify-center'>
                                <SparkleLoader size='sm' />
                            </div>
                            <div className='flex items-center justify-center animate-pulse absolute w-full h-full bg-linear-to-tr z-1 from-cyan-50/80 to-pink-100/80 rounded-[12px]'></div>
                        </>
                    )}
                    <EditorSwitchRender editMode={editMode} handleChange={handleChange} description={description} />
                </div>
            </GradientGenerate>
        </>
    );
}