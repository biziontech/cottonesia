import { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Ellipsis, Pencil, Trash, Save, Users } from "lucide-react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Required from "@/components/partials/Required";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getInitial = (name = "") => {
    const parts = name.trim().split(" ").filter(Boolean);

    if (parts.length === 0) return "-";
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();

    return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
};

const Actions = ({ row, table }) => {
    const reload = table.options.meta?.reload;
    const department = row.original;
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [usersOpen, setUsersOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        name: department?.name || "",
        description: department?.description || "",
    });

    const resetForm = () => {
        setForm({
            name: department?.name || "",
            description: department?.description || "",
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            setUsers([]);

            const response = await api.fetch(`${API_URL}/office/departments/${department?.uuid}/users`, {
                method: "GET",
            });

            if (response?.success) {
                setUsers(response?.data?.users || []);
            } else {
                toast.error(response?.message || "Gagal mengambil user department");
            }
        } catch (error) {
            toast.error(error?.message || "Gagal mengambil user department");
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleOpenUsers = () => {
        setUsersOpen(true);
        fetchUsers();
    };

    const handleDelete = async (uuid) => {
        try {
            setLoading(true);

            const response = await api.fetch(`${API_URL}/office/departments/${uuid}`, {
                method: "DELETE",
            });

            if (response?.success) {
                toast.success(response?.message || "Department berhasil dihapus");
                setDeleteOpen(false);
                if (reload) reload();
            } else {
                toast.error(response?.message || "Gagal menghapus department");
            }
        } catch {
            toast.error("Gagal menghapus department");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);

            const response = await api.fetch(`${API_URL}/office/departments/${department?.uuid}`, {
                method: "PUT",
                body: JSON.stringify(form),
            });

            if (response?.success) {
                toast.success(response?.message || "Department berhasil diperbarui");
                setEditOpen(false);
                if (reload) reload();
            } else {
                toast.error(response?.message || "Gagal memperbarui department");
            }
        } catch (error) {
            toast.error(error?.message || "Gagal memperbarui department");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2">
            <Button
                size="icon-sm"
                variant="outline"
                onClick={handleOpenUsers}
            >
                <Users />
            </Button>

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

            <Dialog open={usersOpen} onOpenChange={setUsersOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader className="gap-0">
                        <DialogTitle className="text-base font-bold">User Department</DialogTitle>
                        <DialogDescription>{department?.name ?? "Department"}</DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="h-80 rounded-xl border">
                        <div className="divide-y">
                            {loadingUsers ? (
                                <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                                    <Spinner />
                                    <span className="ml-2">Memuat user...</span>
                                </div>
                            ) : users.length > 0 ? (
                                users.map((user) => (
                                    <div key={user.uuid} className="flex items-center gap-3 p-3">
                                        <Avatar>
                                            <AvatarFallback>{getInitial(user.full_name || user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">{user.full_name || user.name || "-"}</p>
                                            <p className="truncate text-xs text-muted-foreground">{user.email || "-"}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{user.whatsapp_no || "-"}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                                    Belum ada user di department ini.
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="gap-0">
                        <DialogTitle className="text-base font-bold">Edit Department</DialogTitle>
                        <DialogDescription>Perbarui nama dan deskripsi department.</DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 gap-4 border-b border-dotted pb-4">
                        <div className="space-y-2">
                            <Label htmlFor={`name-${department?.uuid}`}>Nama Department<Required /></Label>
                            <Input
                                id={`name-${department?.uuid}`}
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Contoh: Operasional"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`description-${department?.uuid}`}>Deskripsi<Required /></Label>
                            <Textarea
                                id={`description-${department?.uuid}`}
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Masukkan deskripsi department"
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
                        <AlertDialogTitle>Ingin menghapus department {department?.name ?? "-"}?</AlertDialogTitle>
                        <AlertDialogDescription>Tindakan ini akan menghapus data department dari sistem.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <Button variant="destructive" onClick={() => handleDelete(department?.uuid)} disabled={loading}>
                            {loading ? "Memproses..." : "Hapus"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Actions;
