/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { Info, CalendarArrowUp, Clock, CalendarClock, Zap, Sunrise, Sun, Sunset, Moon, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useModule } from "@/contexts/ModuleContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const TimeScrollPicker = ({ hour, minute, setHour, setMinute }) => {
    const generateHours = () => Array.from({ length: 24 }, (_, h) => h.toString().padStart(2, '0'));
    const generateMinutes = () => Array.from({ length: 60 }, (_, m) => m.toString().padStart(2, '0'));

    return (
        <div className="flex flex-col">
            <p className="text-xs font-medium text-slate-600 my-2 px-2 flex items-center gap-1">
                <Clock className="size-3" />
                Time
            </p>
            <div className="flex gap-1">
                <div className="flex flex-col items-center">
                    <p className="text-xs text-slate-500 mb-1">Hour</p>
                    <ScrollArea className="h-[280px] w-[42px] [&_[data-slot='scroll-area-scrollbar']]:w-1.5">
                        <ScrollBar />
                        <div className="flex flex-col gap-1">
                            {generateHours().map((h) => (
                                <Button
                                    key={h}
                                    variant={hour === h ? "default" : "ghost"}
                                    size="icon"
                                    onClick={() => setHour(h)}
                                    className="justify-center text-sm rounded-lg"
                                >
                                    {h}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-xs text-slate-500 mb-1">Min</p>
                    <ScrollArea className="h-[280px] w-[42px] [&_[data-slot='scroll-area-scrollbar']]:w-1.5">
                        <div className="flex flex-col gap-1">
                            {generateMinutes().map((m) => (
                                <Button
                                    key={m}
                                    variant={minute === m ? "default" : "ghost"}
                                    size="icon"
                                    onClick={() => setMinute(m)}
                                    className="justify-center text-sm rounded-lg"
                                >
                                    {m}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
};

export const HomeRibbonPublish = () => {
    const { module, moduleTemp, setModuleTemp } = useModule();
    const [datePublish, setDatePublish] = useState(null);
    const [hour, setHour] = useState('12');
    const [minute, setMinute] = useState('00');

    const quickSelects = [
        { label: 'Today', days: 0, icon: Zap },
        { label: 'Tomorrow', days: 1, icon: Sunrise },
        { label: 'In 2 Days', days: 2, icon: Sun },
        { label: 'In 3 Days', days: 3, icon: Sun },
        { label: 'In 5 Days', days: 5, icon: Sunset },
        { label: 'In 7 Days', days: 7, icon: Moon }
    ];

    const formatDateTime = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    };

    useEffect(() => {
        if (module?.published_at) {
            const date = new Date(module.published_at);
            setDatePublish(date);
            setHour(date.getHours().toString().padStart(2, '0'));
            setMinute(date.getMinutes().toString().padStart(2, '0'));
        }
    }, [module?.published_at]);

    useEffect(() => {
        if (datePublish && hour && minute) {
            const fullDate = new Date(datePublish);
            fullDate.setHours(hour, minute, 0);
            const newDateTime = formatDateTime(fullDate);
            const originalDateTime = module?.published_at ? formatDateTime(new Date(module.published_at)) : null;
            if (newDateTime !== originalDateTime) {
                setModuleTemp(prev => ({
                    ...prev,
                    published_at: newDateTime
                }));
            } else {
                setModuleTemp(prev => {
                    const { published_at, ...rest } = prev;
                    return rest;
                });
            }
        }
    }, [datePublish, hour, minute, module?.published_at]);

    const handleQuickSelect = (days) => {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + days);
        if (days === 0) {
            setHour(newDate.getHours().toString().padStart(2, '0'));
            setMinute(newDate.getMinutes().toString().padStart(2, '0'));
        }
        setDatePublish(newDate);
    };

    const handleReset = () => {
        if (module?.published_at) {
            const date = new Date(module.published_at);
            setDatePublish(date);
            setHour(date.getHours().toString().padStart(2, '0'));
            setMinute(date.getMinutes().toString().padStart(2, '0'));
        } else {
            setDatePublish(null);
            setHour('12');
            setMinute('00');
        }
        setModuleTemp(prev => {
            const { published_at, ...rest } = prev;
            return rest;
        });
    };

    const formatShortDate = (date) => {
        if (!date) return null;
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    };

    return (
        <>
            {/* ── Tombol Tanggal ── */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button size="sm" variant="outline" className="justify-start text-left font-normal ps-2.5">
                        <span className="flex gap-2 items-center font-medium">
                            <CalendarArrowUp className="text-gray-500" />
                            {datePublish ? formatShortDate(datePublish) : <span>Tanggal Publish</span>}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2 divide-dotted flex divide-x">
                    {/* Quick selects */}
                    <div className="flex flex-col gap-1 pe-2 min-w-30">
                        <p className="text-xs font-medium text-slate-600 mb-1 px-2">Quick</p>
                        {quickSelects.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <Button
                                    key={item.days}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleQuickSelect(item.days)}
                                    className="justify-start text-sm h-8 gap-2"
                                >
                                    <IconComponent className="size-4" />
                                    {item.label}
                                </Button>
                            );
                        })}
                    </div>

                    {/* Calendar */}
                    <Calendar
                        mode="single"
                        selected={datePublish}
                        onSelect={setDatePublish}
                        captionLayout="dropdown"
                        fromYear={2024}
                        toYear={2030}
                        initialFocus
                    />

                    {/* Time picker */}
                    <div className="ps-2">
                        <TimeScrollPicker hour={hour} minute={minute} setHour={setHour} setMinute={setMinute} />
                    </div>
                </PopoverContent>
            </Popover>

            {/* ── Tombol Jam ── */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button size="sm" variant="outline" className="justify-start text-left font-normal ps-2.5">
                        <span className="flex gap-2 items-center font-medium">
                            <CalendarClock className="text-gray-500 size-4" />
                            {`${hour}:${minute} WIB`}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-1">
                    <TimeScrollPicker hour={hour} minute={minute} setHour={setHour} setMinute={setMinute} />
                </PopoverContent>
            </Popover>

            {/* ── Reset button ── */}
            {moduleTemp?.published_at && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button className="size-6" variant="outline" onClick={handleReset}>
                            <X className="size-3" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Reset ke Default</p>
                    </TooltipContent>
                </Tooltip>
            )}
        </>
    );
}