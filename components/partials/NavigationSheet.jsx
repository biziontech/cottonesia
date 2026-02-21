import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import { NavMenu } from "@/components/partials/NavMenu";

export const NavigationSheet = () => {
    return (
        <Sheet>
            <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
            </VisuallyHidden>

            <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent className="px-6 py-3">
                <span>BHI</span>
                <NavMenu orientation="vertical" className="mt-6 [&>div]:h-full" />
            </SheetContent>
        </Sheet>
    );
};
