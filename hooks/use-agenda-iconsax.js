"use client";

import * as IconsaxList from "iconsax-reactjs";

export const ICON_OPTIONS = Object.entries(IconsaxList)
    .filter(([key, val]) =>
        key !== "default" &&
        /^[A-Z]/.test(key)
    )
    .map(([key, Icon]) => ({ key, Icon, label: key }))
    .sort((a, b) => a.key.localeCompare(b.key));

export const ICON_MAP = Object.fromEntries(ICON_OPTIONS.map((o) => [o.key, o.Icon]));

export const ICON_VARIANTS = ["Linear", "Outline", "Bold", "Bulk", "TwoTone", "Broken"];

export function useAgendaIconsax() {
    return { ICON_OPTIONS, ICON_MAP, ICON_VARIANTS };
}
