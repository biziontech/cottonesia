'use client';

import { Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';

/**
 * StepHistory
 * Props:
 *   value    : { riwayat: string, cedera: string }
 *   onChange : (next) => void
 */

const FREQUENCY_OPTIONS = [
    {
        id: 'tidak_pernah',
        label: 'Tidak Pernah',
        desc: 'Belum rutin berolahraga',
        emoji: '🛋️',
    },
    {
        id: '1-2x',
        label: '1–2× Seminggu',
        desc: 'Aktif sesekali',
        emoji: '🚶',
    },
    {
        id: '3-4x',
        label: '3–4× Seminggu',
        desc: 'Cukup aktif',
        emoji: '🏃',
    },
    {
        id: 'setiap_hari',
        label: 'Setiap Hari',
        desc: 'Sangat rutin berolahraga',
        emoji: '💪',
    },
];

export default function StepHistory({ value, onChange }) {
    const set = (k, v) => onChange({ ...value, [k]: v });

    return (
        <div className="space-y-6">
            {/* Section label */}
            <div className="flex items-center gap-2.5 pb-3 border-b border-border/40">
                <div className="h-7 w-7 rounded-lg bg-primary/15 ring-1 ring-primary/20 flex items-center justify-center">
                    <Activity className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="font-display font-semibold text-sm tracking-wide text-foreground/80">
                    Riwayat Aktivitas Fisik
                </span>
            </div>

            {/* Frekuensi olahraga */}
            <div className="space-y-2.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Seberapa sering kamu olahraga saat ini?
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                    {FREQUENCY_OPTIONS.map((opt) => {
                        const isSelected = value.riwayat === opt.id;
                        return (
                            <button
                                key={opt.id}
                                type="button"
                                onClick={() => set('riwayat', opt.id)}
                                className={`
                                    flex items-center gap-3.5 w-full px-4 py-3 rounded-xl border text-left
                                    transition-all duration-200 group
                                    ${isSelected
                                        ? 'border-primary/60 bg-primary/10 shadow-[0_0_0_1px] shadow-primary/20'
                                        : 'border-border bg-card/40 hover:border-border/80 hover:bg-card/70'
                                    }
                                `}
                            >
                                {/* Checkbox indicator */}
                                <span
                                    className={`
                                        flex-shrink-0 h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center transition-all
                                        ${isSelected
                                            ? 'border-primary bg-primary'
                                            : 'border-muted-foreground/30 bg-transparent'
                                        }
                                    `}
                                    style={{ height: 18, width: 18 }}
                                >
                                    {isSelected && (
                                        <svg viewBox="0 0 10 8" className="h-2 w-2 fill-none stroke-white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="1 4 4 7 9 1" />
                                        </svg>
                                    )}
                                </span>

                                <span className="text-xl leading-none">{opt.emoji}</span>

                                <div className="flex-1 min-w-0">
                                    <div className={`text-sm font-semibold leading-tight ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                        {opt.label}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground mt-0.5">{opt.desc}</div>
                                </div>

                                {isSelected && <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Riwayat cedera */}
            <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400/70" />
                    Riwayat Cedera
                    <span className="normal-case font-normal tracking-normal text-muted-foreground/40 ml-1">— opsional</span>
                </label>
                <textarea
                    value={value.cedera}
                    onChange={(e) => set('cedera', e.target.value)}
                    placeholder="Contoh: pernah sakit lutut saat lari, tidak ada cedera, cedera bahu 6 bulan lalu…"
                    rows={3}
                    className="w-full rounded-xl border border-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none resize-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all leading-relaxed"
                />
                <p className="text-[11px] text-muted-foreground/50 leading-relaxed">
                    Info cedera membantu kami menyesuaikan program agar tidak memperparah kondisi yang ada.
                </p>
            </div>
        </div>
    );
}
