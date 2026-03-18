import { Button } from "@/components/ui/button";
import { Plus, EllipsisVertical, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useModule } from "@/contexts/ModuleContext";
import { toast } from "sonner";
import api from '@/lib/api';
import { useState } from "react";
import { ActionNewSlide } from "@/components/partials/modules/slides/ActionNewSlide";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export function ActionSlides() {
    const { module, setModule, selectedSlide, setSelectedSlide } = useModule();
    const [open, setOpen] = useState(false);

    const handleDeleteSlide = async () => {
        try {
            const response = await api.fetch(`${API_URL}/office/training-slides/${module?.uuid}/delete/${selectedSlide?.ulid}`, {
                method: 'DELETE'
            });

            const data = response;

            if (!response?.success) {
                throw new Error(data.message || 'Gagal menghapus slide');
            }

            // Tambahkan slide baru ke array slides
            setModule(prev => ({
                ...prev,
                slides: data.data?.slides
            }));

            // Update selected slide dengan data dari server
            setSelectedSlide(data.data?.selected);
            setOpen(false);
            toast.success(data.message || "Berhasil menghapus slide");

        } catch (error) {
            toast.error(error.message || "Terjadi kesalahan saat menghapus slide");
        }
    };

    return (
        <div className="flex gap-2">
            <ActionNewSlide />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon-sm">
                        <EllipsisVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-42">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setOpen(true)}>
                            <Trash />
                            <span>Delete Slide</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ingin menghapus Slide ini ?</AlertDialogTitle>
                        <AlertDialogDescription>Tindakan ini akan menghapus slide secara permanen dan tidak dapat dipulihkan</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={() => handleDeleteSlide()}
                        >
                            Ya, Hapus
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}