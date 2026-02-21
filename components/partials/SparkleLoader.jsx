import { cn } from "@/lib/utils";

export const SparkleLoader = ({ className, size = "md", ...props }) => {
    // Size mapping untuk scale
    const sizeMap = {
        xxs: 0.3,   // w-16 h-16 equivalent
        xs: 0.5,   // w-16 h-16 equivalent
        sm: 0.75,  // w-24 h-24 equivalent
        md: 1,     // w-32 h-32 (default)
        lg: 1.5,   // w-48 h-48 equivalent
        xl: 2,     // w-64 h-64 equivalent
        "2xl": 2.5 // w-80 h-80 equivalent
    };

    const scale = sizeMap[size] || 1;

    return (
        <div className="flex gap-0 flex-col items-center">
            <div 
                className={cn('relative w-32 h-32 mx-auto', className)}
                style={{ transform: `scale(${scale})` }}
            >
                {/* Main Star */}
                <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                        animation: 'scaleBreath 2s ease-in-out infinite'
                    }}
                >
                    <svg
                        className="w-20 h-20"
                        viewBox="0 0 78 78"
                    >
                        <defs>
                            <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
                                <stop offset="25%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                                <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                                <stop offset="75%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                        <path
                            d="M0,39 C0,39 18.367,35.632 26,28 C33.632,20.367 39,0 39,0 C39,0 42.371,18.926 51,27 C59.628,35.73 78,39 78,39 C78,39 59.261,42.738 51,51 C42.738,59.261 39,78 39,78 C39,78 35.834,61.638 28,52 C20.165,42.361 0,39 0,39 Z"
                            fill="url(#mainGradient)"
                        />
                    </svg>
                </div>

                {/* Small Star 1 - Top Right */}
                <div
                    className="absolute top-0 right-4"
                    style={{
                        animation: 'twinkle1 1.5s ease-in-out infinite'
                    }}
                >
                    <svg className="w-8 h-8" viewBox="0 0 78 78">
                        <defs>
                            <linearGradient id="smallGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#c084fc', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                        <path
                            d="M0,39 C0,39 18.367,35.632 26,28 C33.632,20.367 39,0 39,0 C39,0 42.371,18.926 51,27 C59.628,35.73 78,39 78,39 C78,39 59.261,42.738 51,51 C42.738,59.261 39,78 39,78 C39,78 35.834,61.638 28,52 C20.165,42.361 0,39 0,39 Z"
                            fill="url(#smallGradient1)"
                        />
                    </svg>
                </div>

                {/* Small Star 2 - Bottom Left */}
                <div
                    className="absolute bottom-2 left-2"
                    style={{
                        animation: 'twinkle2 1.8s ease-in-out infinite'
                    }}
                >
                    <svg className="w-6 h-6" viewBox="0 0 78 78">
                        <defs>
                            <linearGradient id="smallGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#f472b6', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#a78bfa', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                        <path
                            d="M0,39 C0,39 18.367,35.632 26,28 C33.632,20.367 39,0 39,0 C39,0 42.371,18.926 51,27 C59.628,35.73 78,39 78,39 C78,39 59.261,42.738 51,51 C42.738,59.261 39,78 39,78 C39,78 35.834,61.638 28,52 C20.165,42.361 0,39 0,39 Z"
                            fill="url(#smallGradient2)"
                        />
                    </svg>
                </div>

                {/* Small Star 3 - Top Left */}
                <div
                    className="absolute top-4 left-0"
                    style={{
                        animation: 'twinkle3 2s ease-in-out infinite'
                    }}
                >
                    <svg className="w-5 h-5" viewBox="0 0 78 78">
                        <defs>
                            <linearGradient id="smallGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                        <path
                            d="M0,39 C0,39 18.367,35.632 26,28 C33.632,20.367 39,0 39,0 C39,0 42.371,18.926 51,27 C59.628,35.73 78,39 78,39 C78,39 59.261,42.738 51,51 C42.738,59.261 39,78 39,78 C39,78 35.834,61.638 28,52 C20.165,42.361 0,39 0,39 Z"
                            fill="url(#smallGradient3)"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};