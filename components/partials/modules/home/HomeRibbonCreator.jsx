/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { Info, User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectLabel, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { useModule } from "@/contexts/ModuleContext";


export const HomeRibbonCreator = () => {
    const { staff, module, setModuleTemp } = useModule();
    const [creator, setCreator] = useState("");

    const handleSelectCreator = (c) => {
        setCreator(c);
        // set temp jika berbeda dengan yang asli
        if (module?.creator?.uuid != c) {
            setModuleTemp(prev => ({
                ...prev,
                creator_id: c
            }));
        }
    }

    useEffect(() => {
        if (module?.creator) {
            setCreator(module?.creator?.uuid);
        }
    }, [module])

    return (
        <div className="flex items-center justify-center">
            <Select
                id="creator-select"
                value={creator}
                onValueChange={(c) => handleSelectCreator(c)}
            >
                <SelectTrigger size="sm" variant="outline" className="min-w-40 shadow-none text-xs font-medium cursor-pointer [&>span]:flex [&>span]:gap-2 [&>span]:items-center dark:bg-accent">
                    <SelectValue placeholder="Select a Creator" />
                </SelectTrigger>
                <SelectContent side="bottom" position="popper">
                    <SelectGroup>
                        <SelectLabel>Creator</SelectLabel>
                        {staff?.map((c) => (
                            <SelectItem
                                key={c.uuid}
                                value={c.uuid}
                                className="text-xs flex gap-2 items-center"
                            >
                                <Avatar className="size-4.5">
                                    <AvatarImage alt={c.full_name} src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{c.full_name}</span>
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}