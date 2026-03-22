import { toast } from 'sonner';
import { useState } from 'react';
import { Save, Trash, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Required from '@/components/partials/Required';
import { useModule } from '@/contexts/ModuleContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SparkleAi } from '@/components/partials/SparkleAi';
import { GradientGenerate } from '@/components/partials/GradientGenerate';
import { SparkleLoader } from "@/components/partials/SparkleLoader";
import { Skeleton } from '@/components/ui/skeleton';

const MAX_SUMMARY = 120;

const ResetSaveRender = ({ isGenerating, handleGenerateSummary, cancelSummaryDefault, handleSaveSummary }) => {
    return (
        <div className="flex flex-1 items-center justify-end p-3 border-t w-full border-dashed gap-2">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="group"
                        disabled={isGenerating}
                        onClick={() => handleGenerateSummary()}
                    >
                        <SparkleAi />
                        <span className="text-purple-600 font-semibold">Generate</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Generate dengan AI</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon-sm"
                        className="group"
                        onClick={() => cancelSummaryDefault()}
                    >
                        <X />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Batalkan Edit</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        size="sm"
                        onClick={() => handleSaveSummary()}
                    >
                        <Save />
                        <span>Simpan</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Simpan Perubahan</p>
                </TooltipContent>
            </Tooltip>
        </div>
    )
}

export const ModuleSummary = ({ initialSummary = "" }) => {
    const { module, moduleTemp, setModuleTemp } = useModule();
    const [summary, setSummary] = useState(initialSummary);
    const [editSummary, setEditSummary] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const cancelSummaryDefault = () => {
        setSummary(initialSummary);
        setEditSummary(false);
    }

    const handleSaveSummary = async () => {
        // simpan
        if (summary != module?.summary) {
            setModuleTemp(prev => ({
                ...prev,
                summary: summary
            }));
            // tutup
            setEditSummary(false);
        } else {
            setModuleTemp(prev => {
                const { summary: _, ...rest } = prev;
                return rest;
            });
            // tutup
            setEditSummary(false);
        }
    }

    const handleGenerateSummary = async () => {
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
                    type: "generate_summary",
                    text: "Buatkan Summary Singkat untuk Module Training Berjudul: " + title
                })
            });
            // ambil json
            const data = await res.json();
            // check
            if (data?.success) {
                // set data summary
                setSummary(data?.data?.text);
            }
        } catch (err) {
            console.log(err);
            toast.error("Error loading module");
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <GradientGenerate isGenerating={isGenerating} borderRadius="15px">
            <div className='rounded-xl bg-card text-card-foreground shadow-sm'>
                <div className='flex flex-col p-4'>
                    <h4 className='font-semibold text-sm'>Summary <Required /></h4>
                    <p className='text-xs text-muted-foreground'>Deskripsi singkat untuk materi training</p>
                </div>
                <div className='border-t border-dashed border-border p-4 flex flex-col gap-2 text-end'>
                    <div className='border border-border rounded-xl overflow-hidden'>
                        {isGenerating ? (
                            <div className='min-h-28 relative bg-linear-to-tr from-cyan-50 to-pink-100'>
                                <div className='absolute top-3 left-3 w-full h-full flex flex-col gap-2'>
                                    <Skeleton className="w-10/12 h-3 bg-yellow-50/80" />
                                    <Skeleton className="w-7/12 h-3 bg-yellow-50/80" />
                                    <Skeleton className="w-5/12 h-3 bg-yellow-50/80" />
                                    <Skeleton className="w-3/12 h-3 bg-yellow-50/80" />
                                </div>
                                <SparkleLoader size="xxs" className="absolute -bottom-7 -right-7" />
                            </div>
                        ) : (
                            <Textarea
                                maxLength={MAX_SUMMARY}
                                className="min-h-28 shadow-none border-0 focus-visible:ring-0 disabled:opacity-80"
                                disabled={!editSummary}
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                            />
                        )}
                        <div className='text-muted-foreground text-xs py-2 px-3 border-t border-dotted border-border bg-muted/50'>{summary.length} / {MAX_SUMMARY} karakter</div>
                    </div>
                </div>
                {!editSummary && (
                    <div className="flex flex-1 items-center justify-end w-full px-4 py-3 border-t border-dashed border-border">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setEditSummary(true)}>
                                    <Trash />
                                    <span>Ubah</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Ubah Summary</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                )}
                {editSummary && (
                    <ResetSaveRender isGenerating={isGenerating} handleGenerateSummary={handleGenerateSummary} cancelSummaryDefault={cancelSummaryDefault} handleSaveSummary={handleSaveSummary} />
                )}
            </div>
        </GradientGenerate>
    );
}
