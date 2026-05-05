'use client';

import { useMemo } from 'react';
import { User, Ruler, Weight, CalendarDays, Info } from 'lucide-react';

/**
 * StepProfile
 * Props:
 *   value    : { tinggi: string, berat: string, usia: string }
 *   onChange : (next) => void
 */
export default function StepProfile({ value, onChange }) {
    const set = (k, v) => onChange({ ...value, [k]: v });

    const bmi = useMemo(() => {
        const t = parseFloat(value.tinggi);
        const b = parseFloat(value.berat);
        if (!t || !b || t < 50 || b < 20) return null;
        return (b / ((t / 100) ** 2)).toFixed(1);
    }, [value.tinggi, value.berat]);

    const bmiCategory = useMemo(() => {
        if (!bmi) return null;
        const v = parseFloat(bmi);
        if (v < 18.5) return { label: 'Kurus', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' };
        if (v < 25)   return { label: 'Normal ✓', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' };
        if (v < 30)   return { label: 'Berlebih', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' };
        return { label: 'Obesitas', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' };
    }, [bmi]);

    return (
        <div className="space-y-5">
            {/* Section label */}
            <div className="flex items-center gap-2.5 pb-3 border-b border-border/40">
                <div className="h-7 w-7 rounded-lg bg-primary/15 ring-1 ring-primary/20 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="font-display font-semibold text-sm tracking-wide text-foreground/80">
                    Data Fisik Dasar
                </span>
            </div>

            {/* Tinggi + Berat */}
            <div className="grid grid-cols-2 gap-4">
                <Field
                    label="Tinggi Badan"
                    icon={<Ruler className="h-3.5 w-3.5" />}
                    unit="cm"
                    type="number"
                    placeholder="172"
                    value={value.tinggi}
                    onChange={(v) => set('tinggi', v)}
                    min={100}
                    max={230}
                />
                <Field
                    label="Berat Badan"
                    icon={<Weight className="h-3.5 w-3.5" />}
                    unit="kg"
                    type="number"
                    placeholder="65"
                    value={value.berat}
                    onChange={(v) => set('berat', v)}
                    min={30}
                    max={200}
                />
            </div>

            {/* Usia */}
            <Field
                label="Usia"
                icon={<CalendarDays className="h-3.5 w-3.5" />}
                unit="tahun"
                type="number"
                placeholder="18"
                value={value.usia}
                onChange={(v) => set('usia', v)}
                min={10}
                max={60}
            />

            {/* BMI Preview */}
            {bmi && bmiCategory && (
                <div
                    className={`flex items-center justify-between rounded-xl border px-4 py-3.5 ${bmiCategory.bg} transition-all duration-300`}
                >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Info className="h-3.5 w-3.5 text-primary/60" />
                        <span>Indeks Massa Tubuh (BMI)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`font-display font-bold text-lg leading-none ${bmiCategory.color}`}>
                            {bmi}
                        </span>
                        <span className={`text-xs font-semibold ${bmiCategory.color}`}>
                            {bmiCategory.label}
                        </span>
                    </div>
                </div>
            )}

            {/* Info note */}
            <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
                Data ini digunakan untuk menghitung kebutuhan kalori harian dan menyesuaikan intensitas latihan dengan kondisi tubuhmu.
            </p>
        </div>
    );
}

/* ─── Reusable field component ─────────────────────────── */
function Field({ label, icon, unit, type = 'text', placeholder, value, onChange, min, max }) {
    return (
        <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                <span className="text-primary/60">{icon}</span>
                {label}
            </label>
            <div className="flex items-center rounded-xl border border-border bg-card/60 overflow-hidden focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                <input
                    type={type}
                    inputMode={type === 'number' ? 'numeric' : undefined}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    min={min}
                    max={max}
                    className="flex-1 min-w-0 bg-transparent px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none"
                />
                {unit && (
                    <span className="shrink-0 px-3 text-xs text-muted-foreground/50 border-l border-border bg-muted/10 self-stretch flex items-center">
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );
}
