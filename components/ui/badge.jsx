import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        success:
          "border-transparent bg-success text-success-foreground [a&]:hover:bg-success/90 focus-visible:ring-success/20 dark:focus-visible:ring-success/40",
        warning:
          "border-transparent bg-warning text-warning-foreground [a&]:hover:bg-warning/90 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40",
        info:
          "border-transparent bg-info text-info-foreground [a&]:hover:bg-info/90 focus-visible:ring-info/20 dark:focus-visible:ring-info/40",
        danger:
          "border-transparent bg-danger text-danger-foreground [a&]:hover:bg-danger/90 focus-visible:ring-danger/20 dark:focus-visible:ring-danger/40",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-muted",
      },
      size: {
        // Text sizes
        xs: "px-1.5 py-px   text-[10px] gap-0.5 [&>svg]:size-2.5",
        sm: "px-2   py-px   text-xs     gap-1   [&>svg]:size-3",
        md: "px-2.5 py-0.5  text-xs     gap-1   [&>svg]:size-3",
        lg: "px-3   py-1    text-sm     gap-1.5 [&>svg]:size-3.5",
        xl: "px-4   py-1.5  text-sm     gap-1.5 [&>svg]:size-4",
        // Icon-only sizes (square)
        "icon-xs": "px-1.5 py-px   text-[10px] gap-0.5 [&>svg]:size-3",
        "icon-sm": "ps-1.5 pe-1.5 py-px text-xs gap-0.5 [&>svg]:size-3.5",
        "icon-md": "ps-1 pe-2 py-0.5  text-xs gap-1 [&>svg]:size-4",
        "icon-lg": "ps-1.5 pe-2.5   py-1    text-sm     gap-1.5 [&>svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props} />
  );
}

export { Badge, badgeVariants }