"use client";

import { SquarePen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export default function AgendaWorkspaceHeader({ title, description, onEdit }) {
    return (
        <div className="flex flex-col lg:flex-row my-5 justify-between items-start lg:items-end gap-y-3 lg:gap-y-0 pt-1 pb-5 mt-0 md:mx-5">
            <div className="flex flex-col">
                {title ? (
                    <div className="group inline-flex items-center gap-2">
                        <h2 className="text-xl font-bold z-[1]">{title}</h2>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="xs"
                                    variant="ghost"
                                    type="button"
                                    onClick={onEdit}
                                    className="z-[1] !px-1.5"
                                    aria-label="Edit judul workspace"
                                >
                                    <SquarePen />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent sideOffset={6}>Edit judul workspace</TooltipContent>
                        </Tooltip>
                    </div>
                ) : (
                    <Skeleton className="h-6 w-36" />
                )}
                {description ? (
                    <small className="text-xs text-stone-600 z-[1]">{description}</small>
                ) : (
                    <Skeleton className="h-4 mt-1 w-56" />
                )}
            </div>
            <span />
        </div>
    );
}
