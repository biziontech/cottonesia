import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { differenceInDays, isToday, isTomorrow, parseISO, format } from 'date-fns';
import id from 'date-fns/locale/id';

export default function AnnouncementAlert({ announcementDate }) {
    if (!announcementDate) return null;

    let alertData = null;

    try {
        const parsedDate = parseISO(announcementDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const daysDifference = differenceInDays(parsedDate, today);

        // Hari H pengumuman
        if (isToday(parsedDate)) {
            alertData = {
                variant: "default",
                title: "🎉 Hari Pengumuman!",
                description: "Hari ini adalah tanggal pengumuman hasil penerimaan. Pastikan semua notifikasi telah terkirim kepada siswa."
            };
        }
        // H-1 pengumuman
        else if (isTomorrow(parsedDate)) {
            alertData = {
                variant: "secondary",
                title: "⏰ Besok Hari Pengumuman",
                description: `Pengumuman akan dilakukan besok pada ${format(parsedDate, "dd MMMM yyyy", { locale: id })}. Siapkan semua data dan notifikasi.`
            };
        }
        // H-2 sampai H-7
        else if (daysDifference > 0 && daysDifference <= 7) {
            alertData = {
                variant: "outline",
                title: `📅 Pengumuman Dalam ${daysDifference} Hari`,
                description: `Pengumuman akan dilakukan pada ${format(parsedDate, "EEEE, dd MMMM yyyy", { locale: id })}. Waktu untuk persiapan masih ada.`
            };
        }
        // Sudah lewat
        else if (daysDifference < 0) {
            alertData = {
                variant: "destructive",
                title: "⚠️ Pengumuman Telah Lewat",
                description: `Tanggal pengumuman pada ${format(parsedDate, "dd MMMM yyyy", { locale: id })} telah berlalu.`
            };
        }
    } catch (error) {
        console.error('Error calculating announcement date:', error);
        return null;
    }

    // Return JSX setelah try-catch
    if (!alertData) return null;

    return (
        <Alert className="mb-5" variant={alertData.variant}>
            <Info />
            <AlertTitle>{alertData.title}</AlertTitle>
            <AlertDescription>{alertData.description}</AlertDescription>
        </Alert>
    );
}