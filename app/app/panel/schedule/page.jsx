"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Zap, CalendarDays, Users, Clock, Save, RefreshCw, PanelRight, Info, Trash2, InfoIcon } from 'lucide-react'
import { toast } from 'sonner'
import PageTitle from '@/components/partials/PageTitle'
import LayoutContainer from '@/components/partials/LayoutContainer'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import api from '@/lib/api'
import { Spinner } from '@/components/ui/spinner'
import { CalendarRemove, InfoCircle, Stickynote } from 'iconsax-reactjs'
import { useTheme } from 'next-themes'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const COLORS = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#6b7280",
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const SHIFT_COLORS = [
    'bg-blue-700 text-white border-blue-700',
    'bg-teal-700 text-white border-teal-700',
    'bg-violet-700 text-white border-violet-700',
    'bg-amber-700 text-white border-amber-700',
    'bg-rose-700 text-white border-rose-700',
]

const DEFAULT_SCHEDULE_FORM = {
    start_time: '08:00',
    end_time: '17:00',
    cross_day: false,
    late_tolerance_minutes: 0,
}

const DRAFT_STATES = {
    WORK: 'work',
    OFF: 'off',
    EMPTY: 'empty',
}

const GENERATE_INFO_STEPS = [
    {
        title: 'Pilih Shift',
        description: 'Buka Generate, lalu centang shift yang ingin dibuat jadwalnya. Secara default semua shift aktif akan dipilih.',
    },
    {
        title: 'Atur Status Tanggal',
        description: 'Klik tanggal di kalender generate untuk mengganti status Masuk, Libur, atau Kosong. Status Kosong tidak akan dikirim ke backend.',
    },
    {
        title: 'Generate Ulang',
        description: 'Tanggal yang sudah punya jadwal akan dikunci. Aktifkan Generate ulang jika tanggal tersebut memang ingin dibuat ulang.',
    },
    {
        title: 'Simpan Jadwal',
        description: 'Saat dikirim, hari Masuk dan Libur dibuat untuk setiap shift yang dipilih. Hari Libur tetap dibuat dengan is_day_off aktif.',
    },
]

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay()
}

function formatDateLong(day, month, year) {
    return `${day} ${MONTH_NAMES[month]} ${year}`
}

function getMonthOffset(year, month, offset) {
    const date = new Date(year, month + offset, 1)
    return {
        month: date.getMonth(),
        year: date.getFullYear(),
    }
}

function toDateString(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function getDayFromDate(date) {
    const normalized = String(date || '').split('T')[0]
    return Number(normalized.split('-')[2])
}

function normalizeTime(value, fallback = '08:00') {
    if (!value) return fallback
    return String(value).slice(0, 5)
}

function getInitials(name = '-') {
    const parts = String(name || '-').trim().split(/\s+/).filter(Boolean)
    if (!parts.length) return '-'

    return parts.slice(0, 2).map(part => part[0]).join('').toUpperCase()
}

function normalizeImageUrl(value) {
    if (!value) return ''
    if (/^https?:\/\//i.test(value)) return value

    return `${API_URL}/${String(value).replace(/^\/+/, '')}`
}

function getScheduleShiftUuid(schedule) {
    return schedule?.shift_uuid || schedule?.shift?.uuid
}

function getScheduleUuid(schedule) {
    return schedule?.uuid
}

function getShiftSortValue(item) {
    const id = Number(item?.shiftId ?? item?.shift_id ?? item?.id)

    if (Number.isFinite(id)) return id

    const createdAt = Date.parse(item?.shiftCreatedAt ?? item?.created_at ?? '')

    return Number.isFinite(createdAt) ? createdAt : 0
}

function getScheduleTimeForm(schedule, shift) {
    return {
        start_time: normalizeTime(schedule?.start_time ?? shift?.start_time, DEFAULT_SCHEDULE_FORM.start_time),
        end_time: normalizeTime(schedule?.end_time ?? shift?.end_time, DEFAULT_SCHEDULE_FORM.end_time),
        cross_day: !!(schedule?.cross_day ?? shift?.cross_day ?? DEFAULT_SCHEDULE_FORM.cross_day),
        late_tolerance_minutes: schedule?.late_tolerance_minutes ?? shift?.late_tolerance_minutes ?? DEFAULT_SCHEDULE_FORM.late_tolerance_minutes,
    }
}

function getSchedulePayloadTime(form) {
    return {
        start_time: form.start_time || DEFAULT_SCHEDULE_FORM.start_time,
        end_time: form.end_time || DEFAULT_SCHEDULE_FORM.end_time,
        cross_day: !!form.cross_day,
        late_tolerance_minutes: Number(form.late_tolerance_minutes || 0),
    }
}

function normalizeShift(shift, index = 0) {
    return {
        ...shift,
        id: shift.id ?? shift.uuid,
        label: shift.name || `Shift ${index + 1}`,
        sublabel: `${normalizeTime(shift.start_time)} - ${normalizeTime(shift.end_time, '17:00')}`,
        color: SHIFT_COLORS[index % SHIFT_COLORS.length],
        start_time: normalizeTime(shift.start_time),
        end_time: normalizeTime(shift.end_time, '17:00'),
        is_active: !!shift.is_active,
    }
}

function buildInitialDays(year, month, shifts = []) {
    const total = getDaysInMonth(year, month)
    const activeShiftMap = Object.fromEntries(shifts.filter(shift => shift.is_active).map(shift => [shift.uuid, true]))
    const result = {}

    for (let d = 1; d <= total; d++) {
        const dow = new Date(year, month, d).getDay()
        const isHoliday = dow === 0
        result[d] = {
            operational: !isHoliday,
            shifts: !isHoliday ? activeShiftMap : {},
            schedules: [],
            note: isHoliday ? 'Libur Hari Minggu' : '',
        }
    }

    return result
}

function getDraftStateFromOperational(operational) {
    if (operational === true) return DRAFT_STATES.WORK
    if (operational === false) return DRAFT_STATES.OFF
    return DRAFT_STATES.EMPTY
}

function buildDraftDays(year, month, shifts = [], existingDays = {}, allowRegenerate = false) {
    const defaults = buildInitialDays(year, month, shifts)
    const total = getDaysInMonth(year, month)
    const result = {}

    for (let day = 1; day <= total; day++) {
        const existingDay = existingDays[day]
        const hasExistingSchedules = !!existingDay?.schedules?.length

        if (hasExistingSchedules) {
            result[day] = {
                ...defaults[day],
                ...existingDay,
                existing: true,
                locked: !allowRegenerate,
                operational: allowRegenerate ? null : existingDay.operational,
                draftState: allowRegenerate ? DRAFT_STATES.EMPTY : getDraftStateFromOperational(existingDay.operational),
            }
            continue
        }

        result[day] = {
            ...defaults[day],
            existing: false,
            locked: false,
            draftState: getDraftStateFromOperational(defaults[day].operational),
        }
    }

    return result
}

function buildDaysFromSchedules(schedules = []) {
    const result = {}

    schedules.forEach(schedule => {
        const day = getDayFromDate(schedule.date)
        if (!day) return

        const shiftUuid = getScheduleShiftUuid(schedule)
        const existing = result[day] || {
            operational: false,
            shifts: {},
            schedules: [],
            note: '',
        }

        const hasOperationalSchedule = !schedule.is_day_off

        result[day] = {
            ...existing,
            operational: existing.operational || hasOperationalSchedule,
            shifts: shiftUuid && hasOperationalSchedule
                ? { ...existing.shifts, [shiftUuid]: true }
                : existing.shifts,
            schedules: [...existing.schedules, schedule],
            note: hasOperationalSchedule ? existing.note : existing.note || 'Libur',
        }
    })

    return result
}

function StatCard({ icon: Icon, label, value, sub, accent }) {
    return (
        <div className="p-4 rounded-2xl border bg-card flex flex-col gap-1 flex-1 min-w-0 relative overflow-hidden">
            <div className="bg-card-login absolute inset-0 z-0 -top-px -left-px pointer-events-none"></div>
            <div className="flex items-center gap-2 mb-1 justify-between">
                <p className="text-sm font-medium text-muted-foreground line-clamp-1">{label}</p>
                <div className={cn('p-1.5 rounded-md', accent)}>
                    <Icon className="w-3.5 h-3.5" />
                </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{value}</h2>
            <small className="text-xs text-muted-foreground">{sub}</small>
        </div>
    )
}

function ShiftBadge({ shift, index, onClick }) {
    const color = COLORS[index % COLORS.length]

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    size="icon-xs"
                    variant="outline"
                    className="shadow-none size-2 group-hover:size-7 rounded-lg text-xs !text-white transition-all duration-200 ease-out hover:brightness-90 active:brightness-75"
                    style={{ backgroundColor: color, borderColor: color }}
                    onClick={(event) => {
                        event.stopPropagation()
                        onClick?.(shift)
                    }}
                >
                    <span className='group-hover:block hidden'>{index + 1}</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent>{shift.label} - {shift.sublabel}</TooltipContent>
        </Tooltip>
    )
}

function ActionShift({ activeShifts, onShiftClick }) {
    const sortedShifts = [...activeShifts].sort((a, b) => getShiftSortValue(a) - getShiftSortValue(b))

    return (
        <div className="gap-1 absolute bottom-2 left-2 hidden xl:flex">
            {sortedShifts.map((shift, index) => (
                <ShiftBadge key={shift.uuid} shift={shift} index={index} onClick={onShiftClick} />
            ))}
        </div>
    )
}

function CalendarCell({ day, dayData, isSelected, isGenerated, isToday, isMuted = false, shifts = [], onClick, onShiftClick, isLoading = false }) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, [])

    const stickyColor = mounted
        ? (resolvedTheme === 'dark' ? '#2c2c32' : '#dfdfdf')
        : '#dfdfdf';

    const activeShifts = isGenerated && dayData?.operational
        ? (dayData.schedules?.length
            ? dayData.schedules
                .filter(schedule => !schedule.is_day_off && getScheduleShiftUuid(schedule))
                .map(schedule => {
                    const shiftUuid = getScheduleShiftUuid(schedule)
                    const shift = {
                        ...(shifts.find(item => item.uuid === shiftUuid) || {}),
                        ...(schedule.shift || {}),
                    }
                    const timeForm = getScheduleTimeForm(schedule, shift)

                    return {
                        ...shift,
                        ...timeForm,
                        uuid: shiftUuid,
                        scheduleUuid: getScheduleUuid(schedule),
                        scheduleId: schedule.id,
                        shiftId: schedule.shift?.id ?? shift.id,
                        shiftCreatedAt: schedule.shift?.created_at ?? shift.created_at,
                        label: shift.label || shift.name || `Shift`,
                        sublabel: `${timeForm.start_time} - ${timeForm.end_time}`,
                    }
                })
            : shifts.filter(shift => dayData.shifts?.[shift.uuid]))
        : []

    return (
        <div
            onClick={isMuted || isLoading ? undefined : onClick}
            className={cn(
                'bg-muted cursor-default group relative flex aspect-[200/150] overflow-hidden rounded-2xl border w-full flex-col p-2 text-left transition-all duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                isMuted
                    ? 'pointer-events-none border bg-diagonal from-transparent to-transparent opacity-50 dark:to-transparent'
                    : '',
                isSelected && !isMuted
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 ring-1 ring-blue-500'
                    : !isMuted ? 'border-border hover:border-border/80 hover:bg-accent/40' : '',
                isGenerated && dayData
                    ? 'bg-gradient-to-tr from-muted/40 from-70% hover:from-50% to-green-100 dark:to-green-950' : '',
                isGenerated && dayData && !dayData.operational
                    ? 'to-rose-100 dark:to-rose-950'
                    : '',
                !isGenerated && !isMuted ? 'bg-muted/40 cursor-default' : '',
                !isMuted ? 'cursor-pointer' : 'cursor-default',
                isLoading && !isMuted ? 'cursor-wait' : '',
            )}
        >
            {!isMuted && (
                <div
                    className={cn(
                        'absolute inset-0 z-20 flex items-center justify-center text-muted-foreground transition-[background-color,backdrop-filter,opacity] duration-300 ease-out',
                        isLoading
                            ? 'bg-muted/40 opacity-100 backdrop-blur-[1px]'
                            : 'pointer-events-none bg-muted/0 opacity-0 backdrop-blur-0',
                    )}
                >
                    <Spinner
                        className={cn(
                            'transition-[opacity,transform] duration-300 ease-out',
                            isLoading ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
                        )}
                    />
                </div>
            )}
            <div className='absolute hidden md:flex top-0 pointer-events-none left-0 w-full h-full items-center justify-center'>
                {(isGenerated && dayData && !dayData.operational) ? (
                    <CalendarRemove variant='Bulk' color={stickyColor} />
                ) : (
                    <Stickynote variant='Bulk' color={stickyColor} />
                )}
            </div>
            {(isGenerated && dayData) && (
                <div className={cn('size-2 rounded-full absolute top-2.5 right-2.5', dayData && !dayData.operational ? 'bg-rose-500' : 'bg-green-500')}></div>
            )}
            <div className="bg-card-login absolute inset-0 z-0 -top-px -left-px pointer-events-none"></div>
            {isToday && !isMuted && (
                <div className="absolute bottom-2.5 right-2.5">
                    <span className="relative flex size-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex size-2 rounded-full bg-primary"></span>
                    </span>
                </div>
            )}
            <div className="flex gap-2">
                <Button size="icon-xs" variant="ghost" className={cn(
                    'mb-2 text-xs font-semibold rounded-lg',
                    isGenerated && dayData && !dayData.operational ? '' : 'text-muted-foreground',
                )}>
                    {day}
                </Button>
            </div>
            {isGenerated && dayData && !isMuted && (
                <div className="flex min-w-0 flex-wrap gap-1 mt-auto mb-2 ms-1">
                    {dayData.operational
                        ? <ActionShift activeShifts={activeShifts} onShiftClick={onShiftClick} />
                        : (
                            <div className="text-red-500 items-center gap-1 hidden xl:flex">
                                <Info className="size-4 min-w-4" />
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="min-w-0 text-xs leading-tight font-medium line-clamp-1">{dayData.note || 'Libur'}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>{dayData.note || 'Libur'}</TooltipContent>
                                </Tooltip>
                            </div>
                        )}
                </div>
            )}
        </div>
    )
}

function GenerateCalendarPreview({ days, totalDays, leadingDays, selectedShifts, onToggleDay }) {
    const selectedShiftLabels = selectedShifts.map(shift => shift.label).join(', ')

    return (
        <div className="space-y-2">
            <Alert>
                <InfoIcon />
                <AlertTitle className="text-sm">Shift yang akan digenerate</AlertTitle>
                <AlertDescription className="text-xs">
                    {selectedShiftLabels || 'Belum ada shift dipilih'}
                </AlertDescription>
            </Alert>
            <div className="grid grid-cols-7 gap-1">
                {DAY_NAMES.map(day => (
                    <div key={day} className="py-1 text-center text-[11px] font-medium text-muted-foreground">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
                {leadingDays.map(day => (
                    <div
                        key={`generate-previous-${day}`}
                        className="flex aspect-square items-center justify-center rounded-md text-xs text-muted-foreground/35"
                    >
                        {day}
                    </div>
                ))}
                {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => {
                    const dayData = days[day]
                    const draftState = dayData?.draftState || getDraftStateFromOperational(dayData?.operational)
                    const isOperational = draftState === DRAFT_STATES.WORK
                    const isDayOff = draftState === DRAFT_STATES.OFF
                    const isEmpty = draftState === DRAFT_STATES.EMPTY
                    const isLocked = !!dayData?.locked

                    return (
                        <button
                            key={day}
                            type="button"
                            onClick={() => onToggleDay(day)}
                            disabled={isLocked}
                            className={cn(
                                'flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-0.5 rounded-2xl border text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-55',
                                isOperational && 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300',
                                isDayOff && 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300',
                                isEmpty && 'border-border bg-background text-muted-foreground hover:bg-accent/50',
                                isLocked && 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300',
                            )}
                        >
                            <span>{day}</span>
                            <span className="hidden text-[9px] font-medium leading-none sm:block">
                                {isLocked ? 'Sudah ada' : isOperational ? 'Masuk' : isDayOff ? 'Libur' : 'Kosong'}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default function Schedule() {
    const today = new Date()
    const [rightSide, setRightSide] = useState(false)
    const [currentYear, setCurrentYear] = useState(today.getFullYear())
    const [currentMonth, setCurrentMonth] = useState(today.getMonth())
    const [selectedDay, setSelectedDay] = useState(today.getDate())
    const [isGenerated, setIsGenerated] = useState(false)
    const [days, setDays] = useState({})
    const [shifts, setShifts] = useState([])
    const [selectedShiftUuid, setSelectedShiftUuid] = useState('')
    const [selectedScheduleUuid, setSelectedScheduleUuid] = useState('')
    const [noteInput, setNoteInput] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [generateOpen, setGenerateOpen] = useState(false)
    const [draftDays, setDraftDays] = useState({})
    const [generateShiftMap, setGenerateShiftMap] = useState({})
    const [allowRegenerate, setAllowRegenerate] = useState(false)
    const [scheduleForm, setScheduleForm] = useState(DEFAULT_SCHEDULE_FORM)
    const [isSavingScheduleTime, setIsSavingScheduleTime] = useState(false)
    const [isDeletingSchedule, setIsDeletingSchedule] = useState(false)
    const [generateInfoStep, setGenerateInfoStep] = useState(0)

    const totalDays = getDaysInMonth(currentYear, currentMonth)
    const firstDayDow = getFirstDayOfMonth(currentYear, currentMonth)
    const previousMonth = getMonthOffset(currentYear, currentMonth, -1)
    const previousMonthTotalDays = getDaysInMonth(previousMonth.year, previousMonth.month)
    const calendarLeadingDays = Array.from({ length: firstDayDow }, (_, i) => previousMonthTotalDays - firstDayDow + i + 1)
    const selectedData = days[selectedDay]
    const monthDateRange = `${formatDateLong(1, currentMonth, currentYear)} - ${formatDateLong(totalDays, currentMonth, currentYear)}`
    const selectedDate = toDateString(currentYear, currentMonth, selectedDay)
    const selectedSchedule = selectedData?.schedules?.find(schedule => getScheduleUuid(schedule) === selectedScheduleUuid)
        || selectedData?.schedules?.find(schedule => getScheduleShiftUuid(schedule) === selectedShiftUuid)
    const selectedSchedules = selectedData?.schedules || []
    const generatorAdmin = selectedSchedules.find(schedule => schedule.admin)?.admin;
    console.log(generatorAdmin);
    const generatorName = generatorAdmin?.full_name || generatorAdmin?.name || '-'
    const generatorAvatar = normalizeImageUrl(
        generatorAdmin?.avatar
        || generatorAdmin?.photo
        || generatorAdmin?.photo_url
        || generatorAdmin?.profile_photo
        || generatorAdmin?.profile_photo_url
        || generatorAdmin?.image_url
    )
    const hasSelectedSchedule = !!selectedData?.schedules?.length
    const selectedShift = shifts.find(shift => shift.uuid === selectedShiftUuid)
    const activeShifts = useMemo(() => shifts.filter(shift => shift.is_active), [shifts])
    const activeShiftMap = useMemo(() => Object.fromEntries(activeShifts.map(shift => [shift.uuid, true])), [activeShifts])
    const selectedGenerateShifts = useMemo(
        () => activeShifts.filter(shift => generateShiftMap[shift.uuid]),
        [activeShifts, generateShiftMap],
    )

    const { draftOpCount, draftLibCount, draftEmptyCount } = useMemo(() => {
        let op = 0
        let lib = 0
        let empty = 0
        for (let d = 1; d <= totalDays; d++) {
            const state = draftDays[d]?.draftState || getDraftStateFromOperational(draftDays[d]?.operational)
            if (state === DRAFT_STATES.WORK) op++
            else if (state === DRAFT_STATES.OFF) lib++
            else empty++
        }
        return { draftOpCount: op, draftLibCount: lib, draftEmptyCount: empty }
    }, [draftDays, totalDays])

    const { opCount, libCount, scheduleCount } = useMemo(() => {
        if (!isGenerated) return { opCount: 0, libCount: 0, scheduleCount: 0 }

        let op = 0
        let lib = 0
        let schedules = 0

        for (let d = 1; d <= totalDays; d++) {
            if (days[d]?.operational) op++
            else lib++

            schedules += days[d]?.schedules?.length || 0
        }

        return { opCount: op, libCount: lib, scheduleCount: schedules }
    }, [days, isGenerated, totalDays])

    const generateInfo = GENERATE_INFO_STEPS[generateInfoStep]

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    const fetchMasterData = useCallback(async () => {
        const shiftResponse = await api.fetch(`${API_URL}/office/shifts?per_page=100&sort_by=start_time&sort_order=asc`)

        const nextShifts = (shiftResponse?.data || []).map(normalizeShift)

        setShifts(nextShifts)
        setSelectedShiftUuid(prev => prev || nextShifts.find(shift => shift.is_active)?.uuid || nextShifts[0]?.uuid || '')
    }, [])

    const fetchSchedules = useCallback(async ({ showLoading = false } = {}) => {
        try {
            if (showLoading) {
                setIsLoading(true)
                setDays([]);
            }
            const dateFrom = toDateString(currentYear, currentMonth, 1)
            const dateTo = toDateString(currentYear, currentMonth, totalDays)
            const response = await api.fetch(`${API_URL}/office/schedules?per_page=1000&date_from=${dateFrom}&date_to=${dateTo}`)
            await sleep(1000)
            const nextDays = buildDaysFromSchedules(response?.data || [])

            setDays(nextDays)
            setIsGenerated(Object.keys(nextDays).length > 0)
        } catch (error) {
            toast.error(error?.message || 'Gagal memuat jadwal')
        } finally {
            if (showLoading) setIsLoading(false)
        }
    }, [currentMonth, currentYear, totalDays])

    useEffect(() => {
        fetchMasterData()
    }, [fetchMasterData])

    useEffect(() => {
        fetchSchedules({ showLoading: true })
    }, [fetchSchedules])

    useEffect(() => {
        setGenerateShiftMap(prev => {
            const next = {}

            activeShifts.forEach(shift => {
                next[shift.uuid] = prev[shift.uuid] ?? true
            })

            return next
        })
    }, [activeShifts])

    useEffect(() => {
        setNoteInput(days[selectedDay]?.note || '')
    }, [days, selectedDay])

    useEffect(() => {
        const firstSchedule = selectedData?.schedules?.find(schedule => !schedule.is_day_off)
            || selectedData?.schedules?.[0]
        const scheduleUuid = getScheduleUuid(firstSchedule)
        const shiftUuid = getScheduleShiftUuid(firstSchedule)

        if (scheduleUuid) {
            setSelectedScheduleUuid(scheduleUuid)
        } else {
            setSelectedScheduleUuid('')
        }

        if (shiftUuid) {
            setSelectedShiftUuid(shiftUuid)
        }
    }, [selectedData])

    useEffect(() => {
        setScheduleForm(getScheduleTimeForm(selectedSchedule, selectedShift))
    }, [selectedSchedule, selectedShift])

    function changeMonth(dir) {
        let m = currentMonth + dir
        let y = currentYear
        if (m < 0) { m = 11; y-- }
        if (m > 11) { m = 0; y++ }
        setCurrentMonth(m)
        setCurrentYear(y)
        setSelectedDay(1)
        setNoteInput('')
    }

    function goToToday() {
        setCurrentYear(today.getFullYear())
        setCurrentMonth(today.getMonth())
        setSelectedDay(today.getDate())
    }

    function openGenerateDialog() {
        setAllowRegenerate(false)
        setGenerateShiftMap(Object.fromEntries(activeShifts.map(shift => [shift.uuid, true])))
        setDraftDays(buildDraftDays(currentYear, currentMonth, activeShifts, days, false))
        setGenerateOpen(true)
    }

    function toggleDraftOperational(day) {
        setDraftDays(prev => {
            const currentDay = prev[day] ?? {
                operational: true,
                shifts: activeShiftMap,
                schedules: [],
                note: '',
            }
            if (currentDay.locked) return prev

            const currentState = currentDay.draftState || getDraftStateFromOperational(currentDay.operational)
            const nextState = currentState === DRAFT_STATES.WORK
                ? DRAFT_STATES.OFF
                : currentState === DRAFT_STATES.OFF
                    ? DRAFT_STATES.EMPTY
                    : DRAFT_STATES.WORK
            const nextOperational = nextState === DRAFT_STATES.EMPTY
                ? null
                : nextState === DRAFT_STATES.WORK

            return {
                ...prev,
                [day]: {
                    ...currentDay,
                    operational: nextOperational,
                    shifts: nextOperational ? activeShiftMap : {},
                    draftState: nextState,
                    note: nextOperational === false ? currentDay.note || 'Libur' : '',
                },
            }
        })
    }

    function toggleGenerateShift(shiftUuid, checked) {
        setGenerateShiftMap(prev => ({ ...prev, [shiftUuid]: !!checked }))
    }

    function toggleAllowRegenerate(checked) {
        setAllowRegenerate(checked)
        setDraftDays(buildDraftDays(currentYear, currentMonth, activeShifts, days, checked))
    }

    function changeGenerateInfoStep(dir) {
        setGenerateInfoStep(prev => (prev + dir + GENERATE_INFO_STEPS.length) % GENERATE_INFO_STEPS.length)
    }

    async function handleGenerate() {
        if (!selectedGenerateShifts.length) {
            toast.error('Pilih minimal satu shift terlebih dahulu')
            return
        }

        const schedules = []
        const defaultDays = buildInitialDays(currentYear, currentMonth, activeShifts)

        for (let day = 1; day <= totalDays; day++) {
            const dayData = draftDays[day] || defaultDays[day]
            const date = toDateString(currentYear, currentMonth, day)

            if (dayData?.draftState === DRAFT_STATES.EMPTY || dayData?.operational === null) {
                continue
            }

            if (dayData?.operational) {
                selectedGenerateShifts.forEach(shift => {
                    schedules.push({
                        date,
                        shift_uuid: shift.uuid,
                        is_day_off: false,
                        ...getSchedulePayloadTime(getScheduleTimeForm(null, shift)),
                    })
                })
            } else {
                selectedGenerateShifts.forEach(shift => {
                    schedules.push({
                        date,
                        shift_uuid: shift.uuid,
                        is_day_off: true,
                        ...getSchedulePayloadTime(getScheduleTimeForm(null, shift)),
                    })
                })
            }
        }

        if (!schedules.length) {
            toast.error('Pilih minimal satu tanggal untuk digenerate')
            return
        }

        try {
            setIsGenerating(true)
            const response = await api.fetch(`${API_URL}/office/schedule-batches`, {
                method: 'POST',
                body: JSON.stringify({
                    name: `Jadwal ${MONTH_NAMES[currentMonth]} ${currentYear}`,
                    period_start: toDateString(currentYear, currentMonth, 1),
                    period_end: toDateString(currentYear, currentMonth, totalDays),
                    schedules,
                }),
            })

            if (response?.success) {
                toast.success(response?.message || 'Jadwal berhasil dibuat')
                setGenerateOpen(false)
                await fetchSchedules()
            } else {
                toast.error(response?.message || 'Gagal membuat jadwal')
            }
        } catch (error) {
            toast.error(error?.message || 'Terjadi kesalahan saat generate jadwal')
        } finally {
            setIsGenerating(false)
        }
    }

    function applySchedulesForSelectedDay(nextSchedules) {
        const nextOperational = nextSchedules.some(schedule => !schedule.is_day_off)
        const nextShiftMap = Object.fromEntries(
            nextSchedules
                .filter(schedule => !schedule.is_day_off && getScheduleShiftUuid(schedule))
                .map(schedule => [getScheduleShiftUuid(schedule), true])
        )

        setDays(prev => ({
            ...prev,
            [selectedDay]: {
                ...prev[selectedDay],
                operational: nextOperational,
                shifts: nextShiftMap,
                schedules: nextSchedules,
                note: nextOperational ? '' : prev[selectedDay]?.note || 'Libur',
            },
        }))
    }

    async function persistScheduleDayOff(schedule, isDayOff) {
        const scheduleUuid = getScheduleUuid(schedule)
        const shiftUuid = getScheduleShiftUuid(schedule)

        if (!scheduleUuid || !shiftUuid) {
            throw new Error('Data schedule tidak lengkap')
        }

        const shift = shifts.find(item => item.uuid === shiftUuid) || schedule.shift || {}
        const timeForm = getScheduleTimeForm(schedule, shift)

        return api.fetch(`${API_URL}/office/schedules/${scheduleUuid}`, {
            method: 'PUT',
            body: JSON.stringify({
                date: selectedDate,
                shift_uuid: shiftUuid,
                is_day_off: isDayOff,
                ...getSchedulePayloadTime(timeForm),
            }),
        })
    }

    async function toggleOperational() {
        if (!hasSelectedSchedule) return

        const nextOperational = !selectedData?.operational
        const nextSchedules = selectedSchedules.map(schedule => ({
            ...schedule,
            is_day_off: !nextOperational,
        }))

        try {
            setIsSaving(true)
            const responses = await Promise.all(nextSchedules.map(schedule => persistScheduleDayOff(schedule, schedule.is_day_off)))

            if (responses.every(response => response?.success)) {
                applySchedulesForSelectedDay(nextSchedules)
                toast.success(nextOperational ? 'Semua shift diaktifkan' : 'Semua shift diliburkan')
            } else {
                toast.error(responses.find(response => !response?.success)?.message || 'Gagal memperbarui status hari')
            }
        } catch (error) {
            toast.error(error?.message || 'Terjadi kesalahan saat memperbarui status hari')
        } finally {
            setIsSaving(false)
        }
    }

    async function toggleScheduleOperational(scheduleUuid, checked) {
        if (!hasSelectedSchedule) return

        const selectedScheduleItem = selectedSchedules.find(schedule => getScheduleUuid(schedule) === scheduleUuid)
        if (!selectedScheduleItem) return

        const nextSchedules = selectedSchedules.map(schedule => (
            getScheduleUuid(schedule) === scheduleUuid
                ? { ...schedule, is_day_off: !checked }
                : schedule
        ))
        const nextSchedule = nextSchedules.find(schedule => getScheduleUuid(schedule) === scheduleUuid)

        try {
            setIsSaving(true)
            const response = await persistScheduleDayOff(nextSchedule, nextSchedule.is_day_off)

            if (response?.success) {
                applySchedulesForSelectedDay(nextSchedules)
                toast.success(checked ? 'Shift diaktifkan' : 'Shift diliburkan')
            } else {
                toast.error(response?.message || 'Gagal memperbarui status shift')
            }
        } catch (error) {
            toast.error(error?.message || 'Terjadi kesalahan saat memperbarui status shift')
        } finally {
            setIsSaving(false)
        }
    }

    function selectShiftForEdit(shift) {
        setSelectedShiftUuid(shift.uuid)
        setSelectedScheduleUuid(shift.scheduleUuid || '')
        setRightSide(false)
    }

    function selectShiftFromForm(shiftUuid) {
        const schedule = selectedData?.schedules?.find(item => getScheduleShiftUuid(item) === shiftUuid)

        setSelectedShiftUuid(shiftUuid)
        setSelectedScheduleUuid(getScheduleUuid(schedule) || '')
    }

    function selectDay(day) {
        setSelectedDay(day)
        setNoteInput(days[day]?.note || '')
    }

    async function handleSave() {
        if (!selectedShiftUuid) {
            toast.error('Pilih shift terlebih dahulu')
            return
        }

        const isDayOff = !selectedData?.operational

        try {
            setIsSaving(true)

            const schedulesToUpdate = selectedData?.schedules?.length
                ? selectedData.schedules
                : []

            const responses = schedulesToUpdate.length
                ? await Promise.all(schedulesToUpdate.map(schedule => {
                    const shiftUuid = getScheduleShiftUuid(schedule)
                    const shift = shifts.find(item => item.uuid === shiftUuid) || schedule.shift || {}
                    const timeForm = getScheduleTimeForm(schedule, shift)

                    return api.fetch(`${API_URL}/office/schedules/${schedule.uuid}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            date: selectedDate,
                            shift_uuid: shiftUuid,
                            is_day_off: !!schedule.is_day_off,
                            ...getSchedulePayloadTime(timeForm),
                        }),
                    })
                }))
                : [await api.fetch(`${API_URL}/office/schedules`, {
                    method: 'POST',
                    body: JSON.stringify({
                        date: selectedDate,
                        shift_uuid: selectedShiftUuid,
                        is_day_off: isDayOff,
                        ...getSchedulePayloadTime(scheduleForm),
                    }),
                })]

            if (responses.every(response => response?.success)) {
                toast.success(responses[0]?.message || 'Jadwal berhasil disimpan')
                if (isDayOff) {
                    setDays(prev => ({ ...prev, [selectedDay]: { ...prev[selectedDay], note: noteInput || 'Libur' } }))
                }
                await fetchSchedules()
            } else {
                toast.error(responses.find(response => !response?.success)?.message || 'Gagal menyimpan jadwal')
            }
        } catch (error) {
            toast.error(error?.message || 'Terjadi kesalahan saat menyimpan jadwal')
        } finally {
            setIsSaving(false)
        }
    }

    async function handleSaveScheduleTime() {
        if (!selectedSchedule?.uuid) {
            toast.error('Pilih schedule yang sudah tersimpan terlebih dahulu')
            return
        }

        const isDayOff = !selectedData?.operational
        const endpoint = `${API_URL}/office/schedules/${selectedSchedule.uuid}`

        try {
            setIsSavingScheduleTime(true)
            const response = await api.fetch(endpoint, {
                method: 'PUT',
                body: JSON.stringify({
                    date: selectedDate,
                    shift_uuid: selectedShiftUuid,
                    is_day_off: isDayOff,
                    ...getSchedulePayloadTime(scheduleForm),
                }),
            })

            if (response?.success) {
                toast.success(response?.message || 'Jam schedule berhasil diperbarui')
                await fetchSchedules()
            } else {
                toast.error(response?.message || 'Gagal memperbarui jam schedule')
            }
        } catch (error) {
            toast.error(error?.message || 'Terjadi kesalahan saat memperbarui jam schedule')
        } finally {
            setIsSavingScheduleTime(false)
        }
    }

    async function handleDeleteSchedule() {
        if (!selectedSchedule?.uuid) {
            toast.error('Schedule belum tersimpan')
            return
        }

        try {
            setIsDeletingSchedule(true)
            const response = await api.fetch(`${API_URL}/office/schedules/${selectedSchedule.uuid}`, {
                method: 'DELETE',
            })

            if (response?.success) {
                toast.success(response?.message || 'Schedule berhasil dihapus')
                await fetchSchedules()
            } else {
                toast.error(response?.message || 'Gagal menghapus schedule')
            }
        } catch (error) {
            toast.error(error?.message || 'Terjadi kesalahan saat menghapus schedule')
        } finally {
            setIsDeletingSchedule(false)
        }
    }

    const isToday = (day) =>
        day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()

    const sortedShifts = [...activeShifts].sort((a, b) => getShiftSortValue(a) - getShiftSortValue(b));

    return (
        <LayoutContainer>
            <div className="max-w-full mx-auto w-full space-y-4 mb-10">
                <div className="block relative overflow-hidden">
                    <div className={cn('transition-[padding] xl:me-5 duration-500', rightSide ? 'xl:pe-0' : 'xl:pe-80')}>
                        <div className="max-w-7xl mx-auto flex flex-col gap-5">
                            <div className="flex flex-col gap-0">
                                <PageTitle title="Jadwal" subtitle="Manajemen jadwal operasional bulanan" />

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                    <div className="flex gap-3 items-center">
                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-xl font-semibold font-poppins leading-none">
                                                {MONTH_NAMES[currentMonth]} {currentYear}
                                            </h3>
                                            <p className="text-xs font-medium text-muted-foreground">{monthDateRange}</p>
                                        </div>
                                    </div>

                                    <div className="flex w-full items-center gap-2 sm:w-auto sm:justify-end">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="outline" size="icon-sm" onClick={() => changeMonth(-1)}>
                                                    <ChevronLeft />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent><p>Bulan Sebelumnya</p></TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="outline" size="sm" onClick={goToToday}>
                                                    <span>Today</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent><p>Hari ini</p></TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="outline" size="icon-sm" onClick={() => changeMonth(1)}>
                                                    <ChevronRight />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent><p>Bulan Selanjutnya</p></TooltipContent>
                                        </Tooltip>

                                        <Separator orientation="vertical" className="w-1 !h-5" />
                                        <Button
                                            size="sm"
                                            onClick={openGenerateDialog}
                                            disabled={isGenerating || isLoading}
                                            className="flex-1 gap-1.5 sm:flex-none"
                                        >
                                            {isGenerating
                                                ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                                : <Zap className="w-3.5 h-3.5" />
                                            }
                                            {isGenerating ? 'Generating...' : 'Generate'}
                                        </Button>
                                        <Button
                                            size="icon-sm"
                                            variant="outline"
                                            className="gap-1.5 hidden xl:flex"
                                            onClick={() => setRightSide(!rightSide)}
                                        >
                                            <PanelRight />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                <StatCard
                                    icon={CalendarDays}
                                    label="Hari Masuk"
                                    value={isGenerated ? opCount : '-'}
                                    sub="hari operasional bulan ini"
                                    accent="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                />
                                <StatCard
                                    icon={CalendarDays}
                                    label="Hari Libur"
                                    value={isGenerated ? libCount : '-'}
                                    sub="berdasarkan jadwal tersimpan"
                                    accent="bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300"
                                />
                                <StatCard
                                    icon={Clock}
                                    label="Shift Aktif"
                                    value={activeShifts.length}
                                    sub={activeShifts.length ? activeShifts.map(shift => shift.label).slice(0, 3).join(' - ') : 'belum ada shift aktif'}
                                    accent="bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                                />
                                <StatCard
                                    icon={Users}
                                    label="Total Jadwal"
                                    value={scheduleCount}
                                    sub="record operasional tersimpan"
                                    accent="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                />
                            </div>

                            <Alert className="pr-24">
                                <Info />
                                <AlertTitle>{generateInfo.title}</AlertTitle>
                                <AlertDescription className="text-xs">
                                    {generateInfo.description}
                                </AlertDescription>
                                <AlertAction className="flex items-center gap-1">
                                    <span className="me-1 text-[11px] font-medium text-muted-foreground">
                                        {generateInfoStep + 1}/{GENERATE_INFO_STEPS.length}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={() => changeGenerateInfoStep(-1)}
                                    >
                                        <ChevronLeft />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={() => changeGenerateInfoStep(1)}
                                    >
                                        <ChevronRight />
                                    </Button>
                                </AlertAction>
                            </Alert>

                            <div className="min-w-0 flex-1">
                                <div className="overflow-x-auto p-2">
                                    <div className="min-w-[600px]">
                                        <div className="grid grid-cols-7 gap-1.5 mb-1">
                                            {DAY_NAMES.map(day => (
                                                <div key={day} className="text-center text-xs text-muted-foreground py-1 font-medium">{day}</div>
                                            ))}
                                        </div>

                                        <div>
                                            <div className="grid grid-cols-7 gap-2">
                                                {calendarLeadingDays.map(day => (
                                                    <CalendarCell
                                                        key={`previous-${day}`}
                                                        day={day}
                                                        isMuted
                                                        isGenerated={false}
                                                    />
                                                ))}
                                                {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => (
                                                    <CalendarCell
                                                        key={day}
                                                        day={day}
                                                        dayData={days[day]}
                                                        shifts={shifts}
                                                        isSelected={day === selectedDay}
                                                        isGenerated={isGenerated}
                                                        isToday={isToday(day)}
                                                        isLoading={isLoading}
                                                        onClick={() => selectDay(day)}
                                                        onShiftClick={selectShiftForEdit}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={cn('mt-4 w-full transition-transform space-y-5 duration-500 xl:absolute xl:right-0 xl:top-0 xl:mt-0 xl:w-80', rightSide ? 'xl:translate-x-80' : 'xl:translate-x-0')}>

                        {/* Card 1: Jadwal Harian */}
                        <Card className="rounded-2xl shadow-none relative overflow-hidden">
                            <div className="bg-card-login absolute inset-0 z-0 -top-px -left-px pointer-events-none"></div>
                            <CardHeader className="gap-1">
                                <CardTitle className="text-sm font-semibold">Status Jadwal Harian</CardTitle>
                                <CardDescription className="text-xs">
                                    Atur status operasional setiap shift pada tanggal terpilih.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex items-start backdrop-blur-xs justify-between gap-3 rounded-xl border bg-muted/20 pe-3 ps-3.5 py-3">
                                    <div className="min-w-0">
                                        <Label className="text-xs text-muted-foreground">Tanggal</Label>
                                        <h2 className="mt-1 text-xl font-semibold leading-tight">{selectedDay} {MONTH_NAMES[currentMonth]} {currentYear}</h2>
                                    </div>
                                    <Badge variant={selectedData?.operational ? 'success' : 'danger'} className="shrink-0">
                                        {selectedData?.operational ? 'Operasional' : 'Libur'}
                                    </Badge>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground font-medium">Generate Oleh</Label>
                                    <div className='flex items-center justify-start gap-2 px-2 py-1 transition-colors'>
                                        <Avatar className="size-7">
                                            {generatorAvatar && (
                                                <AvatarImage src={generatorAvatar} alt={generatorName} />
                                            )}
                                            <AvatarFallback className="text-xs">{getInitials(generatorName)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs font-medium truncate">{generatorName}</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground font-medium">Status Hari</Label>
                                    <div
                                        className={cn(
                                            'flex items-center justify-between rounded-lg px-3 border py-2 transition-colors',
                                            hasSelectedSchedule && !isSaving ? 'cursor-pointer hover:bg-accent/50' : 'cursor-not-allowed opacity-60',
                                        )}
                                        onClick={hasSelectedSchedule && !isSaving ? toggleOperational : undefined}
                                    >
                                        <span className="text-sm font-medium">{selectedData?.operational ? 'Operasional' : 'Hari Libur'}</span>
                                        <Switch
                                            checked={!!selectedData?.operational}
                                            disabled={!hasSelectedSchedule || isSaving}
                                            onCheckedChange={hasSelectedSchedule && !isSaving ? toggleOperational : undefined}
                                            className="pointer-events-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground font-medium">Operasional Shift</Label>
                                    <div className="overflow-hidden rounded-xl border">
                                        {isLoading ? (
                                            <div className="px-3 py-3 text-xs text-muted-foreground flex items-center gap-2 justify-center">
                                                <Spinner />
                                                <span>Memuat data..</span>
                                            </div>
                                        ) : sortedShifts.length ? sortedShifts.map((shift, index) => {
                                            const shiftUuid = shift.uuid
                                            const schedule = selectedSchedules.find(item => getScheduleShiftUuid(item) === shiftUuid)
                                            const timeForm = getScheduleTimeForm(schedule, shift)
                                            const isScheduleOperational = schedule ? !schedule.is_day_off : false
                                            const scheduleUuid = getScheduleUuid(schedule);
                                            const color = COLORS[index % COLORS.length]
                                            return (
                                                <div
                                                    key={scheduleUuid || `${shiftUuid}-${index}`}
                                                    className={cn(
                                                        'flex items-center justify-between gap-3 border-b border-dashed pe-3 ps-3.5 py-2.5 last:border-b-0 transition-colors',
                                                        scheduleUuid && !isSaving ? 'cursor-pointer hover:bg-accent/50' : 'cursor-not-allowed opacity-60',
                                                    )}
                                                    onClick={() => scheduleUuid && !isSaving && toggleScheduleOperational(scheduleUuid, !isScheduleOperational)}
                                                >
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <div className='size-2 rounded-full' style={{ backgroundColor: color }}></div>
                                                            <span className="min-w-0 truncate text-sm font-medium">{shift.label || shift.name || `Shift ${index + 1}`}</span>
                                                            <Badge variant={isScheduleOperational ? 'success' : 'danger'} className="px-1.5 py-0 text-[10px]">
                                                                {isScheduleOperational ? 'Masuk' : 'Libur'}
                                                            </Badge>
                                                        </div>
                                                        <p className="mt-0.5 text-xs text-muted-foreground font-geist">{timeForm.start_time}&nbsp;&nbsp;-&nbsp;&nbsp;{timeForm.end_time}</p>
                                                    </div>
                                                    <Switch
                                                        checked={isScheduleOperational}
                                                        disabled={!scheduleUuid || isSaving}
                                                        onCheckedChange={(checked) => scheduleUuid && toggleScheduleOperational(scheduleUuid, checked)}
                                                        className="pointer-events-none"
                                                    />
                                                </div>
                                            )
                                        }) : (
                                            <div className="px-4 py-4 text-xs text-muted-foreground">
                                                Belum ada shift pada tanggal ini.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {!selectedData?.operational && (
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground font-medium">Keterangan</Label>
                                        <Textarea
                                            disabled={selectedData?.operational}
                                            value={noteInput}
                                            onChange={event => setNoteInput(event.target.value)}
                                            placeholder="Nama hari libur..."
                                            className="min-h-20 text-xs"
                                        />
                                    </div>
                                )}


                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    disabled={isSaving || isLoading || !hasSelectedSchedule}
                                >
                                    {isSaving
                                        ? <Spinner />
                                        : <Save />
                                    }
                                    {isSaving ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Card 2: Jam Schedule */}
                        <Card className="rounded-2xl shadow-none overflow-hidden relative">
                            <div className="bg-card-login absolute inset-0 z-0 -top-px -left-px pointer-events-none"></div>
                            <CardHeader className="gap-1">
                                <CardTitle className="text-sm font-semibold">Jam Schedule</CardTitle>
                                <CardDescription className="text-xs">
                                    Mengubah jam di sini akan memperbarui schedule tanggal terpilih.
                                </CardDescription>
                            </CardHeader>

                            {/* View toggle */}
                            <div className="bg-muted/60 z-[1] p-0.5 mx-5 flex rounded-lg border border-border/50 w-fit max-w-full overflow-x-auto scrollbar-none">
                                <div className="flex gap-0.5">
                                    {sortedShifts.map(shift => {
                                        return (
                                            <Tooltip key={shift.uuid}>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => selectShiftFromForm(shift.uuid)}
                                                        className={cn(
                                                            "rounded-md shrink-0 relative border border-transparent group",
                                                            selectedShiftUuid === shift.uuid && "bg-background border border-border"
                                                        )}
                                                    >
                                                        <span>{shift.label}</span>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>{shift.label} - {shift.sublabel}</TooltipContent>
                                            </Tooltip>
                                        )
                                    })}
                                </div>
                            </div>

                            <CardContent className="flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground font-medium">Jam Masuk</Label>
                                        <Input
                                            type="time"
                                            value={scheduleForm.start_time}
                                            onChange={event => setScheduleForm(prev => ({ ...prev, start_time: event.target.value }))}

                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground font-medium">Jam Keluar</Label>
                                        <Input
                                            type="time"
                                            value={scheduleForm.end_time}
                                            onChange={event => setScheduleForm(prev => ({ ...prev, end_time: event.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground font-medium">Toleransi Terlambat</Label>
                                    <InputGroup>
                                        <InputGroupInput
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={scheduleForm.late_tolerance_minutes}
                                            onChange={event => setScheduleForm(prev => ({
                                                ...prev,
                                                late_tolerance_minutes: event.target.value.replace(/\D/g, ''),
                                            }))}
                                        />
                                        <InputGroupAddon align="inline-end">
                                            <InputGroupText>menit</InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>

                                <div
                                    className="flex items-center justify-between px-3 py-2 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors"
                                    onClick={() => setScheduleForm(prev => ({ ...prev, cross_day: !prev.cross_day }))}
                                >
                                    <span className="text-sm">Lintas Hari</span>
                                    <Switch checked={!!scheduleForm.cross_day} onCheckedChange={(checked) => setScheduleForm(prev => ({ ...prev, cross_day: checked }))} className="pointer-events-none" />
                                </div>

                            </CardContent>
                            <CardFooter className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <Button
                                    variant="outline"
                                    className="w-full gap-1.5"
                                    size="sm"
                                    onClick={handleSaveScheduleTime}
                                    disabled={isSavingScheduleTime || !selectedSchedule?.uuid}
                                >
                                    {isSavingScheduleTime
                                        ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        : <Save className="w-3.5 h-3.5" />
                                    }
                                    {isSavingScheduleTime ? 'Menyimpan...' : 'Simpan'}
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            className="w-full gap-1.5"
                                            size="sm"
                                            disabled={isDeletingSchedule || !selectedSchedule?.uuid}
                                        >
                                            {isDeletingSchedule
                                                ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                                : <Trash2 className="w-3.5 h-3.5" />
                                            }
                                            {isDeletingSchedule ? 'Menghapus...' : 'Hapus'}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Hapus schedule?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Schedule untuk tanggal {selectedDay} {MONTH_NAMES[currentMonth]} {currentYear} akan dihapus permanen.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-destructive text-white hover:bg-destructive/90"
                                                onClick={handleDeleteSchedule}
                                            >
                                                Hapus
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardFooter>
                        </Card>

                    </div>
                </div>

                <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Generate Jadwal</DialogTitle>
                            <DialogDescription className="text-xs">
                                Pilih shift dan klik tanggal untuk mengatur Masuk, Libur, atau Kosong.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between gap-3 pb-2 border-dashed">
                                <div>
                                    <p className="text-lg font-semibold">{MONTH_NAMES[currentMonth]} {currentYear}</p>
                                    <p className="text-xs text-muted-foreground">{monthDateRange}</p>
                                </div>
                                <div className="flex shrink-0 gap-2">
                                    <Badge variant="success">{draftOpCount} Masuk</Badge>
                                    <Badge variant="danger">{draftLibCount} Libur</Badge>
                                    <Badge variant="outline">{draftEmptyCount} Kosong</Badge>
                                </div>
                            </div>

                            <div className="space-y-3 rounded-lg border bg-muted/20 p-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold">Generate ulang</p>
                                        <p className="text-[11px] text-muted-foreground">Aktifkan untuk memilih ulang tanggal yang sudah punya jadwal.</p>
                                    </div>
                                    <Switch checked={allowRegenerate} onCheckedChange={toggleAllowRegenerate} />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-medium">Shift Digenerate</Label>
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        {activeShifts.map(shift => (
                                            <label
                                                key={shift.uuid}
                                                className="flex cursor-pointer items-center gap-2 rounded-lg border bg-background px-3 py-2 text-xs transition-colors hover:bg-accent/50"
                                            >
                                                <Checkbox
                                                    checked={!!generateShiftMap[shift.uuid]}
                                                    onCheckedChange={(checked) => toggleGenerateShift(shift.uuid, checked)}
                                                />
                                                <span className="min-w-0 truncate font-medium">{shift.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <GenerateCalendarPreview
                                days={draftDays}
                                totalDays={totalDays}
                                leadingDays={calendarLeadingDays}
                                selectedShifts={selectedGenerateShifts}
                                onToggleDay={toggleDraftOperational}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setGenerateOpen(false)}>
                                Batal
                            </Button>
                            <Button type="button" onClick={handleGenerate} disabled={isGenerating} className="gap-1.5">
                                {isGenerating
                                    ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    : <Zap className="w-3.5 h-3.5" />
                                }
                                {isGenerating ? 'Generating...' : 'Generate Jadwal'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </LayoutContainer>
    )
}
