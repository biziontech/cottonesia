"use client";

import * as React from "react";
import { toast } from "sonner";
import { format, isValid, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import EmojiPicker, { Theme } from "emoji-picker-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import TextareaAutosize from "react-textarea-autosize"
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger, PopoverDescription, PopoverTitle } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarGroup } from "@/components/ui/avatar-group";
import SignalTaskCard from "@/components/partials/agenda/SignalTaskCard";
import { EmojiReactionPopover } from "@/components/partials/EmojiReactionPopover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sortable,
    SortableContent,
    SortableItem,
    SortableItemHandle,
    SortableOverlay,
} from "@/components/ui/sortable";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    CalendarIcon,
    Check,
    File,
    FileImage,
    FileText,
    Link2,
    Loader2,
    MessageSquare,
    Plus,
    Trash2,
    X,
    CheckSquare2,
    Tag,
    SaveIcon,
    List,
    Group,
    UserPlus2,
    SmilePlus,
    ArrowUp,
    ExternalLink,
    GripVertical,
    ListPlus,
    Upload,
    Save,
    TrashIcon,
    Download,
} from "lucide-react";


import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { ICON_MAP, ICON_OPTIONS, ICON_VARIANTS } from "@/hooks/use-agenda-iconsax";
import { Like1, Message, Messages, Messages2, Messages3, Trash } from "iconsax-reactjs";
import { CircularProgress, CircularProgressIndicator, CircularProgressRange, CircularProgressTrack } from "@/components/ui/circular-progress";
import { Separator } from "@/components/ui/separator";

// ─── Constants ────────────────────────────────────────────────────────────────

const API = process.env.NEXT_PUBLIC_API_URL;

const ENDPOINTS = {
    card: (bId, cId) => `${API}/office/agenda/boards/${bId}/cards/${cId}`,
    assignees: (cId) => `${API}/office/agenda/cards/${cId}/assignees`,
    comments: (cId) => `${API}/office/agenda/cards/${cId}/comments`,
    comment: (cId, cmId) => `${API}/office/agenda/cards/${cId}/comments/${cmId}`,
    commentVotes: (cId, cmId) => `${API}/office/agenda/cards/${cId}/comments/${cmId}/votes`,
    commentReactions: (cId, cmId) => `${API}/office/agenda/cards/${cId}/comments/${cmId}/reactions`,
    checklists: (cId) => `${API}/office/agenda/cards/${cId}/checklists`,
    checklist: (cId, clId) => `${API}/office/agenda/cards/${cId}/checklists/${clId}`,
    checklistReorder: (cId) => `${API}/office/agenda/cards/${cId}/checklists/reorder`,
    checklistItems: (cId, clId) => `${API}/office/agenda/cards/${cId}/checklists/${clId}/items`,
    checklistItem: (cId, clId, iId) => `${API}/office/agenda/cards/${cId}/checklists/${clId}/items/${iId}`,
    checklistItemReorder: (cId, clId) => `${API}/office/ agenda/cards/${cId}/checklists/${clId}/items/reorder`,
    attachments: (cId) => `${API}/office/agenda/cards/${cId}/attachments`,
    attachment: (cId, mediaId) => `${API}/office/agenda/cards/${cId}/attachments/${mediaId}`,
    allAdmins: `${API}/office/agenda/admins`,
};

// ─── Label color palette ──────────────────────────────────────────────────────

const LABEL_COLORS = [
    { bg: "#ef4444", name: "Merah" },
    { bg: "#f97316", name: "Oranye" },
    { bg: "#eab308", name: "Kuning" },
    { bg: "#22c55e", name: "Hijau" },
    { bg: "#3b82f6", name: "Biru" },
    { bg: "#6366f1", name: "Indigo" },
    { bg: "#8b5cf6", name: "Ungu" },
    { bg: "#ec4899", name: "Pink" },
    { bg: "#14b8a6", name: "Teal" },
    { bg: "#6b7280", name: "Abu" },
];


// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name = "") {
    return name
        .split(" ")
        .slice(0, 2)
        .map(n => n[0] ?? "")
        .join("")
        .toUpperCase();
}

const AVATAR_COLORS = [
    "bg-rose-500", "bg-blue-500", "bg-emerald-500",
    "bg-violet-500", "bg-amber-500", "bg-pink-500",
    "bg-teal-500", "bg-indigo-500",
];

function avatarBg(name = "") {
    return AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];
}

function normalizeMember(m) {
    return {
        adminId: m.admin_id ?? m.id,
        name: m.name ?? "",
        email: m.email ?? "",
    };
}

function normalizeLabel(label = {}) {
    const iconKey = label.iconKey ?? label.icon_key ?? label.icon ?? null;
    const iconVariant = label.iconVariant ?? label.icon_variant ?? label.iconType ?? label.icon_type ?? null;
    return {
        ...label,
        id: label.id ?? label.uuid ?? `${label.name ?? "label"}-${label.color ?? "color"}`,
        name: label.name ?? "",
        color: label.color ?? LABEL_COLORS[0].bg,
        iconKey,
        iconVariant,
    };
}

function serializeLabelForPayload(label = {}) {
    const normalized = normalizeLabel(label);
    return {
        id: normalized.id,
        name: normalized.name,
        color: normalized.color,
        iconKey: normalized.iconKey,
        iconVariant: normalized.iconVariant,
        icon_key: normalized.iconKey,
        icon_variant: normalized.iconVariant,
        icon_type: normalized.iconVariant,
    };
}

function normalizeLink(link = {}) {
    return {
        label: (link.label ?? "").toString(),
        url: (link.url ?? "").toString(),
    };
}

function toExternalHref(url = "") {
    const raw = String(url ?? "").trim();
    if (!raw) return "";
    return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

function formatFileSize(size = 0) {
    const bytes = Number(size ?? 0);
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / Math.pow(1024, i);
    return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function getAttachmentIcon(mime = "") {
    const m = String(mime).toLowerCase();
    if (m.startsWith("image/")) return FileImage;
    if (m.includes("pdf") || m.includes("word") || m.includes("text") || m.includes("sheet") || m.includes("excel")) return FileText;
    return File;
}

function patchCommentReactions(list = [], targetRef, reactions) {
    return (list ?? []).map((item) => {
        const ref = getCommentRef(item);
        const replies = Array.isArray(item?.replies) ? item.replies : [];

        if (ref === targetRef) {
            return { ...item, reactions, replies: replies.length ? patchCommentReactions(replies, targetRef, reactions) : replies };
        }
        if (!replies.length) return item;
        return { ...item, replies: patchCommentReactions(replies, targetRef, reactions) };
    });
}

function fmtDate(val) {
    if (!val) return "";
    try {
        const d = typeof val === "string" ? parseISO(val) : val;
        return isValid(d) ? format(d, "d MMMM yyyy", { locale: localeId }) : "";
    } catch { return ""; }
}

function getCommentRef(cm) {
    return cm?.uuid ?? cm?.id;
}

function patchCommentVote(list = [], targetRef, patch = {}) {
    return (list ?? []).map((item) => {
        const ref = getCommentRef(item);
        const replies = Array.isArray(item?.replies) ? item.replies : [];

        if (ref === targetRef) {
            return {
                ...item,
                ...patch,
                replies: replies.length ? patchCommentVote(replies, targetRef, patch) : replies,
            };
        }

        if (!replies.length) {
            return item;
        }

        return {
            ...item,
            replies: patchCommentVote(replies, targetRef, patch),
        };
    });
}

function findCommentByRef(list = [], targetRef) {
    for (const item of (list ?? [])) {
        const ref = getCommentRef(item);
        if (ref === targetRef) return item;
        const replies = Array.isArray(item?.replies) ? item.replies : [];
        if (replies.length) {
            const found = findCommentByRef(replies, targetRef);
            if (found) return found;
        }
    }
    return null;
}

function buildOptimisticVotePatch(comment = {}, voteValue) {
    const currentVote = Number(comment?.my_vote);
    const likes = Number(comment?.likes_count ?? 0);
    const dislikes = Number(comment?.dislikes_count ?? 0);
    const nextVote = currentVote === voteValue ? null : voteValue;

    let nextLikes = likes;
    let nextDislikes = dislikes;

    if (currentVote === 1) nextLikes = Math.max(0, nextLikes - 1);
    if (currentVote === -1) nextDislikes = Math.max(0, nextDislikes - 1);
    if (nextVote === 1) nextLikes += 1;
    if (nextVote === -1) nextDislikes += 1;

    return {
        likes_count: nextLikes,
        dislikes_count: nextDislikes,
        my_vote: nextVote,
    };
}

function insertReplyIntoTree(list = [], parentRef, replyComment) {
    return (list ?? []).map((item) => {
        const ref = getCommentRef(item);
        const replies = Array.isArray(item?.replies) ? item.replies : [];

        if (ref === parentRef) {
            return {
                ...item,
                replies: [...replies, replyComment],
            };
        }

        if (!replies.length) {
            return item;
        }

        return {
            ...item,
            replies: insertReplyIntoTree(replies, parentRef, replyComment),
        };
    });
}

function removeCommentFromTree(list = [], targetRef) {
    return (list ?? [])
        .filter((item) => getCommentRef(item) !== targetRef)
        .map((item) => ({
            ...item,
            replies: Array.isArray(item?.replies) ? removeCommentFromTree(item.replies, targetRef) : [],
        }));
}

// ─── Priority Badge ───────────────────────────────────────────────────────────

const PRIORITY_CFG = {
    low: { label: "Low", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
    medium: { label: "Medium", cls: "bg-amber-500/15   text-amber-400   border-amber-500/30" },
    high: { label: "High", cls: "bg-rose-500/15    text-rose-400    border-rose-500/30" },
};

function hexToRgba(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)

    return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// ─── Label Badge ──────────────────────────────────────────────────────────────

function LabelBadge({ label, staticRemove, onRemove }) {
    const IconComp = label.iconKey ? ICON_MAP[label.iconKey] : null;
    return (
        <Badge key={label.id} variant="outline" size={IconComp ? 'icon-md' : 'md'} className="rounded-md gap-1.5 font-semibold h-fit group items-center cursor-default" style={{ backgroundColor: hexToRgba(label.color, 0.15), borderColor: hexToRgba(label.color, 0.2) }}>
            {IconComp && (
                <IconComp
                    variant={label.iconVariant ?? "Bulk"}
                    color={label?.color ?? 'white'}
                />
            )}
            <span style={{ color: label.color }}>{label.name}</span>
            {onRemove && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            onClick={() => onRemove(label.id)}
                            className={cn("transition-opacity -mr-1 cursor-pointer hidden rounded-sm", staticRemove ? 'block' : 'group-hover:block')}
                            style={{ backgroundColor: hexToRgba(label.color, 0.15), color: label.color }}
                        >
                            <X className="size-3.5" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Hapus Label</p>
                    </TooltipContent>
                </Tooltip>
            )}
        </Badge>
    );
}

// ─── Label Picker Popover Content ─────────────────────────────────────────────

function LabelPickerContent({ labels, onAdd, onRemove }) {
    const [name, setName] = React.useState("");
    const [color, setColor] = React.useState(LABEL_COLORS[0].bg);
    const [iconKey, setIconKey] = React.useState(null);
    const [iconVariant, setIconVariant] = React.useState("Bold");
    const [tab, setTab] = React.useState("color");   // "color" | "icon"
    const [iconSearch, setIconSearch] = React.useState("");

    // Filter icon list by search query
    const filteredIcons = React.useMemo(() =>
        iconSearch.trim()
            ? ICON_OPTIONS.filter(o => o.key.toLowerCase().includes(iconSearch.toLowerCase()))
            : ICON_OPTIONS,
        [iconSearch]
    );

    const handleAdd = () => {
        if (!name.trim()) return;
        onAdd?.({ id: crypto.randomUUID(), name: name.trim(), color, iconKey, iconVariant });
        setName("");
        setIconKey(null);
        setIconSearch("");
    };

    const PreviewIcon = iconKey ? ICON_MAP[iconKey] : null;

    return (
        <PopoverContent className="w-80 p-0 shadow-xl border-border/60" align="start" side="left">
            {/* Header */}
            <div className="px-3 py-2 pb-1">
                <div className="flex items-center justify-between gap-2">
                    <PopoverTitle className="text-sm">Buat Label</PopoverTitle>
                    <small className="text-[11px] text-muted-foreground">
                        {labels.length} item
                    </small>
                </div>
                <PopoverDescription className="text-[11px] mt-0.5">
                    Masukan nama label serta tentukan warna dan icon
                </PopoverDescription>
            </div>

            {labels.length > 0 && (
                <div className="px-3 py-2 flex flex-wrap gap-1.5 border-b border-border/50">
                    {labels.map(l => (
                        <LabelBadge key={l.id} label={l} onRemove={onRemove} />
                    ))}
                </div>
            )}

            {/* Add new */}
            <div className="p-3 space-y-3">
                {/* Label name */}
                <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Nama label..."
                    className="text-xs"
                    onKeyDown={e => e.key === "Enter" && handleAdd()}
                />

                {/* Tabs: warna / ikon */}
                <div className="flex gap-1 p-1 rounded-lg bg-muted/50 border border-border/40">
                    {[
                        { key: "color", label: "Warna" },
                        { key: "icon", label: "Ikon" },
                    ].map(t => (
                        <Button
                            key={t.key}
                            size="sm"
                            variant={tab === t.key ? "outline" : "ghost"}
                            onClick={() => setTab(t.key)}
                            className={cn(
                                "px-2.5 text-xs border rounded-md flex-1",
                                tab === t.key && "bg-background shadow-xs border border-border",
                                tab !== t.key && "border-transparent"
                            )}>
                            <span>{t.label}</span>
                        </Button>
                    ))}
                </div>


                {/* ── Color tab ──────────────────────────────────────────────── */}
                {tab === "color" && (
                    <div className="grid grid-cols-5 gap-1.5">
                        {LABEL_COLORS.map(c => (
                            <button
                                key={c.bg}
                                type="button"
                                onClick={() => setColor(c.bg)}
                                title={c.name}
                                className={cn(
                                    "h-8 w-full rounded-lg transition-all border-2",
                                    color === c.bg
                                        ? "border-white scale-105 shadow-md ring-1 ring-white/30"
                                        : "border-transparent hover:scale-105 hover:border-white/30"
                                )}
                                style={{ backgroundColor: c.bg }}
                            />
                        ))}
                    </div>
                )}

                {/* ── Icon tab ───────────────────────────────────────────────── */}
                {tab === "icon" && (
                    <div className="space-y-2">
                        {/* Icon search */}
                        <Input
                            value={iconSearch}
                            onChange={e => setIconSearch(e.target.value)}
                            placeholder="Cari ikon..."
                            className="text-xs"
                            variant="secondary"
                        />

                        {/* Variant selector */}
                        <div className="flex gap-1 flex-wrap">
                            {ICON_VARIANTS.map(v => (
                                <button
                                    key={v}
                                    type="button"
                                    onClick={() => setIconVariant(v)}
                                    className={cn(
                                        "px-2 py-0.5 text-[10px] rounded-md border transition-all font-medium",
                                        iconVariant === v
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                                    )}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>

                        {/* Icon grid */}
                        <ScrollArea className="h-36 rounded-md border border-border/40">
                            <div className="p-1.5 grid grid-cols-8 gap-1">
                                {/* No icon */}
                                <button
                                    type="button"
                                    onClick={() => setIconKey(null)}
                                    title="Tanpa ikon"
                                    className={cn(
                                        "h-8 w-full rounded-md flex items-center justify-center transition-all border text-muted-foreground",
                                        iconKey === null
                                            ? "bg-primary/15 border-primary/60 text-primary"
                                            : "border-border/40 hover:bg-muted hover:border-border"
                                    )}
                                >
                                    <X className="h-3 w-3" />
                                </button>

                                {filteredIcons.map(({ key, Icon }) => (
                                    <Tooltip key={key}>
                                        <TooltipTrigger asChild>
                                            <button
                                                type="button"
                                                onClick={() => setIconKey(key)}
                                                className={cn(
                                                    "h-8 w-full rounded-md flex items-center justify-center transition-all border",
                                                    iconKey === key
                                                        ? "bg-primary/15 border-primary/60 text-primary"
                                                        : "border-border/40 hover:bg-muted hover:border-border text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                <Icon
                                                    size={15}
                                                    color="currentColor"
                                                    variant={iconVariant}
                                                />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            {key}
                                        </TooltipContent>
                                    </Tooltip>
                                ))}

                                {filteredIcons.length === 0 && (
                                    <p className="col-span-8 text-[11px] text-muted-foreground text-center py-4">
                                        Tidak ada ikon {iconSearch}
                                    </p>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                )}

                {/* Preview */}
                {name.trim() && (
                    <div className="flex items-center gap-2 py-1">
                        <span className="text-[10px] text-muted-foreground">Preview:</span>
                        <LabelBadge
                            label={{ id: "prev", name: name.trim(), color, iconKey, iconVariant }}
                        />
                    </div>
                )}

                <Button
                    type="button"
                    size="sm"
                    className="w-full"
                    onClick={handleAdd}
                    disabled={!name.trim()}
                >
                    <Plus />
                    Tambah Label
                </Button>
            </div>
        </PopoverContent>
    );
}

// ─── Member Picker Content ────────────────────────────────────────────────────

function MemberPickerContent({ members, assignees, onToggle, loading }) {
    const [search, setSearch] = React.useState("");

    const normalized = members.map(normalizeMember);
    const filtered = normalized.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase())
    );

    const isAssigned = m =>
        assignees.some(a => (a.adminId ?? a.id ?? a.admin_id) === m.adminId);

    return (
        <PopoverContent className="w-72 p-0 overflow-hidden" align="start" side="left">
            <div className="border-b px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                    <PopoverTitle className="text-sm">Pilih Member</PopoverTitle>
                    <small className="text-[11px] text-muted-foreground">
                        {assignees.length} selected
                    </small>
                </div>
                <PopoverDescription className="text-[11px] mt-0.5">
                    Klik member untuk pilih atau lepas assignee.
                </PopoverDescription>
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama / email..."
                    className="h-8 text-xs mt-2"
                />
            </div>

            <div className="p-2">
                {loading ? (
                    <div className="h-28 flex items-center justify-center text-xs text-muted-foreground">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Memuat member...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="h-28 flex items-center justify-center text-xs text-muted-foreground text-center px-2">
                        Tidak ada member yang cocok.
                    </div>
                ) : (
                    <ScrollArea className="h-64">
                        <div className="space-y-1 pr-1">
                            {filtered.map((m) => {
                                const selected = isAssigned(m);
                                return (
                                    <button
                                        key={m.adminId}
                                        type="button"
                                        onClick={() => onToggle?.(m)}
                                        className={cn(
                                            "w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors border",
                                            selected
                                                ? "bg-muted/50"
                                                : "hover:bg-muted/60 border-transparent"
                                        )}
                                    >
                                        <Avatar className="h-7 w-7 shrink-0">
                                            <AvatarFallback className={cn("text-[10px] font-semibold text-white", avatarBg(m.name ?? ""))}>
                                                {getInitials(m.name ?? "")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-medium truncate">{m.name || "Tanpa Nama"}</p>
                                            <p className="text-[11px] text-muted-foreground truncate">{m.email || "-"}</p>
                                        </div>
                                        {selected && (
                                            <Check className="size-4 text-primary shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </ScrollArea>
                )}
            </div>
        </PopoverContent>
    );
}

// ─── Date Range Picker ────────────────────────────────────────────────────────

function DateRangePicker({ startDate, dueDate, onStartChange, onDueChange, onSave, saving }) {
    const [useRange, setUseRange] = React.useState(false);
    const [startOpen, setStartOpen] = React.useState(false);
    const [dueOpen, setDueOpen] = React.useState(false);

    const startVal = startDate ? (typeof startDate === "string" ? parseISO(startDate) : startDate) : undefined;
    const dueVal = dueDate ? (typeof dueDate === "string" ? parseISO(dueDate) : dueDate) : undefined;

    React.useEffect(() => {
        setUseRange(Boolean(startDate));
    }, [startDate]);

    const handleToggleRange = (checked) => {
        const next = checked === true;
        setUseRange(next);

        if (!next) {
            onStartChange?.("");
            onSave?.({
                start_date: null,
                due_date: dueDate || null,
            });
        }
    };

    return (
        <div className="space-y-4 w-full">
            <div className="flex items-center gap-2 cursor-pointer group">
                <Checkbox
                    id="use-range"
                    checked={useRange}
                    onCheckedChange={handleToggleRange}
                />
                <label
                    htmlFor="use-range"
                    className="text-xs text-muted-foreground group-hover:text-foreground transition-colors cursor-pointer select-none"
                >
                    Aktifkan rentang tanggal (Mulai - Deadline)
                </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {useRange && (
                    <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                            Tanggal Mulai
                        </Label>
                        <Popover open={startOpen} onOpenChange={setStartOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-xs font-medium items-center",
                                        !startVal && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="text-muted-foreground" />
                                    {startVal && isValid(startVal) ? fmtDate(startVal) : "Pilih tanggal mulai"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={startVal}
                                    onSelect={d => {
                                        const nextStart = d ? format(d, "yyyy-MM-dd") : "";
                                        onStartChange?.(nextStart);
                                        setStartOpen(false);

                                        if (useRange && nextStart) {
                                            onSave?.({
                                                start_date: nextStart,
                                                due_date: dueDate || null,
                                            });
                                        }
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                )}

                <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                        Deadline
                    </Label>
                    <Popover open={dueOpen} onOpenChange={setDueOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                size="sm"
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-xs font-medium",
                                    !dueVal && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="size-3.5 text-muted-foreground" />
                                {dueVal && isValid(dueVal) ? fmtDate(dueVal) : "Pilih deadline"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={dueVal}
                                onSelect={d => {
                                    const nextDue = d ? format(d, "yyyy-MM-dd") : "";
                                    onDueChange?.(nextDue);
                                    setDueOpen(false);

                                    if (useRange && !startVal) return;

                                    onSave?.({
                                        start_date: useRange ? (startDate || null) : null,
                                        due_date: nextDue || null,
                                    });
                                }}
                                fromDate={startVal}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    );
}
// ─── Checklist Item Row ───────────────────────────────────────────────────────

function ChecklistItemRow({ item, onToggle, onDelete }) {
    return (
        <div className="flex items-center cursor-default gap-2 py-1 px-2 rounded-md hover:bg-muted/30 transition-colors group">
            <Checkbox
                checked={item.is_done}
                onCheckedChange={() => onToggle?.(item)}
                className="shrink-0 cursor-pointer"
            />

            <span
                className={cn(
                    "flex-1 text-sm leading-snug transition-colors",
                    item.is_done && "line-through text-muted-foreground/60"
                )}
            >
                {item.title}
            </span>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all shrink-0"
                onClick={() => onDelete?.(item)}
            >
                <X className="h-3 w-3" />
            </Button>
        </div>
    );
}

// ─── Checklist Section ────────────────────────────────────────────────────────

function ChecklistSection({ checklist, cardRef, api, onUpdated, onDeleted, SortableItemHandle }) {
    const [showInput, setShowInput] = React.useState(false);
    const [newText, setNewText] = React.useState("");
    const [addingItem, setAddingItem] = React.useState(false);

    const total = checklist.progress?.total ?? checklist.items?.length ?? 0;
    const done = checklist.progress?.done ?? checklist.items?.filter(i => i.is_done).length ?? 0;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;

    const handleToggle = async item => {
        try {
            await api.fetch(ENDPOINTS.checklistItem(cardRef, checklist.id, item.id), {
                method: "PATCH",
                body: JSON.stringify({ is_done: !item.is_done }),
            });
            const newItems = checklist.items.map(i => i.id === item.id ? { ...i, is_done: !i.is_done } : i);
            const newDone = newItems.filter(i => i.is_done).length;
            onUpdated?.({ ...checklist, items: newItems, progress: { total: newItems.length, done: newDone, percent: Math.round((newDone / newItems.length) * 100) } });
        } catch { toast.error("Gagal update item"); }
    };

    const handleAddItem = async () => {
        if (!newText.trim()) return;
        setAddingItem(true);
        try {
            const res = await api.fetch(ENDPOINTS.checklistItems(cardRef, checklist.id), {
                method: "POST",
                body: JSON.stringify({ title: newText.trim() }),
            });
            const item = res.data ?? res;
            const newItems = [...checklist.items, { id: item.uuid ?? item.id, title: item.title, is_done: false }];
            const newDone = newItems.filter(i => i.is_done).length;
            onUpdated?.({ ...checklist, items: newItems, progress: { total: newItems.length, done: newDone, percent: Math.round((newDone / newItems.length) * 100) } });
            setNewText("");
            setShowInput(false);
        } catch { toast.error("Gagal menambah item"); }
        finally { setAddingItem(false); }
    };

    const handleDeleteItem = async item => {
        try {
            await api.fetch(ENDPOINTS.checklistItem(cardRef, checklist.id, item.id), { method: "DELETE" });
            const newItems = checklist.items.filter(i => i.id !== item.id);
            const newDone = newItems.filter(i => i.is_done).length;
            onUpdated?.({ ...checklist, items: newItems, progress: { total: newItems.length, done: newDone, percent: newItems.length > 0 ? Math.round((newDone / newItems.length) * 100) : 0 } });
        } catch { toast.error("Gagal menghapus item"); }
    };

    const handleReorderItems = async (reorderedItems) => {
        try {
            // Update API with new order
            await api.fetch(ENDPOINTS.checklistItemReorder(cardRef, checklist.id), {
                method: "PATCH",
                body: JSON.stringify({ ids: reorderedItems.map(item => item.id) }),
            });
        } catch {
            toast.error("Gagal mengurutkan item");
        }
    };

    return (
        <div className="rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/30 border-b border-dashed">
                <SortableItemHandle className="cursor-grab py-1 text-muted-foreground">
                    <GripVertical className="h-4.5 w-4.5" />
                </SortableItemHandle>
                <span className="text-md font-medium flex-1 truncate">{checklist.title}</span>
                <span className="text-xs text-muted-foreground font-mono shrink-0">{done}/{total}</span>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <CircularProgress
                            value={percent}
                            min={0}
                            max={100}
                            size={16}
                            thickness={2.5}
                        >
                            <CircularProgressIndicator>
                                <CircularProgressTrack className="text-blue-200 dark:text-blue-900" />
                                <CircularProgressRange className="text-blue-500" />
                            </CircularProgressIndicator>
                        </CircularProgress>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{percent}%</p>
                    </TooltipContent>
                </Tooltip>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="text-muted-foreground/50 hover:text-destructive shrink-0"
                    onClick={() => onDeleted?.(checklist.id)}
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>
            {/* Items */}
            <div className="py-1.5 px-1.5">
                <Sortable
                    value={checklist.items ?? []}
                    getItemValue={(item) => item.id}
                    onMove={({ activeIndex, overIndex }) => {
                        const reordered = [...(checklist.items ?? [])];
                        const [moved] = reordered.splice(activeIndex, 1);
                        reordered.splice(overIndex, 0, moved);
                        onUpdated?.({ ...checklist, items: reordered });
                        // Persist order
                        handleReorderItems(reordered);
                    }}
                >
                    <SortableContent className="space-y-0">
                        {(checklist.items ?? []).map(item => (
                            <SortableItem
                                key={item.id}
                                value={item.id}
                                className="group/sortable-item"
                            >
                                <div className="flex items-center gap-0">
                                    <SortableItemHandle className="cursor-grab opacity-0 group-hover/sortable-item:opacity-100 transition-opacity text-muted-foreground/30 hover:text-muted-foreground/60">
                                        <GripVertical className="h-4.5 w-4.5" />
                                    </SortableItemHandle>
                                    <div className="flex-1">
                                        <ChecklistItemRow
                                            item={item}
                                            onToggle={handleToggle}
                                            onDelete={handleDeleteItem}
                                        />
                                    </div>
                                </div>
                            </SortableItem>
                        ))}
                    </SortableContent>
                    <SortableOverlay />
                </Sortable>

                {/* Add item inline */}
                {showInput ? (
                    <div className="flex items-center gap-2 px-2 py-1.5">
                        <div className="w-3.5 shrink-0" />
                        <div className="w-4 shrink-0" />
                        <Input
                            autoFocus
                            value={newText}
                            onChange={e => setNewText(e.target.value)}
                            placeholder="Tambah item..."
                            className="text-xs flex-1"
                            onKeyDown={e => {
                                if (e.key === "Enter") handleAddItem();
                                if (e.key === "Escape") { setShowInput(false); setNewText(""); }
                            }}
                        />
                        <Button
                            type="button"
                            size="sm"
                            className="text-xs"
                            onClick={handleAddItem}
                            disabled={addingItem}
                        >
                            {addingItem ? <Spinner /> : (
                                <>
                                    <Save />
                                    <span>Tambah</span>
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            className="h-7 w-7 shrink-0"
                            onClick={() => { setShowInput(false); setNewText(""); }}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                ) : (
                    <Button
                        size="sm"
                        variant="secondary"
                        type="button"
                        onClick={() => setShowInput(true)}
                        className={cn("flex items-center w-fit", checklist?.items?.length > 0 ? 'mt-2' : '')}
                    >
                        <Plus className="h-3 w-3" />
                        Tambah item
                    </Button>
                )}
            </div>
        </div>
    );
}

function formatTimeAgoOrDate(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;

    const seconds = Math.floor(diffMs / 1000);
    const days = Math.floor(seconds / (60 * 60 * 24));

    // 👉 Jika lebih dari 2 hari → format tanggal
    if (days > 2) {
        return past.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }

    // 👉 Time ago
    if (seconds < 60) return `${seconds} detik lalu`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit lalu`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;

    return `${days} hari lalu`;
}

// ─── Comment Item ─────────────────────────────────────────────────────────────

function CommentItem({ cm, onDelete, onVote, votingRef = null, onReply, replyingRef = null, onReact, myReactions = {}, level = 0, isLastComment = false }) {
    const [hovered, setHovered] = React.useState(false);
    const [showReplyForm, setShowReplyForm] = React.useState(false);
    const [replyBody, setReplyBody] = React.useState("");
    const [emojiPopOpen, setEmojiPopOpen] = React.useState(false);
    const isLiked = Number(cm?.my_vote) === 1;
    const isDisliked = Number(cm?.my_vote) === -1;
    const commentRef = getCommentRef(cm);
    const isVoting = votingRef === commentRef;
    const isReplying = replyingRef === commentRef;
    const hasReplies = Array.isArray(cm?.replies) && cm.replies.length > 0;
    const { resolvedTheme } = useTheme();

    const submitReply = async () => {
        if (!replyBody.trim()) return;
        const ok = await onReply?.(cm, replyBody.trim());
        if (ok) {
            setReplyBody("");
            setShowReplyForm(false);
        }
    };

    const handleEmojiClick = (emojiData) => {
        // emojiData.emoji berisi emoji yang dipilih
        setReplyBody(prev => prev + emojiData.emoji);
    };


    return (
        <div
            className={cn("group flex gap-3 py-2 pe-2 relative", level > 0 && "ms-0")}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Line */}
            {level > 0 && (
                <div className="pointer-events-none mt-0 w-6 border-muted rounded-bl-xl border-t-0 border-e-0 h-7 border-2 absolute top-0 -left-7"></div>
            )}

            <div className="relative">
                <Avatar className="h-8 w-8 shrink-0 mt-0.5 relative">
                    <AvatarFallback className={cn("text-[11px] text-white font-semibold", avatarBg(cm.author?.name ?? ""))}>
                        {getInitials(cm.author?.name ?? "?")}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <div className="flex items-baseline gap-2 mb-0.5 relative">
                    <span className="text-xs font-semibold">{cm.author?.name ?? "—"}</span>
                    <span className="text-[10px] text-muted-foreground">{formatTimeAgoOrDate(cm.created_at)}</span>
                    {hovered && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 absolute top-1 right-1 ml-auto text-muted-foreground hover:text-destructive"
                            onClick={() => onDelete?.(cm)}
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    )}
                </div>
                <div className="flex flex-col gap-0.5 relative">
                    {hasReplies ? (
                        <div className="pointer-events-none mt-0 w-1 border-t-0 border-muted border-e-0 border-b-0 h-full border-2 absolute top-6 -left-7 bottom-0"></div>
                    ) : (
                        <>
                            {!isLastComment && (
                                <div className="pointer-events-none mt-0 w-1 border-t-0 border-muted border-e-0 border-b-0 h-[calc(100%+25px)] border-2 absolute -top-4 -left-18"></div>
                            )}
                        </>
                    )}

                    <p className="text-sm mb-1.5 leading-normal whitespace-pre-wrap text-foreground/80 rounded-lg">
                        {cm.body}
                    </p>

                    <div className="flex flex-wrap relative items-center">
                        <Button
                            size="xs"
                            variant="ghost"
                            className="font-medium"
                            disabled={isVoting}
                            onClick={() => onVote?.(cm, 1)}
                        >
                            <Like1 color={isLiked ? "#0c99ff" : (resolvedTheme === "dark" ? "#ffffff" : "#27272a")} variant={isLiked ? "Bulk" : "Outline"} />
                            <span className={`font-semibold ${isLiked ? "text-[#0c99ff]" : "text-[#27272a]  dark:text-white"}`}>{cm?.likes_count ?? 0}</span>
                        </Button>
                        <Button
                            size="xs"
                            variant="ghost"
                            className="font-medium"
                            disabled={isVoting}
                            onClick={() => onVote?.(cm, -1)}
                        >
                            <Like1 color={isDisliked ? "#f54a00" : (resolvedTheme === "dark" ? "#ffffff" : "#27272a")} variant={isDisliked ? "Bulk" : "Outline"} className="-rotate-180" />
                            <span className={`font-semibold ${isDisliked ? "text-[#f54a00]" : "text-[#27272a] dark:text-white"}`}>{cm?.dislikes_count ?? 0}</span>
                        </Button>
                        <Button
                            size="xs"
                            variant="ghost"
                            className="font-medium"
                            onClick={() => setShowReplyForm((p) => !p)}
                        >
                            <Message variant="Outline" className="h-3.5 w-3.5" />
                            <span>Balas</span>
                        </Button>

                        {/* ── Reaction chips ── */}
                        {(cm?.reactions ?? []).length > 0 && (
                            <>
                                <div className="w-px h-3.5 bg-border mx-1 shrink-0" />
                                <div className="flex flex-wrap gap-1 ms-1 me-2">
                                    {cm.reactions.map(({ emoji, count, me_reacted }) => {
                                        return (
                                            <Button
                                                key={emoji}
                                                onClick={() => onReact?.(cm, emoji)}
                                                disabled={isVoting}
                                                size="xs"
                                                variant="ghost"
                                                className={cn(
                                                    "inline-flex items-center gap-1 ps-1.5 pe-2 py-0.5 rounded-lg text-[11px] font-medium border transition-all",
                                                    me_reacted
                                                        ? "bg-sky-50 border-sky-300 text-sky-700 dark:bg-sky-950 dark:border-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900"
                                                        : "bg-muted/60 border-border/50 text-muted-foreground hover:bg-muted hover:border-border"
                                                )}
                                            >
                                                <span className="text-sm leading-none">{emoji}</span>
                                                <span>{count}</span>
                                            </Button>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        <EmojiReactionPopover
                            onReact={(emoji) => onReact?.(cm, emoji)}
                            disabled={isVoting}
                        />
                    </div>

                </div>

                {showReplyForm && (
                    <div className="mt-2 bg-muted/30 flex gap-2 flex-col justify-end border-border/50 focus-visible:ring-1 focus-visible:ring-primary/50 border p-3.5 rounded-2xl">
                        <TextareaAutosize
                            value={replyBody}
                            onChange={(e) => setReplyBody(e.target.value)}
                            placeholder="Tulis balasan..."
                            minRows={2}
                            maxRows={6}
                            className="text-sm w-full resize-none focus-visible:outline-none"
                            onKeyDown={e => {
                                if (e.key === "Enter" && e.ctrlKey) submitReply();
                            }}
                        />
                        <div className="flex gap-2 justify-between">
                            <div>
                                <Popover open={emojiPopOpen} onOpenChange={setEmojiPopOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            type="button"
                                            size="icon-sm"
                                            className="rounded-xl"
                                            variant="outline"
                                        >
                                            <SmilePlus className="stroke-[1.5]" />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent
                                        className="w-auto p-0 border shadow-md"
                                        side="top"
                                        align="start"
                                        sideOffset={6}
                                    >
                                        <EmojiPicker
                                            onEmojiClick={(emojiData) => {
                                                handleEmojiClick(emojiData);
                                                setEmojiPopOpen(false);
                                            }}
                                            theme={resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT}
                                            lazyLoadEmojis
                                            searchPlaceholder="Cari emoji..."
                                            width={300}
                                            height={380}
                                        />
                                    </PopoverContent>
                                </Popover>

                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="xs"
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setShowReplyForm(false);
                                        setReplyBody("");
                                    }}
                                    disabled={isReplying}
                                >
                                    Batal
                                </Button>
                                <Button
                                    size="icon-xs"
                                    type="button"
                                    className="rounded-lg"
                                    onClick={submitReply}
                                    disabled={isReplying || !replyBody.trim()}
                                >
                                    {isReplying ? (<Spinner />) : (<ArrowUp />)}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {hasReplies && (
                    <div className="mt-2">
                        {cm.replies.map((rp, i) => (
                            <CommentItem
                                key={rp.uuid ?? rp.id}
                                cm={rp}
                                onDelete={onDelete}
                                onVote={onVote}
                                votingRef={votingRef}
                                onReply={onReply}
                                replyingRef={replyingRef}
                                onReact={onReact}
                                myReactions={myReactions}
                                level={level + 1}
                                isLastComment={cm.replies?.length === i + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

// ─── Role helpers ─────────────────────────────────────────────────────────────
// role: "viewer" | "commenter" | "editor"
// viewer    → read-only: cannot comment, cannot edit anything
// commenter → can comment only, cannot edit card fields
// editor    → full access (default)

export default function AgendaCardDetailModal({
    open, onOpenChange,
    card, columnId, boardRef, workspaceId,
    onCardUpdated,
    api,
    wsMembers: wsMembersProp = [],
    role = "editor", // "viewer" | "commenter" | "editor"
}) {
    const canComment = role === "commenter" || role === "editor";
    const canEdit = role === "editor";
    // ── State ────────────────────────────────────────────────────────────────────
    const [title, setTitle] = React.useState("");
    const [editingTitle, setEditingTitle] = React.useState(false);
    const [description, setDescription] = React.useState("");
    const [priority, setPriority] = React.useState("medium");
    const [startDate, setStartDate] = React.useState("");
    const [dueDate, setDueDate] = React.useState("");
    const [labels, setLabels] = React.useState([]);
    const [links, setLinks] = React.useState([]);
    const [newLinkLabel, setNewLinkLabel] = React.useState("");
    const [newLinkUrl, setNewLinkUrl] = React.useState("");
    const [attachments, setAttachments] = React.useState([]);
    const [assignees, setAssignees] = React.useState([]);
    const [checklists, setChecklists] = React.useState([]);
    const [comments, setComments] = React.useState([]);
    const [newComment, setNewComment] = React.useState("");
    const [wsMembers, setWsMembers] = React.useState([]);
    const { resolvedTheme } = useTheme();

    const [loadingMembers, setLoadingMembers] = React.useState(false);
    const [loadingDetail, setLoadingDetail] = React.useState(false);
    const [savingTitle, setSavingTitle] = React.useState(false);
    const [savingDesc, setSavingDesc] = React.useState(false);
    const [postingComment, setPostingComment] = React.useState(false);
    const [votingCommentRef, setVotingCommentRef] = React.useState(null);
    const [replyingCommentRef, setReplyingCommentRef] = React.useState(null);
    const [myReactions, setMyReactions] = React.useState({});
    const [addingChecklist, setAddingChecklist] = React.useState(false);
    const [savingMeta, setSavingMeta] = React.useState(false);
    const [uploadingAttachment, setUploadingAttachment] = React.useState(false);
    const [deletingAttachmentId, setDeletingAttachmentId] = React.useState(null);
    const [downloadingAttachmentId, setDownloadingAttachmentId] = React.useState(null);

    const [newChecklistTitle, setNewChecklistTitle] = React.useState("");
    const [showChecklistInput, setShowChecklistInput] = React.useState(false);
    const [labelPopOpen, setLabelPopOpen] = React.useState(false);
    const [memberPopOpen, setMemberPopOpen] = React.useState(false);

    const [assignView, setAssignView] = React.useState("detail"); // ringkas | detail
    const [commentSort, setCommentSort] = React.useState("all"); // "all" | "newest" | "oldest"
    const [emojiPopOpen, setEmojiPopOpen] = React.useState(false);
    const [showLinkInput, setShowLinkInput] = React.useState(false);
    const [showLinkDelete, setShowLinkDelete] = React.useState(false);

    const commentScrollRef = React.useRef(null);
    const lastLoadedCardRef = React.useRef(null);

    const cardRef = card?._beRef ?? card?.id;
    const priorityCfg = PRIORITY_CFG[priority] ?? PRIORITY_CFG.medium;

    // ── Sync members from prop ───────────────────────────────────────────────────
    React.useEffect(() => {
        if (wsMembersProp.length > 0) setWsMembers(wsMembersProp);
    }, [wsMembersProp]);

    // ── Load on open ─────────────────────────────────────────────────────────────
    React.useEffect(() => {
        if (!open || !card) return;
        setTitle(card.title ?? "");
        setDescription(card.description ?? "");
        setPriority(card.priority ?? "medium");
        setStartDate(card.startDate ?? "");
        setDueDate(card.dueDate ?? "");
        setLabels((card.labels ?? []).map(normalizeLabel));
        setLinks((card.links ?? []).map(normalizeLink));
        setAssignees(card.assignees ?? []);

        // Guard cardRef existence sebelum load extras
        const ref = card?._beRef ?? card?.id;
        if (ref && lastLoadedCardRef.current !== ref) {
            lastLoadedCardRef.current = ref;
            setAttachments([]);
            setChecklists([]);
            setComments([]);
            loadExtras();
            loadMembers();
        }
    }, [open, card]);

    React.useEffect(() => {
        if (!open) {
            lastLoadedCardRef.current = null;
        }
    }, [open]);

    const scrollCommentsToBottom = React.useCallback(() => {
        const root = commentScrollRef.current;
        if (!root) return;
        const el = root.querySelector(":scope > div");
        const el_height = root.querySelector(":scope > div > div");
        console.log("el_height.scrollHeight", el_height.scrollHeight)
        el.scrollTop = el_height.scrollHeight;
    }, []);

    // ── Scroll ke bawah ketika komentar berubah (komentar terbaru di atas) ──────── 
    React.useLayoutEffect(() => {
        if (comments.length > 0) {
            setTimeout(() => {
                console.log("sdcrollll")
                scrollCommentsToBottom();
            }, 0);
        }
    }, [comments.length, scrollCommentsToBottom]);

    const loadMembers = async () => {
        setLoadingMembers(true);
        try {
            const res = await api.fetch(ENDPOINTS.allAdmins).catch(() => ({ data: [] }));
            setWsMembers(Array.isArray(res) ? res : (res.data ?? []));
        } finally { setLoadingMembers(false); }
    };

    const loadExtras = async () => {
        if (!cardRef) return;
        setLoadingDetail(true);
        try {
            const [clRes, cmRes, atRes] = await Promise.all([
                api.fetch(ENDPOINTS.checklists(cardRef)).catch(() => ({ data: [] })),
                api.fetch(ENDPOINTS.comments(cardRef)).catch(() => ({ data: [] })),
                api.fetch(ENDPOINTS.attachments(cardRef)).catch(() => ({ data: [] })),
            ]);
            setChecklists(Array.isArray(clRes) ? clRes : (clRes.data ?? []));
            setComments(Array.isArray(cmRes) ? cmRes : (cmRes.data ?? []));
            setAttachments(Array.isArray(atRes) ? atRes : (atRes.data ?? []));
            setMyReactions({});
        } finally { setLoadingDetail(false); }
    };

    // ── Save title ────────────────────────────────────────────────────────────────
    const handleSaveTitle = async () => {
        if (!title.trim() || !boardRef || !cardRef) { setEditingTitle(false); return };
        setSavingTitle(true);
        try {
            const res = await api.fetch(ENDPOINTS.card(boardRef, cardRef), {
                method: "PATCH",
                body: JSON.stringify({ title: title.trim() }),
            });
            onCardUpdated?.({ ...card, title: res.data?.title ?? title.trim() });
            toast.success("Judul diperbarui");
        } catch { toast.error("Gagal memperbarui judul"); }
        finally { setSavingTitle(false); setEditingTitle(false); }
    };

    // ── Save description ──────────────────────────────────────────────────────────
    const handleSaveDescription = async () => {
        if (!boardRef || !cardRef) return;
        setSavingDesc(true);
        try {
            await api.fetch(ENDPOINTS.card(boardRef, cardRef), {
                method: "PATCH",
                body: JSON.stringify({ description }),
            });
            onCardUpdated?.({ ...card, description });
            toast.success("Deskripsi disimpan");
        } catch { toast.error("Gagal menyimpan deskripsi"); }
        finally { setSavingDesc(false); }
    };

    // ── Save meta ─────────────────────────────────────────────────────────────────
    const handleSaveMeta = async (patch = {}) => {
        if (!boardRef || !cardRef) return;
        setSavingMeta(true);
        try {
            const nextLabels = (patch.labels ?? labels ?? []).map(normalizeLabel);
            const nextLinks = (patch.links ?? links ?? [])
                .map(normalizeLink)
                .map((item) => ({ ...item, url: toExternalHref(item.url) }))
                .filter((item) => item.label.trim() && item.url.trim());
            const payload = {
                priority,
                start_date: startDate || null,
                due_date: dueDate || null,
                labels: nextLabels.map(serializeLabelForPayload),
                links: nextLinks,
                ...patch,
            };
            if (patch.labels !== undefined) {
                payload.labels = nextLabels.map(serializeLabelForPayload);
            }
            if (patch.links !== undefined) {
                payload.links = nextLinks;
            }
            const res = await api.fetch(ENDPOINTS.card(boardRef, cardRef), {
                method: "PATCH",
                body: JSON.stringify(payload),
            });
            const u = res.data ?? res;
            const nextStartDate = u.start_date !== undefined
                ? u.start_date
                : (patch.start_date !== undefined ? patch.start_date : startDate);
            const nextDueDate = u.due_date !== undefined
                ? u.due_date
                : (patch.due_date !== undefined ? patch.due_date : dueDate);
            const updatedLabels = Array.isArray(u.labels)
                ? u.labels.map(normalizeLabel)
                : nextLabels;
            const updatedLinks = Array.isArray(u.links)
                ? u.links.map(normalizeLink)
                : nextLinks;
            setLinks(updatedLinks);
            onCardUpdated?.({
                ...card,
                priority: u.priority ?? priority,
                startDate: nextStartDate,
                dueDate: nextDueDate,
                labels: updatedLabels,
                links: updatedLinks,
            });
        } catch { toast.error("Gagal menyimpan"); }
        finally { setSavingMeta(false); }
    };

    // ── Assignees ─────────────────────────────────────────────────────────────────
    const handleToggleMember = async member => {
        const already = assignees.some(a => (a.adminId ?? a.id ?? a.admin_id) === member.adminId);
        const next = already
            ? assignees.filter(a => (a.adminId ?? a.id ?? a.admin_id) !== member.adminId)
            : [...assignees, { adminId: member.adminId, id: member.adminId, name: member.name, email: member.email }];
        setAssignees(next);
        try {
            await api.fetch(ENDPOINTS.assignees(cardRef), {
                method: "POST",
                body: JSON.stringify({ admin_ids: next.map(a => a.adminId ?? a.id ?? a.admin_id) }),
            });
            onCardUpdated?.({ ...card, assignees: next });
        } catch {
            setAssignees(assignees);
            toast.error("Gagal memperbarui member");
        }
    };

    // ── Labels ────────────────────────────────────────────────────────────────────
    const handleAddLabel = label => { const n = [...labels, label]; setLabels(n); handleSaveMeta({ labels: n }); };
    const handleRemoveLabel = id => { const n = labels.filter(l => l.id !== id); setLabels(n); handleSaveMeta({ labels: n }); };

    const handleRemoveLink = (index) => {
        const next = links.filter((_, i) => i !== index);
        setLinks(next);
        handleSaveMeta({ links: next });
    };

    const handleCreateLink = () => {
        const label = newLinkLabel.trim();
        const url = toExternalHref(newLinkUrl);
        if (!label || !url) {
            toast.error("Label dan URL wajib diisi");
            return;
        }
        const next = [...links, { label, url }];
        setLinks(next);
        setNewLinkLabel("");
        setNewLinkUrl("");
        setShowLinkInput(false);
        handleSaveMeta({ links: next });
    };

    const handleUploadAttachments = async (files = []) => {
        if (!cardRef || !files.length) return;
        setUploadingAttachment(true);
        try {
            const token = api?.getCookie?.("token");

            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch(ENDPOINTS.attachments(cardRef), {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: formData,
                });

                const json = await response.json();
                if (!response.ok || json?.success === false) {
                    throw new Error(json?.message || "Gagal upload attachment");
                }
            }

            const atRes = await api.fetch(ENDPOINTS.attachments(cardRef)).catch(() => ({ data: [] }));
            setAttachments(Array.isArray(atRes) ? atRes : (atRes.data ?? []));
            toast.success("Attachment berhasil diunggah");
        } catch (err) {
            toast.error(err?.message || "Gagal upload attachment");
        } finally {
            setUploadingAttachment(false);
        }
    };

    const handleDeleteAttachment = async (attachmentId) => {
        if (!cardRef || !attachmentId) return;
        setDeletingAttachmentId(attachmentId);
        try {
            const res = await api.fetch(ENDPOINTS.attachment(cardRef, attachmentId), { method: "DELETE" });
            if (res?.success === false) {
                throw new Error(res?.message || "Gagal menghapus attachment");
            }
            setAttachments((prev) => prev.filter((item) => Number(item.id) !== Number(attachmentId)));
            toast.success("Attachment dihapus");
        } catch (err) {
            toast.error(err?.message || "Gagal menghapus attachment");
        } finally {
            setDeletingAttachmentId(null);
        }
    };

    const resolveAttachmentUrl = React.useCallback((attachment = {}) => {
        const raw = String(
            attachment?.download_url ??
            attachment?.url ??
            attachment?.file_url ??
            attachment?.path ??
            ""
        ).trim();

        if (!raw) return "";
        if (/^(https?:)?\/\//i.test(raw) || raw.startsWith("blob:") || raw.startsWith("data:")) return raw;
        if (raw.startsWith("/")) {
            const base = String(API ?? "").replace(/\/+$/, "");
            return base ? `${base}${raw}` : raw;
        }
        return raw;
    }, []);

    // ── Checklist ─────────────────────────────────────────────────────────────────
    const handleAddChecklist = async () => {
        if (!newChecklistTitle.trim()) return;
        setAddingChecklist(true);
        try {
            const res = await api.fetch(ENDPOINTS.checklists(cardRef), {
                method: "POST",
                body: JSON.stringify({ title: newChecklistTitle.trim() }),
            });
            const cl = res.data ?? res;
            setChecklists(p => [...p, { id: cl.uuid ?? cl.id, title: cl.title, items: [], progress: { total: 0, done: 0, percent: 0 } }]);
            setNewChecklistTitle("");
            setShowChecklistInput(false);
            toast.success("Checklist ditambahkan");
        } catch { toast.error("Gagal membuat checklist"); }
        finally { setAddingChecklist(false); }
    };

    const handleDeleteChecklist = async clId => {
        try {
            await api.fetch(ENDPOINTS.checklist(cardRef, clId), { method: "DELETE" });
            setChecklists(p => p.filter(c => c.id !== clId));
            toast.success("Checklist dihapus");
        } catch { toast.error("Gagal menghapus checklist"); }
    };

    // ── Comments ──────────────────────────────────────────────────────────────────
    const getSortedComments = () => {
        const commentsCopy = [...comments];

        if (commentSort === "newest") {
            return commentsCopy.sort((a, b) => {
                const timeA = new Date(a.created_at || a.createdAt || 0).getTime();
                const timeB = new Date(b.created_at || b.createdAt || 0).getTime();
                return timeB - timeA;
            });
        } else if (commentSort === "oldest") {
            return commentsCopy.sort((a, b) => {
                const timeA = new Date(a.created_at || a.createdAt || 0).getTime();
                const timeB = new Date(b.created_at || b.createdAt || 0).getTime();
                return timeA - timeB;
            });
        }

        return commentsCopy;
    };

    const handlePostComment = async () => {
        if (!newComment.trim() || !cardRef || !canComment) return;
        setPostingComment(true);
        try {
            const res = await api.fetch(ENDPOINTS.comments(cardRef), {
                method: "POST",
                body: JSON.stringify({ body: newComment.trim() }),
            });
            const cm = res.data ?? res;
            // Prepend so newest comment appears at the top
            setComments(p => [...p, cm]);
            setNewComment("");

            // Scroll ke atas karena komentar baru ada di atas
            setTimeout(() => {
                const el = commentScrollRef.current;
                if (el) el.scrollTop = 0;
            }, 0);
        } catch { toast.error("Gagal mengirim komentar"); }
        finally { setPostingComment(false); }
    };

    const handleDeleteComment = async cm => {
        if (!cardRef) return;
        const ref = cm.uuid ?? cm.id;
        try {
            await api.fetch(ENDPOINTS.comment(cardRef, ref), { method: "DELETE" });
            setComments((p) => removeCommentFromTree(p, ref));
        } catch { toast.error("Gagal menghapus komentar"); }
    };

    const handleReplyComment = async (parentComment, body) => {
        if (!cardRef || !body?.trim()) return false;

        const parentRef = getCommentRef(parentComment);
        if (!parentRef) return false;

        setReplyingCommentRef(parentRef);
        try {
            const res = await api.fetch(ENDPOINTS.comments(cardRef), {
                method: "POST",
                body: JSON.stringify({
                    body: body.trim(),
                    parent_uuid: parentRef,
                }),
            });

            const newReply = res?.data ?? res;
            setComments((prev) => insertReplyIntoTree(prev, parentRef, newReply));
            return true;
        } catch {
            toast.error("Gagal mengirim balasan");
            return false;
        } finally {
            setReplyingCommentRef(null);
        }
    };

    const handleVoteComment = async (cm, voteValue) => {
        if (!cardRef) return;

        const ref = getCommentRef(cm);
        if (!ref) return;

        const currentComment = findCommentByRef(comments, ref) ?? cm;
        const currentVote = Number(currentComment?.my_vote);
        const sameVote = currentVote === Number(voteValue);
        const optimisticPatch = buildOptimisticVotePatch(currentComment, Number(voteValue));
        const rollbackPatch = {
            likes_count: currentComment?.likes_count ?? 0,
            dislikes_count: currentComment?.dislikes_count ?? 0,
            my_vote: currentComment?.my_vote ?? null,
        };

        setComments((prev) => patchCommentVote(prev, ref, optimisticPatch));
        setVotingCommentRef(ref);
        try {
            await new Promise((resolve) => setTimeout(resolve, 180));

            let res;
            if (sameVote) {
                res = await api.fetch(ENDPOINTS.commentVotes(cardRef, ref), { method: "DELETE" });
            } else {
                res = await api.fetch(ENDPOINTS.commentVotes(cardRef, ref), {
                    method: "POST",
                    body: JSON.stringify({ vote: voteValue }),
                });
            }

            const data = res?.data ?? res ?? {};
            const patch = {
                likes_count: data.likes_count ?? 0,
                dislikes_count: data.dislikes_count ?? 0,
                my_vote: data.my_vote ?? null,
            };

            setComments((prev) => patchCommentVote(prev, ref, patch));
        } catch {
            setComments((prev) => patchCommentVote(prev, ref, rollbackPatch));
            toast.error("Gagal memperbarui vote");
        } finally {
            setVotingCommentRef(null);
        }
    };

    const handleReactComment = async (cm, emoji) => {
        if (!cardRef) return;
        const ref = getCommentRef(cm);
        if (!ref) return;

        const currentComment = findCommentByRef(comments, ref) ?? cm;
        const currentReactions = [...(currentComment?.reactions ?? [])];

        // ← Cek me_reacted langsung dari data reactions
        const alreadyReacted = currentReactions.find(r => r.emoji === emoji)?.me_reacted ?? false;

        // Optimistic update
        let optimisticReactions;
        if (alreadyReacted) {
            optimisticReactions = currentReactions
                .map(r => r.emoji === emoji ? { ...r, count: Math.max(0, r.count - 1), me_reacted: false } : r)
                .filter(r => r.count > 0);
        } else {
            const exists = currentReactions.find(r => r.emoji === emoji);
            optimisticReactions = exists
                ? currentReactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1, me_reacted: true } : r)
                : [...currentReactions, { emoji, count: 1, me_reacted: true }];
        }

        setComments(prev => patchCommentReactions(prev, ref, optimisticReactions));

        try {
            const res = await api.fetch(ENDPOINTS.commentReactions(cardRef, ref), {
                method: alreadyReacted ? "DELETE" : "POST",
                body: JSON.stringify({ emoji }),
            });

            const data = res?.data ?? res ?? {};
            if (Array.isArray(data.reactions)) {
                setComments(prev => patchCommentReactions(prev, ref, data.reactions));
            }
        } catch {
            // Rollback ke data sebelumnya
            setComments(prev => patchCommentReactions(prev, ref, currentReactions));
            toast.error("Gagal memproses reaksi");
        }
    };

    const handleEmojiClick = (emojiData) => {
        // emojiData.emoji berisi emoji yang dipilih
        setNewComment(prev => prev + emojiData.emoji);
    };

    // ── Guard ─────────────────────────────────────────────────────────────────────
    if (!card) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-7xl w-full p-0 gap-0 overflow-hidden max-h-[87.2dvh] flex flex-col rounded-2xl dark:bg-muted">
                <DialogTitle className="sr-only">{title}</DialogTitle>
                <div className="px-5 py-3.5 border-b border-dashed relative flex items-center gap-3">
                    <SignalTaskCard className="size-4.5" />
                    {editingTitle ? (
                        <div className="flex flex-1 gap-2 me-5">
                            <TextareaAutosize
                                defaultValue={title}
                                className="w-full h-fit text-zinc-700 dark:text-zinc-300 me-6 resize-none focus-visible:outline-none text-lg font-medium"
                            />
                            <Button size="xs" onClick={handleSaveTitle} disabled={savingTitle}>
                                <span>{savingTitle ? 'Menyimpan..' : 'Simpan'}</span>
                            </Button>
                            <Button size="xs" variant="ghost" onClick={() => { setTitle(card.title); setEditingTitle(false); }}>
                                <span>Batal</span>
                            </Button>
                        </div>
                    ) : (
                        <p
                            className="font-medium text-zinc-950 dark:text-white text-lg"
                            onClick={() => setEditingTitle(true)}
                        >{title}</p>
                    )}
                </div>
                <div className="flex flex-col lg:flex-row h-full max-h-[92dvh] overflow-hidden divide-x divide-border/50">

                    {/* Left */}
                    <ScrollArea className="flex-1 min-w-0">
                        <div className="p-6 space-y-0">


                            {/* ── Priority ─────────────────────────────────────────── */}

                            <div className="flex flex-col">
                                <div className="grid md:grid-cols-6 lg:grid-cols-3 py-3.5 md:grid-rows-1 gap-5 md:gap-10">
                                    {/* Label */}
                                    <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-1">
                                        <Label>Prioritas</Label>
                                        <p className="text-xs text-muted-foreground">Tingkat urgensi tugas</p>
                                    </div>

                                    {/* Content */}
                                    <div className="md:col-span-4 lg:col-span-2 flex flex-col justify-between rounded-xl px-4 py-0 pe-2 items-start gap-1">
                                        <Select
                                            value={priority}
                                            onValueChange={val => {
                                                setPriority(val);
                                                handleSaveMeta({ priority: val });
                                            }}
                                        >
                                            <SelectTrigger className="text-xs w-fit bg-white dark:bg-muted" size="sm">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">
                                                    <span className="flex items-center gap-2">
                                                        <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                                                        Low
                                                    </span>
                                                </SelectItem>
                                                <SelectItem value="medium">
                                                    <span className="flex items-center gap-2">
                                                        <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                                                        Medium
                                                    </span>
                                                </SelectItem>
                                                <SelectItem value="high">
                                                    <span className="flex items-center gap-2">
                                                        <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                                                        High
                                                    </span>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* =========== Label ============= */}
                            <div className="flex flex-col">
                                <div className="grid md:grid-cols-6 lg:grid-cols-3 py-3.5 md:grid-rows-1 gap-5 md:gap-10">
                                    {/* Label */}
                                    <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-1">
                                        <Label>Label</Label>
                                        <p className="text-xs text-muted-foreground">Kategori untuk item ini</p>
                                    </div>

                                    {/* Content */}
                                    <div className="md:col-span-4 lg:col-span-2 flex flex-col justify-between rounded-xl px-4 py-0 pe-2 items-start gap-1">

                                        {/* ── Labels manager ──────────────────────────────────────── */}
                                        <div className="space-y-2 w-full">
                                            <div className="flex items-center justify-between w-full">
                                                <small className="text-muted-foreground text-xs">{labels.length} item</small>
                                                <Popover open={labelPopOpen} onOpenChange={setLabelPopOpen}>
                                                    <PopoverTrigger asChild>
                                                        <Button type="button" variant="ghost" size="icon-xs">
                                                            <Tag className="h-3 w-3" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <LabelPickerContent
                                                        labels={labels}
                                                        onAdd={handleAddLabel}
                                                        onRemove={handleRemoveLabel}
                                                    />
                                                </Popover>
                                            </div>

                                            {labels.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {labels.map(l => (
                                                        <LabelBadge key={l.id} label={l} onRemove={handleRemoveLabel} staticRemove={true} />
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-muted-foreground/60 italic">Belum ada label</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* =========== Assigner ============= */}
                            <div className="flex flex-col">
                                <div className="grid md:grid-cols-6 lg:grid-cols-3 py-3.5 md:grid-rows-1 gap-5 md:gap-10">
                                    {/* Label */}
                                    <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-1">
                                        <Label>Assigner</Label>
                                        <p className="text-xs text-muted-foreground">Siapa yang mengerjakan</p>
                                    </div>

                                    {/* Content */}
                                    <div className="md:col-span-4 lg:col-span-2 flex flex-col justify-between rounded-xl px-4 py-0 pe-2 items-start gap-1">
                                        <div className="flex items-center justify-between w-full">
                                            <small className="text-muted-foreground text-xs">{assignees.length} selected</small>

                                            <div className="flex items-center gap-1">
                                                {/* Toggle switch */}
                                                {assignees.length > 0 && (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="icon-xs"
                                                                variant="ghost"
                                                                onClick={() => setAssignView(v => v === "detail" ? "ringkas" : "detail")}
                                                            >
                                                                {assignView === "detail"
                                                                    ? <Group />   // icon ringkas
                                                                    : <List />         // icon detail
                                                                }
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {assignView === "detail" ? "Tampilan ringkas" : "Tampilan detail"}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                )}
                                                {/* Add Member */}
                                                <Popover open={memberPopOpen} onOpenChange={setMemberPopOpen}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    size="icon-xs"
                                                                    variant="ghost"
                                                                >
                                                                    <UserPlus2 />
                                                                </Button>
                                                            </PopoverTrigger>
                                                        </TooltipTrigger>

                                                        <TooltipContent>
                                                            <p>Tambah member</p>
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    <MemberPickerContent
                                                        members={wsMembers}
                                                        assignees={assignees}
                                                        onToggle={handleToggleMember}
                                                        loading={loadingMembers}
                                                    />
                                                </Popover>
                                            </div>

                                        </div>
                                        <div>
                                            {/* Tampilan kondisional */}
                                            {assignees.length > 0 ? (
                                                assignView === "detail" ? (
                                                    // ── MODE DETAIL: badge nama ──
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {assignees.map(a => (
                                                            <Tooltip key={a.adminId ?? a.id ?? a.admin_id}>
                                                                <TooltipTrigger asChild>
                                                                    <div className="flex items-center gap-1.5 bg-muted/90 dark:bg-zinc-900 rounded-full pl-0.5 pr-2.5 py-0.5 border border-border/40 cursor-default">
                                                                        <Avatar className="h-5 w-5 shrink-0">
                                                                            <AvatarFallback className={cn("text-[9px] text-white font-semibold", avatarBg(a.name ?? ""))}>
                                                                                {getInitials(a.name ?? "")}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <span className="text-xs font-medium">{a.name}</span>
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>{a.email}</TooltipContent>
                                                            </Tooltip>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    // ── MODE RINGKAS: AvatarGroup ──
                                                    <div>
                                                        <AvatarGroup max={5} className="items-center">
                                                            {assignees.map((a, idx) => (
                                                                <Avatar title={a.name} key={a.id ?? a.admin_id ?? idx} className="size-7 hover:z-10 border-white dark:border-zinc-800">
                                                                    <AvatarFallback className={cn("text-[9px] font-semibold text-white", avatarBg(a.name ?? ""))}>
                                                                        {getInitials(a.name ?? "")}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            ))}
                                                        </AvatarGroup>
                                                    </div>
                                                )
                                            ) : (
                                                <div className="flex items-center flex-1 h-full">
                                                    <p className="text-xs text-muted-foreground/60 italic">Belum ada member yang ditambahkan</p>
                                                </div>
                                            )}

                                        </div>

                                    </div>
                                </div>
                            </div>


                            {/* Date Picker */}
                            <div className="flex flex-col">
                                <div className="grid md:grid-cols-6 lg:grid-cols-3 py-3.5 md:grid-rows-1 gap-5 md:gap-10">
                                    {/* Label */}
                                    <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-1">
                                        <Label>Tanggal</Label>
                                        <p className="text-xs text-muted-foreground">Atur Tanggal mulai dan tanggal selesai</p>
                                    </div>

                                    {/* Content */}
                                    <div className="md:col-span-4 lg:col-span-2 flex flex-col justify-between rounded-xl px-4 py-0 pe-2 items-start gap-1">
                                        {/* ── Date range picker ────────────────────────────────── */}
                                        <DateRangePicker
                                            startDate={startDate}
                                            dueDate={dueDate}
                                            onStartChange={setStartDate}
                                            onDueChange={setDueDate}
                                            onSave={(patch = {}) =>
                                                handleSaveMeta({
                                                    start_date: patch.start_date !== undefined ? patch.start_date : (startDate || null),
                                                    due_date: patch.due_date !== undefined ? patch.due_date : (dueDate || null),
                                                })
                                            }
                                            saving={savingMeta}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 border-t border-dashed">
                                {/* Links */}
                                <div className="space-y-2 pt-3.5">
                                    <div className="flex gap-2 justify-between">
                                        <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-1">
                                            <Label>Tautan Link</Label>
                                            <p className="text-xs text-muted-foreground">Tambahkan Link dan label</p>
                                        </div>
                                        <div className="flex gap-2">


                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="icon-xs"
                                                        variant="ghost"
                                                        onClick={() => setShowLinkInput(!showLinkInput)}
                                                    >
                                                        {showLinkInput ? (<X />) : (<Plus />)}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Tambahkan Link</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="icon-xs"
                                                        variant="ghost"
                                                        disabled={links.length == 0}
                                                        onClick={() => setShowLinkDelete(!showLinkDelete)}
                                                    >
                                                        {showLinkInput ? (<X />) : (<TrashIcon />)}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Hapus Item</p>
                                                </TooltipContent>
                                            </Tooltip>

                                        </div>
                                    </div>


                                    <div className="p-3 space-y-3 rounded-xl">
                                        {links.length > 0 ? (
                                            <div className="flex flex-wrap gap-1.5">
                                                {links.map((link, idx) => (
                                                    <div key={`link-tag-${idx}`} className={cn("inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/30 ps-2 py-1", showLinkDelete ? 'pe-1' : 'pe-2.5')}>
                                                        <a
                                                            href={toExternalHref(link.url)}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-2 text-xs font-medium hover:text-primary"
                                                        >
                                                            <Link2 className="size-3.5" />
                                                            <span>{link.label}</span>
                                                        </a>
                                                        {showLinkDelete && (
                                                            <Button
                                                                type="button"
                                                                size="icon-sm"
                                                                variant="ghost"
                                                                className="h-5 w-5"
                                                                onClick={() => handleRemoveLink(idx)}
                                                            >
                                                                <X className="size-3.5" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-muted-foreground/70 italic">Belum ada link</p>
                                        )}

                                        {showLinkInput && (
                                            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.4fr_auto] gap-1.5 items-center">
                                                <Input
                                                    value={newLinkLabel}
                                                    onChange={(e) => setNewLinkLabel(e.target.value)}
                                                    placeholder="Label"
                                                    className="text-xs"
                                                />
                                                <Input
                                                    value={newLinkUrl}
                                                    onChange={(e) => setNewLinkUrl(e.target.value)}
                                                    placeholder="https://..."
                                                    className="text-xs"
                                                />
                                                <Button variant="outline" type="button" size="sm" onClick={handleCreateLink} disabled={savingMeta}>
                                                    {savingMeta ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
                                                    Tambah
                                                </Button>
                                            </div>
                                        )}

                                    </div>
                                </div>

                                {/* ── Description ─────────────────────────────────────────── */}
                                <div className="space-y-2 pt-3.5">
                                    <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-1">
                                        <Label htmlFor="description">
                                            Deskripsi
                                        </Label>
                                        <p className="text-xs text-muted-foreground">Tambahkan deskripsi untuk item ini</p>
                                    </div>
                                    <div className="border rounded-xl bg-card">
                                        <TextareaAutosize
                                            id="description"
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                            placeholder="Tambah deskripsi lengkap tentang tugas ini..."
                                            className="text-sm w-full resize-none focus-visible:outline-none px-4 pt-4 pb-2"
                                            minRows={3}
                                            maxRows={6}
                                        />

                                        <div className="flex items-center h-8 justify-between px-3 pb-2">
                                            <small className="text-muted-foreground">{description?.length} char</small>
                                            {(description != card?.description) && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={handleSaveDescription}
                                                    disabled={savingDesc}
                                                >
                                                    {savingDesc
                                                        ? <Spinner />
                                                        : <SaveIcon />
                                                    }
                                                    Simpan
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Attachments */}
                                <div className="space-y-2 pt-3.5">
                                    <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-1">
                                        <Label htmlFor="attachment">
                                            Attachments
                                        </Label>
                                        <p className="text-xs text-muted-foreground" id="attachment">Tambahkan file untuk item ini</p>
                                    </div>
                                    <div className="p-3 rounded-xl space-y-3">
                                        <div className="flex justify-between items-center">
                                            <small className="text-xs text-muted-foreground">{attachments.length} file</small>
                                            <label className="inline-flex">
                                                <input
                                                    type="file"
                                                    multiple
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const files = Array.from(e.target.files ?? []);
                                                        if (files.length) handleUploadAttachments(files);
                                                        e.target.value = "";
                                                    }}
                                                />
                                                <Button type="button" size="xs" variant="outline" asChild disabled={uploadingAttachment}>
                                                    <span>
                                                        {uploadingAttachment ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
                                                        Upload
                                                    </span>
                                                </Button>
                                            </label>
                                        </div>

                                        {attachments.length === 0 ? (
                                            <div className="rounded-xl border border-dashed border-border/60 px-4 py-3 text-center text-xs text-muted-foreground/70">
                                                Belum ada attachment.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                                                {attachments.map((item) => {
                                                    const IconComp = getAttachmentIcon(item?.mime_type);
                                                    return (
                                                        <div
                                                            key={item.id ?? item.uuid}
                                                            className="rounded-xl border border-border/60 p-3 flex flex-col gap-2 bg-card"
                                                        >
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="inline-flex items-center justify-center size-8 rounded-lg bg-muted/70 border border-border/50">
                                                                    <IconComp className="size-4 text-muted-foreground" />
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    size="icon-sm"
                                                                    variant="ghost"
                                                                    disabled={deletingAttachmentId === item.id}
                                                                    onClick={() => handleDeleteAttachment(item.id)}
                                                                >
                                                                    {deletingAttachmentId === item.id
                                                                        ? <Loader2 className="size-3.5 animate-spin" />
                                                                        : <Trash2 className="size-3.5" />
                                                                    }
                                                                </Button>
                                                            </div>

                                                            <div className="flex-1 min-h-0">
                                                                <p className="text-xs font-medium line-clamp-2 break-all">{item.file_name ?? item.name}</p>
                                                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                                                    {formatFileSize(item.size)}{item.mime_type ? ` • ${item.mime_type}` : ""}
                                                                </p>
                                                            </div>

                                                            <div className="flex gap-2 items-center justify-between">
                                                                <a
                                                                    href={item.url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex flex-1"
                                                                >
                                                                    <Button type="button" size="xs" variant="outline" className="w-full">
                                                                        <ExternalLink className="size-3.5" />
                                                                        Buka File
                                                                    </Button>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    {/* Right */}
                    <div className="flex-1 flex flex-col bg-card min-h-0">
                        <div className="px-3 py-2 h-full min-h-0">
                            <Tabs defaultValue="comment" className="gap-5 h-full min-h-0 flex flex-col">
                                <TabsList variant="line" className="[&>button]:px-3">
                                    <TabsTrigger value="comment" className="cursor-pointer">
                                        <span>Comments</span>
                                        <Badge size="icon-sm">{card?.comments_count ?? 0}</Badge>
                                    </TabsTrigger>
                                    <TabsTrigger value="checklist" className="cursor-pointer">
                                        <span>Checklist</span>
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="comment" className="mt-0 flex-1 min-h-0 flex flex-col overflow-hidden">

                                    {/* Comment filter badges — only when there are comments & not loading */}
                                    {!loadingDetail && comments.length > 0 && (
                                        <div className="flex gap-2 items-center mb-3 flex-wrap">
                                            <Badge
                                                variant={commentSort === "all" ? "default" : "ghost"}
                                                className="cursor-pointer rounded-md"
                                                onClick={() => setCommentSort("all")}
                                            >
                                                Semua
                                            </Badge>
                                            <Badge
                                                variant={commentSort === "newest" ? "default" : "ghost"}
                                                className="cursor-pointer rounded-md"
                                                onClick={() => setCommentSort("newest")}
                                            >
                                                Terbaru
                                            </Badge>
                                            <Badge
                                                variant={commentSort === "oldest" ? "default" : "ghost"}
                                                className="cursor-pointer rounded-md"
                                                onClick={() => setCommentSort("oldest")}
                                            >
                                                Terlama
                                            </Badge>
                                        </div>
                                    )}

                                    {/* ── Comment list (ScrollArea, grows to fill space) ── */}
                                    <ScrollArea className="flex-1 min-h-0 pe-1" ref={commentScrollRef}>
                                        {loadingDetail ? (
                                            <div className="flex items-center min-h-40 gap-2 text-xs justify-center mt-60 text-muted-foreground py-3">
                                                <Spinner />
                                                Memuat komentar...
                                            </div>
                                        ) : comments.length > 0 ? (
                                            getSortedComments().map((cm, i) => (
                                                <CommentItem
                                                    key={cm.uuid ?? cm.id}
                                                    cm={cm}
                                                    onDelete={canEdit ? handleDeleteComment : undefined}
                                                    onVote={canComment ? handleVoteComment : undefined}
                                                    votingRef={votingCommentRef}
                                                    onReply={canComment ? handleReplyComment : undefined}
                                                    replyingRef={replyingCommentRef}
                                                    onReact={canComment ? handleReactComment : undefined}
                                                    myReactions={myReactions}
                                                    isLastComment={getSortedComments()?.length === i + 1}
                                                />
                                            ))
                                        ) : (
                                            <div className="text-center py-6 flex items-center justify-center flex-col gap-2 mt-72">
                                                <Messages3 variant="TwoTone" className="h-10 w-10 text-muted-foreground/50 mx-auto" />
                                                <p className="text-xs text-muted-foreground/80">Belum ada komentar</p>
                                            </div>
                                        )}
                                    </ScrollArea>

                                    {/* ── Comment input — always at bottom ── */}
                                    <div className={cn(
                                        "bg-muted/30 mt-2 mb-2 mx-2 flex gap-2 flex-col justify-end border-border/50 border p-3.5 rounded-2xl",
                                        "focus-within:ring-1 focus-within:ring-primary/50",
                                        !canComment && "opacity-60"
                                    )}>
                                        <TextareaAutosize
                                            value={newComment}
                                            minRows={2}
                                            maxRows={6}
                                            onChange={e => canComment && setNewComment(e.target.value)}
                                            placeholder={
                                                role === "viewer"
                                                    ? "Anda hanya dapat melihat komentar..."
                                                    : "Tulis komentar... (Ctrl+Enter untuk kirim)"
                                            }
                                            readOnly={!canComment}
                                            disabled={loadingDetail}
                                            className={cn(
                                                "text-sm w-full resize-none focus-visible:outline-none bg-transparent",
                                                (!canComment || loadingDetail) && "cursor-not-allowed text-muted-foreground"
                                            )}
                                            onKeyDown={e => {
                                                if (e.key === "Enter" && e.ctrlKey && canComment) handlePostComment();
                                            }}
                                        />
                                        <div className="flex justify-between">
                                            <Popover open={emojiPopOpen} onOpenChange={canComment ? setEmojiPopOpen : undefined}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        size="icon-sm"
                                                        className="rounded-xl"
                                                        variant="outline"
                                                        disabled={!canComment || loadingDetail}
                                                    >
                                                        <SmilePlus className="stroke-[1.5]" />
                                                    </Button>
                                                </PopoverTrigger>

                                                <PopoverContent
                                                    className="w-auto p-0 border shadow-md"
                                                    side="top"
                                                    align="start"
                                                    sideOffset={6}
                                                >
                                                    <EmojiPicker
                                                        onEmojiClick={(emojiData) => {
                                                            handleEmojiClick(emojiData);
                                                            setEmojiPopOpen(false);
                                                        }}
                                                        theme={resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT}
                                                        lazyLoadEmojis
                                                        searchPlaceholder="Cari emoji..."
                                                        width={300}
                                                        height={380}
                                                    />
                                                </PopoverContent>
                                            </Popover>

                                            <Button
                                                type="button"
                                                size="icon-sm"
                                                className="rounded-xl"
                                                onClick={handlePostComment}
                                                disabled={!canComment || postingComment || loadingDetail || !newComment.trim()}
                                            >
                                                {postingComment
                                                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                    : <ArrowUp className="h-3.5 w-3.5" />
                                                }
                                            </Button>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="checklist">

                                    <div className="flex flex-col gap-3">

                                        <div className="flex justify-between items-end">
                                            <small className="text-muted-foreground">{checklists?.length} Checklist</small>
                                            <Button
                                                type="button"
                                                size="xs"
                                                onClick={() => setShowChecklistInput(true)}
                                            >
                                                <Plus className="h-3 w-3" />
                                                Tambah
                                            </Button>
                                        </div>

                                        {/* Add checklist input */}
                                        {showChecklistInput && (
                                            <div className="flex items-center gap-1.5 pt-1">
                                                <Input
                                                    autoFocus
                                                    value={newChecklistTitle}
                                                    onChange={(e) => setNewChecklistTitle(e.target.value)}
                                                    placeholder="Nama checklist baru..."
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") handleAddChecklist();
                                                        if (e.key === "Escape") {
                                                            setShowChecklistInput(false);
                                                            setNewChecklistTitle("");
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={handleAddChecklist}
                                                    disabled={addingChecklist || !newChecklistTitle.trim()}
                                                >
                                                    {addingChecklist ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Save />
                                                            <span>Tambah</span>
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-7 w-7"
                                                    onClick={() => {
                                                        setShowChecklistInput(false);
                                                        setNewChecklistTitle("");
                                                    }}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        )}

                                        {/* ── Checklists ──────────────────────────────────────────── */}
                                        <div className="space-y-1">

                                            {loadingDetail && (
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                    Memuat...
                                                </div>
                                            )}

                                            {/* Sortable checklists */}
                                            <Sortable
                                                value={checklists}
                                                getItemValue={(item) => item.id}
                                                onMove={({ activeIndex, overIndex }) => {
                                                    const reordered = [...checklists];
                                                    const [moved] = reordered.splice(activeIndex, 1);
                                                    reordered.splice(overIndex, 0, moved);
                                                    setChecklists(reordered);
                                                    // Persist order 
                                                    api.fetch(ENDPOINTS.checklistReorder(cardRef), {
                                                        method: "PATCH",
                                                        body: JSON.stringify({ ids: reordered.map((cl) => cl.id) }),
                                                    });
                                                }}
                                            >
                                                <SortableContent className="space-y-4">
                                                    {checklists.map((cl) => (
                                                        <SortableItem
                                                            key={cl.id}
                                                            value={cl.id}
                                                            className="group/sortable-cl relative"
                                                        >

                                                            <ChecklistSection
                                                                checklist={cl}
                                                                cardRef={cardRef}
                                                                SortableItemHandle={SortableItemHandle}
                                                                api={api}
                                                                onUpdated={(u) =>
                                                                    setChecklists((prev) =>
                                                                        prev.map((c) => (c.id === u.id ? u : c))
                                                                    )
                                                                }
                                                                onDeleted={handleDeleteChecklist}
                                                            />
                                                        </SortableItem>
                                                    ))}
                                                </SortableContent>
                                                <SortableOverlay />
                                            </Sortable>

                                        </div>

                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
