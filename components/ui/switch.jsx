"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

function Switch({
  className,
  thumbClassName,
  iconClassName,
  checkedIcon,
  uncheckedIcon,
  checked: controlledChecked,
  defaultChecked,
  onCheckedChange,
  ...props
}) {
  const isControlled = controlledChecked !== undefined
  const [uncontrolledChecked, setUncontrolledChecked] =
    React.useState(defaultChecked ?? false)

  const checked = isControlled ? controlledChecked : uncontrolledChecked

  const handleChange = (value) => {
    if (!isControlled) setUncontrolledChecked(value)
    onCheckedChange?.(value)
  }

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      checked={checked}
      onCheckedChange={handleChange}
      className={cn(
        // Track: lebih lebar supaya thumb & icon punya ruang bergerak
        "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent",
        "shadow-xs transition-all outline-none",
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Thumb: h-4 w-4 (16px), track h-5 (20px) → gap 2px atas bawah
          "pointer-events-none flex items-center justify-center",
          "size-4 rounded-full bg-background shadow-sm",
          "transition-transform duration-200",
          "data-[state=unchecked]:translate-x-0.5",
          "data-[state=checked]:translate-x-[1.125rem]", // (36 - 16 - 2) = 18px
          thumbClassName
        )}
      >
        {(checkedIcon || uncheckedIcon) && (
          <span
            className={cn(
              // Icon dibatasi ~10px (size-2.5) agar proporsional dalam thumb 16px
              "flex items-center justify-center size-2.5",
              "text-muted-foreground transition-opacity duration-200",
              "[&>svg]:size-full [&>svg]:shrink-0",
              iconClassName
            )}
          >
            {checked ? checkedIcon : uncheckedIcon}
          </span>
        )}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch }