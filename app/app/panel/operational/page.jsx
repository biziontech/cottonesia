"use client"

import { useState, useEffect, useCallback } from 'react'
import PageTitle from '@/components/partials/PageTitle'
import LayoutContainer from '@/components/partials/LayoutContainer'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
    Drawer, DrawerClose, DrawerContent,
    DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle,
} from "@/components/ui/drawer"
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    ChevronLeft, ChevronRight, Clock, Sparkles, Calendar,
    Briefcase, CalendarOff, Info, Pencil, Trash2, RotateCcw,
    Users, XCircle, UserCheck, Clock as ClockIcon, Plus,
    Grid2x2,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import api from '@/lib/api'
import {
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    addDays, isSameMonth, addMonths, subMonths, getDay,
    parseISO, isToday, getDaysInMonth,
} from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const WORKING_DAY_OPTIONS = [
    { value: '1', label: 'Hari Kerja' },
    { value: '2', label: 'Sabtu' },
    { value: '3', label: 'Minggu' },
    { value: '4', label: 'Libur Nasional' },
    { value: '5', label: 'Cuti Bersama' },
]

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getCalendarDays(currentDate) {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
    const days = []
    let day = calStart
    while (day <= calEnd) { days.push(day); day = addDays(day, 1) }
    return days
}

function isWeekend(date) {
    const dow = getDay(date)
    return dow === 0 || dow === 6
}

function defaultWorkingDay(date) {
    const dow = getDay(date)
    if (dow === 0) return '3'
    if (dow === 6) return '2'
    return '1'
}

function getInitials(name = '') {
    return name.split(' ').slice(0, 2).map(n => n[0] ?? '').join('').toUpperCase() || '?'
}

// ─── Generate Dialog ───────────────────────────────────────────────────────────

const GenerateDialog = ({ open, onClose, onSuccess, existingDates }) => {
    const [targetDate, setTargetDate] = useState(() => format(addMonths(new Date(), 1), 'yyyy-MM'))
    const [defaultStartTime, setDefaultStartTime] = useState('08:00')
    const [defaultEndTime, setDefaultEndTime] = useState('17:00')
    const [weekendOff, setWeekendOff] = useState(true)
    const [loading, setLoading] = useState(false)

    const [year, month] = targetDate.split('-').map(Number)
    const total = targetDate ? getDaysInMonth(new Date(year, month - 1)) : 0
    const skipped = [...Array(total)].filter((_, i) => {
        const d = new Date(year, month - 1, i + 1)
        return isWeekend(d) && weekendOff
    }).length
    const alreadyExist = [...Array(total)].filter((_, i) => {
        const d = new Date(year, month - 1, i + 1)
        return existingDates.has(format(d, 'yyyy-MM-dd'))
    }).length
    const willCreate = Math.max(0, total - skipped - alreadyExist)

    const handleGenerate = async () => {
        setLoading(true)
        try {
            const promises = []
            for (let d = 1; d <= total; d++) {
                const date = new Date(year, month - 1, d)
                const dateStr = format(date, 'yyyy-MM-dd')
                if (existingDates.has(dateStr)) continue
                const wknd = isWeekend(date)
                const isOp = weekendOff ? !wknd : true
                promises.push(
                    api.fetch(`${API_URL}/office/operational-days`, {
                        method: 'POST',
                        body: JSON.stringify({
                            date: dateStr,
                            is_operational: isOp,
                            should_generate: true,
                            start_time: isOp ? defaultStartTime : null,
                            end_time: isOp ? defaultEndTime : null,
                            working_day: defaultWorkingDay(date),
                            notes: null,
                        }),
                    }).catch(() => null)
                )
            }
            await Promise.all(promises)
            toast.success(`Berhasil generate ${willCreate} hari operasional!`)
            onSuccess()
            onClose()
        } catch {
            toast.error('Gagal generate operasional.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base">
                        <Sparkles className="size-4 text-primary" />
                        Generate Operasional Bulanan
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Buat otomatis jadwal operasional untuk satu bulan penuh.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-1">
                    <div className="space-y-1.5">
                        <Label className="text-sm">Bulan Target</Label>
                        <Input type="month" value={targetDate} onChange={e => setTargetDate(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-sm">Jam Masuk</Label>
                            <Input type="time" value={defaultStartTime} onChange={e => setDefaultStartTime(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm">Jam Pulang</Label>
                            <Input type="time" value={defaultEndTime} onChange={e => setDefaultEndTime(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                        <div>
                            <p className="text-sm font-medium">Sabtu & Minggu Libur</p>
                            <p className="text-[11px] text-muted-foreground">Weekend otomatis jadi hari libur</p>
                        </div>
                        <Switch checked={weekendOff} onCheckedChange={setWeekendOff} />
                    </div>
                    <div className="p-3 rounded-lg bg-muted/40 border border-dashed border-border space-y-1.5 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Total hari</span>
                            <span className="font-medium text-foreground">{total} hari</span>
                        </div>
                        {weekendOff && (
                            <div className="flex justify-between text-muted-foreground">
                                <span>Weekend dilewati</span>
                                <span className="text-red-500">-{skipped} hari</span>
                            </div>
                        )}
                        {alreadyExist > 0 && (
                            <div className="flex justify-between text-muted-foreground">
                                <span>Sudah ada</span>
                                <span className="text-amber-500">-{alreadyExist} hari</span>
                            </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-semibold">
                            <span>Akan dibuat</span>
                            <span className="text-emerald-600">{willCreate} hari</span>
                        </div>
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
                    <Button onClick={handleGenerate} disabled={loading || willCreate <= 0}>
                        {loading
                            ? <><Spinner className="size-3.5" /> Generating...</>
                            : <><Sparkles className="size-3.5" /> Generate</>}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ─── Attendance Modal ──────────────────────────────────────────────────────────

const AttendanceModal = ({ open, onClose, date }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!open || !date) return
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData([])
        setLoading(true)
        api.fetch(`${API_URL}/office/attendances?date=${date}&per_page=100`, { method: 'GET' })
            .then(res => {
                if (res?.success) setData(res.data?.data || res.data || [])
                else setData([])
            })
            .catch(() => setData([]))
            .finally(() => setLoading(false))
    }, [open, date])

    const present = data.filter(a => a.check_in)
    const absent = data.filter(a => !a.check_in)

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base">
                        <Users className="size-4 text-primary" />
                        Kehadiran Karyawan
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        {date ? (() => { try { return format(parseISO(date), 'EEEE, d MMMM yyyy', { locale: idLocale }) } catch { return date } })() : ''}
                    </DialogDescription>
                </DialogHeader>
                {loading ? (
                    <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground text-sm">
                        <Spinner className="size-4" /> Memuat data kehadiran...
                    </div>
                ) : data.length === 0 ? (
                    <div className="text-center py-10 text-sm text-muted-foreground">
                        <Users className="size-8 mx-auto mb-2 opacity-30" />
                        <p>Belum ada data kehadiran</p>
                        <p className="text-xs mt-1 opacity-60">untuk tanggal ini</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                                <UserCheck className="size-4 text-emerald-600 shrink-0" />
                                <div>
                                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400">Hadir</p>
                                    <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400 leading-none">{present.length}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
                                <XCircle className="size-4 text-red-500 shrink-0" />
                                <div>
                                    <p className="text-[10px] text-red-600 dark:text-red-400">Tidak Hadir</p>
                                    <p className="text-xl font-bold text-red-600 dark:text-red-400 leading-none">{absent.length}</p>
                                </div>
                            </div>
                        </div>
                        <ScrollArea className="max-h-64">
                            <div className="space-y-0.5 pr-2">
                                {data.map((att, i) => (
                                    <div key={att.uuid || i}
                                        className="flex items-center gap-2.5 p-2 rounded-md hover:bg-muted/50 transition-colors">
                                        <div className={cn(
                                            "size-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0",
                                            att.check_in
                                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                                                : "bg-muted text-muted-foreground"
                                        )}>
                                            {getInitials(att.employee?.name || att.name || '')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{att.employee?.name || att.name || '—'}</p>
                                            <p className="text-[10px] text-muted-foreground truncate">{att.employee?.position || att.position || ''}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            {att.check_in ? (
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 justify-end">
                                                        <ClockIcon className="size-2.5" />
                                                        <span>{att.check_in?.slice(0, 5)}</span>
                                                    </div>
                                                    {att.check_out && (
                                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground justify-end">
                                                            <ClockIcon className="size-2.5" />
                                                            <span>{att.check_out?.slice(0, 5)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 text-red-500 border-red-200 dark:border-red-800">
                                                    Absen
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" size="sm" onClick={onClose}>Tutup</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ─── Day Edit Drawer ───────────────────────────────────────────────────────────

const DayDrawer = ({ open, onClose, selectedDate, existingDay, onSuccess }) => {
    const isEdit = !!existingDay
    const [form, setForm] = useState({
        is_operational: true,
        should_generate: true,
        start_time: '08:00',
        end_time: '17:00',
        working_day: '1',
        notes: '',
    })
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)

    useEffect(() => {
        if (!open) return
        setConfirmDelete(false)
        if (existingDay) {
            setForm({
                is_operational: existingDay.is_operational ?? true,
                should_generate: existingDay.should_generate ?? true,
                start_time: existingDay.start_time?.slice(0, 5) || '',
                end_time: existingDay.end_time?.slice(0, 5) || '',
                working_day: String(existingDay.working_day || '1'),
                notes: existingDay.notes || '',
            })
        } else if (selectedDate) {
            const wknd = isWeekend(selectedDate)
            setForm({
                is_operational: !wknd,
                should_generate: true,
                start_time: wknd ? '' : '08:00',
                end_time: wknd ? '' : '17:00',
                working_day: defaultWorkingDay(selectedDate),
                notes: '',
            })
        }
    }, [existingDay, selectedDate, open])

    const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

    const handleSave = async () => {
        setLoading(true)
        try {
            const payload = {
                date: format(selectedDate, 'yyyy-MM-dd'),
                is_operational: form.is_operational,
                should_generate: form.should_generate,
                start_time: form.start_time || null,
                end_time: form.end_time || null,
                working_day: form.working_day,
                notes: form.notes || null,
            }
            if (isEdit) {
                await api.fetch(`${API_URL}/office/operational-days/${existingDay.uuid}`, {
                    method: 'PUT', body: JSON.stringify(payload),
                })
                toast.success('Berhasil memperbarui.')
            } else {
                await api.fetch(`${API_URL}/office/operational-days`, {
                    method: 'POST', body: JSON.stringify(payload),
                })
                toast.success('Berhasil menyimpan.')
            }
            onSuccess()
            onClose()
        } catch {
            toast.error(isEdit ? 'Gagal memperbarui.' : 'Gagal menyimpan.')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirmDelete) { setConfirmDelete(true); return }
        setDeleting(true)
        try {
            await api.fetch(`${API_URL}/office/operational-days/${existingDay.uuid}`, { method: 'DELETE' })
            toast.success('Data dihapus.')
            onSuccess()
            onClose()
        } catch {
            toast.error('Gagal menghapus.')
        } finally {
            setDeleting(false)
            setConfirmDelete(false)
        }
    }

    return (
        <Drawer direction="right" open={open} onOpenChange={onClose}>
            <DrawerContent className="!w-full sm:!w-[400px] h-full flex flex-col">
                <DrawerHeader className="pb-3 border-b border-border">
                    <DrawerTitle className="flex items-center gap-2 text-base">
                        <Calendar className="size-4 text-primary" />
                        {selectedDate
                            ? format(selectedDate, 'EEEE, d MMMM yyyy', { locale: idLocale })
                            : 'Detail Hari'}
                    </DrawerTitle>
                    <DrawerDescription className="text-xs">
                        {isEdit ? 'Edit pengaturan operasional hari ini.' : 'Tambah pengaturan untuk hari ini.'}
                    </DrawerDescription>
                </DrawerHeader>

                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-5">
                        <div className="rounded-lg border border-border bg-muted/20 divide-y divide-border">
                            <div className="flex items-center justify-between p-3.5">
                                <div>
                                    <p className="text-sm font-medium">Status Operasional</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">Apakah hari ini masuk kerja?</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "text-[11px] font-medium",
                                        form.is_operational ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
                                    )}>
                                        {form.is_operational ? 'Buka' : 'Libur'}
                                    </span>
                                    <Switch checked={form.is_operational} onCheckedChange={v => set('is_operational', v)} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3.5">
                                <div>
                                    <p className="text-sm font-medium">Generate Absensi</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">Buat rekap absensi otomatis</p>
                                </div>
                                <Switch checked={form.should_generate} onCheckedChange={v => set('should_generate', v)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm flex items-center gap-1.5">
                                <Clock className="size-3.5 text-muted-foreground" />
                                Jam Operasional
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-[11px] text-muted-foreground">Jam Masuk</Label>
                                    <Input type="time" value={form.start_time}
                                        onChange={e => set('start_time', e.target.value)}
                                        disabled={!form.is_operational} className="disabled:opacity-50" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[11px] text-muted-foreground">Jam Pulang</Label>
                                    <Input type="time" value={form.end_time}
                                        onChange={e => set('end_time', e.target.value)}
                                        disabled={!form.is_operational} className="disabled:opacity-50" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm">Tipe Hari</Label>
                            <Select value={form.working_day} onValueChange={v => set('working_day', v)}>
                                <SelectTrigger><SelectValue placeholder="Pilih tipe hari" /></SelectTrigger>
                                <SelectContent>
                                    {WORKING_DAY_OPTIONS.map(o => (
                                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm">
                                Catatan <span className="text-muted-foreground font-normal">(opsional)</span>
                            </Label>
                            <Textarea placeholder="Misal: Libur Hari Raya, Cuti Bersama, dll..."
                                value={form.notes} onChange={e => set('notes', e.target.value)}
                                rows={3} className="resize-none text-sm" />
                        </div>

                        {isEdit && (existingDay?.createdBy || existingDay?.updatedBy) && (
                            <div className="p-3 rounded-lg border border-dashed border-border bg-muted/10 text-xs text-muted-foreground space-y-1">
                                {existingDay?.createdBy && (
                                    <p>Dibuat: <span className="text-foreground">{existingDay.createdBy?.name}</span></p>
                                )}
                                {existingDay?.updatedBy && (
                                    <p>Diperbarui: <span className="text-foreground">{existingDay.updatedBy?.name}</span></p>
                                )}
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <DrawerFooter className="border-t border-border pt-3 gap-2">
                    <Button onClick={handleSave} disabled={loading} className="w-full">
                        {loading
                            ? <><Spinner className="size-3.5" /> Menyimpan...</>
                            : isEdit
                                ? <><Pencil className="size-3.5" /> Perbarui</>
                                : <><Calendar className="size-3.5" /> Simpan</>}
                    </Button>
                    {isEdit && (
                        <>
                            <Button variant={confirmDelete ? "destructive" : "outline"}
                                className="w-full" onClick={handleDelete} disabled={deleting}>
                                {deleting
                                    ? <><Spinner className="size-3.5" /> Menghapus...</>
                                    : confirmDelete
                                        ? <><Trash2 className="size-3.5" /> Konfirmasi Hapus?</>
                                        : <><Trash2 className="size-3.5" /> Hapus Data</>}
                            </Button>
                            {confirmDelete && (
                                <Button variant="ghost" size="sm" className="text-xs w-full"
                                    onClick={() => setConfirmDelete(false)}>
                                    <RotateCcw className="size-3 mr-1" /> Batalkan
                                </Button>
                            )}
                        </>
                    )}
                    <DrawerClose asChild>
                        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground w-full">Tutup</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

// ─── Calendar Cell (Redesigned) ────────────────────────────────────────────────

const CalendarCell = ({ date, currentMonth, dayData, onToggle, onEdit, onShowAttendance, togglingDate }) => {
    const inMonth = isSameMonth(date, currentMonth)
    const today = isToday(date)
    const weekend = isWeekend(date)
    const hasData = !!dayData
    const isOp = dayData?.is_operational
    const dateKey = format(date, 'yyyy-MM-dd')
    const isToggling = togglingDate === dateKey

    if (!inMonth) {
        return (
            <div className="min-h-[90px] rounded-xl border border-border/20 bg-muted/5 opacity-30" />
        )
    }

    return (
        <div
            onClick={() => onEdit(date)}
            className={cn(
                "relative flex flex-col rounded-xl border overflow-hidden transition-all duration-150 min-h-[90px] cursor-pointer group",
                // No data — ghost dashed
                !hasData && "border-dashed border-border/50 bg-transparent hover:bg-muted/20 hover:border-border",
                // Operational
                hasData && isOp && "border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-br from-emerald-50 to-emerald-50/30 dark:from-emerald-950/30 dark:to-emerald-950/10 hover:border-emerald-300 dark:hover:border-emerald-700",
                // Holiday
                hasData && !isOp && "border-rose-200 dark:border-rose-900/60 bg-gradient-to-br from-rose-50 to-rose-50/30 dark:from-rose-950/30 dark:to-rose-950/10 hover:border-rose-300 dark:hover:border-rose-700",
                // Today ring
                today && "ring-2 ring-primary/70 ring-offset-1 border-primary/30!",
            )}
        >
            {/* Top accent stripe */}
            {hasData && (
                <div className={cn(
                    "h-[3px] w-full shrink-0",
                    isOp
                        ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                        : "bg-gradient-to-r from-rose-400 to-rose-500"
                )} />
            )}

            {/* Content */}
            <div className="flex-1 p-2 flex flex-col gap-1.5">
                {/* Date number + status badge */}
                <div className="flex items-start justify-between gap-1">
                    <span className={cn(
                        "text-sm font-bold leading-none",
                        today && "text-primary",
                        !today && weekend && "text-orange-500 dark:text-orange-400",
                        !today && !weekend && "text-foreground",
                    )}>
                        {format(date, 'd')}
                    </span>

                    {/* Status pill badge */}
                    {hasData && (
                        <span className={cn(
                            "inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wide leading-none px-1.5 py-0.5 rounded-full shrink-0",
                            isOp
                                ? "bg-emerald-500 text-white"
                                : "bg-rose-500 text-white"
                        )}>
                            {isOp ? 'Buka' : 'Libur'}
                        </span>
                    )}

                    {/* Today badge */}
                    {today && !hasData && (
                        <span className="inline-flex text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">
                            Hari ini
                        </span>
                    )}
                </div>

                {/* Time row */}
                {hasData && isOp && dayData?.start_time && (
                    <div className="hidden sm:flex items-center gap-1">
                        <Clock className="size-2.5 text-muted-foreground shrink-0" />
                        <span className="text-[9px] text-muted-foreground leading-none">
                            {dayData.start_time.slice(0, 5)}–{dayData.end_time?.slice(0, 5) ?? '??:??'}
                        </span>
                    </div>
                )}

                {/* Notes */}
                {hasData && dayData?.notes && (
                    <p className="hidden sm:block text-[9px] text-muted-foreground/80 line-clamp-1 leading-tight italic">
                        {dayData.notes}
                    </p>
                )}

                {/* Empty CTA */}
                {!hasData && (
                    <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground/40 mt-auto group-hover:text-muted-foreground/70 transition-colors">
                        <Plus className="size-2.5" />
                        <span>tambah</span>
                    </span>
                )}
            </div>

            {/* Bottom action bar — only when has data */}
            {hasData && (
                <div
                    className="flex items-center justify-between px-2 pb-1.5 mt-auto"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Attendance button */}
                    <button
                        onClick={() => onShowAttendance(dateKey)}
                        className={cn(
                            "flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full transition-colors",
                            isOp
                                ? "text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                                : "text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/30"
                        )}
                        title="Lihat kehadiran"
                    >
                        <Users className="size-2.5" />
                        <span className="hidden md:inline">Hadir</span>
                    </button>

                    {/* Toggle switch */}
                    <div onClick={() => !isToggling && onToggle(dayData, !isOp)}>
                        {isToggling
                            ? <Spinner className="size-3 text-muted-foreground" />
                            : <Switch checked={isOp} className="scale-[0.6] origin-right cursor-pointer" />
                        }
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── Summary List ──────────────────────────────────────────────────────────────

const SummaryList = ({ data, currentMonth, onEdit, onShowAttendance }) => {
    const monthData = data
        .filter(d => { try { return isSameMonth(parseISO(d.date), currentMonth) } catch { return false } })
        .sort((a, b) => a.date.localeCompare(b.date))

    if (monthData.length === 0) {
        return (
            <div className="text-center py-10 text-sm text-muted-foreground">
                <CalendarOff className="size-7 mx-auto mb-2 opacity-30" />
                <p className="text-xs">Belum ada data</p>
                <p className="text-[10px] mt-0.5 opacity-60">Generate atau tambah manual</p>
            </div>
        )
    }

    return (
        <div className="space-y-px">
            {monthData.map(item => (
                <div
                    key={item.uuid}
                    // ✅ FIX: Both calendar cell and summary list call openEdit the same way
                    // Pass parseISO(item.date) as date + item as dayData so drawer gets full data
                    onClick={() => onEdit(parseISO(item.date), item)}
                    className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                    {/* Status dot */}
                    <div className={cn(
                        "size-2 rounded-full shrink-0 ring-2",
                        item.is_operational
                            ? "bg-emerald-500 ring-emerald-100 dark:ring-emerald-900/50"
                            : "bg-rose-400 ring-rose-100 dark:ring-rose-900/50"
                    )} />

                    {/* Date + note */}
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium leading-none truncate">
                            {format(parseISO(item.date), 'EEE, d MMM', { locale: idLocale })}
                        </p>
                        {item.notes && (
                            <p className="text-[10px] text-muted-foreground mt-0.5 truncate italic">{item.notes}</p>
                        )}
                    </div>

                    {/* Time + actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        {item.is_operational && item.start_time && (
                            <span className="hidden xl:flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                <Clock className="size-2.5" />
                                {item.start_time.slice(0, 5)}
                            </span>
                        )}
                        <button
                            onClick={e => { e.stopPropagation(); onShowAttendance(item.date) }}
                            className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                            title="Lihat kehadiran"
                        >
                            <Users className="size-3" />
                        </button>
                        <span className={cn(
                            "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                            item.is_operational
                                ? "bg-emerald-500 text-white"
                                : "bg-rose-500 text-white"
                        )}>
                            {item.is_operational ? 'Buka' : 'Libur'}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, colorClass, subtext }) => (
    <div className="relative flex items-center gap-3 p-4 rounded-xl border border-border bg-card overflow-hidden">
        <div className={cn("p-2.5 rounded-lg shrink-0", colorClass)}>
            <Icon className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-[11px] text-muted-foreground font-medium truncate">{label}</p>
            <p className="text-2xl font-bold leading-none mt-0.5 tracking-tight">{value}</p>
            {subtext && <p className="text-[10px] text-muted-foreground mt-0.5">{subtext}</p>}
        </div>
    </div>
)

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function Operational() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [operationalData, setOperationalData] = useState([])
    const [loading, setLoading] = useState(false)

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedDayData, setSelectedDayData] = useState(null)

    const [generateOpen, setGenerateOpen] = useState(false)

    const [attendanceOpen, setAttendanceOpen] = useState(false)
    const [attendanceDate, setAttendanceDate] = useState(null)

    const [togglingDate, setTogglingDate] = useState(null)

    const calendarDays = getCalendarDays(currentDate)

    const dayMap = operationalData.reduce((acc, item) => {
        acc[item.date] = item
        return acc
    }, {})

    const existingDates = new Set(Object.keys(dayMap))

    // ── Fetch ──────────────────────────────────────────────────────────────────
    const fetchMonth = useCallback(async (date) => {
        setLoading(true)
        try {
            const start = format(startOfMonth(date), 'yyyy-MM-dd')
            const end = format(endOfMonth(date), 'yyyy-MM-dd')
            const res = await api.fetch(
                `${API_URL}/office/operational-days?start_date=${start}&end_date=${end}&per_page=100`,
                { method: 'GET' }
            )
            if (res?.success) {
                setOperationalData(res.data?.data || res.data || [])
            } else {
                toast.error(res?.message || 'Gagal memuat data.')
            }
        } catch {
            toast.error('Gagal memuat data operasional.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchMonth(currentDate) }, [currentDate, fetchMonth])

    // ── Toggle ─────────────────────────────────────────────────────────────────
    const handleToggle = async (dayData, newValue) => {
        setTogglingDate(dayData.date)
        try {
            const res = await api.fetch(`${API_URL}/office/operational-days/${dayData.uuid}`, {
                method: 'PUT',
                body: JSON.stringify({
                    date: dayData.date,
                    is_operational: newValue,
                    should_generate: dayData.should_generate,
                    start_time: dayData.start_time || null,
                    end_time: dayData.end_time || null,
                    working_day: String(dayData.working_day),
                    notes: dayData.notes || null,
                }),
            })
            if (res?.success) {
                setOperationalData(prev =>
                    prev.map(d => d.uuid === dayData.uuid ? { ...d, is_operational: newValue } : d)
                )
                toast.success(newValue ? 'Ditandai operasional.' : 'Ditandai libur.')
            } else {
                toast.error(res?.message || 'Gagal mengubah status.')
            }
        } catch {
            toast.error('Gagal mengubah status.')
        } finally {
            setTogglingDate(null)
        }
    }

    // ── Open Drawer ────────────────────────────────────────────────────────────
    // ✅ SYNC FIX: Single `openEdit` used by BOTH CalendarCell and SummaryList.
    // - Calendar cell: passes date only → falls back to dayMap lookup
    // - Summary list: passes date + item directly (no lookup needed)
    // Both paths produce identical drawer state → fully in sync.
    const openEdit = useCallback((date, dayData = null) => {
        setSelectedDate(date)
        setSelectedDayData(dayData ?? dayMap[format(date, 'yyyy-MM-dd')] ?? null)
        setDrawerOpen(true)
    }, [dayMap])

    const openAttendance = (dateStr) => {
        setAttendanceDate(dateStr)
        setAttendanceOpen(true)
    }

    // ── Stats ──────────────────────────────────────────────────────────────────
    const daysInMonth = getDaysInMonth(currentDate)
    const monthData = operationalData.filter(d => {
        try { return isSameMonth(parseISO(d.date), currentDate) } catch { return false }
    })
    const opCount = monthData.filter(d => d.is_operational).length
    const offCount = monthData.filter(d => !d.is_operational).length
    const notSetCount = daysInMonth - monthData.length
    const coveragePct = daysInMonth > 0 ? Math.round((monthData.length / daysInMonth) * 100) : 0

    return (
        <LayoutContainer>
            {/* ✅ max-w-7xl container */}
            <div className='max-w-6xl mx-auto w-full mb-10'>

                <PageTitle title="Jadwal Operasional" subtitle="Atur hari kerja & libur kantor setiap bulan" />

                <div className='flex flex-col gap-5'>

                    <div className="space-y-7">
                        {/* Toolbar */}
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                            <Button
                                size="sm"
                                onClick={() => setGenerateOpen(true)}
                                className="shrink-0"
                            >
                                <Sparkles className="size-3.5" />
                                Generate Bulan
                            </Button>
                        </div>

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                        {/* Hari Operasional */}
                        <div className="p-5 rounded-2xl w-full border flex flex-col gap-1 bg-card relative overflow-hidden">
                            <div className="flex gap-2 items-start">
                                <div className="flex flex-col gap-1 flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Hari Operasional
                                    </p>
                                    <h2 className="text-2xl font-bold">
                                        {opCount}
                                    </h2>
                                </div>
                                <Briefcase className="w-6 h-6 text-emerald-500" />
                            </div>
                            <small className="text-xs text-muted-foreground">
                                hari kerja aktif
                            </small>
                            <div className="bg-card-login absolute inset-0 z-0 -top-px -left-px pointer-events-none"></div>
                        </div>

                        {/* Hari Libur */}
                        <div className="p-5 rounded-2xl w-full border flex flex-col gap-1 bg-card relative overflow-hidden">
                            <div className="flex gap-2 items-start">
                                <div className="flex flex-col gap-1 flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Hari Libur
                                    </p>
                                    <h2 className="text-2xl font-bold">
                                        {offCount}
                                    </h2>
                                </div>
                                <CalendarOff className="w-6 h-6 text-rose-500" />
                            </div>
                            <small className="text-xs text-muted-foreground">
                                hari tidak masuk
                            </small>
                            <div className="bg-card-login absolute inset-0 z-0 -top-px -left-px pointer-events-none"></div>
                        </div>

                        {/* Total Bulan Ini */}
                        <div className="p-5 rounded-2xl w-full border flex flex-col gap-1 bg-card relative overflow-hidden">
                            <div className="flex gap-2 items-start">
                                <div className="flex flex-col gap-1 flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Bulan Ini
                                    </p>
                                    <h2 className="text-2xl font-bold">
                                        {daysInMonth}
                                    </h2>
                                </div>
                                <Calendar className="w-6 h-6 text-blue-500" />
                            </div>
                            <small className="text-xs text-muted-foreground">
                                {format(currentDate, 'MMMM yyyy', { locale: idLocale })}
                            </small>
                            <div className="bg-card-login absolute inset-0 z-0 -top-px -left-px pointer-events-none"></div>
                        </div>

                        {/* Belum Diatur */}
                        <div className="p-5 rounded-2xl w-full border flex flex-col gap-1 bg-card relative overflow-hidden">
                            <div className="flex gap-2 items-start">
                                <div className="flex flex-col gap-1 flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Belum Diatur
                                    </p>
                                    <h2 className="text-2xl font-bold">
                                        {notSetCount}
                                    </h2>
                                </div>
                                <Info className="w-6 h-6 text-amber-500" />
                            </div>
                            <small className="text-xs text-muted-foreground">
                                {coveragePct}% sudah dikonfigurasi
                            </small>
                            <div className="bg-card-login absolute inset-0 z-0 -top-px -left-px pointer-events-none"></div>
                        </div>

                    </div>

                    {/* ── Main layout: Calendar (left, wide) + Sidebar (right) ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] xl:grid-cols-[1fr_312px] gap-4 items-start">

                        {/* ── Calendar ── */}
                        <Card className="overflow-hidden">
                            <CardHeader className="pb-3 border-b border-border space-y-3">
                                {/* Month nav */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon" className="size-8 rounded-lg"
                                            onClick={() => setCurrentDate(d => subMonths(d, 1))} disabled={loading}>
                                            <ChevronLeft className="size-4" />
                                        </Button>
                                        <span className="text-sm font-semibold w-[140px] text-center capitalize select-none">
                                            {format(currentDate, 'MMMM yyyy', { locale: idLocale })}
                                        </span>
                                        <Button variant="outline" size="icon" className="size-8 rounded-lg"
                                            onClick={() => setCurrentDate(d => addMonths(d, 1))} disabled={loading}>
                                            <ChevronRight className="size-4" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {loading && <Spinner className="size-3.5 text-muted-foreground" />}
                                        <Button variant="ghost" size="sm" className="text-xs h-7 rounded-lg"
                                            onClick={() => setCurrentDate(new Date())} disabled={loading}>
                                            Hari Ini
                                        </Button>
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="flex items-center gap-4 flex-wrap">
                                    {[
                                        { color: 'bg-emerald-500', label: 'Operasional' },
                                        { color: 'bg-rose-500', label: 'Libur' },
                                        { color: 'border border-dashed border-border bg-transparent', label: 'Belum diatur' },
                                    ].map(l => (
                                        <span key={l.label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                            <span className={cn("size-2 rounded-full", l.color)} />
                                            {l.label}
                                        </span>
                                    ))}
                                </div>
                            </CardHeader>

                            <CardContent className="pt-4">
                                {/* Day headers */}
                                <div className="grid grid-cols-7 gap-1.5 mb-2">
                                    {DAY_NAMES.map((name, i) => (
                                        <div key={name} className={cn(
                                            "text-center text-[11px] font-semibold py-1.5 rounded-lg select-none",
                                            (i === 0 || i === 6)
                                                ? "text-orange-500 bg-orange-50 dark:bg-orange-950/20"
                                                : "text-muted-foreground bg-muted/40"
                                        )}>
                                            {name}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar grid */}
                                <div className="grid grid-cols-7 gap-1.5">
                                    {calendarDays.map(date => {
                                        const key = format(date, 'yyyy-MM-dd')
                                        return (
                                            <CalendarCell
                                                key={key}
                                                date={date}
                                                currentMonth={currentDate}
                                                dayData={dayMap[key]}
                                                onToggle={handleToggle}
                                                onEdit={openEdit}
                                                onShowAttendance={openAttendance}
                                                togglingDate={togglingDate}
                                            />
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* ── Sidebar: Monthly Summary ── */}
                        <div className="lg:sticky lg:top-4 space-y-3">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center justify-between">
                                        <span>Ringkasan Bulan</span>
                                        <Badge variant="outline" className="text-[10px] font-normal h-5 rounded-full">
                                            {monthData.length}/{daysInMonth} hari
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0 space-y-3">
                                    {/* Progress bar */}
                                    <div className="space-y-1.5">
                                        <div className="flex h-2 rounded-full overflow-hidden bg-muted gap-0.5">
                                            {opCount > 0 && (
                                                <div
                                                    className="bg-emerald-500 transition-all rounded-l-full"
                                                    style={{ width: `${(opCount / daysInMonth) * 100}%` }}
                                                />
                                            )}
                                            {offCount > 0 && (
                                                <div
                                                    className={cn(
                                                        "bg-rose-400 transition-all",
                                                        opCount === 0 && "rounded-l-full",
                                                        notSetCount === 0 && "rounded-r-full"
                                                    )}
                                                    style={{ width: `${(offCount / daysInMonth) * 100}%` }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex justify-between text-[10px]">
                                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">{opCount} operasional</span>
                                            <span className="text-rose-500 font-medium">{offCount} libur</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* List */}
                                    <ScrollArea className="h-[340px] lg:h-[calc(100vh-460px)] min-h-[200px]">
                                        <SummaryList
                                            data={operationalData}
                                            currentMonth={currentDate}
                                            onEdit={openEdit}
                                            onShowAttendance={openAttendance}
                                        />
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Modals & Drawers ── */}
            <GenerateDialog
                open={generateOpen}
                onClose={() => setGenerateOpen(false)}
                onSuccess={() => fetchMonth(currentDate)}
                existingDates={existingDates}
            />

            <DayDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                selectedDate={selectedDate}
                existingDay={selectedDayData}
                onSuccess={() => fetchMonth(currentDate)}
            />

            <AttendanceModal
                open={attendanceOpen}
                onClose={() => setAttendanceOpen(false)}
                date={attendanceDate}
            />
        </LayoutContainer>
    )
}