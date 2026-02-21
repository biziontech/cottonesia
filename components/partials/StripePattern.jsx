import { cn } from "@/lib/utils";

export default function StripePattern({ className }) {
    return (
        <div
            className={cn("pointer-events-none absolute inset-0 bg-[url('/images/stripe.svg')]  bg-repeat", className)}
            style={{
                backgroundSize: "24px 24px",
            }}
        />
    );
}
