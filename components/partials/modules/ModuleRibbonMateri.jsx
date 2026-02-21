import { Info, Milestone, PencilRuler, FileInput } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export const ModuleRibbonMateri = () => {
    return (
        <div className="flex gap-3">
            <div className="text-sm text-gray-600 flex bg-white rounded-xl shadow-sm flex-col items-center">
                <div className="flex flex-col items-center justify-end p-2 rounded-lg gap-2">
                    <div className="flex divide-x">
                        <div className="pe-1.5">
                            <Button variant="ghost" className="flex h-auto flex-col gap-1.5 items-center justify-center cursor-pointer group">
                                <FileInput />
                                <small>Import</small>
                            </Button>
                        </div>
                        <div className="flex flex-col justify-start items-start ps-1.5">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="xs" className="flex items-center justify-start text-xs w-full">
                                        <Milestone className="w-4 h-4" />
                                        <span>Tujuan</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Tujuan dari modul ini dibuat</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="xs" className="flex items-center justify-start text-xs">
                                        <Info className="w-4 h-4" />
                                        <span>Informasi</span>
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
                    <small className="font-semibold">Materi</small>
                </div>
            </div>
        </div>
    );
}