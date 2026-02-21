/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { useEcho } from "@laravel/echo-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, SquareArrowOutUpRight, Settings } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import TimeAgo from "@/components/partials/TimeAgo";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { broadcast } from '@/lib/broadcast';
import { api } from "@/lib/api";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function NotificationListener({ userUuid, modelType = 'user' }) {
    // notification
    const router = useRouter();
    const [notifications, setNotifications] = useState([]);

    // Initialize Echo configuration
    broadcast.init(modelType);

    // Get channel name
    const channelName = broadcast.getChannel(userUuid, modelType);

    // Setup Echo hook
    const { listen, channel, stopListening } = useEcho(
        channelName,
        undefined,
        undefined,
        [],
        "private"
    );

    // Fetch notifications
    const handleGetNotification = async () => {
        const response = await api.fetch(`${API_URL}/notifications`, {
            method: 'GET',
        });

        if (response?.success) {
            setNotifications(response?.data?.data);
        }
    }

    // Mark notification as read
    const handleMarkAsRead = async (id) => {
        const response = await api.fetch(`${API_URL}/notifications/mark-as-read/${id}`, {
            method: 'POST',
            body: JSON.stringify({
                model_type: modelType
            }),
        });

        if (response?.success) {
            setNotifications(notifications.map(notification => {
                if (notification.id === id) {
                    return {
                        ...notification,
                        is_read: true,
                    }
                }
                return notification;
            }));
        }
    }

    // Setup listener on mount
    useEffect(() => {
        handleGetNotification();
        listen();

        const ch = channel();
        if (!ch) return;

        const handleNotification = (notification) => {
            setNotifications(prev => [notification, ...prev]);
            toast.info("1 notifikasi baru");

            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('notification:new', {
                detail: notification
            }));
        };

        // Bind event listener
        ch.subscription.bind(broadcast.events.NOTIFICATION_NEW, handleNotification);

        // Cleanup on unmount
        return () => {
            ch.subscription.unbind(broadcast.events.NOTIFICATION_NEW, handleNotification);
            stopListening();
        };
    }, []);

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="border-0 notification shadow-none relative h-7 w-7 hover:bg-transparent">
                    <Bell className='bell-icon' />
                    {((notifications?.length > 0) && notifications.some(item => (item?.is_read == false || item?.is_read == null))) && (
                        <div className='absolute top-1 right-1.5'>
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex size-2 rounded-full bg-sky-500"></span>
                            </span>
                        </div>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-sm rounded-xl p-2 overflow-hidden">
                <div className='flex border-b border-dotted border-stone-300 pb-1 mb-2'>
                    <DropdownMenuLabel className="text-sm font-bold flex-1">Notification</DropdownMenuLabel>
                    <Button size="icon" variant="ghost" className="w-4 h-4 p-3.5 me-1"><Settings /></Button>
                </div>
                <ScrollArea className='flex flex-col max-h-96 overflow-y-auto'>
                    {notifications.length === 0 ? (
                        <div className="my-10 text-xs text-stone-500 justify-center items-center flex">
                            <p>Belum ada notifikasi</p>
                        </div>
                    ) : (
                        <>
                            {notifications.map((item) => (
                                <DropdownMenuItem key={item.id} className="flex py-2 flex-col rounded-xl" onSelect={(e) => e.preventDefault()} onClick={() => {
                                    if (!item?.is_read) {
                                        handleMarkAsRead(item.id)
                                    }
                                }}>
                                    <div className="flex gap-4 items-center w-full">
                                        <div className='flex'>
                                            <div className={`w-2 h-2 rounded-full ${item?.is_read ? 'bg-green-400' : 'bg-rose-400'}`}></div>
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <div className='flex items-center justify-between mb-0.5'>
                                                <h4 className='font-bold'>{item.title}</h4>
                                                <small className='text-medium text-stone-600'><TimeAgo date={item.created_at} /></small>
                                            </div>
                                            {item.data?.message_html ? (
                                                <p
                                                    className="text-xs text-stone-700"
                                                    dangerouslySetInnerHTML={{
                                                        __html: item.message,
                                                    }}
                                                />
                                            ) : (
                                                <p className="text-xs text-stone-700">
                                                    {item.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {item.action_url && (
                                        <div className="flex items-start flex-1 w-full py-2 border-t border-dotted border-stone-300">
                                            <Button variant="secondary" size="sm" className="text-xs ms-6" onClick={() => router.push(item.action_url)}><SquareArrowOutUpRight className='text-white !w-3 !h-3' />Konfimasi</Button>
                                        </div>
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </>
                    )}
                </ScrollArea>
                {notifications.length > 0 && (
                    <DropdownMenuItem className="text-xs text-stone-500 font-medium transition-transform justify-center items-center mt-2 cursor-pointer">
                        <p>View All Notification</p>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu >
    )
}