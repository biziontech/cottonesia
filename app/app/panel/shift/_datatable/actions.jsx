import { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Ellipsis, Pencil, Trash, Save } from "lucide-react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Required from "@/components/partials/Required";
import TimePicker from "./time-picker";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const toTimeValue = (value, fallback) => {
    if (!value) return fallback;

    return value.slice(0, 5);
};

const Actions = ({ row, table }) => {
    const reload = table.options.meta?.reload;
    const shift = row.original;
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: shift?.name || "",
        start_time: toTimeValue(shift?.start_time, "08:00"),
        end_time: toTimeValue(shift?.end_time, "17:00"),
        cross_day: Boolean(shift?.cross_day),
        is_active: Boolean(shift?.is_active),
        late_tolerance_minutes: shift?.late_tolerance_minutes ?? 0,
    });

    const resetForm = () => {
        setForm({
            name: shift?.name || "",
            start_time: toTimeValue(shift?.start_time, "08:00"),
            end_time: toTimeValue(shift?.end_time, "17:00"),
            cross_day: Boolean(shift?.cross_day),
            is_active: Boolean(shift?.is_active),
            late_tolerance_minutes: shift?.late_tolerance_minutes ?? 0,
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleDelete = async (uuid) => {
        try {
            setLoading(true);

            const response = await api.fetch(`${API_URL}/office/shifts/${uuid}`, {
                method: "DELETE",
            });

            if (response?.success) {
                toast.success(response?.message || "Shift berhasil dihapus");
                setDeleteOpen(false);
                if (reload) reload();
            } else {
                toast.error(response?.message || "Gagal menghapus shift");
            }
        } catch {
            toast.error("Gagal menghapus shift");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);

            const response = await api.fetch(`${API_URL}/office/shifts/${shift?.uuid}`, {
                method: "PUT",
                body: JSON.stringify({
                    ...form,
                    late_tolerance_minutes: Number(form.late_tolerance_minutes || 0),
                }),
            });

            if (response?.success) {
                toast.success(response?.message || "Shift berhasil diperbarui");
                setEditOpen(false);
                if (reload) reload();
            } else {
                toast.error(response?.message || "Gagal memperbarui shift");
            }
        } catch (error) {
            toast.error(error?.message || "Gagal memperbarui shift");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon-sm" variant="outline">
                        <Ellipsis />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                        resetForm();
                        setEditOpen(true);
                    }}>
                        <Pencil />
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                        <Trash />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="gap-0">
                        <DialogTitle className="text-base font-bold">Edit Shift</DialogTitle>
                        <DialogDescription>Perbarui jam kerja dan toleransi keterlambatan.</DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 gap-4 border-b border-dotted pb-4">
                        <div className="space-y-2">
                            <Label htmlFor={`name-${shift?.uuid}`}>Nama Shift<Required /></Label>
                            <Input
                                id={`name-${shift?.uuid}`}
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Contoh: Shift Pagi"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Jam Mulai<Required /></Label>
                                <TimePicker
                                    value={form.start_time}
                                    onChange={(value) => setForm((prev) => ({ ...prev, start_time: value }))}
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Jam Selesai<Required /></Label>
                                <TimePicker
                                    value={form.end_time}
                                    onChange={(value) => setForm((prev) => ({ ...prev, end_time: value }))}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`late-tolerance-${shift?.uuid}`}>Toleransi Terlambat (menit)</Label>
                            <Input
                                id={`late-tolerance-${shift?.uuid}`}
                                name="late_tolerance_minutes"
                                type="number"
                                min="0"
                                value={form.late_tolerance_minutes}
                                onChange={handleChange}
                                placeholder="0"
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-md border px-3 py-2">
                            <div className="space-y-0.5">
                                <Label htmlFor={`cross-day-${shift?.uuid}`}>Lintas Hari</Label>
                                <p className="text-xs text-muted-foreground">Aktifkan untuk shift yang selesai keesokan hari.</p>
                            </div>
                            <Switch
                                id={`cross-day-${shift?.uuid}`}
                                checked={form.cross_day}
                                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, cross_day: checked }))}
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-md border px-3 py-2">
                            <div className="space-y-0.5">
                                <Label htmlFor={`is-active-${shift?.uuid}`}>Shift Aktif</Label>
                                <p className="text-xs text-muted-foreground">Shift aktif akan ikut dibuat saat generate jadwal.</p>
                            </div>
                            <Switch
                                id={`is-active-${shift?.uuid}`}
                                checked={form.is_active}
                                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_active: checked }))}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={loading}>Batal</Button>
                        </DialogClose>

                        <Button onClick={handleUpdate} disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner />
                                    <span>Loading..</span>
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    <span>Simpan</span>
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ingin menghapus shift {shift?.name ?? "-"}?</AlertDialogTitle>
                        <AlertDialogDescription>Tindakan ini akan menghapus data shift dari sistem.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <Button variant="destructive" onClick={() => handleDelete(shift?.uuid)} disabled={loading}>
                            {loading ? "Memproses..." : "Hapus"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Actions;
