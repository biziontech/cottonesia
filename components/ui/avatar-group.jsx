import { cloneElement, Children, forwardRef, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// ================================== //

const AvatarGroup = forwardRef(
    ({ className, children, max = 1, spacing = 10, ...props }, ref) => {
        const avatarItems = Children.toArray(children);


        const renderContent = useMemo(() => {
            const firstChild = avatarItems[0];

            const sizeStyle = firstChild?.props?.style || {};
            const sizeClass = firstChild?.props?.className || "";

            return (
                <>
                    {avatarItems.slice(0, max).map((child, index) => {
                        const title = child.props.title || child.props.alt || "User";

                        return (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    {cloneElement(child, {
                                        className: cn(child.props.className, "border-2 border-background"),
                                        style: {
                                            marginLeft: index === 0 ? 0 : -spacing,
                                            ...child.props.style,
                                        },
                                    })}
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{title}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}

                    {avatarItems.length > max && (
                        <div
                            className={cn(
                                "relative flex items-center justify-center rounded-full border-2 border-background bg-muted",
                                sizeClass
                            )}
                            style={{
                                marginLeft: -spacing,
                                ...sizeStyle,
                            }}
                        >
                            <p className="text-[clamp(9px,0.4em,14px)] font-medium font-geist text-muted-foreground">
                                +{avatarItems.length - max}
                            </p>
                        </div>
                    )}
                </>
            );
        }, [avatarItems, max, spacing]);

        return (
            <div ref={ref} className={cn("relative flex", className)} {...props}>
                {renderContent}
            </div>
        );
    }
);

AvatarGroup.displayName = "AvatarGroup";

export { AvatarGroup };