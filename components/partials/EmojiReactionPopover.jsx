"use client";

import { useState } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { SmilePlus } from "lucide-react";
import { useTheme } from "next-themes"; // opsional, untuk dark mode

const QUICK_EMOJIS = ["😍", "😆", "😅", "😭", "😡"];

export function EmojiReactionPopover({ onReact, disabled, is_fullpicker = false }) {
    const [open, setOpen] = useState(false);
    const [showFullPicker, setShowFullPicker] = useState(is_fullpicker ? true : false);
    const { resolvedTheme } = useTheme(); // opsional

    const handleQuickReact = (emoji) => {
        onReact(emoji);
        setOpen(false);
        setShowFullPicker(false);
    };

    const handleEmojiClick = (emojiData) => {
        onReact(emojiData.emoji);
        setOpen(false);
        setShowFullPicker(false);
    };

    return (
        <Popover
            open={open}
            onOpenChange={(val) => {
                setOpen(val);
                if (!val) setShowFullPicker(false);
            }}
        >
            <PopoverTrigger asChild>
                <Button
                    size="icon-xs"
                    variant="ghost"
                    className="font-medium"
                    disabled={disabled}
                >
                    <SmilePlus className="h-3.5 w-3.5 stroke-[1.5]" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-auto p-0 border shadow-md"
                side="top"
                align="start"
                sideOffset={6}
            >
                {!showFullPicker ? (
                    <div className="flex items-center gap-1 px-2 py-1.5">
                        {QUICK_EMOJIS.map((emoji) => (
                            <button
                                key={emoji}
                                onClick={() => handleQuickReact(emoji)}
                                className="text-[22px] cursor-pointer rounded-lg py-0.5 hover:bg-muted hover:scale-125 transition-all duration-100 leading-none"
                            >
                                {emoji}
                            </button>
                        ))}
                        <div className="w-px h-5 bg-border mx-1" />
                        <button
                            onClick={() => setShowFullPicker(true)}
                            className="flex items-center cursor-pointer justify-center w-8 h-8 rounded-lg border border-dashed border-muted-foreground/40 hover:bg-muted transition-colors"
                            title="Lebih banyak emoji"
                        >
                            <SmilePlus className="h-3.5 w-3.5 mx-auto stroke-[1.5] text-muted-foreground" />
                        </button>
                    </div>
                ) : (
                    <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        theme={resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT}
                        lazyLoadEmojis
                        searchPlaceholder="Cari emoji..."
                        width={300}
                        height={380}
                    />
                )}
            </PopoverContent>
        </Popover>
    );
}