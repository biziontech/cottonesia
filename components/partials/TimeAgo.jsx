import { useMemo } from "react";

export default function TimeAgo({ date }) {
    const text = useMemo(() => {
        const now = new Date();
        const past = new Date(date);

        const diffMs = now - past;
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffWeeks = Math.floor(diffDays / 7);

        if (diffMinutes < 1) return "baru saja";
        if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
        if (diffHours < 24) return `${diffHours} jam lalu`;
        if (diffDays < 7) return `${diffDays} hari lalu`;
        if (diffWeeks < 2) return `${diffWeeks} minggu lalu`;

        return past.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }, [date]);

    return <span>{text}</span>;
}