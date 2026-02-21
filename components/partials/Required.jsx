import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Required({ text = "Wajib diisi" }) {
    return (
        <Tooltip>
            <TooltipTrigger>
                <span className="text-rose-500">*</span>
            </TooltipTrigger>
            <TooltipContent>
                <p>{text}</p>
            </TooltipContent>
        </Tooltip>
    );
}