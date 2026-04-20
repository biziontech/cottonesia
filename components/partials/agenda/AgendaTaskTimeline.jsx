"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
    CalendarDays, Clock, MessageCircleMore,
    Lock, Archive, GripVertical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const VIEWS = [
    { key: "day", label: "Per Hari", icon: "☀️" },
    { key: "month", label: "Per Bulan", icon: "📅" },
    { key: "year", label: "Per Tahun", icon: "🗓️" },
];

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const MONTH_NAMES_FULL = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const ROW_HEIGHT = 74;   // px per row
const COL_W_DAY = 80;   // px per hour  (24 cols)
const COL_W_MONTH = 80;   // px per day   (~30 cols)
const COL_W_YEAR = 150;  // px per month (12 cols)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name = "") {
    return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

function avatarColor(name = "") {
    const colors = ["bg-red-400", "bg-blue-400", "bg-green-400", "bg-purple-400", "bg-orange-400", "bg-pink-400"];
    return colors[name.charCodeAt(0) % colors.length];
}

function getPriorityVariant(priority) {
    if (priority === "high") return "danger";
    if (priority === "medium") return "warning";
    return "success";
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function resolveColor(task) {
    if (task.color) return task.color;
    if (task.labels?.[0]?.color) return task.labels[0].color;
    if (task.priority === "high") return "#ef4444";
    if (task.priority === "medium") return "#f59e0b";
    return "#10b981";
}

function isOverdue(dateStr) {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date(new Date().toDateString());
}

function formatDateLabel(task) {
    if (!task.startDate && !task.dueDate) return null;
    const d = new Date(task.dueDate ?? task.startDate);
    return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

// ─── Greedy row packing ────────────────────────────────────────────────────────

function assignRows(tasks) {
    const sorted = [...tasks].sort((a, b) => a.startCol - b.startCol);
    const rowEnds = [];
    return sorted.map(task => {
        let row = rowEnds.findIndex(end => end <= task.startCol);
        if (row === -1) row = rowEnds.length;
        rowEnds[row] = task.endCol;
        return { ...task, row };
    });
}

// ─── Position computation ──────────────────────────────────────────────────────

function computePositions(tasks, view, now) {
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = getDaysInMonth(year, month);

    return tasks.map(task => {
        const start = task.startDate ? new Date(task.startDate) : null;
        const end = task.dueDate ? new Date(task.dueDate) : null;

        let startCol = 0, endCol = 1;

        if (view === "day") {
            startCol = start ? start.getHours() : 8;
            endCol = end ? Math.min(end.getHours() + 1, 24) : startCol + 2;
        } else if (view === "month") {
            startCol = start ? Math.max(0, start.getDate() - 1) : 0;
            endCol = end ? Math.min(daysInMonth, end.getDate()) : startCol + 2;
        } else {
            startCol = start ? start.getMonth() : 0;
            endCol = end ? Math.min(12, end.getMonth() + 1) : startCol + 1;
        }

        if (endCol <= startCol) endCol = startCol + 1;
        return { ...task, startCol, endCol };
    });
}

// ─── Now line helpers ──────────────────────────────────────────────────────────

function getColWidth(view) {
    if (view === "day") return COL_W_DAY;
    if (view === "month") return COL_W_MONTH;
    return COL_W_YEAR;
}

function getNowX(view, now, colWidth) {
    const year = now.getFullYear();
    const month = now.getMonth();
    if (view === "day") {
        const mins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
        return (mins / (24 * 60)) * 24 * colWidth;
    }
    if (view === "month") {
        const days = getDaysInMonth(year, month);
        const d = (now.getDate() - 1) + now.getHours() / 24 + now.getMinutes() / 1440;
        return (d / days) * days * colWidth;
    }
    const dayOfYear = Math.floor((now - new Date(year, 0, 1)) / 86400000);
    const daysInYear = year % 4 === 0 ? 366 : 365;
    return (dayOfYear / daysInYear) * 12 * colWidth;
}

function getNowColIdx(view, now) {
    if (view === "day") return now.getHours();
    if (view === "month") return now.getDate() - 1;
    return now.getMonth();
}

function getNowLabel(view, now) {
    if (view === "day")
        return now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    if (view === "month")
        return `${now.getDate()} ${MONTH_NAMES[now.getMonth()]}`;
    return MONTH_NAMES[now.getMonth()];
}

function buildHeaders(view, now) {
    const year = now.getFullYear();
    const month = now.getMonth();
    if (view === "day") {
        return Array.from({ length: 24 }, (_, i) => ({
            label: `${i.toString().padStart(2, "0")}:00`,
            sub: null,
            weekend: false,
        }));
    }
    if (view === "month") {
        const days = getDaysInMonth(year, month);
        return Array.from({ length: days }, (_, i) => {
            const dow = new Date(year, month, i + 1).getDay();
            return {
                label: String(i + 1),
                sub: DAY_NAMES[dow],
                weekend: dow === 0 || dow === 6,
            };
        });
    }
    return MONTH_NAMES.map(m => ({ label: m, sub: String(year), weekend: false }));
}

// ─── Timeline Task Card ────────────────────────────────────────────────────────

function TimelineTaskCard({ task, colWidth, onCardClick }) {
    const [hovered, setHovered] = useState(false);
    const cardColor = resolveColor(task);
    const overdue = isOverdue(task.dueDate);
    const dateLabel = formatDateLabel(task);

    const left = task.startCol * colWidth + 2;
    const width = Math.max((task.endCol - task.startCol) * colWidth - 6, 130);
    const top = task.row * ROW_HEIGHT + 5;
    const height = ROW_HEIGHT - 12;

    return (
        <div
            className={cn(
                "absolute rounded-xl border bg-white dark:bg-zinc-800/80 shadow-sm",
                "transition-all duration-200 overflow-hidden cursor-pointer",
                hovered && "shadow-md -translate-y-px z-10 border-border",
            )}
            style={{ left, top, width, height }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onCardClick?.(task)}
        >
            {/* Subtle card mesh (matches AgendaTaskCard) */}
            <div className="bg-card-login absolute inset-0 z-0 -top-px -left-px pointer-events-none" />

            {/* Left colour accent */}
            <div
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl z-[1]"
                style={{ background: cardColor }}
            />

            <div className="relative z-10 flex flex-col justify-between h-full pl-4 pr-2.5 py-2">
                {/* Title row */}
                <div className="flex items-start justify-between gap-1.5 min-w-0">
                    <span className="text-[12px] font-medium text-foreground line-clamp-1 flex-1 min-w-0 leading-tight">
                        {task.title}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                        {task?.isLocked && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="inline-flex items-center justify-center size-4 rounded border border-border bg-muted/60 text-muted-foreground">
                                        <Lock className="size-2.5" />
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent><p>Card terkunci</p></TooltipContent>
                            </Tooltip>
                        )}
                        {task?.isArchive && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="inline-flex items-center justify-center size-4 rounded border border-border bg-muted/60 text-muted-foreground">
                                        <Archive className="size-2.5" />
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent><p>Diarsipkan</p></TooltipContent>
                            </Tooltip>
                        )}
                        <Badge
                            variant={getPriorityVariant(task.priority)}
                            className="pointer-events-none h-4 rounded-md px-1.5 text-[10px] capitalize"
                        >
                            {task.priority}
                        </Badge>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-2 justify-between">
                    {/* Assignees */}
                    {task.assignees?.length > 0 && (
                        <AvatarGroup max={3} className="items-center">
                            {task.assignees.map((a, idx) => (
                                <Avatar
                                    key={a.id ?? a.admin_id ?? idx}
                                    className="size-5 border-white dark:border-zinc-800"
                                    title={a.name}
                                >
                                    <AvatarFallback
                                        className={cn("text-[8px] font-semibold text-white", avatarColor(a.name ?? ""))}
                                    >
                                        {getInitials(a.name ?? "")}
                                    </AvatarFallback>
                                </Avatar>
                            ))}
                        </AvatarGroup>
                    )}

                    <div className="flex items-center gap-2 ml-auto">
                        {/* Labels */}
                        {task.labels?.slice(0, 1).map(label => (
                            <Badge
                                key={label.id}
                                variant="outline"
                                className="h-4 px-1.5 text-[9px] rounded-md"
                                style={{
                                    borderColor: label.color + "40",
                                    color: label.color,
                                    background: label.color + "18",
                                }}
                            >
                                {label.name}
                            </Badge>
                        ))}

                        {/* Comments */}
                        {(task?.comments_count ?? 0) > 0 && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center gap-1 text-muted-foreground cursor-default">
                                        <MessageCircleMore className="size-3" />
                                        <span className="text-[10px] font-medium font-geist">
                                            {task.comments_count}
                                        </span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent><p></p></TooltipContent>
                            </Tooltip>
                        )}

                        {/* Due date */}
                        {dateLabel && (
                            <div className={cn(
                                "flex items-center gap-1 text-[10px] font-medium font-geist",
                                overdue ? "text-destructive" : "text-muted-foreground"
                            )}>
                                <CalendarDays className="size-3" />
                                <span>{dateLabel}</span>
                                {overdue && (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-3.5">
                                        <path d="M21.76 15.92L15.36 4.4C14.5 2.85 13.31 2 12 2C10.69 2 9.49998 2.85 8.63998 4.4L2.23998 15.92C1.42998 17.39 1.33998 18.8 1.98998 19.91C2.63998 21.02 3.91998 21.63 5.59998 21.63H18.4C20.08 21.63 21.36 21.02 22.01 19.91C22.66 18.8 22.57 17.38 21.76 15.92ZM11.25 9C11.25 8.59 11.59 8.25 12 8.25C12.41 8.25 12.75 8.59 12.75 9V14C12.75 14.41 12.41 14.75 12 14.75C11.59 14.75 11.25 14.41 11.25 14V9ZM12.71 17.71C12.66 17.75 12.61 17.79 12.56 17.83C12.5 17.87 12.44 17.9 12.38 17.92C12.32 17.95 12.26 17.97 12.19 17.98C12.13 17.99 12.06 18 12 18C11.94 18 11.87 17.99 11.8 17.98C11.74 17.97 11.68 17.95 11.62 17.92C11.56 17.9 11.5 17.87 11.44 17.83C11.39 17.79 11.34 17.75 11.29 17.71C11.11 17.52 11 17.26 11 17C11 16.74 11.11 16.48 11.29 16.29C11.34 16.25 11.39 16.21 11.44 16.17C11.5 16.13 11.56 16.1 11.62 16.08C11.68 16.05 11.74 16.03 11.8 16.02C11.93 15.99 12.07 15.99 12.19 16.02C12.26 16.03 12.32 16.05 12.38 16.08C12.44 16.1 12.5 16.13 12.56 16.17C12.61 16.21 12.66 16.25 12.71 16.29C12.89 16.48 13 16.74 13 17C13 17.26 12.89 17.52 12.71 17.71Z"
                                            className="fill-rose-500 animate-pulse"
                                        />
                                    </svg>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Now Line ──────────────────────────────────────────────────────────────────

function NowLine({ x, label }) {
    return (
        <div
            className="absolute top-0 bottom-0 z-[15] pointer-events-none"
            style={{ left: x, width: 2 }}
        >
            {/* Gradient bar */}
            <div className="absolute inset-0 bg-gradient-to-b from-rose-500 via-orange-400 to-rose-500 opacity-75 animate-pulse" />

            {/* Top label */}
            <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                {label}
            </div>
            {/* Diamond knob */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 rotate-45 size-2 bg-rose-500 shadow" />
            {/* Bottom NOW */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-rose-500/60 text-white text-[8px] font-mono font-semibold px-1.5 py-px rounded-full whitespace-nowrap">
                NOW
            </div>
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AgendaTaskTimeline({
    tasks = [],
    onCardClick,
    className,
}) {
    const [view, setView] = useState("day");
    const [now, setNow] = useState(new Date());
    const wrapRef = useRef(null);

    // Real-time ticker
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const colWidth = getColWidth(view);
    const headers = useMemo(() => buildHeaders(view, now), [view, now?.getDate(), now?.getMonth(), now?.getFullYear()]);
    const nowColIdx = getNowColIdx(view, now);
    const nowX = getNowX(view, now, colWidth);
    const nowLabel = getNowLabel(view, now);
    const totalW = headers.length * colWidth;

    // Position + row-pack tasks
    const positioned = useMemo(() => {
        const withPos = computePositions(tasks, view, now);
        return assignRows(withPos);
    }, [tasks, view, now.getDate(), now.getMonth(), now.getFullYear()]);

    const maxRow = positioned.length > 0 ? Math.max(...positioned.map(t => t.row)) + 1 : 1;
    const boardH = maxRow * ROW_HEIGHT + 16;

    // Scroll now-line to center when view switches
    useEffect(() => {
        if (wrapRef.current) {
            const offset = nowX - wrapRef.current.clientWidth / 2;
            wrapRef.current.scrollLeft = Math.max(0, offset);
        }
    }, [view]);

    const viewLabel = view === "day"
        ? now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
        : view === "month"
            ? `${MONTH_NAMES_FULL[now.getMonth()]} ${now.getFullYear()}`
            : `Tahun ${now.getFullYear()}`;

    // Footer stats
    const countByStatus = (s) => tasks.filter(t => (t.status ?? t.st) === s).length;

    return (
        <div className={cn(
            "relative w-full rounded-2xl border overflow-hidden",
            "bg-gradient-to-br from-slate-50 to-slate-100",
            "dark:from-zinc-950 dark:to-zinc-800 dark:border-zinc-900",
            className
        )}>
            {/* Diagonal grid pattern (matches AgendaTaskColumn) */}
            <div className="absolute inset-0 z-0 pointer-events-none
                [background-image:repeating-linear-gradient(45deg,transparent,transparent_32px,var(--grid-line)_32px,var(--grid-line)_33px),repeating-linear-gradient(135deg,transparent,transparent_32px,var(--grid-line)_32px,var(--grid-line)_33px)]
                [mask-image:radial-gradient(80%_80%_at_100%_0%,rgb(0,0,0)_50%,transparent_90%)]"
            />

            {/* ── Toolbar ───────────────────────────────────────────────────── */}
            <div className="relative z-10 flex items-center justify-between gap-3 px-4 py-2.5 border-b border-dashed border-border/60 flex-wrap gap-y-2">
                {/* View tabs */}
                <div className="flex gap-2">
                    <div className="bg-muted/60 p-0.5 gap-0.5 flex rounded-lg border border-border/50">
                        {VIEWS.map((v) => (
                            <Button
                                key={v.key}
                                size="xs"
                                variant={view === v.key ? "outline" : "ghost"}
                                onClick={() => setView(v.key)}
                                className={cn(
                                    "px-2.5 text-xs border rounded-md",
                                    view === v.key && "bg-background shadow-xs border border-border",
                                    view !== v.key && "border-transparent"
                                )}>
                                <span>{v.label}</span>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Right: live indicator + clock + label */}
                <div className="flex items-center gap-3">
                    {/* Live pulse */}
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex size-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                        </span>
                        <span className="text-[11px] text-muted-foreground font-medium">Live</span>
                    </div>

                    {/* Clock */}
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="size-3.5" />
                        <span className="text-[11px] font-mono font-medium tabular-nums">
                            {now.toLocaleTimeString("id-ID")}
                        </span>
                    </div>

                    {/* Period badge */}
                    <Badge variant="outline" className="rounded-lg text-[11px] font-medium capitalize">
                        {viewLabel}
                    </Badge>
                </div>
            </div>

            {/* ── Scrollable Timeline ──────────────────────────────────────── */}
            <div ref={wrapRef} className="overflow-x-auto overflow-y-hidden relative z-10">
                <div style={{ width: totalW, minWidth: totalW }} className="relative ">

                    {/* Column Headers */}
                    <div className="flex sticky top-0 z-20 border-b border-border/40
                        bg-gradient-to-br from-slate-50/95 to-slate-100/95
                        dark:from-zinc-950/95 dark:to-zinc-800/95 backdrop-blur-sm"
                    >
                        {headers.map((h, i) => {
                            const isNow = i === nowColIdx;
                            return (
                                <div
                                    key={i}
                                    style={{ width: colWidth, minWidth: colWidth }}
                                    className={cn(
                                        "flex-shrink-0 flex flex-col items-center justify-center py-2.5 border-r border-border/30",
                                        isNow && "bg-primary/10",
                                        h.weekend && !isNow && "bg-muted/25"
                                    )}
                                >
                                    <span className={cn(
                                        "font-mono text-[11px] font-medium leading-none",
                                        isNow ? "text-primary font-bold"
                                            : h.weekend ? "text-muted-foreground/50"
                                                : "text-muted-foreground"
                                    )}>
                                        {h.label}
                                    </span>
                                    {h.sub && view !== "year" && (
                                        <span className={cn(
                                            "text-[9px] leading-none mt-1",
                                            isNow ? "text-primary/60" : "text-muted-foreground/40"
                                        )}>
                                            {h.sub}
                                        </span>
                                    )}
                                    {isNow && (
                                        <div className="size-1 rounded-full bg-primary mt-1 animate-pulse" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Board rows */}
                    <div className="relative" style={{ height: boardH }}>

                        {/* Vertical grid lines + weekend bg */}
                        {headers.map((h, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "absolute top-0 bottom-0 border-r border-border/20",
                                    h.weekend && "bg-muted/15"
                                )}
                                style={{ left: i * colWidth, width: colWidth }}
                            />
                        ))}

                        {/* Horizontal row stripes */}
                        {Array.from({ length: maxRow }).map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "absolute left-0 right-0 rounded-lg pointer-events-none",
                                    i % 2 === 0 ? "bg-white/40 dark:bg-white/[0.02]" : ""
                                )}
                                style={{ top: i * ROW_HEIGHT + 3, height: ROW_HEIGHT - 6 }}
                            />
                        ))}

                        {/* Task Cards */}
                        {positioned.map(task => (
                            <TimelineTaskCard
                                key={task.id}
                                task={task}
                                colWidth={colWidth}
                                view={view}
                                onCardClick={onCardClick}
                            />
                        ))}

                        {/* Realtime Now Line */}
                        <NowLine x={nowX} label={nowLabel} />
                    </div>
                </div>
            </div>

            {/* Empty state */}
            {positioned.length === 0 && (
                <div className="relative z-10 flex flex-col items-center justify-center py-14 text-muted-foreground gap-2">
                    <CalendarDays className="size-8 opacity-25" />
                    <p className="text-sm font-medium">Tidak ada tugas di rentang ini</p>
                    <p className="text-xs text-muted-foreground/60">
                        Tambahkan startDate &amp; dueDate pada task
                    </p>
                </div>
            )}

            {/* ── Footer Stats ─────────────────────────────────────────────── */}
            <div className="relative z-10 flex items-center gap-5 px-4 py-2 border-t border-dashed border-border/60 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-sm flex-wrap">
                {[
                    { label: "Total", val: tasks.length, cls: "text-foreground" },
                    { label: "Berjalan", val: countByStatus("in-progress"), cls: "text-blue-500" },
                    { label: "Selesai", val: countByStatus("completed"), cls: "text-emerald-500" },
                    { label: "Pending", val: countByStatus("pending"), cls: "text-amber-500" },
                ].map(s => (
                    <div key={s.label} className="flex items-center gap-1.5">
                        <span className={cn("text-base font-semibold tabular-nums font-geist", s.cls)}>
                            {s.val}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{s.label}</span>
                    </div>
                ))}

                <div className="ml-auto flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    realtime · 1s
                </div>
            </div>
        </div>
    );
}