import { useState, useEffect } from 'react';
import { useEcho } from '@laravel/echo-react';
import broadcast from '@/lib/broadcast';

export function useConversion(uuid) {
    const [progress, setProgress] = useState(null);

    // Initialize Echo
    broadcast.init('admin'); // atau 'user'

    // Get conversion channel
    const channelName = broadcast.getConversionChannel(uuid);

    // Setup Echo hook
    const { listen, channel, stopListening } = useEcho(
        channelName,
        undefined,
        undefined,
        [],
        "public"
    );

    useEffect(() => {
        if (!uuid) return;

        listen();
        const ch = channel();
        if (!ch) return;

        const handleProgress = (data) => {
            setProgress(data);
        };

        ch.subscription.bind(broadcast.events.CONVERSION_PROGRESS, handleProgress);

        return () => {
            ch.subscription.unbind(broadcast.events.CONVERSION_PROGRESS, handleProgress);
            stopListening();
        };
    }, [uuid]);

    return { progress };
}