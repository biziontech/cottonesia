import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function DateNow({className}) {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const updateDate = () => {
            const now = new Date();

            // Convert to WIB (GMT+7)
            const wibOffset = 7 * 60; // 7 hours in minutes
            const localOffset = now.getTimezoneOffset(); // Local timezone offset in minutes
            const wibTime = new Date(now.getTime() + (wibOffset + localOffset) * 60000);

            // Format: Hari, DD Bulan YYYY
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            const months = [
                'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
            ];

            const dayName = days[wibTime.getDay()];
            const day = wibTime.getDate();
            const monthName = months[wibTime.getMonth()];
            const year = wibTime.getFullYear();

            setCurrentDate(`${dayName}, ${day} ${monthName} ${year}`);
        };

        updateDate();
        // Update every minute
        const interval = setInterval(updateDate, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <span className={cn(className, 'text-sm')}>{currentDate}</span>
    );
}