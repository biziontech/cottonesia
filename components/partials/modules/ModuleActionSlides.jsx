import { ActionSlides } from "@/components/partials/modules/slides/ActionSlides";
import { Separator } from "@/components/ui/separator";
import StripePattern from "@/components/partials/StripePattern";

export default function ModuleActionSlides({ Left, children }) {
    return (
        <div className="flex items-center justify-between border m-1.5 p-2 gap-1.5 relative border-dashed">
            <span className="border-primary/20 bg-white absolute top-0 left-0 z-30 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-xs border"></span>
            <span className="border-primary/20 bg-white absolute bottom-0 right-0 z-30 size-2.5 translate-x-1/2 translate-y-1/2 rotate-45 rounded-xs border"></span>
            <div className="flex items-center justify-between z-10 flex-1">

                <div className="flex gap-2 items-center justify-center">
                    <ActionSlides />
                    {Left && (
                        <Left />
                    )}
                </div>
                {children}
            </div>
            <StripePattern />
        </div>
    )
}