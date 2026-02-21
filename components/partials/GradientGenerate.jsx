import { cn } from "@/lib/utils";

export function GradientGenerate({
    children,
    isGenerating = false,
    borderWidth = '3px',
    borderRadius = "0.5rem",
    gradientColors = '#06b6d4, #3b82f6, #8b5cf6, #ec4899',
    animationDuration = '3s',
    className = ''
}) {
    return (
        <div
            className={`${isGenerating ? 'generate-gradient-outline generating' : ''} ${cn(className)}`}
            style={{
                '--border-width': isGenerating ? borderWidth : '0px',
                '--border-radius': borderRadius,
                '--gradient-colors': gradientColors,
                '--animation-duration': animationDuration
            }}
        >
            {children}
        </div>
    );
}