'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useModule } from "@/contexts/ModuleContext";
import { RotateCcw, Save, GripVertical, X, Trash, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ModuleWorkspaceTitle } from '@/components/partials/modules/ModuleWorkspaceTitle';
import { Sortable, SortableContent, SortableItem, SortableItemHandle, SortableOverlay } from "@/components/ui/sortable";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GradientGenerate } from '@/components/partials/GradientGenerate';
import { SparkleLoader } from '@/components/partials/SparkleLoader';
import { SparkleAi } from '@/components/partials/SparkleAi';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import Required from '../../Required';


export const HomeRibbonObjective = () => {
    const { module, moduleTemp, setModuleTemp } = useModule();
    const [objective, setObjective] = useState(module?.objective || []);
    const [lastSavedObjective, setLastSavedObjective] = useState(module?.objective || []);
    const [isGenerating, setIsGenerating] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', subtitle: '' });

    // Handle Edit
    const handleEditClick = (item) => {
        setEditingId(item.id);
        setEditForm({ title: item.title, subtitle: item.subtitle });
    };

    // Handle Cancel Edit
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({ title: '', subtitle: '' });
    };

    // Handle Save Edit
    const handleSaveEdit = (id) => {
        setObjective(prev => prev.map(item =>
            item.id === id
                ? { ...item, title: editForm.title, subtitle: editForm.subtitle }
                : item
        ));
        setEditingId(null);
        setEditForm({ title: '', subtitle: '' });
    };

    // Update handleResetObjective
    const handleResetObjective = () => {
        setObjective(module?.objective);
        setLastSavedObjective(module?.objective);
        setModuleTemp(prev => {
            const { objective: _, ...rest } = prev;
            return rest;
        });
    }

    // Update handleSaveObjective
    const handleSaveObjective = () => {
        setModuleTemp(prev => ({
            ...prev,
            objective: objective
        }));
        setLastSavedObjective(objective);
    }

    // Actions
    const ActionButton = () => {
        const hasChangedFromOriginal = JSON.stringify(objective) !== JSON.stringify(module?.objective);
        const hasChangedFromLastSaved = JSON.stringify(objective) !== JSON.stringify(lastSavedObjective);
        const showButtons = hasChangedFromOriginal || hasChangedFromLastSaved;

        return (
            <>
                <div className="items-center flex justify-center h-full gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="group"
                                disabled={isGenerating}
                                onClick={() => handleGenerateObjective()}
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
                                        onClick={() => handleResetObjective()}
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
                                            onClick={() => handleSaveObjective()}
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

    // Handle Objective
    const handleGenerateObjective = async () => {
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
                    type: "generate_objective",
                    text: "Buatkan Objective untuk Module Training Berjudul: " + title
                })
            });
            // ambil json
            const data = await res.json();
            // check
            if (data?.success && data?.data?.text) {
                let parsedObjective;
                // try parse JSON
                try {
                    parsedObjective = JSON.parse(data.data.text);
                    // validasi dasar: harus array
                    if (!Array.isArray(parsedObjective)) {
                        throw new Error("Objective bukan array");
                    }
                    // kalau lolos semua
                    setObjective(parsedObjective);
                } catch (parseError) {
                    console.error("JSON Parse Error:", parseError);
                    toast.error("Format objective tidak valid");
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
            <ModuleWorkspaceTitle Action={ActionButton} />
            <GradientGenerate isGenerating={isGenerating} borderWidth="4px" borderRadius="15px" className='relative'>
                {isGenerating && (
                    <>
                        <div className='absolute z-10 h-full w-full flex items-center justify-center'>
                            <SparkleLoader size='sm' />
                        </div>
                        <div className='flex items-center justify-center animate-pulse absolute w-full h-full bg-linear-to-tr z-1 from-cyan-50/80 to-pink-100/80 rounded-[12px]'></div>
                    </>
                )}
                <div className='bg-card text-card-foreground shadow-sm rounded-xl p-4 flex flex-col gap-4'>
                    <div className='flex justify-end'>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    size="sm"
                                    disabled={isGenerating}
                                >
                                    <Plus />
                                    <span>Tambah</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Tambah Tujuan Module</DialogTitle>
                                    <DialogDescription></DialogDescription>
                                </DialogHeader>
                                <div className='flex flex-col gap-4'>
                                    <div className='flex flex-col gap-2'>
                                        <Label htmlFor="objective-title" className="text-xs">Tujuan module <Required /></Label>
                                        <Input
                                            id="objective-title"
                                            value={editForm.title}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="Judul Tujuan"
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <Label htmlFor="objective-subtitle" className="text-xs">Deskripsi</Label>
                                        <Textarea
                                            id="objective-subtitle"
                                            value={editForm.subtitle}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, subtitle: e.target.value }))}
                                            placeholder="Deskripsi Tujuan"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <DialogClose asChild>
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setObjective(prev => [...prev, {
                                                    id: Date.now().toString(),
                                                    title: editForm.title,
                                                    subtitle: editForm.subtitle
                                                }]);
                                                setEditForm({ title: '', subtitle: '' });
                                            }}
                                        >
                                            <Save className="h-4 w-4" />
                                            <span>Simpan</span>
                                        </Button>
                                    </DialogClose>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className='border border-border rounded-xl'>
                        {objective?.length > 0 ? (
                            <Sortable
                                value={objective}
                                onValueChange={setObjective}
                                getItemValue={(item) => item.id}
                            >
                                <SortableContent className="flex flex-col gap-0 divide-y divide-dashed">
                                    {objective.map((item, index) => (
                                        <SortableItem key={item.id} value={item.id}>
                                            {editingId === item.id ? (
                                                // Edit Mode
                                                <div className='pe-4 ps-3 py-4 flex flex-col gap-3 bg-muted/50'>
                                                    <div className='flex gap-3'>
                                                        <div className='flex items-center'>
                                                            <div className="text-muted-foreground block">
                                                                <GripVertical className="h-5 w-5 text-muted-foreground opacity-50" />
                                                            </div>
                                                        </div>
                                                        <div className='font-mono text-base min-w-8 text-primary font-medium text-center mt-2'>{index + 1}.</div>
                                                        <div className='flex-1 flex flex-col gap-0 bg-card rounded-lg shadow-sm border border-border/60'>
                                                            <Input
                                                                value={editForm.title}
                                                                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                                                placeholder="Judul objective"
                                                                className="font-semibold focus-visible:ring-0 shadow-none border-0 border-b border-dashed rounded-none"
                                                            />
                                                            <Textarea
                                                                value={editForm.subtitle}
                                                                onChange={(e) => setEditForm(prev => ({ ...prev, subtitle: e.target.value }))}
                                                                placeholder="Deskripsi objective"
                                                                className="text-sm focus-visible:ring-0 resize-none shadow-none border-0 rounded-none"
                                                                rows={2}
                                                            />
                                                        </div>
                                                        <div className='flex items-center justify-center gap-2 pt-1 flex-col'>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleSaveEdit(item.id)}
                                                                    >
                                                                        <Save className="h-4 w-4" />
                                                                        <span>Simpan</span>
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Simpan</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={handleCancelEdit}
                                                                        className="w-full"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                        <span>Batal</span>
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Batal</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                // View Mode
                                                <div className='pe-4 ps-3 py-4 flex hover:bg-muted/50 transition-colors duration-400 gap-3'>
                                                    <div className='flex items-center'>
                                                        <SortableItemHandle className="cursor-grab text-muted-foreground block">
                                                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                                                        </SortableItemHandle>
                                                    </div>
                                                    <div className='font-mono text-base min-w-8 text-primary font-medium text-center mt-0.5'>{index + 1}.</div>
                                                    <div className='flex flex-col gap-1 flex-1'>
                                                        <div className='text-base font-semibold text-foreground'>{item?.title}</div>
                                                        <p className='text-sm text-muted-foreground line-clamp-2'>{item?.subtitle}</p>
                                                    </div>
                                                    <div className='flex items-center justify-center gap-2'>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleEditClick(item)}
                                                        >
                                                            <span>Ubah</span>
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    size="icon-sm"
                                                                    variant="outline"
                                                                >
                                                                    <Trash />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Apa ingin menghapus tujuan ini ?</AlertDialogTitle>
                                                                    <AlertDialogDescription>Tindakan ini akan menghapus tujuan untuk sementara. Anda masih bisa pulihkan dengan mereset ke awal.</AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => {
                                                                        setObjective(prev => prev.filter(i => i.id !== item.id));
                                                                        toast.success("Tujuan telah dihapus");
                                                                    }}>Continue</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>
                                            )}
                                        </SortableItem>
                                    ))}
                                </SortableContent>

                                <SortableOverlay>
                                    {({ value }) => {
                                        const item = objective.find(i => i.id === value);
                                        const itemIndex = objective.findIndex(i => i.id === value);
                                        return (
                                            <div className='pe-4 ps-3 py-4 flex bg-card shadow-lg border border-border rounded-lg gap-3'>
                                                <div className='flex items-center'>
                                                    <div className="cursor-grab text-muted-foreground block">
                                                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                </div>
                                                <div className='font-mono text-base min-w-8 text-primary font-medium text-center mt-0.5'>{itemIndex + 1}.</div>
                                                <div className='flex flex-col gap-1'>
                                                    <div className='text-base font-semibold'>{item?.title}</div>
                                                    <p className='text-sm text-muted-foreground line-clamp-2'>{item?.subtitle}</p>
                                                </div>
                                            </div>
                                        );
                                    }}
                                </SortableOverlay>
                            </Sortable>
                        ) : (
                            <div className='flex items-center justify-center p-4 min-h-20'>
                                <p className='text-sm'>Belum ada Tujuan, Silakan tambahakan</p>
                            </div>
                        )}
                    </div>
                </div>
            </GradientGenerate>
        </>
    );
}
