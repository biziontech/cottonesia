"use client"

import {
    Plus, Loader2, Grid2x2Plus, LayersPlus,
    Lock, LockOpen, Bookmark,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Kanban, KanbanBoard, KanbanOverlay } from "@/components/ui/kanban";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
    Select, SelectContent, SelectGroup,
    SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { CalendarIcon, LayoutDashboard, LayoutList } from "lucide-react";
import AgendaTaskCard from "@/components/partials/agenda/AgendaTaskCard";
import AgendaTaskColumn from "@/components/partials/agenda/AgendaTaskColumn";
import AgendaWorkspaceHeader from "@/components/partials/agenda/AgendaWorkspaceHeader";
import AgendaCardDetailModal from "@/components/partials/agenda/AgendaCardDetailModal";

// ─── API Endpoints ────────────────────────────────────────────────────────────

const API = process.env.NEXT_PUBLIC_API_URL;

const tabs = [
    { key: "board", label: "Board", icon: LayoutDashboard, isDisabled: false },
    { key: "list", label: "List", icon: LayoutList, isDisabled: true },
    { key: "calendar", label: "Calendar", icon: CalendarIcon, isDisabled: true },
];

const ENDPOINTS = {
    workspace: (wsId) => `${API}/office/agenda/workspaces/${wsId}`,
    lockWorkspace: (wsId) => `${API}/office/agenda/workspaces/${wsId}/lock`,
    boards: (wsId) => `${API}/office/agenda/workspaces/${wsId}/boards`,
    board: (wsId, bId) => `${API}/office/agenda/workspaces/${wsId}/boards/${bId}`,
    reorderBoards: (wsId) => `${API}/office/agenda/workspaces/${wsId}/boards/reorder`,
    cards: (bId) => `${API}/office/agenda/boards/${bId}/cards`,
    card: (bId, cId) => `${API}/office/agenda/boards/${bId}/cards/${cId}`,
    moveCard: (bId, cId) => `${API}/office/agenda/boards/${bId}/cards/${cId}/move`,
    wsMembers: (wsId) => `${API}/office/agenda/workspaces/${wsId}/members`,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createLocalId() {
    return `local-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function getEntityRef(entity) {
    return entity?.uuid ?? entity?.id;
}

/**
 * Map a BE card → local task shape
 * Menyimpan semua field yang berguna dari BE
 */
function mapCard(card) {
    const cardRef = getEntityRef(card);
    return {
        id: String(cardRef ?? createLocalId()),
        title: card.title ?? "",
        description: card.description ?? "",
        priority: card.priority ?? "medium",
        comments_count: card.comments_count,
        // Assignees array (untuk AvatarGroup)
        assignees: card.assignees?.map(a => ({
            id: a.id ?? a.admin_id,
            name: a.name ?? a.admin?.name ?? "",
            email: a.email ?? a.admin?.email ?? "",
        })) ?? [],
        // Date range
        startDate: card.start_date ?? card.startDate ?? "",
        dueDate: card.due_date ?? card.dueDate ?? "",
        // Labels (array of {id, name, color})
        labels: card.labels ?? [],
        _beRef: cardRef ?? null,
    };
}

/**
 * Map a BE board → column shape
 */
function mapBoard(board) {
    const boardRef = getEntityRef(board);
    return {
        id: String(boardRef ?? createLocalId()),
        title: board.title ?? board.name ?? "Column",
        position: board.position ?? 0,
        tasks: (board.cards ?? []).map(mapCard),
        _beRef: boardRef ?? null,
    };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Agenda(props) {
    const params = useParams();
    const workspaceId = props?.workspaceId ?? params?.uuid;

    const [columnMap, setColumnMap] = React.useState({});
    const [columnOrder, setColumnOrder] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [wsInfo, setWsInfo] = React.useState(null);
    const [wsMembers, setWsMembers] = React.useState([]);
    const [activeTab, setActiveTab] = React.useState("board");
    const [isLocked, setIsLocked] = React.useState(false);
    const [isBookmarked, setIsBookmarked] = React.useState(false);
    const [togglingLock, setTogglingLock] = React.useState(false);

    const scrollHostRef = React.useRef(null);
    const scrollDragRef = React.useRef({ active: false, startX: 0, scrollLeft: 0 });

    // ── Add Column Dialog ─────────────────────────────────────────────────────
    const [columnDialogOpen, setColumnDialogOpen] = React.useState(false);
    const [newColumnTitle, setNewColumnTitle] = React.useState("");
    const [savingColumn, setSavingColumn] = React.useState(false);

    // ── Quick Add / Edit Item Dialog ──────────────────────────────────────────
    const [itemDialogOpen, setItemDialogOpen] = React.useState(false);
    const [editingItemId, setEditingItemId] = React.useState(null);
    const [savingItem, setSavingItem] = React.useState(false);
    const [itemForm, setItemForm] = React.useState({
        columnId: "", title: "", description: "",
        startDate: "", dueDate: "", priority: "medium",
    });

    // ── Card Detail Modal ─────────────────────────────────────────────────────
    const [detailModalOpen, setDetailModalOpen] = React.useState(false);
    const [detailCard, setDetailCard] = React.useState(null);
    const [detailColumnId, setDetailColumnId] = React.useState(null);

    // ── Load workspace ────────────────────────────────────────────────────────
    const loadWorkspace = React.useCallback(async () => {
        if (!workspaceId) return;
        setLoading(true);
        try {
            const res = await api.fetch(ENDPOINTS.workspace(workspaceId));
            const wsData = res.data ?? res;
            setWsInfo(wsData);
            setIsLocked(wsData.is_locked ?? false);

            let boards = wsData.boards ?? [];
            if (boards.length === 0) {
                const bRes = await api.fetch(ENDPOINTS.boards(workspaceId));
                boards = Array.isArray(bRes) ? bRes : (bRes.data ?? []);
            }

            const boardsWithCards = await Promise.all(
                boards.map(async (board) => {
                    if (board.cards) return board;
                    const boardRef = getEntityRef(board);
                    const cRes = boardRef
                        ? await api.fetch(ENDPOINTS.cards(boardRef))
                        : { data: [] };
                    return { ...board, cards: Array.isArray(cRes) ? cRes : (cRes.data ?? []) };
                })
            );

            const map = {};
            const order = [];
            boardsWithCards
                .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
                .forEach((board) => {
                    const col = mapBoard(board);
                    map[col.id] = col;
                    order.push(col.id);
                });

            setColumnMap(map);
            setColumnOrder(order);

            // Load workspace members for detail modal
            const mRes = await api.fetch(ENDPOINTS.wsMembers(workspaceId)).catch(() => ({ data: [] }));
            setWsMembers(Array.isArray(mRes) ? mRes : (mRes.data ?? []));
        } catch (err) {
            console.error("Failed to load workspace:", err);
            toast.error("Gagal memuat workspace");
        } finally {
            setLoading(false);
        }
    }, [workspaceId]);

    React.useEffect(() => { loadWorkspace(); }, [loadWorkspace]);

    // ── Lock / Unlock workspace ───────────────────────────────────────────────
    const handleToggleLock = React.useCallback(async () => {
        if (!workspaceId || togglingLock) return;
        setTogglingLock(true);
        const prev = isLocked;
        setIsLocked(!prev); // optimistic

        try {
            const res = await api.fetch(ENDPOINTS.lockWorkspace(workspaceId), { method: "PATCH" });
            const data = res.data ?? res;
            setIsLocked(data.is_locked ?? !prev);
            toast.success(data.is_locked ? "Workspace dikunci" : "Workspace dibuka");
        } catch (err) {
            setIsLocked(prev); // rollback
            toast.error("Gagal mengubah status kunci");
        } finally {
            setTogglingLock(false);
        }
    }, [workspaceId, isLocked, togglingLock]);

    // ── Add column ────────────────────────────────────────────────────────────
    const handleAddColumn = React.useCallback(async () => {
        const title = newColumnTitle.trim();
        if (!title || !workspaceId) return;
        setSavingColumn(true);
        try {
            const res = await api.fetch(ENDPOINTS.boards(workspaceId), {
                method: "POST",
                body: JSON.stringify({ name: title, position: columnOrder.length }),
            });
            const board = res.data ?? res;
            const col = mapBoard(board);
            setColumnMap(prev => ({ ...prev, [col.id]: col }));
            setColumnOrder(prev => [...prev, col.id]);
            setNewColumnTitle("");
            setColumnDialogOpen(false);
            toast.success(res?.message || "Kolom berhasil dibuat");
        } catch (err) {
            toast.error("Gagal membuat kolom");
            console.error(err);
        } finally {
            setSavingColumn(false);
        }
    }, [newColumnTitle, workspaceId, columnOrder.length]);

    // ── Remove column ─────────────────────────────────────────────────────────
    const handleRemoveColumn = React.useCallback(async (colId) => {
        if (!confirm("Hapus kolom ini beserta semua card di dalamnya?")) return;
        const col = columnMap[colId];
        if (!col?._beRef) return;

        setColumnMap(prev => { const n = { ...prev }; delete n[colId]; return n; });
        setColumnOrder(prev => prev.filter(id => id !== colId));

        try {
            await api.fetch(ENDPOINTS.board(workspaceId, col._beRef), { method: "DELETE" });
            toast.success("Kolom dihapus");
        } catch (err) {
            console.error(err);
            loadWorkspace();
        }
    }, [columnMap, workspaceId, loadWorkspace]);

    // ── Quick-add item dialog ─────────────────────────────────────────────────
    const openAddItemDialog = React.useCallback((columnId) => {
        setEditingItemId(null);
        setItemForm({ columnId, title: "", description: "", startDate: "", dueDate: "", priority: "medium" });
        setItemDialogOpen(true);
    }, []);

    const openEditItemDialog = React.useCallback((columnId, task) => {
        setEditingItemId(task.id);
        setItemForm({
            columnId,
            title: task.title ?? "",
            description: task.description ?? "",
            startDate: task.startDate ?? "",
            dueDate: task.dueDate ?? "",
            priority: task.priority ?? "medium",
        });
        setItemDialogOpen(true);
    }, []);

    // ── Open card detail modal ────────────────────────────────────────────────
    const openCardDetail = React.useCallback((task) => {
        // Find which column contains this task
        const colId = Object.entries(columnMap).find(([, col]) =>
            col.tasks.some(t => t.id === task.id)
        )?.[0] ?? null;

        setDetailCard(task);
        setDetailColumnId(colId);
        setDetailModalOpen(true);
    }, [columnMap]);

    // ── Save card (quick create/edit) ─────────────────────────────────────────
    const handleSaveItem = React.useCallback(async () => {
        const title = itemForm.title.trim();
        if (!title || !itemForm.columnId) return;
        setSavingItem(true);

        const col = columnMap[itemForm.columnId];
        if (!col?._beRef) { setSavingItem(false); return; }

        const payload = {
            title,
            description: itemForm.description?.trim() ?? "",
            start_date: itemForm.startDate || null,
            due_date: itemForm.dueDate || null,
            priority: itemForm.priority,
        };

        try {
            if (editingItemId) {
                // Find task in current state snapshot
                const task = columnMap[itemForm.columnId]?.tasks.find(t => t.id === editingItemId);
                if (!task?._beRef) { setSavingItem(false); return; }

                const res = await api.fetch(ENDPOINTS.card(col._beRef, task._beRef), {
                    method: "PATCH",
                    body: JSON.stringify(payload),
                });
                const updated = mapCard(res.data ?? res);

                setColumnMap(prev => ({
                    ...prev,
                    [itemForm.columnId]: {
                        ...prev[itemForm.columnId],
                        tasks: prev[itemForm.columnId].tasks.map(t =>
                            t.id === editingItemId ? updated : t
                        ),
                    },
                }));
                toast.success("Item diperbarui");
            } else {
                const res = await api.fetch(ENDPOINTS.cards(col._beRef), {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
                const created = mapCard(res.data ?? res);

                setColumnMap(prev => ({
                    ...prev,
                    [itemForm.columnId]: {
                        ...prev[itemForm.columnId],
                        tasks: [...prev[itemForm.columnId].tasks, created],
                    },
                }));
                toast.success("Item ditambahkan");
            }
            setItemDialogOpen(false);
        } catch (err) {
            toast.error("Gagal menyimpan item");
            console.error(err);
        } finally {
            setSavingItem(false);
        }
    }, [editingItemId, itemForm, columnMap]);

    // ── Remove card ───────────────────────────────────────────────────────────
    const handleRemoveItem = React.useCallback(async (columnId, itemId) => {
        const col = columnMap[columnId];
        if (!col?._beRef) return;
        const task = col.tasks.find(t => t.id === itemId);
        if (!task?._beRef) return;

        setColumnMap(prev => ({
            ...prev,
            [columnId]: { ...prev[columnId], tasks: prev[columnId].tasks.filter(t => t.id !== itemId) },
        }));

        try {
            await api.fetch(ENDPOINTS.card(col._beRef, task._beRef), { method: "DELETE" });
        } catch (err) {
            console.error(err);
            loadWorkspace();
        }
    }, [columnMap, loadWorkspace]);

    // ── Card detail updated callback ──────────────────────────────────────────
    const handleCardUpdated = React.useCallback((updatedCard) => {
        if (!detailColumnId || !updatedCard) return;
        setColumnMap(prev => {
            const col = prev[detailColumnId];
            if (!col) return prev;
            return {
                ...prev,
                [detailColumnId]: {
                    ...col,
                    tasks: col.tasks.map(t => t.id === updatedCard.id ? { ...t, ...updatedCard } : t),
                },
            };
        });
        // Update detailCard too
        setDetailCard(prev => prev ? { ...prev, ...updatedCard } : prev);
    }, [detailColumnId]);

    // ── Kanban: card moved between columns ────────────────────────────────────
    const handleColumnsChange = React.useCallback(async (nextValue) => {
        const prevFlat = Object.entries(columnMap).flatMap(([cId, col]) =>
            col.tasks.map(t => ({ colId: cId, taskId: t.id }))
        );

        const newMap = {};
        for (const colId of columnOrder) {
            const existingCol = columnMap[colId];
            if (!existingCol) continue;
            const newTasks = (nextValue[colId] ?? []).map(item => {
                const found = Object.values(columnMap).flatMap(c => c.tasks).find(t => t.id === (item.id ?? item));
                return found ?? item;
            });
            newMap[colId] = { ...existingCol, tasks: newTasks };
        }
        setColumnMap(newMap);

        // Detect & persist moved card
        for (const [colId, col] of Object.entries(newMap)) {
            for (const task of col.tasks) {
                const prev = prevFlat.find(p => p.taskId === task.id);
                if (prev && prev.colId !== colId) {
                    const destCol = newMap[colId];
                    const destPos = destCol.tasks.findIndex(t => t.id === task.id);
                    const srcCol = columnMap[prev.colId];
                    if (!srcCol?._beRef || !destCol?._beRef || !task?._beRef) break;

                    try {
                        await api.fetch(ENDPOINTS.moveCard(srcCol._beRef, task._beRef), {
                            method: "PATCH",
                            body: JSON.stringify({
                                board_uuid: destCol._beRef,
                                position: destPos,
                            }),
                        });
                    } catch (err) {
                        console.error("Failed to move card:", err);
                    }
                    break;
                }
            }
        }
    }, [columnMap, columnOrder]);

    // ── Column reorder ────────────────────────────────────────────────────────
    const handleColumnOrderChange = React.useCallback(async (newOrder) => {
        setColumnOrder(newOrder);
        try {
            await api.fetch(ENDPOINTS.reorderBoards(workspaceId), {
                method: "PATCH",
                body: JSON.stringify({
                    boards: newOrder
                        .map((colId, idx) => ({
                            id: columnMap[colId]?._beRef,
                            uuid: columnMap[colId]?._beRef,
                            position: idx,
                        }))
                        .filter(b => b.id),
                }),
            });
        } catch (err) {
            console.error("Failed to reorder columns:", err);
        }
    }, [columnMap, workspaceId]);

    // ── Scroll-drag (horizontal pan) ──────────────────────────────────────────
    const handleBoardPointerDown = React.useCallback((event) => {
        if (event.button !== 0) return;
        if (event.target.closest("button, input, textarea, select, [role='button']")) return;
        const viewport = scrollHostRef.current?.querySelector("[data-slot='scroll-area-viewport']");
        if (!viewport) return;
        scrollDragRef.current = { active: true, startX: event.clientX, scrollLeft: viewport.scrollLeft };
        viewport.style.cursor = "grabbing";
        viewport.style.userSelect = "none";
        event.preventDefault();
    }, []);

    React.useEffect(() => {
        const onMove = (e) => {
            if (!scrollDragRef.current.active) return;
            const viewport = scrollHostRef.current?.querySelector("[data-slot='scroll-area-viewport']");
            if (!viewport) return;
            viewport.scrollLeft = scrollDragRef.current.scrollLeft - (e.clientX - scrollDragRef.current.startX);
        };
        const onUp = () => {
            if (!scrollDragRef.current.active) return;
            scrollDragRef.current.active = false;
            const viewport = scrollHostRef.current?.querySelector("[data-slot='scroll-area-viewport']");
            viewport?.style.removeProperty("cursor");
            viewport?.style.removeProperty("user-select");
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onUp);
        return () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("pointercancel", onUp);
        };
    }, []);

    // ── Build kanban value ────────────────────────────────────────────────────
    const kanbanValue = React.useMemo(() => {
        const val = {};
        for (const colId of columnOrder) {
            val[colId] = columnMap[colId]?.tasks ?? [];
        }
        return val;
    }, [columnMap, columnOrder]);

    const handleEditWorkspaceTitle = React.useCallback(() => {
        toast.info("Fitur edit judul workspace segera hadir");
    }, []);

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="max-w-full bg-gray-50 dark:bg-background mx-auto w-full px-4 py-6 min-h-[calc(100dvh-108px)] relative isolate">
            <div className="max-w-full mx-auto w-full relative z-10">
                <AgendaWorkspaceHeader
                    title={wsInfo?.name ?? ""}
                    description={wsInfo?.description ?? ""}
                    onEdit={handleEditWorkspaceTitle}
                />

                <div className="space-y-3.5 md:mx-5">
                    {/* ── Toolbar ── */}
                    <div className="flex items-center gap-2 flex-wrap justify-between">
                        <div className="flex gap-2">
                            <div className="bg-muted/60 p-0.5 gap-0.5 flex rounded-lg border border-border/50">
                                {tabs.map((f) => (
                                    <Button
                                        key={f.key}
                                        size="xs"
                                        disabled={f.isDisabled}
                                        variant={activeTab === f.key ? "outline" : "ghost"}
                                        onClick={() => setActiveTab(f.key)}
                                        className={cn(
                                            "px-2.5 text-xs border rounded-md",
                                            activeTab === f.key && "bg-background shadow-xs border border-border",
                                            activeTab !== f.key && "border-transparent"
                                        )}>
                                        <span>{f.label}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {/* Lock / Unlock (connected to BE) */}
                            <div className="bg-muted/60 p-0.5 gap-0.5 flex rounded-lg border border-border/50">
                                <Toggle
                                    aria-label="Toggle lock"
                                    pressed={isLocked}
                                    onPressedChange={handleToggleLock}
                                    disabled={togglingLock}
                                    size="icon"
                                    variant="ghost"
                                    className={cn(
                                        "size-7 rounded-md hover:bg-background border border-transparent hover:border-border transition-colors duration-300",
                                        isLocked && "!bg-background shadow-xs border-border"
                                    )}>
                                    {togglingLock
                                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        : isLocked
                                            ? <Lock className="h-3.5 w-3.5" />
                                            : <LockOpen className="h-3.5 w-3.5 stroke-muted-foreground" />
                                    }
                                </Toggle>
                                <Toggle
                                    aria-label="Toggle bookmark"
                                    pressed={isBookmarked}
                                    onPressedChange={setIsBookmarked}
                                    size="icon"
                                    variant="ghost"
                                    className={cn(
                                        "size-7 rounded-md hover:bg-background border border-transparent hover:border-border transition-colors duration-300",
                                        isBookmarked && "!bg-background shadow-xs border border-border"
                                    )}>
                                    <Bookmark className={cn("size-4 transition-colors", isBookmarked ? "fill-foreground stroke-foreground" : "stroke-muted-foreground")} />
                                </Toggle>
                            </div>

                            <Button
                                type="button" size="sm" className="shrink-0"
                                disabled={loading || isLocked}
                                onClick={() => setColumnDialogOpen(true)}>
                                <LayersPlus className="size-3.5" />
                                Tambah Board
                            </Button>
                        </div>
                    </div>

                    {/* Locked notice */}
                    {isLocked && (
                        <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                            <Lock className="h-3.5 w-3.5 shrink-0" />
                            Workspace ini sedang dikunci. Hanya pemilik yang dapat melakukan perubahan.
                        </div>
                    )}

                    {/* ── Board ── */}
                    {loading ? (
                        <div className="flex items-center justify-center min-h-[420px] gap-2 text-sm text-muted-foreground">
                            <Loader2 className="size-4 animate-spin" />
                            Memuat board…
                        </div>
                    ) : (
                        <Kanban
                            value={kanbanValue}
                            onValueChange={handleColumnsChange}
                            columns={columnOrder}                        // ← fix column drag
                            onColumnsChange={handleColumnOrderChange}    // ← fix column drag
                            getItemValue={(item) => item.id}
                        >
                            <div ref={scrollHostRef}>
                                <ScrollArea
                                    className="min-h-[70dvh] w-full"
                                    onPointerDown={handleBoardPointerDown}>
                                    <KanbanBoard className="flex min-w-max items-start gap-3">
                                        {columnOrder.map((colId) => {
                                            const col = columnMap[colId];
                                            if (!col) return null;
                                            return (
                                                <AgendaTaskColumn
                                                    key={colId}
                                                    value={colId}
                                                    title={col.title}
                                                    tasks={col.tasks}
                                                    onAddItem={openAddItemDialog}
                                                    onRemoveColumn={handleRemoveColumn}
                                                    onEditItem={openEditItemDialog}
                                                    onRemoveItem={handleRemoveItem}
                                                    onCardClick={openCardDetail}   // ← detail modal
                                                    showActions={!isLocked}
                                                />
                                            );
                                        })}
                                    </KanbanBoard>
                                </ScrollArea>
                            </div>

                            <KanbanOverlay>
                                {({ value, variant }) => {
                                    if (variant === "column") {
                                        const col = columnMap[value];
                                        if (!col) return null;
                                        return (
                                            <AgendaTaskColumn
                                                value={value}
                                                title={col.title}
                                                tasks={col.tasks}
                                                showActions={false}
                                            />
                                        );
                                    }
                                    const task = Object.values(columnMap).flatMap(c => c.tasks).find(t => t.id === value);
                                    if (!task) return null;
                                    return <AgendaTaskCard task={task} showActions={false} />;
                                }}
                            </KanbanOverlay>
                        </Kanban>
                    )}
                </div>
            </div>

            {/* ── Add Column Dialog ─────────────────────────────────────────────── */}
            <Dialog open={columnDialogOpen} onOpenChange={setColumnDialogOpen}>
                <DialogContent className="md:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Tambah Kolom</DialogTitle>
                        <DialogDescription>Buat kolom baru untuk status pekerjaan.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label className="text-sm">Nama Kolom</Label>
                        <Input
                            value={newColumnTitle}
                            onChange={(e) => setNewColumnTitle(e.target.value)}
                            placeholder="Masukkan nama kolom"
                            onKeyDown={(e) => e.key === "Enter" && handleAddColumn()}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setColumnDialogOpen(false)}>Batal</Button>
                        <Button type="button" onClick={handleAddColumn} disabled={savingColumn}>
                            {savingColumn ? <Spinner /> : <Grid2x2Plus />}
                            Tambah
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Quick Add / Edit Item Dialog ─────────────────────────────────── */}
            <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingItemId ? "Edit Cepat" : "Tambah Item"}</DialogTitle>
                        <DialogDescription>Kelola detail item pada kolom.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Judul</Label>
                            <Input
                                autoFocus
                                value={itemForm.title}
                                onChange={(e) => setItemForm(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Contoh: Servis AC Fortuner"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Mulai</Label>
                                <Input type="date" value={itemForm.startDate}
                                    onChange={(e) => setItemForm(prev => ({ ...prev, startDate: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Deadline</Label>
                                <Input type="date" value={itemForm.dueDate}
                                    onChange={(e) => setItemForm(prev => ({ ...prev, dueDate: e.target.value }))} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Prioritas</Label>
                            <Select
                                value={itemForm.priority}
                                onValueChange={(value) => setItemForm((prev) => ({ ...prev, priority: value }))}>
                                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="low">🟢 Low</SelectItem>
                                        <SelectItem value="medium">🟡 Medium</SelectItem>
                                        <SelectItem value="high">🔴 High</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Deskripsi (opsional)</Label>
                            <Textarea
                                value={itemForm.description}
                                onChange={(e) => setItemForm(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Catatan singkat..."
                                className="resize-none"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setItemDialogOpen(false)}>Batal</Button>
                        <Button type="button" onClick={handleSaveItem} disabled={savingItem}>
                            {savingItem && <Loader2 className="size-3.5 animate-spin mr-1" />}
                            {editingItemId ? "Update" : "Tambah"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Card Detail Modal ─────────────────────────────────────────────── */}
            {detailCard && (
                <AgendaCardDetailModal
                    open={detailModalOpen}
                    onOpenChange={setDetailModalOpen}
                    card={detailCard}
                    columnId={detailColumnId}
                    boardRef={detailColumnId ? columnMap[detailColumnId]?._beRef : null}
                    workspaceId={workspaceId}
                    onCardUpdated={handleCardUpdated}
                    api={api}
                    wsMembers={wsMembers}
                />
            )}

            {/* Background pattern */}
            <div className="-z-10 absolute inset-0 [background-size:20px_20px] [background-image:radial-gradient(#d4d4d4_1px,transparent_1px)] dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]" />
            <div className="-z-10 pointer-events-none absolute inset-0 flex items-center justify-center bg-gray-50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />
        </div>
    );
}