"use client";

import { EllipsisVertical, GripVertical, CalendarDays, Lock, Archive, MessageCircleMore, Paperclip } from "lucide-react";
import { EmojiHappy, FolderOpen, Messages } from 'iconsax-reactjs';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KanbanItem, KanbanItemHandle } from "@/components/ui/kanban";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { cn } from "@/lib/utils";
import SignalTaskCard from "@/components/partials/agenda/SignalTaskCard";
import { ICON_MAP } from "@/hooks/use-agenda-iconsax";
import { CircularProgress, CircularProgressIndicator, CircularProgressRange, CircularProgressTrack } from "@/components/ui/circular-progress";



// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPriorityBadgeVariant(priority) {
    if (priority === "high") return "danger";
    if (priority === "medium") return "warning";
    return "success";
}

function getInitials(name = "") {
    return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

function avatarColor(name = "") {
    const colors = ["bg-red-400", "bg-blue-400", "bg-green-400", "bg-purple-400", "bg-orange-400", "bg-pink-400"];
    return colors[name.charCodeAt(0) % colors.length];
}

function formatDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.toLocaleDateString("id-ID", { month: "short" });
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
}

function formatDateRange(startDate, endDate) {
    if (!startDate && !endDate) return null;

    if (!endDate || startDate === endDate) {
        return formatDate(startDate);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const startDay = start.getDate();
    const endDay = end.getDate();
    const endMonth = end.toLocaleDateString("id-ID", { month: "short" });
    const year = end.getFullYear();

    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
        // Range dalam 1 bulan: 7 - 8 Nov, 2025
        return `${startDay} - ${endDay} ${endMonth}, ${year}`;
    }

    // Beda bulan: 7 Okt - 8 Nov, 2025
    const startMonth = start.toLocaleDateString("id-ID", { month: "short" });
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
}

function isOverdue(dateStr) {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date(new Date().toDateString());
}

// ─── AvatarGroup ─────────────────────────────────────────────────────────────

function hexToRgba(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)

    return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// ─── Main Card Component ────────────────────────────────────────────────────── 

export default function AgendaTaskCard({
    task,
    onEdit,
    onRemove,
    onCardClick,
    onToggleLock,
    onToggleArchive,
    showActions = true,
    ...props
}) {
    const overdue = isOverdue(task.dueDate);
    const hasRange = task.startDate && task.dueDate;
    const dateLabel = hasRange
        ? `${formatDateRange(task.startDate, task.dueDate)}`
        : formatDate(task.dueDate);

    return (
        <KanbanItem value={task.id} asChild {...props}>
            <article className="rounded-xl border bg-white dark:bg-zinc-800/80 pt-3 pb-3 shadow-sm transition-shadow duration-300 hover:shadow-md relative overflow-hidden group">
                <div className="bg-card-login absolute inset-0 z-0 -top-px -left-px pointer-events-none"></div>

                <div className="relative flex flex-col gap-2 !z-10">
                    {/* Title row */}
                    <div className="px-1.5">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1 min-w-0">
                                <div className="!size-6 !min-w-6 flex items-center relative">
                                    <KanbanItemHandle asChild>
                                        <Button type="button" variant="ghost" size="icon"
                                            disabled={task?.isLocked}
                                            className="h-6 w-6 top-0 bottom-0 my-auto shrink-0 group-hover:opacity-100 opacity-0 text-muted-foreground transition-opacity duration-300 hover:bg-transparent">
                                            <GripVertical className="h-3.5 w-3.5" />
                                        </Button>
                                    </KanbanItemHandle>
                                    {/* signal : active / idle / lagging */}
                                    <SignalTaskCard task={task} className="absolute top-0 bottom-0" />
                                </div>

                                {/* Clickable title → opens detail modal */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                            className="text-sm font-medium text-foreground text-left line-clamp-1 hover:text-primary transition-colors cursor-pointer"
                                            onPointerDown={(e) => e.stopPropagation()}
                                            onClick={() => onCardClick?.(task)}
                                        >
                                            {task.title}
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{task.title}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>



                            <div className="flex items-center gap-1 shrink-0">
                                {task?.isLocked && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span className="inline-flex items-center justify-center size-5 rounded-md border border-border bg-muted/60 text-muted-foreground">
                                                <Lock className="size-3" />
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Card terkunci</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                                {task?.isArchive && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span className="inline-flex items-center justify-center size-5 rounded-md border border-border bg-muted/60 text-muted-foreground">
                                                <Archive className="size-3" />
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Card diarsipkan</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                                <Badge
                                    variant={getPriorityBadgeVariant(task.priority)}
                                    className="pointer-events-none h-5 rounded-md px-1.5 text-[11px] capitalize"
                                >
                                    <span>{task.priority}</span>
                                </Badge>

                                {showActions && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button type="button" variant="ghost" size="icon"
                                                className="h-6 w-6 text-muted-foreground hover:bg-transparent"
                                                onPointerDown={(e) => e.stopPropagation()}>
                                                <EllipsisVertical className="h-3.5 w-3.5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Aksi Item</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem onSelect={() => onCardClick?.(task)}>Buka Detail</DropdownMenuItem>
                                                <DropdownMenuItem disabled={task?.isLocked} onSelect={() => onEdit?.()}>Edit Cepat</DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => onToggleLock?.(task)}>
                                                    {task?.isLocked ? "Buka Kunci Card" : "Kunci Card"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => onToggleArchive?.(task)}>
                                                    {task?.isArchive ? "Pulihkan Card" : "Arsipkan Card"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem disabled={task?.isLocked} variant="destructive" onSelect={() => onRemove?.()}>Hapus</DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    {/* <div className="px-3 py-1">
                        <div className="aspect-video bg-muted/80 rounded-xl relative overflow-hidden">
                        </div>
                    </div> */}

                    {/* Description preview */}
                    {task.description && (
                        <div className="px-4">
                            <p
                                className="line-clamp-3 text-xs text-muted-foreground font-geist">
                                {task.description}
                            </p>
                        </div>
                    )}

                    {((task.assignees?.length > 0) || (task.labels?.length > 0)) && (
                        <div className="px-3 mt-1.5 flex flex-wrap gap-1 items-center">
                            {/* Avatar group */}
                            {task.assignees?.length > 0
                                ? (
                                    <AvatarGroup max={3} className="items-center">
                                        {task.assignees.map((a, idx) => (
                                            <Avatar
                                                key={a.id ?? a.admin_id ?? idx}
                                                className="size-6 hover:z-10 border-white dark:border-zinc-800"
                                                title={a.name}
                                            >
                                                <AvatarFallback className={cn("text-[9px] font-semibold text-white", avatarColor(a.name ?? ""))}>
                                                    {getInitials(a.name ?? "")}
                                                </AvatarFallback>
                                            </Avatar>
                                        ))}
                                    </AvatarGroup>
                                )
                                : <span />
                            }
                            {/* Labels */}
                            {task.labels?.length > 0 && (
                                <>
                                    {task.labels.map(label => {
                                        const IconComp = label.iconKey ? ICON_MAP[label.iconKey] : null;
                                        return (
                                            <Badge key={label.id} variant="outline" size={IconComp ? 'icon-md' : 'md'} className="rounded-md gap-1.5 font-semibold h-fit group items-center" style={{ backgroundColor: hexToRgba(label.color, 0.15), borderColor: hexToRgba(label.color, 0.2) }}>
                                                {IconComp && (
                                                    <IconComp
                                                        variant={label.iconVariant ?? "Bulk"}
                                                        color={label?.color ?? 'white'}
                                                    />
                                                )}
                                                <span style={{ color: label.color }}>{label.name}</span>
                                            </Badge>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    )}

                    {/* Footer */}
                    {((task?.media_count > 0) || (task?.comments_count > 0) || (task?.checklist_progress?.percent > 0) || dateLabel) && (
                        <div className="px-3 pt-3 border-t border-dashed">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex gap-2.5">
                                    {task?.media_count > 0 && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="text-muted-foreground flex items-center gap-1 font-geist cursor-default">
                                                    <Paperclip className="size-3.5" />
                                                    <span className="text-xs font-medium">{task?.media_count ?? 0}</span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Jumlah Attactment</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    )}

                                    {task?.comments_count > 0 && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="flex items-center gap-1 font-geist text-muted-foreground cursor-default">
                                                    <MessageCircleMore variant="Linear" className="size-3.5" />
                                                    <span className="text-xs font-medium">{task?.comments_count ?? 0}</span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Jumlah Komentar</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    )}

                                    {task?.checklist_progress?.percent > 0 && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="flex items-center gap-1.5 font-geist text-muted-foreground cursor-default">
                                                    <CircularProgress
                                                        value={task?.checklist_progress?.percent ?? 0}
                                                        min={0}
                                                        max={100}
                                                        size={16}
                                                        thickness={2.5}
                                                    >
                                                        <CircularProgressIndicator>
                                                            <CircularProgressTrack className="text-emerald-200 dark:text-emerald-900" />
                                                            <CircularProgressRange className="text-emerald-500" />
                                                        </CircularProgressIndicator>
                                                    </CircularProgress>
                                                    <span className="text-xs font-medium">{task?.checklist_progress?.done}/{task?.checklist_progress?.total}</span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Checklist Terselesaikan</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    )}

                                </div>

                                {/* Date range / due date */}
                                {dateLabel && (
                                    <div className={cn(
                                        "flex items-center gap-1 text-xs font-geist font-medium",
                                        overdue ? "text-destructive" : "text-muted-foreground"
                                    )}>
                                        <CalendarDays className="size-3.5" />
                                        <span>{dateLabel}</span>
                                        {overdue && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4 ms-0.5">
                                                        <g>
                                                            <path d="M21.76 15.92L15.36 4.4C14.5 2.85 13.31 2 12 2C10.69 2 9.49998 2.85 8.63998 4.4L2.23998 15.92C1.42998 17.39 1.33998 18.8 1.98998 19.91C2.63998 21.02 3.91998 21.63 5.59998 21.63H18.4C20.08 21.63 21.36 21.02 22.01 19.91C22.66 18.8 22.57 17.38 21.76 15.92ZM11.25 9C11.25 8.59 11.59 8.25 12 8.25C12.41 8.25 12.75 8.59 12.75 9V14C12.75 14.41 12.41 14.75 12 14.75C11.59 14.75 11.25 14.41 11.25 14V9ZM12.71 17.71C12.66 17.75 12.61 17.79 12.56 17.83C12.5 17.87 12.44 17.9 12.38 17.92C12.32 17.95 12.26 17.97 12.19 17.98C12.13 17.99 12.06 18 12 18C11.94 18 11.87 17.99 11.8 17.98C11.74 17.97 11.68 17.95 11.62 17.92C11.56 17.9 11.5 17.87 11.44 17.83C11.39 17.79 11.34 17.75 11.29 17.71C11.11 17.52 11 17.26 11 17C11 16.74 11.11 16.48 11.29 16.29C11.34 16.25 11.39 16.21 11.44 16.17C11.5 16.13 11.56 16.1 11.62 16.08C11.68 16.05 11.74 16.03 11.8 16.02C11.93 15.99 12.07 15.99 12.19 16.02C12.26 16.03 12.32 16.05 12.38 16.08C12.44 16.1 12.5 16.13 12.56 16.17C12.61 16.21 12.66 16.25 12.71 16.29C12.89 16.48 13 16.74 13 17C13 17.26 12.89 17.52 12.71 17.71Z" className="fill-rose-500 animate-pulse" />
                                                        </g>
                                                        <defs>
                                                            <clipPath>
                                                                <rect className="size-4" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Overdue</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </article>
        </KanbanItem>
    );
}
