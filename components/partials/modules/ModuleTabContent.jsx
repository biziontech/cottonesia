"use client"

import { Button } from '@/components/ui/button';
import { useModule } from "@/contexts/ModuleContext";
import { HomeIcon, Layers2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRef, useState, useEffect } from 'react';

export const ModuleTabContent = () => {
    const { rightPanel, setRightPanel } = useModule();

    const tabs = [
        { id: 'general', label: 'General', icon: HomeIcon },
        { id: 'slide', label: 'Slide', icon: Layers2 }
    ];

    const activeIndex = tabs.findIndex(tab => tab.id === rightPanel);

    return (
        <div className='p-3 flex flex-col gap-2 relative'>
            <span className="border-primary/20 bg-white absolute top-0 left-0 z-30 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-xs border"></span>
            {/* Sliding background indicator */}
            <div
                className="absolute left-3 right-3 rounded-xl border bg-background shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                    height: '40px', // icon-lg height
                    transform: `translateY(${activeIndex * (40 + 8)}px)`, // 40px height + 8px gap-2
                }}
            />

            {tabs.map((tab) => (
                <Tooltip key={`right-${tab?.id}`}>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon-lg"
                            className="rounded-xl relative z-10"
                            onClick={() => setRightPanel(tab?.id)}
                        >
                            <tab.icon className='size-5' />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                        <p>{tab?.label}</p>
                    </TooltipContent>
                </Tooltip>
            ))}
        </div>
    );
}