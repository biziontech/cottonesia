"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

function useCanvasResize(canvasRef, containerRef, onResize) {
    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const resize = () => {
            const rect = container.getBoundingClientRect()
            const dpr = window.devicePixelRatio || 1

            canvas.width = Math.max(1, rect.width * dpr)
            canvas.height = Math.max(1, rect.height * dpr)
            canvas.style.width = `${rect.width}px`
            canvas.style.height = `${rect.height}px`

            const ctx = canvas.getContext("2d")
            if (!ctx) return
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.scale(dpr, dpr)

            onResize?.(rect)
        }

        const observer = new ResizeObserver(resize)
        observer.observe(container)
        resize()

        return () => observer.disconnect()
    }, [canvasRef, containerRef, onResize])
}

function getBarColor(canvas, barColor) {
    if (barColor) return barColor
    return getComputedStyle(canvas).getPropertyValue("--foreground") || "#000"
}

function drawBars(ctx, rect, data, options) {
    const {
        barWidth,
        barGap,
        barRadius,
        baseBarHeight,
        barColor,
        fadeEdges,
        fadeWidth,
        mirror = false,
    } = options

    const computedBarColor = getBarColor(ctx.canvas, barColor)
    const step = barWidth + barGap
    const barCount = Math.max(1, Math.floor(rect.width / step))
    const centerY = rect.height / 2

    for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * data.length)
        const value = data[dataIndex] ?? 0
        const x = i * step
        const heightScale = mirror ? 0.8 : 0.7
        const barHeight = Math.max(baseBarHeight, value * rect.height * heightScale)
        const y = centerY - barHeight / 2

        ctx.fillStyle = computedBarColor
        ctx.globalAlpha = 0.3 + value * 0.7

        if (barRadius > 0) {
            ctx.beginPath()
            ctx.roundRect(x, y, barWidth, barHeight, barRadius)
            ctx.fill()
        } else {
            ctx.fillRect(x, y, barWidth, barHeight)
        }
    }

    if (fadeEdges && fadeWidth > 0 && rect.width > 0) {
        const gradient = ctx.createLinearGradient(0, 0, rect.width, 0)
        const fadePercent = Math.min(0.2, fadeWidth / rect.width)

        gradient.addColorStop(0, "rgba(255,255,255,1)")
        gradient.addColorStop(fadePercent, "rgba(255,255,255,0)")
        gradient.addColorStop(1 - fadePercent, "rgba(255,255,255,0)")
        gradient.addColorStop(1, "rgba(255,255,255,1)")

        ctx.globalCompositeOperation = "destination-out"
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, rect.width, rect.height)
        ctx.globalCompositeOperation = "source-over"
    }

    ctx.globalAlpha = 1
}

export const Waveform = ({
    data = [],
    barWidth = 4,
    barHeight: baseBarHeight = 4,
    barGap = 2,
    barRadius = 2,
    barColor,
    fadeEdges = true,
    fadeWidth = 24,
    height = 128,
    onBarClick,
    className,
    ...props
}) => {
    const canvasRef = useRef(null)
    const containerRef = useRef(null)
    const heightStyle = typeof height === "number" ? `${height}px` : height

    const render = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const rect = canvas.getBoundingClientRect()
        ctx.clearRect(0, 0, rect.width, rect.height)

        drawBars(ctx, rect, data, {
            barWidth,
            barGap,
            barRadius,
            baseBarHeight,
            barColor,
            fadeEdges,
            fadeWidth,
            mirror: true,
        })
    }, [data, barWidth, barGap, barRadius, baseBarHeight, barColor, fadeEdges, fadeWidth])

    useCanvasResize(canvasRef, containerRef, render)
    useEffect(() => {
        render()
    }, [render])

    const handleClick = (e) => {
        if (!onBarClick) return

        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return

        const x = e.clientX - rect.left
        const barIndex = Math.floor(x / (barWidth + barGap))
        const bars = Math.max(1, Math.floor(rect.width / (barWidth + barGap)))
        const dataIndex = Math.floor((barIndex * data.length) / bars)

        if (dataIndex >= 0 && dataIndex < data.length) {
            onBarClick(dataIndex, data[dataIndex])
        }
    }

    return (
        <div className={cn("relative", className)} ref={containerRef} style={{ height: heightStyle }} {...props}>
            <canvas className="block h-full w-full" onClick={handleClick} ref={canvasRef} />
        </div>
    )
}

export const ScrollingWaveform = ({
    speed = 50,
    barCount = 60,
    barWidth = 4,
    barHeight: baseBarHeight = 4,
    barGap = 2,
    barRadius = 2,
    barColor,
    fadeEdges = true,
    fadeWidth = 24,
    height = 128,
    data,
    className,
    ...props
}) => {
    const canvasRef = useRef(null)
    const containerRef = useRef(null)
    const barsRef = useRef([])
    const animationRef = useRef(0)
    const lastTimeRef = useRef(0)
    const seedRef = useRef(0.5)
    const dataIndexRef = useRef(0)
    const heightStyle = typeof height === "number" ? `${height}px` : height

    useEffect(() => {
        if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
            const arr = new Uint32Array(1)
            window.crypto.getRandomValues(arr)
            seedRef.current = arr[0] / 0xffffffff
            return
        }
        seedRef.current = 0.6180339887
    }, [])

    useCanvasResize(canvasRef, containerRef)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const seededRandom = (i) => {
            const x = Math.sin(seedRef.current * 10000 + i * 137.5) * 10000
            return x - Math.floor(x)
        }

        const animate = (currentTime) => {
            const rect = canvas.getBoundingClientRect()
            const step = barWidth + barGap
            const dt = lastTimeRef.current ? (currentTime - lastTimeRef.current) / 1000 : 0
            lastTimeRef.current = currentTime

            for (const bar of barsRef.current) {
                bar.x -= speed * dt
            }
            barsRef.current = barsRef.current.filter((bar) => bar.x + barWidth > -step)

            while (barsRef.current.length === 0 || barsRef.current[barsRef.current.length - 1].x < rect.width) {
                const last = barsRef.current[barsRef.current.length - 1]
                const nextX = last ? last.x + step : rect.width
                let nextHeight

                if (Array.isArray(data) && data.length > 0) {
                    nextHeight = data[dataIndexRef.current % data.length] || 0.1
                    dataIndexRef.current += 1
                } else {
                    const idx = barsRef.current.length + currentTime * 0.01
                    const wave1 = Math.sin(idx * 0.1) * 0.2
                    const wave2 = Math.cos(idx * 0.05) * 0.15
                    const random = seededRandom(idx) * 0.4
                    nextHeight = Math.max(0.1, Math.min(0.9, 0.3 + wave1 + wave2 + random))
                }

                barsRef.current.push({ x: nextX, height: nextHeight })
                if (barsRef.current.length > barCount * 2) break
            }

            ctx.clearRect(0, 0, rect.width, rect.height)
            drawBars(
                ctx,
                rect,
                barsRef.current.map((bar) => bar.height),
                { barWidth, barGap, barRadius, baseBarHeight, barColor, fadeEdges, fadeWidth }
            )

            animationRef.current = requestAnimationFrame(animate)
        }

        animationRef.current = requestAnimationFrame(animate)
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
        }
    }, [speed, barCount, barWidth, baseBarHeight, barGap, barRadius, barColor, fadeEdges, fadeWidth, data])

    return (
        <div className={cn("relative flex items-center", className)} ref={containerRef} style={{ height: heightStyle }} {...props}>
            <canvas className="block h-full w-full" ref={canvasRef} />
        </div>
    )
}

export const AudioScrubber = ({
    data = [],
    currentTime = 0,
    duration = 100,
    onSeek,
    showHandle = true,
    barWidth = 3,
    barHeight,
    barGap = 1,
    barRadius = 1,
    barColor,
    height = 128,
    className,
    ...props
}) => {
    const [isDragging, setIsDragging] = useState(false)
    const [localProgress, setLocalProgress] = useState(0)
    const containerRef = useRef(null)

    const waveformData = useMemo(() => {
        if (data.length > 0) return data
        return Array.from({ length: 100 }, (_, i) => {
            const v = Math.sin((i + 1) * 12.9898) * 43758.5453
            const frac = v - Math.floor(v)
            return 0.2 + frac * 0.6
        })
    }, [data])

    const displayProgress = isDragging
        ? localProgress
        : duration > 0
            ? Math.max(0, Math.min(1, currentTime / duration))
            : 0

    const handleScrub = useCallback(
        (clientX) => {
            const container = containerRef.current
            if (!container) return

            const rect = container.getBoundingClientRect()
            const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
            const progress = rect.width ? x / rect.width : 0
            const time = progress * duration

            setLocalProgress(progress)
            onSeek?.(time)
        },
        [duration, onSeek]
    )

    useEffect(() => {
        if (!isDragging) return

        const onMove = (e) => handleScrub(e.clientX)
        const onUp = () => setIsDragging(false)

        document.addEventListener("mousemove", onMove)
        document.addEventListener("mouseup", onUp)
        return () => {
            document.removeEventListener("mousemove", onMove)
            document.removeEventListener("mouseup", onUp)
        }
    }, [isDragging, handleScrub])

    const heightStyle = typeof height === "number" ? `${height}px` : height

    return (
        <div
            aria-label="Audio waveform scrubber"
            aria-valuemax={duration}
            aria-valuemin={0}
            aria-valuenow={currentTime}
            className={cn("relative cursor-pointer select-none", className)}
            onMouseDown={(e) => {
                e.preventDefault()
                setIsDragging(true)
                handleScrub(e.clientX)
            }}
            ref={containerRef}
            role="slider"
            style={{ height: heightStyle }}
            tabIndex={0}
            {...props}
        >
            <Waveform
                barColor={barColor}
                barGap={barGap}
                barHeight={barHeight}
                barRadius={barRadius}
                barWidth={barWidth}
                data={waveformData}
                fadeEdges={false}
            />
            <div className="bg-primary/20 pointer-events-none absolute inset-y-0 left-0" style={{ width: `${displayProgress * 100}%` }} />
            <div className="bg-primary pointer-events-none absolute top-0 bottom-0 w-0.5" style={{ left: `${displayProgress * 100}%` }} />
            {showHandle && (
                <div
                    className="border-background bg-primary pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-lg transition-transform hover:scale-110"
                    style={{ left: `${displayProgress * 100}%` }}
                />
            )}
        </div>
    )
}

export const MicrophoneWaveform = ({
    active = false,
    processing = false,
    fftSize = 256,
    smoothingTimeConstant = 0.8,
    sensitivity = 1,
    onError,
    ...props
}) => {
    const [data, setData] = useState([])
    const analyserRef = useRef(null)
    const audioContextRef = useRef(null)
    const streamRef = useRef(null)
    const animationRef = useRef(null)

    useEffect(() => {
        if (!active) {
            if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop())
            if (audioContextRef.current && audioContextRef.current.state !== "closed") audioContextRef.current.close()
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
            analyserRef.current = null
            streamRef.current = null
            audioContextRef.current = null
            return
        }

        let mounted = true

        const setup = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                if (!mounted) return

                const AudioContextCtor = window.AudioContext || window.webkitAudioContext
                const audioContext = new AudioContextCtor()
                const analyser = audioContext.createAnalyser()
                analyser.fftSize = fftSize
                analyser.smoothingTimeConstant = smoothingTimeConstant

                audioContext.createMediaStreamSource(stream).connect(analyser)

                streamRef.current = stream
                audioContextRef.current = audioContext
                analyserRef.current = analyser

                const tick = () => {
                    if (!analyserRef.current) return
                    const bins = new Uint8Array(analyserRef.current.frequencyBinCount)
                    analyserRef.current.getByteFrequencyData(bins)

                    const start = Math.floor(bins.length * 0.05)
                    const end = Math.floor(bins.length * 0.4)
                    const relevant = bins.slice(start, end)
                    const next = Array.from({ length: 45 }, (_, i) => {
                        const idx = Math.floor((i / 45) * relevant.length)
                        return Math.max(0.05, Math.min(1, (relevant[idx] / 255) * sensitivity))
                    })

                    setData(next)
                    animationRef.current = requestAnimationFrame(tick)
                }

                animationRef.current = requestAnimationFrame(tick)
            } catch (error) {
                onError?.(error)
            }
        }

        setup()

        return () => {
            mounted = false
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
            if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop())
            if (audioContextRef.current && audioContextRef.current.state !== "closed") audioContextRef.current.close()
        }
    }, [active, fftSize, smoothingTimeConstant, sensitivity, onError])

    useEffect(() => {
        if (processing && !active) {
            let t = 0
            let raf = 0
            const animate = () => {
                t += 0.03
                const next = Array.from({ length: 45 }, (_, i) => {
                    const p = (i - 22) / 22
                    const centerWeight = 1 - Math.abs(p) * 0.4
                    const wave = Math.sin(t * 1.5 + i * 0.15) * 0.25 + Math.sin(t * 0.8 - i * 0.1) * 0.2
                    return Math.max(0.05, Math.min(1, (0.2 + wave) * centerWeight))
                })
                setData(next)
                raf = requestAnimationFrame(animate)
            }
            raf = requestAnimationFrame(animate)
            return () => cancelAnimationFrame(raf)
        }
    }, [processing, active])

    return <Waveform data={data} {...props} />
}

export const StaticWaveform = ({ seed = 1, bars = 60, ...props }) => {
    const data = useMemo(() => {
        const rand = (n) => {
            const x = Math.sin(seed * 999 + n * 73.17) * 10000
            return x - Math.floor(x)
        }
        return Array.from({ length: bars }, (_, i) => Math.max(0.05, Math.min(0.95, 0.2 + rand(i) * 0.7)))
    }, [seed, bars])

    return <Waveform data={data} {...props} />
}

export const LiveMicrophoneWaveform = ({
    active = false,
    fftSize = 256,
    smoothingTimeConstant = 0.8,
    sensitivity = 1,
    updateRate = 50,
    historySize = 240,
    dragOffset = 0,
    setDragOffset,
    enableAudioPlayback = false,
    onError,
    barWidth = 3,
    barHeight: baseBarHeight = 4,
    barGap = 1,
    barRadius = 1,
    barColor,
    fadeEdges = true,
    fadeWidth = 24,
    height = 128,
    className,
    ...props
}) => {
    const [isDragging, setIsDragging] = useState(false)
    const [internalOffset, setInternalOffset] = useState(0)
    const [historyLength, setHistoryLength] = useState(0)
    const canvasRef = useRef(null)
    const containerRef = useRef(null)
    const analyserRef = useRef(null)
    const audioContextRef = useRef(null)
    const streamRef = useRef(null)
    const historyRef = useRef([])
    const lastUpdateRef = useRef(0)
    const animationRef = useRef(0)
    const startXRef = useRef(0)
    const startOffsetRef = useRef(0)

    const resolvedOffset = setDragOffset ? dragOffset : internalOffset
    const setOffset = setDragOffset || setInternalOffset

    const heightStyle = typeof height === "number" ? `${height}px` : height

    useCanvasResize(canvasRef, containerRef)

    useEffect(() => {
        if (!active) {
            if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop())
            if (audioContextRef.current && audioContextRef.current.state !== "closed") audioContextRef.current.close()
            analyserRef.current = null
            streamRef.current = null
            audioContextRef.current = null
            return
        }

        let mounted = true
        const setup = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                if (!mounted) return

                const AudioContextCtor = window.AudioContext || window.webkitAudioContext
                const audioContext = new AudioContextCtor()
                const analyser = audioContext.createAnalyser()
                analyser.fftSize = fftSize
                analyser.smoothingTimeConstant = smoothingTimeConstant
                audioContext.createMediaStreamSource(stream).connect(analyser)

                streamRef.current = stream
                audioContextRef.current = audioContext
                analyserRef.current = analyser
            } catch (error) {
                onError?.(error)
            }
        }

        setup()
        return () => {
            mounted = false
            if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop())
            if (audioContextRef.current && audioContextRef.current.state !== "closed") audioContextRef.current.close()
        }
    }, [active, fftSize, smoothingTimeConstant, onError])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const animate = (t) => {
            if (active && analyserRef.current && t - lastUpdateRef.current > updateRate) {
                lastUpdateRef.current = t
                const bins = new Uint8Array(analyserRef.current.frequencyBinCount)
                analyserRef.current.getByteFrequencyData(bins)

                const start = Math.floor(bins.length * 0.05)
                const end = Math.floor(bins.length * 0.4)
                const relevant = bins.slice(start, end)
                let sum = 0
                for (let i = 0; i < relevant.length; i++) sum += relevant[i]
                const avg = (sum / Math.max(1, relevant.length) / 255) * sensitivity
                historyRef.current.push(Math.max(0.05, Math.min(1, avg)))

                if (historyRef.current.length > historySize) {
                    historyRef.current.shift()
                }
                setHistoryLength(historyRef.current.length)
            }

            const rect = canvas.getBoundingClientRect()
            ctx.clearRect(0, 0, rect.width, rect.height)

            const step = barWidth + barGap
            const barsVisible = Math.max(1, Math.floor(rect.width / step))
            const data = historyRef.current

            const offsetBars = Math.floor((active ? 0 : resolvedOffset) / step)
            const startIndex = Math.max(0, data.length - barsVisible - offsetBars)
            const slice = data.slice(startIndex, startIndex + barsVisible)

            drawBars(ctx, rect, slice, {
                barWidth,
                barGap,
                barRadius,
                baseBarHeight,
                barColor,
                fadeEdges,
                fadeWidth,
            })

            animationRef.current = requestAnimationFrame(animate)
        }

        animationRef.current = requestAnimationFrame(animate)
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
        }
    }, [active, sensitivity, updateRate, historySize, barWidth, baseBarHeight, barGap, barRadius, barColor, fadeEdges, fadeWidth, resolvedOffset])

    useEffect(() => {
        if (!isDragging) return

        const onMove = (e) => {
            const canvas = canvasRef.current
            if (!canvas) return

            const deltaX = e.clientX - startXRef.current
            const step = barWidth + barGap
            const viewBars = Math.max(1, Math.floor(canvas.getBoundingClientRect().width / step))
            const maxOffset = Math.max(0, (historyRef.current.length - viewBars) * step)
            const next = Math.max(0, Math.min(maxOffset, startOffsetRef.current - deltaX * 0.5))
            setOffset(next)
        }

        const onUp = () => setIsDragging(false)

        document.addEventListener("mousemove", onMove)
        document.addEventListener("mouseup", onUp)
        return () => {
            document.removeEventListener("mousemove", onMove)
            document.removeEventListener("mouseup", onUp)
        }
    }, [isDragging, barWidth, barGap, setOffset])

    return (
        <div
            className={cn("relative flex items-center", !active && historyLength > 0 && "cursor-pointer", className)}
            onMouseDown={(e) => {
                if (active || historyLength === 0) return
                e.preventDefault()
                setIsDragging(true)
                startXRef.current = e.clientX
                startOffsetRef.current = resolvedOffset
            }}
            ref={containerRef}
            role={!active && historyLength > 0 ? "slider" : undefined}
            aria-label={!active && historyLength > 0 ? "Drag to scrub through recording" : undefined}
            aria-valuenow={!active && historyLength > 0 ? Math.abs(resolvedOffset) : undefined}
            aria-valuemin={!active && historyLength > 0 ? 0 : undefined}
            aria-valuemax={!active && historyLength > 0 ? historyLength : undefined}
            tabIndex={!active && historyLength > 0 ? 0 : undefined}
            style={{ height: heightStyle }}
            {...props}
            data-audio-playback={enableAudioPlayback ? "on" : "off"}
        >
            <canvas className="block h-full w-full" ref={canvasRef} />
        </div>
    )
}

export const RecordingWaveform = ({
    recording = false,
    fftSize = 256,
    smoothingTimeConstant = 0.8,
    sensitivity = 1,
    onError,
    onRecordingComplete,
    updateRate = 50,
    showHandle = true,
    barWidth = 3,
    barHeight: baseBarHeight = 4,
    barGap = 1,
    barRadius = 1,
    barColor,
    height = 128,
    className,
    ...props
}) => {
    const [recordedData, setRecordedData] = useState([])
    const [viewPosition, setViewPosition] = useState(1)
    const [isDragging, setIsDragging] = useState(false)
    const [isRecordingComplete, setIsRecordingComplete] = useState(false)

    const canvasRef = useRef(null)
    const containerRef = useRef(null)
    const recordingDataRef = useRef([])
    const analyserRef = useRef(null)
    const audioContextRef = useRef(null)
    const streamRef = useRef(null)
    const animationRef = useRef(0)
    const lastUpdateRef = useRef(0)

    const heightStyle = typeof height === "number" ? `${height}px` : height

    useCanvasResize(canvasRef, containerRef)

    useEffect(() => {
        if (!recording) {
            if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop())
            if (audioContextRef.current && audioContextRef.current.state !== "closed") audioContextRef.current.close()

            if (recordingDataRef.current.length > 0) {
                const data = [...recordingDataRef.current]
                setRecordedData(data)
                setIsRecordingComplete(true)
                onRecordingComplete?.(data)
            }
            return
        }

        setIsRecordingComplete(false)
        recordingDataRef.current = []
        setRecordedData([])
        setViewPosition(1)

        let mounted = true
        const setup = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                if (!mounted) return

                const AudioContextCtor = window.AudioContext || window.webkitAudioContext
                const audioContext = new AudioContextCtor()
                const analyser = audioContext.createAnalyser()
                analyser.fftSize = fftSize
                analyser.smoothingTimeConstant = smoothingTimeConstant

                audioContext.createMediaStreamSource(stream).connect(analyser)

                streamRef.current = stream
                audioContextRef.current = audioContext
                analyserRef.current = analyser
            } catch (error) {
                onError?.(error)
            }
        }

        setup()

        return () => {
            mounted = false
            if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop())
            if (audioContextRef.current && audioContextRef.current.state !== "closed") audioContextRef.current.close()
        }
    }, [recording, fftSize, smoothingTimeConstant, onError, onRecordingComplete])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const animate = (currentTime) => {
            if (recording && currentTime - lastUpdateRef.current > updateRate) {
                lastUpdateRef.current = currentTime
                if (analyserRef.current) {
                    const bins = new Uint8Array(analyserRef.current.frequencyBinCount)
                    analyserRef.current.getByteFrequencyData(bins)

                    let sum = 0
                    for (let i = 0; i < bins.length; i++) sum += bins[i]
                    const avg = (sum / Math.max(1, bins.length) / 255) * sensitivity
                    recordingDataRef.current.push(Math.max(0.05, Math.min(1, avg)))
                }
            }

            const rect = canvas.getBoundingClientRect()
            ctx.clearRect(0, 0, rect.width, rect.height)

            const dataToRender = recording ? recordingDataRef.current : recordedData
            if (dataToRender.length > 0) {
                const step = barWidth + barGap
                const barsVisible = Math.max(1, Math.floor(rect.width / step))

                let startIndex = 0
                if (!recording && isRecordingComplete) {
                    startIndex = Math.floor(Math.max(0, dataToRender.length - barsVisible) * viewPosition)
                } else if (recording) {
                    startIndex = Math.max(0, dataToRender.length - barsVisible)
                }

                const visibleData = dataToRender.slice(startIndex, startIndex + barsVisible)

                drawBars(ctx, rect, visibleData, {
                    barWidth,
                    barGap,
                    barRadius,
                    baseBarHeight,
                    barColor,
                    fadeEdges: false,
                    fadeWidth: 0,
                })

                if (!recording && isRecordingComplete && showHandle) {
                    const x = rect.width * viewPosition
                    const color = getBarColor(canvas, barColor)

                    ctx.strokeStyle = color
                    ctx.globalAlpha = 0.5
                    ctx.lineWidth = 2
                    ctx.beginPath()
                    ctx.moveTo(x, 0)
                    ctx.lineTo(x, rect.height)
                    ctx.stroke()

                    ctx.fillStyle = color
                    ctx.globalAlpha = 1
                    ctx.beginPath()
                    ctx.arc(x, rect.height / 2, 6, 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            animationRef.current = requestAnimationFrame(animate)
        }

        animationRef.current = requestAnimationFrame(animate)
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
        }
    }, [recording, recordedData, viewPosition, isRecordingComplete, sensitivity, updateRate, showHandle, barWidth, baseBarHeight, barGap, barRadius, barColor])

    const handleScrub = useCallback(
        (clientX) => {
            if (recording || !isRecordingComplete) return
            const rect = containerRef.current?.getBoundingClientRect()
            if (!rect) return

            const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
            setViewPosition(rect.width ? x / rect.width : 0)
        },
        [recording, isRecordingComplete]
    )

    useEffect(() => {
        if (!isDragging) return
        const onMove = (e) => handleScrub(e.clientX)
        const onUp = () => setIsDragging(false)

        document.addEventListener("mousemove", onMove)
        document.addEventListener("mouseup", onUp)
        return () => {
            document.removeEventListener("mousemove", onMove)
            document.removeEventListener("mouseup", onUp)
        }
    }, [isDragging, handleScrub])

    return (
        <div
            aria-label={isRecordingComplete && !recording ? "Drag to scrub through recording" : undefined}
            aria-valuenow={isRecordingComplete && !recording ? viewPosition * 100 : undefined}
            aria-valuemin={isRecordingComplete && !recording ? 0 : undefined}
            aria-valuemax={isRecordingComplete && !recording ? 100 : undefined}
            className={cn("relative flex items-center", isRecordingComplete && !recording && "cursor-pointer", className)}
            onMouseDown={(e) => {
                if (recording || !isRecordingComplete) return
                e.preventDefault()
                setIsDragging(true)
                handleScrub(e.clientX)
            }}
            ref={containerRef}
            role={isRecordingComplete && !recording ? "slider" : undefined}
            style={{ height: heightStyle }}
            tabIndex={isRecordingComplete && !recording ? 0 : undefined}
            {...props}
        >
            <canvas className="block h-full w-full" ref={canvasRef} />
        </div>
    )
}
