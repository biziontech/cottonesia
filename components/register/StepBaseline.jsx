'use client';

import { Footprints, ArrowUpToLine, Dumbbell, Repeat, Move3d, Zap } from 'lucide-react';

/**
 * StepBaseline
 * Props:
 *   value    : { lari: string, pullup: string, pushup: string, situp: string, shuttle: string }
 *   onChange : (next) => void
 */

const TESTS = [
    {
        key: 'lari',
        icon: Footprints,
        label: 'Lari Cooper 12 Menit',
        desc: 'Lari di lapangan atau trek selama 12 menit penuh. Catat jarak total yang ditempuh.',
        placeholder: '2400',
        unit: 'meter',
        target: '≥ 2400 m',
        targetOk: (v) => parseFloat(v) >= 2400,
        hint: 'Standar TNI/POLRI: minimal 2.400 meter',
        colorOk: 'text-green-400',
        colorFail: 'text-red-400',
    },
    {
        key: 'pullup',
        icon: ArrowUpToLine,
        label: 'Pull-up Maksimal',
        desc: 'Lakukan pull-up sebanyak mungkin tanpa batas waktu. Mulai dari posisi gantung.',
        placeholder: '10',
        unit: 'rep',
        target: '≥ 10 rep',
        targetOk: (v) => parseFloat(v) >= 10,
        hint: 'Standar TNI/POLRI: minimal 10 repetisi',
        colorOk: 'text-green-400',
        colorFail: 'text-red-400',
    },
    {
        key: 'pushup',
        icon: Dumbbell,
        label: 'Push-up dalam 1 Menit',
        desc: 'Lakukan push-up sebanyak mungkin dalam 60 detik. Posisi badan lurus.',
        placeholder: '35',
        unit: 'rep',
        target: '≥ 35 rep',
        targetOk: (v) => parseFloat(v) >= 35,
        hint: 'Standar TNI/POLRI: minimal 35 repetisi',
        colorOk: 'text-green-400',
        colorFail: 'text-red-400',
    },
    {
        key: 'situp',
        icon: Repeat,
        label: 'Sit-up dalam 1 Menit',
        desc: 'Lakukan sit-up sebanyak mungkin dalam 60 detik. Kaki ditekuk, tangan di belakang kepala.',
        placeholder: '38',
        unit: 'rep',
        target: '≥ 38 rep',
        targetOk: (v) => parseFloat(v) >= 38,
        hint: 'Standar TNI/POLRI: minimal 38 repetisi',
        colorOk: 'text-green-400',
        colorFail: 'text-red-400',
    },
    {
        key: 'shuttle',
        icon: Move3d,
        label: 'Shuttle Run 4×10 Meter',
        desc: 'Lari bolak-balik 4 kali di jarak 10 meter. Ukur waktu total dari start hingga finish.',
        placeholder: '11.5',
        unit: 'detik',
        target: '≤ 11.5 dtk',
        targetOk: (v) => parseFloat(v) <= 11.5,
        hint: 'Standar TNI/POLRI: maksimal 11.5 detik',
        colorOk: 'text-green-400',
        colorFail: 'text-red-400',
    },
];

export default function StepBaseline({ value, onChange }) {
    const set = (k, v) => onChange({ ...value, [k]: v });

    const filledCount = TESTS.filter((t) => value[t.key] !== '').length;

    return (
        <div className="space-y-5">
            {/* Section label */}
            <div className="flex items-center gap-2.5 pb-3 border-b border-border/40">
                <div className="h-7 w-7 rounded-lg bg-primary/15 ring-1 ring-primary/20 flex items-center justify-center">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="font-display font-semibold text-sm tracking-wide text-foreground/80">
                    5 Tes Mandiri Baseline
                </span>
                <span className="ml-auto text-[11px] font-semibold text-primary/70 tabular-nums">
                    {filledCount}/5 diisi
                </span>
            </div>

            {/* Alert banner */}
            <div className="flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/8 px-4 py-3">
                <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-[12px] text-primary/90 leading-relaxed">
                    Lakukan kelima tes ini secara mandiri <strong>sebelum mengisi</strong>. Hasilnya akan menentukan program latihan personalmu.
                </p>
            </div>

            {/* Test fields */}
            <div className="space-y-3.5">
                {TESTS.map((test, i) => {
                    const Icon = test.icon;
                    const val = value[test.key];
                    const hasValue = val !== '';
                    const isOk = hasValue && test.targetOk(val);
                    const isFail = hasValue && !test.targetOk(val);

                    return (
                        <div
                            key={test.key}
                            className={`
                                rounded-xl border overflow-hidden transition-all duration-200
                                ${hasValue
                                    ? isOk
                                        ? 'border-green-400/30 bg-green-400/5'
                                        : 'border-red-400/30 bg-red-400/5'
                                    : 'border-border bg-card/40'
                                }
                            `}
                        >
                            {/* Header */}
                            <div className="flex items-center gap-3 px-4 pt-3 pb-2.5">
                                <div
                                    className={`
                                        h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                                        ${hasValue
                                            ? isOk ? 'bg-green-400/15' : 'bg-red-400/15'
                                            : 'bg-muted/40'
                                        }
                                    `}
                                >
                                    <Icon
                                        className={`h-4 w-4 transition-colors ${hasValue ? isOk ? 'text-green-400' : 'text-red-400' : 'text-muted-foreground'}`}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-foreground leading-tight">{test.label}</div>
                                    <div className="text-[11px] text-muted-foreground mt-0.5">{test.desc}</div>
                                </div>
                                {/* Target badge */}
                                <span
                                    className={`
                                        flex-shrink-0 font-display font-bold text-[11px] px-2.5 py-1 rounded-full border transition-colors
                                        ${hasValue
                                            ? isOk
                                                ? 'text-green-400 border-green-400/30 bg-green-400/10'
                                                : 'text-red-400 border-red-400/30 bg-red-400/10'
                                            : 'text-muted-foreground/60 border-border bg-muted/20'
                                        }
                                    `}
                                >
                                    {test.target}
                                </span>
                            </div>

                            {/* Input row */}
                            <div className="flex items-center gap-0 border-t border-border/30">
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    placeholder={test.placeholder}
                                    value={val}
                                    onChange={(e) => set(test.key, e.target.value)}
                                    className="flex-1 bg-transparent px-4 py-2.5 text-sm font-semibold text-foreground placeholder:text-muted-foreground/30 outline-none"
                                />
                                <div className="px-3.5 py-2.5 text-xs text-muted-foreground/50 border-l border-border/30 bg-muted/10 self-stretch flex items-center">
                                    {test.unit}
                                </div>
                            </div>

                            {/* Status strip */}
                            {hasValue && (
                                <div
                                    className={`px-4 py-1.5 text-[10px] font-semibold border-t border-border/20 ${isOk ? 'text-green-400 bg-green-400/5' : 'text-red-400 bg-red-400/5'}`}
                                >
                                    {isOk ? '✓ Memenuhi standar — bagus!' : '✗ Di bawah standar — akan diprioritaskan dalam programmu'}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <p className="text-[11px] text-muted-foreground/50 leading-relaxed">
                Standar berdasarkan rata-rata batas kelulusan seleksi TNI/POLRI 2024. Target spesifik per instansi dijelaskan di hasil diagnosis.
            </p>
        </div>
    );
}
