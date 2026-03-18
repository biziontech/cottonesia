import { Button } from "@/components/ui/button";
import { Plus, EllipsisVertical, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useModule } from "@/contexts/ModuleContext";
import { toast } from "sonner";
import api from '@/lib/api';
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export function ActionNewSlide() {
    const { module, setModule, selectedSlide, setSelectedSlide } = useModule();
    
    // new slide
    const handleNewSlide = async () => {
        try {
            const response = await api.fetch(`${API_URL}/office/training-slides/${module?.uuid}/create`, {
                method: 'POST'
            });

            const data = response;

            if (!response?.success) {
                throw new Error(data.message || 'Gagal membuat slide');
            }

            // Update selected slide dengan data dari server
            setSelectedSlide(data?.data);

            // Update module slides
            setModule(prev => ({
                ...prev,
                slides: [...prev.slides, data.data]
            }));

            toast.success(data.message || "Berhasil membuat slide")

        } catch (error) {
            toast.error(error.message || "Terjadi kesalahan saat membuat slide");
        }
    }


    return (
        <Button
            size="sm"
            variant="outline"
            className="ms-auto"
            onClick={() => handleNewSlide()}
        >
            <Plus />
            <span>New Slide</span>
        </Button>
    )
}

