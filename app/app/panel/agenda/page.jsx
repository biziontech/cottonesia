"use client"

import * as React from "react";
import {
    Clock, FolderOpen, Grid2x2, LayoutList, MoreHorizontal,
    Plus, Search, Star, StarOff, Trash2, Copy, ExternalLink,
    X, ChevronLeft, ChevronRight, Columns3,
    SquareDashed, Layers, Bug, Rocket, Users, ListTodo, Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import PageTitle from "@/components/partials/PageTitle";
import api from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const STATUS = {
    active: { label: "Active", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800" },
    archived: { label: "Archived", color: "text-zinc-500 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700" },
    draft: { label: "Draft", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800" },
};

const COVERS = [
    "from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900",
    "from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900",
    "from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900",
    "from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900",
];

const ACCENT_DOTS = [
    "bg-violet-400", "bg-sky-400", "bg-emerald-400",
    "bg-orange-400", "bg-rose-400", "bg-amber-400",
    "bg-teal-400", "bg-indigo-400", "bg-pink-400",
    "bg-cyan-400", "bg-lime-400", "bg-fuchsia-400",
];

const BOARD_COLS = [
    ["To Do", "In Progress", "Done"],
    ["Backlog", "Sprint", "Review", "Released"],
    ["Ideas", "Doing", "Complete"],
    ["Planning", "Development", "Testing", "Deployed"],
];

function generateProjects(n) {
    const names = [
        "Q3 Marketing Campaign", "Product Roadmap 2025", "Onboarding Team Baru",
        "Laporan Keuangan H1", "UX Research Findings", "Brand Identity Update",
        "Sprint Planning Oct", "Customer Feedback Loop", "Launch Checklist v2",
        "Design System Audit", "API Integration Sprint", "Data Migration Plan",
        "Feature Flags Review", "Mobile App Redesign", "SEO Optimisation",
        "Investor Deck 2025", "Bug Triage Weekly", "Growth Experiments",
        "Security Audit Q4", "Team Retrospective",
    ];
    const descs = [
        "Slide deck untuk presentasi kampanye Q3 2025",
        "Roadmap produk tahunan untuk review stakeholder",
        "Materi orientasi karyawan baru divisi teknologi",
        "Ringkasan performa keuangan semester pertama",
        "Temuan riset pengguna untuk fitur baru aplikasi",
        "Pembaruan panduan identitas brand perusahaan",
        "Sprint planning untuk bulan Oktober",
        "Alur pengumpulan dan tindak lanjut feedback pelanggan",
        "Checklist lengkap untuk peluncuran produk versi 2",
        "Audit menyeluruh design system perusahaan",
    ];
    const times = ["2 menit lalu", "1 jam lalu", "Kemarin", "3 hari lalu", "1 minggu lalu", "2 minggu lalu"];
    const statuses = ["active", "active", "active", "draft", "archived"];
    return Array.from({ length: n }, (_, i) => ({
        id: i + 1,
        name: names[i % names.length],
        description: descs[i % descs.length],
        lastOpened: times[i % times.length],
        cards: Math.floor(Math.random() * 40) + 4,
        columns: BOARD_COLS[i % BOARD_COLS.length],
        starred: [0, 2, 5, 8, 11].includes(i),
        coverGradient: COVERS[i % COVERS.length],
        accentColor: ACCENT_DOTS[i % ACCENT_DOTS.length],
        status: statuses[i % statuses.length],
        members: Math.floor(Math.random() * 6) + 1,
        initials: names[i % names.length].split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase(),
    }));
}

const ALL_PROJECTS = generateProjects(20);
const PER_PAGE = 10;
const API = process.env.NEXT_PUBLIC_API_URL;

const AGENDA_ENDPOINTS = {
    boardCards: (boardId) => `${API}/office/agenda/boards/${boardId}/cards`,
    boardCard: (boardId, cardId) => `${API}/office/agenda/boards/${boardId}/cards/${cardId}`,
    boardCardMove: (boardId, cardId) => `${API}/office/agenda/boards/${boardId}/cards/${cardId}/move`,
    cardAssignees: (cardId) => `${API}/office/agenda/cards/${cardId}/assignees`,
    cardAssignee: (cardId, adminId) => `${API}/office/agenda/cards/${cardId}/assignees/${adminId}`,
    cardComments: (cardId) => `${API}/office/agenda/cards/${cardId}/comments`,
    cardComment: (cardId, commentId) => `${API}/office/agenda/cards/${cardId}/comments/${commentId}`,
    templates: `${API}/office/agenda/templates`,
    template: (templateId) => `${API}/office/agenda/templates/${templateId}`,
    templateApply: (templateId) => `${API}/office/agenda/templates/${templateId}/apply`,
    workspaces: `${API}/office/agenda/workspaces`,
    workspace: (workspaceId) => `${API}/office/agenda/workspaces/${workspaceId}`,
    workspaceBoards: (workspaceId) => `${API}/office/agenda/workspaces/${workspaceId}/boards`,
    workspaceBoardsReorder: (workspaceId) => `${API}/office/agenda/workspaces/${workspaceId}/boards/reorder`,
    workspaceBoard: (workspaceId, boardId) => `${API}/office/agenda/workspaces/${workspaceId}/boards/${boardId}`,
    workspaceLock: (workspaceId) => `${API}/office/agenda/workspaces/${workspaceId}/lock`,
    workspaceMembers: (workspaceId) => `${API}/office/agenda/workspaces/${workspaceId}/members`,
    workspaceMember: (workspaceId, memberId) => `${API}/office/agenda/workspaces/${workspaceId}/members/${memberId}`,
};

const getPayloadData = (payload) => payload?.data ?? payload ?? null;

const toArray = (payload) => {
    const data = getPayloadData(payload);
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    return [];
};

const extractData = (payload) => getPayloadData(payload) ?? {};
const getEntityRef = (entity) => entity?.uuid ?? entity?.id;

const formatLastOpened = (value) => {
    if (!value) return "Belum ada aktivitas";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Belum ada aktivitas";
    return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};

const getTemplateColumns = (template, index) => {
    const candidates = [
        template?.columns,
        template?.board_columns,
        template?.boards?.map((b) => b?.title ?? b?.name).filter(Boolean),
        template?.items?.map((b) => b?.title ?? b?.name).filter(Boolean),
    ];

    for (const val of candidates) {
        if (Array.isArray(val) && val.length > 0) {
            return val
                .map((col) => (typeof col === "string" ? col : (col?.title ?? col?.name ?? "")))
                .filter(Boolean);
        }
    }

    return BOARD_COLS[index % BOARD_COLS.length];
};

const buildProjectFromWorkspace = (workspace, index, boardsByWorkspace) => {
    const workspaceRef = getEntityRef(workspace);
    const boards = boardsByWorkspace[workspaceRef] ?? [];
    const cards = boards.reduce((total, board) => {
        if (typeof board.cards_count === "number") return total + board.cards_count;
        if (Array.isArray(board.cards)) return total + board.cards.length;
        return total;
    }, 0);
    const name = workspace.name ?? workspace.title ?? `Workspace ${workspaceRef}`;
    const status = workspace.archived_at || workspace.is_archived ? "archived" : (workspace.is_draft ? "draft" : "active");
    { console.log("aa", workspace) }
    return {
        id: workspaceRef,
        name,
        description: workspace.description ?? "Tanpa deskripsi",
        lastOpened: formatLastOpened(workspace.updated_at ?? workspace.last_opened_at),
        cards,
        columns: boards.map((board) => board.title ?? board.name ?? "Column"),
        starred: Boolean(workspace.is_starred ?? workspace.starred ?? false),
        coverGradient: COVERS[index % COVERS.length],
        accentColor: ACCENT_DOTS[index % ACCENT_DOTS.length],
        status,
        members: workspace.members_count ?? (Array.isArray(workspace.members) ? workspace.members.length : 0),
        initials: name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase(),
    };
};

// ─── Section Header ───────────────────────────────────────────────────────────
// icon · text-sm title · badge · separator · subtitle — all in one row

const SectionHeader = ({ icon: Icon, title, subtitle, badge }) => (
    <div className="flex items-center gap-2">
        <Icon className="size-3.5 text-muted-foreground shrink-0" />
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {badge !== undefined && (
            <Badge variant="secondary" className="text-[10.5px] px-1.5 py-0 h-4 font-normal">
                {badge}
            </Badge>
        )}
        {subtitle && (
            <>
                <Separator orientation="vertical" className="!h-3.5 w-1 mx-0.5" />
                <span className="text-xs text-muted-foreground">{subtitle}</span>
            </>
        )}
    </div>
);

// ─── Quick Start ──────────────────────────────────────────────────────────────

const TEMPLATES = [
    {
        id: "blank",
        label: "Blank Board",
        desc: "Mulai dari nol",
        icon: SquareDashed,
        cols: [],
        isBlank: true,
    },
    {
        id: "sprint",
        label: "Sprint Board",
        desc: "Agile sprint standar",
        icon: Rocket,
        cols: ["Backlog", "Sprint", "Review", "Done"],
    },
    {
        id: "bug",
        label: "Bug Tracker",
        desc: "Lacak & prioritas bug",
        icon: Bug,
        cols: ["Open", "In Progress", "Testing", "Closed"],
    },
    {
        id: "onboard",
        label: "Onboarding",
        desc: "Alur orientasi tim",
        icon: Users,
        cols: ["Persiapan", "Hari 1", "Minggu 1", "Selesai"],
    },
    {
        id: "roadmap",
        label: "Roadmap",
        desc: "Rencana fitur produk",
        icon: Layers,
        cols: ["Planned", "Building", "Released"],
    },
    {
        id: "todo",
        label: "Task List",
        desc: "Daftar tugas sederhana",
        icon: ListTodo,
        cols: ["To Do", "Doing", "Done"],
    },
];

const MiniBoard = ({ cols }) => (
    <div className="flex gap-1 h-full px-2.5 pt-2.5 pb-4 items-end">
        {cols.slice(0, 4).map((_, ci) => {
            const heights = [[3, 2, 4], [2, 4, 2], [4, 2, 3], [2, 3, 2]];
            const cards = heights[ci % heights.length];
            return (
                <div key={ci} className="flex-1 flex flex-col gap-0.5">
                    <div className="h-0.5 rounded-full mb-0.5 w-2/3 bg-foreground/15" />
                    {cards.map((h, ri) => (
                        <div
                            key={ri}
                            className="rounded-[2px] bg-border/60 border border-border/40"
                            style={{ height: `${h * 4}px`, width: `${60 + ri * 15}%` }}
                        />
                    ))}
                </div>
            );
        })}
    </div>
);

const QuickStart = ({ onSelect, templates = TEMPLATES }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
        {templates.map((tpl) => {
            const Icon = tpl.icon;
            return (
                <button
                    key={tpl.id}
                    onClick={() => onSelect?.(tpl)}
                    className={cn(
                        "group flex flex-col rounded-2xl bg-card shadow-xs text-left cursor-pointer",
                        "hover:shadow-sm hover:border-border/70 transition-all duration-200 overflow-hidden"
                    )}
                >
                    {/* Preview area */}
                    <div className={cn(
                        "h-24 w-auto overflow-hidden mx-2 mt-2 rounded-t-xl relative",
                        tpl.isBlank ? "flex items-center justify-center bg-muted/30 border-x-2 border-t-2 border-dashed border-border/70" : "bg-muted/40"
                    )}>
                        {tpl.isBlank ? (
                            <div className="flex flex-col items-center gap-1.5 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors">
                                <Plus className="size-5 stroke-[1.5]" />
                                <div className="flex gap-1">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-px h-5 bg-border rounded-full" />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <MiniBoard cols={tpl.cols} />
                        )}
                        <div className="absolute bottom-[-1px] bg-linear-to-t from-white to-transparent dark:from-card left-0 right-0 w-full h-12 transition-opacity duration-300"></div>
                    </div>

                    {/* Label */}
                    <div className="px-3.5 py-2 border-t border-border/50">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <Icon className="size-3 text-muted-foreground shrink-0" />
                            <p className="text-xs font-semibold text-foreground leading-snug truncate">{tpl.label}</p>
                        </div>
                        <p className="text-[10.5px] text-muted-foreground leading-snug truncate">{tpl.desc}</p>
                    </div>
                </button>
            );
        })}
    </div>
);

const QuickStartSkeleton = () => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="flex flex-col rounded-2xl bg-card shadow-xs overflow-hidden"
                >
                    {/* Preview area */}
                    <div className="h-24 mx-2 mt-2 bg-muted/40 rounded-t-xl overflow-hidden">
                        <MiniBoard cols={["Planned", "Building", "Released"]} />
                    </div>

                    {/* Label */}
                    <div className="px-3.5 py-2 border-t border-border/50 space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-3 w-3 rounded-sm" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-3 w-28" />
                    </div>
                </div>
            ))}
        </div>
    )
}

// ─── Board Preview ────────────────────────────────────────────────────────────

// Deterministic widths — no Math.random() to avoid SSR/client hydration mismatch
const CARD_WIDTHS = [
    [82, 95, 71],
    [68, 90, 78, 85],
    [93, 74, 88],
    [76, 68, 92, 80],
];

const BoardPreview = ({ columns, accentColor }) => (
    <div className="flex gap-1.5 px-3 pt-3 pb-0 h-full items-end">
        {columns.slice(0, 4).map((col, ci) => {
            const cardCount = [3, 5, 2, 4][ci % 4];
            const widths = CARD_WIDTHS[ci % CARD_WIDTHS.length];
            return (
                <div key={ci} className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-1 mb-0.5">
                        <div className={cn("size-1.5 rounded-full shrink-0", accentColor)} />
                        <div className="h-1.5 rounded-full bg-border flex-1 max-w-12" />
                    </div>
                    {Array.from({ length: Math.min(cardCount, 4) }).map((_, ri) => (
                        <div
                            key={ri}
                            className="rounded bg-background border border-border/60 h-4"
                            style={{ width: `${widths[ri % widths.length]}%`, opacity: 0.5 + ri * 0.1 }}
                        />
                    ))}
                </div>
            );
        })}
    </div>
);

// ─── Dropdown Menu ────────────────────────────────────────────────────────────

const ProjectCardMenu = ({ onStar, isStarred }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                variant="outline"
                size="icon-xs"
                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 rounded-md"
                onClick={(e) => e.stopPropagation()}
            >
                <MoreHorizontal className="size-3.5" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={onStar}>
                {isStarred
                    ? <><StarOff className="size-3.5" />Hapus Bintang</>
                    : <><Star className="size-3.5" />Tambah Bintang</>}
            </DropdownMenuItem>
            <DropdownMenuItem><ExternalLink className="size-3.5" />Buka Tab Baru</DropdownMenuItem>
            <DropdownMenuItem><Copy className="size-3.5" />Duplikat</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="size-3.5" />Hapus
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

// ─── Grid Card ────────────────────────────────────────────────────────────────

const GridCard = ({ project, onToggleStar, onClick }) => {
    const st = STATUS[project.status];
    return (
        <div
            onClick={onClick}
            className="group flex flex-col rounded-2xl bg-card shadow-xs hover:shadow-sm hover:border-border/70 cursor-pointer transition-all duration-200 overflow-hidden"
        >
            <div className="mx-2 mt-2 overflow-hidden rounded-t-xl relative">
                <div className={cn("relative h-36 bg-gradient-to-br overflow-hidden", project.coverGradient)}>
                    <BoardPreview columns={project.columns} accentColor={project.accentColor} />
                    <div className="absolute top-2 right-2 flex gap-1 z-10">
                        {project.starred && (
                            <div className="flex items-center justify-center size-5 rounded bg-background/80 backdrop-blur-sm border border-border/50">
                                <Star className="size-2.5 fill-amber-400 text-amber-400" />
                            </div>
                        )}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-card/40 to-transparent pointer-events-none" />
                    <div className="absolute top-2 left-2">
                        <ProjectCardMenu
                            isStarred={project.starred}
                            onStar={(e) => { e?.stopPropagation(); onToggleStar(project.id); }}
                        />
                    </div>
                </div>
                <div className="absolute bottom-[-1px] bg-linear-to-t from-white to-transparent dark:from-card left-0 right-0 w-full h-14 transition-opacity duration-300" />
            </div>

            <div className="flex flex-col gap-1.5 p-3 flex-1">
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-start gap-1.5 justify-between">
                        <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug flex-1">
                            {project.name}
                        </p>
                    </div>
                    <p className="text-[11.5px] text-muted-foreground line-clamp-2 leading-snug">
                        {project.description}
                    </p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                    <span className={cn("text-[10.5px] font-medium px-1.5 py-0.5 rounded border", st.color)}>
                        {st.label}
                    </span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Columns3 className="size-3" />
                        <span className="text-[11px]">{project.columns.length} col</span>
                        <span className="text-muted-foreground/30 mx-0.5">·</span>
                        <span className="text-[11px]">{project.cards} cards</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GridCardSkeleton = () => {
    return (
        <div className="flex flex-col rounded-2xl bg-card shadow-xs overflow-hidden">
            {/* Cover / Preview */}
            <div className="mx-2 mt-2 overflow-hidden rounded-t-xl relative">
                <div className="relative h-36 overflow-hidden">
                    <Skeleton className="w-full h-full" />

                    {/* Top right (star placeholder) */}
                    <div className="absolute top-2 right-2">
                        <Skeleton className="size-5 rounded" />
                    </div>

                    {/* Top left (menu placeholder) */}
                    <div className="absolute top-2 left-2">
                        <Skeleton className="size-5 rounded" />
                    </div>

                    {/* Bottom gradient overlay mimic */}
                    <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-card/40 to-transparent" />
                </div>

                {/* Fade bottom */}
                <div className="absolute bottom-[-1px] left-0 right-0 w-full h-14 bg-gradient-to-t from-white to-transparent dark:from-card" />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 p-3 flex-1">
                {/* Title */}
                <Skeleton className="h-4 w-3/4" />

                {/* Description */}
                <div className="space-y-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                    <Skeleton className="h-4 w-14 rounded" />

                    <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-10" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── List Card ────────────────────────────────────────────────────────────────

const ListCard = ({ project, onToggleStar, onClick }) => {
    const st = STATUS[project.status];
    return (
        <div
            onClick={onClick}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl bg-card shadow-xs hover:shadow-sm hover:border-border/70 cursor-pointer transition-all duration-150"
        >
            <div className="relative shrink-0">
                <div className={cn(
                    "flex items-center justify-center size-8 rounded-lg text-xs font-bold text-foreground/70 bg-gradient-to-br border border-border",
                    project.coverGradient
                )}>
                    {project.initials}
                </div>
                <div className={cn("absolute -bottom-0.5 -right-0.5 size-2 rounded-full border border-card", project.accentColor)} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-foreground truncate leading-snug">{project.name}</p>
                    {project.starred && <Star className="size-2.5 fill-amber-400 text-amber-400 shrink-0" />}
                </div>
                <p className="text-[11.5px] text-muted-foreground truncate leading-snug mt-0.5">
                    {project.description}
                </p>
            </div>

            <div className="hidden sm:flex items-center gap-4 shrink-0">
                <span className={cn("text-[10.5px] font-medium px-1.5 py-0.5 rounded border hidden md:inline-flex", st.color)}>
                    {st.label}
                </span>
                <div className="flex items-center gap-1 text-muted-foreground">
                    <Columns3 className="size-3" />
                    <span className="text-xs">{project.columns.length} col</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="size-3" />
                    <span className="text-xs">{project.lastOpened}</span>
                </div>
            </div>

            <ProjectCardMenu
                isStarred={project.starred}
                onStar={(e) => { e?.stopPropagation(); onToggleStar(project.id); }}
            />
        </div>
    );
};

const ListCardSkeleton = () => {
    return (
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-card shadow-xs">
            {/* Avatar / icon */}
            <div className="relative shrink-0">
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="absolute outline-2 outline-white -bottom-0.5 -right-0.5 size-2 rounded-full" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-3 rounded-sm" />
                </div>
                <Skeleton className="h-3 w-48" />
            </div>

            {/* Right section */}
            <div className="hidden sm:flex items-center gap-4 shrink-0">
                <Skeleton className="h-4 w-14 rounded" />
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-16" />
            </div>

            {/* Menu button */}
            <Skeleton className="h-6 w-6 rounded-md" />
        </div>
    )
}

// ─── Recent Strip ─────────────────────────────────────────────────────────────

const RecentStrip = ({ projects }) => (
    <div className="flex flex-col gap-2.5">
        <SectionHeader
            icon={Clock}
            title="Baru Dibuka"
            subtitle="Lanjutkan dari mana Anda berhenti"
        />
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {(projects.length > 0) ? projects.slice(0, 5).map((w) => (
                <div
                    key={w.id}
                    className="group flex items-center gap-2.5 min-w-[200px] px-3 py-2.5 rounded-lg bg-card shadow-xs hover:shadow-sm hover:border-border/70 cursor-pointer transition-all duration-150 shrink-0"
                >
                    <div className={cn(
                        "flex items-center justify-center size-7 rounded-md text-[10px] font-bold text-foreground/70 bg-gradient-to-br border border-border shrink-0",
                        w.coverGradient
                    )}>
                        {w.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{w.name}</p>
                        <p className="text-[10.5px] text-muted-foreground truncate mt-0.5 flex items-center gap-1">
                            {console.log(w)}
                            <Clock className="size-2.5 shrink-0" />{w.lastOpened}
                        </p>
                    </div>
                </div>
            )) : (
                <div className="h-12 mt-2 flex items-center">
                    <p className="text-xs text-muted-foreground italic">Belum ada yang dibuka</p>
                </div>
            )}
        </div>
    </div>
);

const RecentStripSkeleton = () => {
    return (
        <div className="flex flex-col gap-2.5">
            {/* Header */}
            <SectionHeader
                icon={Clock}
                title="Baru Dibuka"
                subtitle="Lanjutkan dari mana Anda berhenti"
            />

            {/* Horizontal list */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-2.5 min-w-[200px] px-3 py-2.5 rounded-lg bg-card shadow-xs shrink-0"
                    >
                        {/* Avatar / cover */}
                        <Skeleton className="size-7 rounded-md shrink-0" />

                        {/* Text */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-2.5 w-32" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
// ─── Pagination ───────────────────────────────────────────────────────────────

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    const delta = 1;
    const left = currentPage - delta;
    const right = currentPage + delta;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= left && i <= right)) {
            pages.push(i);
        } else if (i === left - 1 || i === right + 1) {
            pages.push("...");
        }
    }

    const deduped = pages.filter((p, idx) => p !== "..." || pages[idx - 1] !== "...");

    return (
        <div className="flex items-center justify-between pt-4 border-border/50">
            <p className="text-xs text-muted-foreground">
                Halaman <span className="font-medium text-foreground">{currentPage}</span> dari{" "}
                <span className="font-medium text-foreground">{totalPages}</span>
            </p>
            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-md"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    <ChevronLeft className="size-3.5" />
                </Button>

                {deduped.map((p, idx) =>
                    p === "..." ? (
                        <span key={`ellipsis-${idx}`} className="px-1 text-xs text-muted-foreground select-none">…</span>
                    ) : (
                        <Button
                            key={p}
                            variant={p === currentPage ? "default" : "outline"}
                            size="icon"
                            className="h-7 w-7 rounded-md text-xs"
                            onClick={() => onPageChange(p)}
                        >
                            {p}
                        </Button>
                    )
                )}

                <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-md"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    <ChevronRight className="size-3.5" />
                </Button>
            </div>
        </div>
    );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <div className="flex items-center justify-center size-12 rounded-xl border border-border bg-card shadow-xs">
            <FolderOpen className="size-5 text-muted-foreground" />
        </div>
        <div>
            <p className="text-sm font-semibold text-foreground">Tidak ada project ditemukan</p>
            <p className="text-xs text-muted-foreground mt-0.5">Coba ubah filter atau buat project baru.</p>
        </div>
        <Button size="sm" className="mt-1">
            <Plus className="size-3.5" />
            New Project
        </Button>
    </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function BrowseWorkspace() {
    const router = useRouter();
    const [viewMode, setViewMode] = React.useState("grid");
    const [search, setSearch] = React.useState("");
    const [projects, setProjects] = React.useState([]);
    const [templates, setTemplates] = React.useState(TEMPLATES);
    const [activeFilter, setActiveFilter] = React.useState("all");
    const [currentPage, setCurrentPage] = React.useState(1);
    const [loading, setLoading] = React.useState(true);
    const [creating, setCreating] = React.useState(false);
    const [serverPagination, setServerPagination] = React.useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: PER_PAGE,
    });

    const loadAgendaData = React.useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const workspaceResponse = await api.fetch(`${AGENDA_ENDPOINTS.workspaces}?page=${page}`);
            const workspacePayload = getPayloadData(workspaceResponse);
            const workspaces = toArray(workspaceResponse);

            if (workspacePayload && !Array.isArray(workspacePayload)) {
                setServerPagination({
                    current_page: workspacePayload.current_page ?? page,
                    last_page: workspacePayload.last_page ?? 1,
                    total: workspacePayload.total ?? workspaces.length,
                    per_page: workspacePayload.per_page ?? PER_PAGE,
                });
                setCurrentPage(workspacePayload.current_page ?? page);
            } else {
                setServerPagination({
                    current_page: 1,
                    last_page: 1,
                    total: workspaces.length,
                    per_page: PER_PAGE,
                });
                setCurrentPage(1);
            }

            const boardsPairs = await Promise.all(workspaces.map(async (workspace) => {
                const workspaceRef = getEntityRef(workspace);
                if (!workspaceRef) return null;
                try {
                    const boardsResponse = await api.fetch(AGENDA_ENDPOINTS.workspaceBoards(workspaceRef));
                    const boards = toArray(boardsResponse);

                    const boardsWithCards = await Promise.all(boards.map(async (board) => {
                        if (Array.isArray(board.cards)) return board;
                        try {
                            const boardRef = getEntityRef(board);
                            if (!boardRef) return { ...board, cards: [] };
                            const cardsResponse = await api.fetch(AGENDA_ENDPOINTS.boardCards(boardRef));
                            return { ...board, cards: toArray(cardsResponse) };
                        } catch {
                            return { ...board, cards: [] };
                        }
                    }));

                    return [workspaceRef, boardsWithCards];
                } catch {
                    return [workspaceRef, []];
                }
            }));

            const boardsByWorkspace = Object.fromEntries(boardsPairs.filter(Boolean));
            const mappedProjects = workspaces.map((workspace, index) =>
                buildProjectFromWorkspace(workspace, index, boardsByWorkspace)
            );
            setProjects(mappedProjects);

            const templateResponse = await api.fetch(AGENDA_ENDPOINTS.templates);
            const apiTemplates = toArray(templateResponse);
            if (apiTemplates.length) {
                const templateIcons = [Rocket, Bug, Users, Layers, ListTodo];
                const mappedTemplates = apiTemplates.map((template, index) => ({
                    id: `tpl-${getEntityRef(template) ?? index}`,
                    _templateId: getEntityRef(template),
                    label: template.name ?? template.title ?? `Template ${index + 1}`,
                    desc: template.description ?? "Template agenda",
                    icon: templateIcons[index % templateIcons.length],
                    cols: getTemplateColumns(template, index),
                }));
                setTemplates([
                    ...mappedTemplates,
                ]);
            }
        } catch (error) {
            console.error("Failed to load agenda list:", error);
            setProjects(ALL_PROJECTS);
            setServerPagination({
                current_page: 1,
                last_page: 1,
                total: ALL_PROJECTS.length,
                per_page: PER_PAGE,
            });
            setCurrentPage(1);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        loadAgendaData();
    }, [loadAgendaData]);

    const openWorkspace = React.useCallback((workspaceId) => {
        router.push(`/app/panel/agenda/${workspaceId}`);
    }, [router]);

    const toggleStar = (id) => {
        setProjects((prev) => prev.map((w) => w.id === id ? { ...w, starred: !w.starred } : w));
    };

    const handleCreateWorkspace = React.useCallback(async (selectedTemplate = null) => {
        setCreating(true);
        try {
            const workspacePayload = {
                name: selectedTemplate?.label && !selectedTemplate?.isBlank
                    ? `${selectedTemplate.label} Workspace`
                    : "Workspace Baru",
                description: selectedTemplate?.desc ?? "",
            };
            const createResponse = await api.fetch(AGENDA_ENDPOINTS.workspaces, {
                method: "POST",
                body: JSON.stringify(workspacePayload),
            });
            const createdWorkspace = extractData(createResponse);
            const createdWorkspaceRef = getEntityRef(createdWorkspace);

            if (selectedTemplate?._templateId && createdWorkspaceRef) {
                await api.fetch(AGENDA_ENDPOINTS.templateApply(selectedTemplate._templateId), {
                    method: "POST",
                    body: JSON.stringify({ workspace_id: createdWorkspaceRef }),
                });
            }

            if (createdWorkspaceRef) {
                openWorkspace(createdWorkspaceRef);
                return;
            }
            await loadAgendaData();
        } catch (error) {
            console.error("Failed to create workspace:", error);
            await loadAgendaData();
        } finally {
            setCreating(false);
        }
    }, [loadAgendaData, openWorkspace]);

    const filtered = React.useMemo(() => {
        return projects.filter((w) => {
            const q = search.toLowerCase();
            const matchSearch = !q || w.name.toLowerCase().includes(q) || w.description.toLowerCase().includes(q);
            const matchFilter =
                activeFilter === "all" ||
                (activeFilter === "starred" && w.starred) ||
                (activeFilter === "active" && w.status === "active");
            return matchSearch && matchFilter;
        });
    }, [projects, search, activeFilter]);

    React.useEffect(() => { setCurrentPage(1); }, [search, activeFilter]);

    const useServerPagination = !search && activeFilter === "all";
    const totalPages = useServerPagination
        ? Math.max(1, serverPagination.last_page ?? 1)
        : Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paginated = useServerPagination
        ? filtered
        : filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const handlePageChange = React.useCallback((page) => {
        if (useServerPagination) {
            loadAgendaData(page);
            return;
        }
        setCurrentPage(page);
    }, [useServerPagination, loadAgendaData]);

    const filters = [
        { key: "all", label: "Semua" },
        { key: "active", label: "Aktif" },
        { key: "starred", label: "Bintang" },
    ];

    const showRecent = !search && activeFilter === "all";

    return (
        <div className="max-w-7xl mx-auto w-full px-4 py-6 min-h-[calc(100dvh-108px)]">

            {/* Header */}
            <PageTitle title="Agenda" subtitle="Kelola dan akses semua agenda Anda" />

            <div className="space-y-7">
                {/* Toolbar */}
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex-1 min-w-[180px] max-w-64">
                        <InputGroup className="bg-background border-border">
                            <InputGroupAddon><Search className="size-3.5" /></InputGroupAddon>
                            <InputGroupInput
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari project..."
                            />
                            {search && (
                                <InputGroupAddon
                                    align="inline-end"
                                    className="cursor-pointer"
                                    onClick={() => setSearch("")}
                                >
                                    <X className="size-3.5" />
                                </InputGroupAddon>
                            )}
                        </InputGroup>
                    </div>

                    <div className="flex-1" />

                    {/* Filter pills */}
                    <div className="bg-muted/60 p-0.5 gap-0.5 flex rounded-lg border border-border/50">
                        {filters.map((f) => (
                            <Button
                                key={f.key}
                                size="xs"
                                variant={activeFilter === f.key ? "outline" : "ghost"}
                                onClick={() => setActiveFilter(f.key)}
                                className={cn(
                                    "h-7 px-2.5 text-xs border-0 rounded-md",
                                    activeFilter === f.key && "bg-background shadow-xs border border-border",
                                    activeFilter !== f.key && "border-transparent"
                                )}
                            >
                                {f.label}
                            </Button>
                        ))}
                    </div>

                    {/* View toggle */}
                    <div className="bg-muted/60 p-0.5 gap-0.5 flex rounded-lg border border-border/50">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    onClick={() => setViewMode("grid")}
                                    variant="ghost"
                                    className={cn(
                                        "size-7 rounded-md",
                                        viewMode === "grid" && "bg-background shadow-xs border border-border"
                                    )}
                                >
                                    <Grid2x2 className="size-3.5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Grid</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    onClick={() => setViewMode("list")}
                                    variant="ghost"
                                    className={cn(
                                        "size-7 rounded-md",
                                        viewMode === "list" && "bg-background shadow-xs border border-border"
                                    )}
                                >
                                    <LayoutList className="size-3.5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>List</TooltipContent>
                        </Tooltip>
                    </div>

                    <Button size="sm" className="shrink-0" onClick={() => handleCreateWorkspace()} disabled={creating}>
                        {creating ? <Spinner /> : <Plus className="size-3.5" />}
                        {creating ? "Membuat..." : "New Project"}
                    </Button>
                </div>

                <div className="space-y-8">

                    {/* Quick Start — hanya muncul saat tidak ada search/filter */}
                    {showRecent && (
                        <>
                            {!loading ? (
                                <QuickStart onSelect={handleCreateWorkspace} templates={templates} />
                            ) : (
                                <QuickStartSkeleton />
                            )}
                        </>
                    )}

                    {/* Recently Opened */}
                    {showRecent && (
                        <>
                            {!loading ? (
                                <RecentStrip projects={projects} />
                            ) : (
                                <RecentStripSkeleton projects={projects} />
                            )}
                        </>
                    )}

                    {/* All Projects */}
                    <div className="flex flex-col gap-3">
                        <SectionHeader
                            icon={FolderOpen}
                            title={
                                activeFilter === "starred" ? "Project Berbintang"
                                    : activeFilter === "active" ? "Project Aktif"
                                        : "Semua Project"
                            }
                            subtitle={
                                activeFilter === "starred" ? "Project yang Anda tandai bintang"
                                    : activeFilter === "active" ? "Project yang sedang berjalan"
                                        : "Semua project dalam workspace Anda"
                            }
                            badge={useServerPagination ? (serverPagination.total ?? filtered.length) : filtered.length}
                        />

                        {loading ? (
                            <>
                                {(viewMode == "grid") ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                                        {Array.from({ length: (paginated.length >= 5 ? 10 : 5) }).map((_, i) => (
                                            <GridCardSkeleton key={i} />
                                        ))}
                                    </div>
                                ) : (viewMode == "list") ? (
                                    <div className="flex flex-col gap-2 w-full">
                                        {Array.from({ length: (paginated.length >= 5 ? 10 : 5) }).map((_, i) => (
                                            <ListCardSkeleton key={i} />
                                        ))}
                                    </div>
                                ) : ('-')}
                            </>
                        ) : (paginated.length === 0) ? (
                            <EmptyState />
                        ) : (viewMode === "grid") ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                                {paginated.map((w) => (
                                    <GridCard key={w.id} project={w} onToggleStar={toggleStar} onClick={() => openWorkspace(w.id)} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {paginated.map((w) => (
                                    <ListCard key={w.id} project={w} onToggleStar={toggleStar} onClick={() => openWorkspace(w.id)} />
                                ))}
                            </div>
                        )}

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}
