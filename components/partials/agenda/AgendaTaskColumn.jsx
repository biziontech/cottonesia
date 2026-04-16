"use client";

import { EllipsisVertical, Grid2x2Plus, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KanbanColumn, KanbanColumnHandle } from "@/components/ui/kanban";
import AgendaTaskCard from "@/components/partials/agenda/AgendaTaskCard";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function AgendaTaskColumn({
    value,
    title,
    tasks,
    onAddItem,
    onRemoveColumn,
    onEditItem,
    onRemoveItem,
    onCardClick,        // ← baru: buka detail modal
    showActions = true,
    ...props
}) {
    return (
        <KanbanColumn value={value} className="w-full overflow-hidden relative min-w-[18rem] min-h-52 max-w-xs rounded-2xl shrink-0 bg-gradient-to-br dark:border-zinc-900 from-slate-50 to-slate-100 dark:from-zinc-950 dark:to-zinc-800 " {...props}>
            <div className="absolute inset-0 z-0 pointer-events-none [background-image:repeating-linear-gradient(45deg,transparent,transparent_32px,var(--grid-line)_32px,var(--grid-line)_33px),repeating-linear-gradient(135deg,transparent,transparent_32px,var(--grid-line)_32px,var(--grid-line)_33px)] [mask-image:radial-gradient(80%_80%_at_100%_0%,rgb(0,0,0)_50%,transparent_90%)]">
            </div>
            
            <div className="mb-1 flex items-center justify-between z-10">
                <div className="flex items-center gap-0.5">
                    <KanbanColumnHandle asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                            <GripVertical className="h-4 w-4" />
                        </Button>
                    </KanbanColumnHandle>
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                        <Badge variant="outline" className="pointer-events-none rounded-md">
                            {tasks.length}
                        </Badge>
                    </div>
                </div>

                {showActions && (
                    <div className="flex">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button" variant="ghost" size="icon"
                                    className="h-7 w-7 text-muted-foreground"
                                    onClick={() => onAddItem?.(value)}
                                    onPointerDown={(e) => e.stopPropagation()}>
                                    <Grid2x2Plus className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Tambah Item</p></TooltipContent>
                        </Tooltip>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button type="button" variant="ghost" size="icon"
                                    className="h-7 w-7 text-muted-foreground"
                                    onPointerDown={(e) => e.stopPropagation()}>
                                    <EllipsisVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Aksi Kolom</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem variant="destructive" onSelect={() => onRemoveColumn?.(value)}>
                                        Hapus Kolom
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2.5 p-0.5 z-10">
                {tasks.map((task) => (
                    <AgendaTaskCard
                        key={task.id}
                        task={task}
                        showActions={showActions}
                        onCardClick={onCardClick}
                        onEdit={() => onEditItem?.(value, task)}
                        onRemove={() => onRemoveItem?.(value, task.id)}
                    />
                ))}
            </div>
        </KanbanColumn>
    );
}