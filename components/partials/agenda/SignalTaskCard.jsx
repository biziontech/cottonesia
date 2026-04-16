import { cn } from "@/lib/utils";

export default function SignalTaskCard({ task, className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" data-signal={task?.signal ?? "idle"} className={cn('size-3 ms-1.5 pointer-events-none group-hover:opacity-0 transition-opacity duration-300 opacity-100 my-auto group', className)} viewBox="0 0 16 16">
            <g>
                <path className="fill-muted-foreground" d="M1 9c0-.55.45-1 1-1h1c.55 0 1 .45 1 1v5c0 .55-.45 1-1 1H2c-.55 0-1-.45-1-1V9z" />
                <path className="fill-muted-foreground" d="M6 6c0-.55.45-1 1-1h1c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1V6z" />
                <path className="fill-muted-foreground" d="M11 2c0-.55.45-1 1-1h1c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1h-1c-.55 0-1-.45-1-1V2z" />
            </g>
        </svg>
    )
}