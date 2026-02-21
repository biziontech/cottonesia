import { Info, Milestone, Airplay, FileInput } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export const ModuleRibbonSlides = () => {

    return (
        <div className="flex gap-3">
            <div className="text-sm text-gray-600 flex bg-white rounded-xl shadow-sm flex-col items-center">
                <div className="flex flex-col items-center justify-end p-2 rounded-lg gap-2">
                    <div className="flex divide-x">
                        <div>
                            <Button variant="ghost" className="flex h-auto flex-col gap-1.5 items-center justify-center cursor-pointer group">
                                <Airplay />
                                <small>New</small>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="px-3 pb-1.5 pt-1 border-t w-full text-center">
                    <small className="font-semibold">Slide</small>
                </div>
            </div>
        </div>
    );
}