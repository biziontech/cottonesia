"use client"

import { useEffect, useState, useRef } from "react"
import {
    Zap, Star, Flame, Sparkles, Cloud, Moon, Sun, Leaf,
    Rocket, Music, Coffee, Heart, Diamond, Globe, Feather, Compass
} from "lucide-react"
import { cn } from "@/lib/utils"

const ICONS = [
    Zap, Star, Flame, Sparkles, Cloud, Moon, Sun, Leaf,
    Rocket, Music, Coffee, Heart, Diamond, Globe, Feather, Compass,
]

function pickNext(current) {
    let next
    do { next = Math.floor(Math.random() * ICONS.length) } while (next === current)
    return next
}

// direction: "up" | "down" | "left" | "right"
const DIRECTIONS = ["up", "down", "left", "right"]

function SlideLoader({ className, interval = 900, size = 24, ...props }) {
    const [currentIdx, setCurrentIdx] = useState(() => Math.floor(Math.random() * ICONS.length))
    const [nextIdx, setNextIdx] = useState(() => pickNext(0))
    const [direction, setDirection] = useState("up")
    const [phase, setPhase] = useState("idle") // "exit" | "enter" | "idle"
    const currentRef = useRef(currentIdx)

    useEffect(() => {
        const id = setInterval(() => {
            const next = pickNext(currentRef.current)
            const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]
            setNextIdx(next)
            setDirection(dir)
            setPhase("exit")

            // after exit animation, snap to next and play enter
            const t1 = setTimeout(() => {
                currentRef.current = next
                setCurrentIdx(next)
                setPhase("enter")
            }, 280)

            const t2 = setTimeout(() => setPhase("idle"), 560)

            return () => { clearTimeout(t1); clearTimeout(t2) }
        }, interval)

        return () => clearInterval(id)
    }, [interval])

    const CurrentIcon = ICONS[currentIdx]
    const NextIcon = ICONS[nextIdx]

    /* ── transform helpers ── */
    const exitTransform = {
        up: "translateY(-120%) scale(0.7)",
        down: "translateY(120%)  scale(0.7)",
        left: "translateX(-120%) scale(0.7)",
        right: "translateX(120%)  scale(0.7)",
    }[direction]

    const enterFrom = {
        up: "translateY(120%)  scale(0.7)",
        down: "translateY(-120%) scale(0.7)",
        left: "translateX(120%)  scale(0.7)",
        right: "translateX(-120%) scale(0.7)",
    }[direction]

    const idle = "translate(0,0) scale(1)"

    return (
        <span
            role="status"
            aria-label="Loading"
            className={cn(
                "relative inline-flex items-center justify-center overflow-hidden",
                "size-[1em]",
                className,
            )}
            style={{ fontSize: size }}
            {...props}
        >
            {/* current icon */}
            <CurrentIcon
                size={size}
                strokeWidth={1.75}
                style={{
                    position: "absolute",
                    transition: "transform 260ms cubic-bezier(.4,0,.2,1), opacity 260ms",
                    transform: phase === "exit" ? exitTransform : idle,
                    opacity: phase === "exit" ? 0 : 1,
                }}
            />

            {/* next icon (only visible during enter) */}
            {phase === "enter" && (
                <NextIcon
                    key={nextIdx + direction}
                    size={size}
                    strokeWidth={1.75}
                    style={{
                        position: "absolute",
                        animation: "slide-in-icon 280ms cubic-bezier(.4,0,.2,1) forwards",
                        // inline CSS animation via style + keyframes injected below
                        "--from": enterFrom,
                    }}
                />
            )}

            <style>{`
        @keyframes slide-in-icon {
          from { transform: var(--from); opacity: 0; }
          to   { transform: translate(0,0) scale(1); opacity: 1; }
        }
      `}</style>
        </span>
    )
}

export { SlideLoader }