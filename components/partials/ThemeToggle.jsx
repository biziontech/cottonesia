'use client';

import { useTheme } from "next-themes";
import { MoonStar, Monitor, SunMedium } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const themeConfig = {
    system: { icon: MoonStar, label: "Switch to dark mode" },
    dark: { icon: SunMedium, label: "Switch to light mode" },
    light: { icon: Monitor, label: "Use system theme" },
};

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const nextTheme = theme === "system" ? "dark" : theme === "dark" ? "light" : "system";
    const current = themeConfig[theme] ?? themeConfig.system;
    const Icon = current.icon;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    suppressHydrationWarning
                    variant="ghost"
                    size="icon"
                    className="border-0 shadow-none relative h-7 w-7 hover:bg-transparent"
                    onClick={() => setTheme(nextTheme)}
                >
                    <Icon />
                </Button>
            </TooltipTrigger>
            <TooltipContent suppressHydrationWarning>
                <p>{current.label}</p>
            </TooltipContent>
        </Tooltip>
    );
}