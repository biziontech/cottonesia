'use client';

import { Brain, CheckSquare, Info } from 'lucide-react';

/**
 * StepSelfAssess
 * Props:
 *   value    : string[]   — array of selected kelemahan IDs
 *   onChange : (next: string[]) => void
 */

const KELEMAHAN_OPTIONS = [
    {
        id: 'daya_tahan_lari',
        label: 'Daya Tahan Lari',
        desc: 'Cepat kehabisan napas atau tidak bisa lari jarak jauh',
        emoji: '🏃',
        color: 'text-red-400',
        bg: 'bg-red-400/10 border-red-400/25',
        selectedBg: 'bg-red-400/15 border-red-400/50',
    },
    {
        id: 'kekuatan_lengan',
        label: 'Kekuatan Lengan',
        desc: 'Kesulitan pull-up atau gerakan mendorong',
        emoji: '💪',
        color: 'text-amber-400',
        bg: 'bg-amber-400/10 border-amber-400/20',
        selectedBg: 'bg-amber-400/15 border-amber-400/50',
    },
    {
        id: 'kekuatan_dada_bahu',
        label: 'Kekuatan Dada & Bahu',
        desc: 'Push-up terasa berat, bahu cepat lelah',
        emoji: '🤸',
        color: 'text-orange-400',
        bg: 'bg-orange-400/10 border-orange-400/20',
        selectedBg: 'bg-orange-400/15 border-orange-400/50',
    },
    {
        id: 'kekuatan_inti',
        label: 'Kekuatan Inti (Core)',
        desc: 'Perut cepat kram saat sit-up, punggung mudah sakit',
        emoji: '🔩',
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10 border-yellow-400/20',
        selectedBg: 'bg-yellow-400/15 border-yellow-400/50',
    },
    {
        id: 'kelincahan',
        label: 'Kelincahan & Kecepatan',
        desc: 'Lambat berubah arah, kurang responsif saat shuttle run',
        emoji: '⚡',
        color: 'text-blue-400',
        bg: 'bg-blue-400/10 border-blue-400/20',
        selectedBg: 'bg-blue-400/15 border-blue-400/50',
    },
    {
        id: 'fleksibilitas',
        label: 'Fleksibilitas',
        desc: 'Otot kaku, rentang gerak terbatas, sering cedera ringan',
        emoji: '🧘',
        color: 'text-purple-400',
        bg: 'bg-purple-400/10 border-purple-400/20',
        selectedBg: 'bg-purple-400/15 border-purple-400/50',
    },
    {
        id: 'mental_ketahanan',
        label: 'Mental & Ketahanan Psikis',
        desc: 'Mudah menyerah saat latihan terasa berat',
        emoji: '🧠',
        color: 'text-teal-400',
        bg: 'bg-teal-400/10 border-teal-400/20',
        selectedBg: 'bg-teal-400/15 border-teal-400/50',
    },
    {
        id: 'berat_badan',
        label: 'Berat Badan Berlebih',
        desc: 'Kelebihan berat yang menghambat performa fisik',
        emoji: '⚖️',
        color: 'text-pink-400',
        bg: 'bg-pink-400/10 border-pink-400/20',
        selectedBg: 'bg-pink-400/15 border-pink-400/50',
    },
];

export default function StepSelfAssess({ value, onChange }) {
    const toggle = (id) => {
        if (value.includes(id)) {
            onChange(value.filter((x) => x !== id));
        } else {
            onChange([...value, id]);
        }
    };

    return (
        <div className="space-y-5">
            {/* Section label */}
            <div className="flex items-center gap-2.5 pb-3 border-b border-border/40">
                <div className="h-7 w-7 rounded-lg bg-primary/15 ring-1 ring-primary/20 flex items-center justify-center">
                    <Brain className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="font-display font-semibold text-sm tracking-wide text-foreground/80">
                    Identifikasi Kelemahan
                </span>
                {value.length > 0 && (
                    <span className="ml-auto font-display font-bold text-[11px] text-primary bg-primary/15 border border-primary/30 rounded-full px-2.5 py-0.5">
                        {value.length} dipilih
                    </span>
                )}
            </div>

            {/* Instruction */}
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card/50 px-4 py-3">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                    Pilih <strong className="text-foreground">semua</strong> area yang terasa sulit bagimu. Tidak ada jawaban yang salah — semakin jujur, semakin akurat program yang akan dibuat untukmu.
                </p>
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-1 gap-2.5">
                {KELEMAHAN_OPTIONS.map((opt) => {
                    const isSelected = value.includes(opt.id);
                    return (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => toggle(opt.id)}
                            className={`
                                flex items-center gap-3.5 w-full px-4 py-3.5 rounded-xl border text-left
                                transition-all duration-200 active:scale-[0.99]
                                ${isSelected
                                    ? opt.selectedBg
                                    : 'border-border bg-card/40 hover:border-border/80 hover:bg-card/70'
                                }
                            `}
                        >
                            {/* Custom checkbox */}
                            <span
                                className={`
                                    flex-shrink-0 h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all
                                    ${isSelected
                                        ? 'border-primary bg-primary'
                                        : 'border-muted-foreground/30 bg-transparent'
                                    }
                                `}
                            >
                                {isSelected && (
                                    <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 fill-none stroke-white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="1 4 4 7 9 1" />
                                    </svg>
                                )}
                            </span>

                            {/* Emoji */}
                            <span className="text-xl leading-none flex-shrink-0">{opt.emoji}</span>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <div
                                    className={`text-sm font-semibold leading-tight transition-colors ${isSelected ? opt.color : 'text-foreground'}`}
                                >
                                    {opt.label}
                                </div>
                                <div className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                                    {opt.desc}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Empty state nudge */}
            {value.length === 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/50 px-3.5 py-2.5">
                    <CheckSquare className="h-3.5 w-3.5 text-muted-foreground/40" />
                    <p className="text-[11px] text-muted-foreground/50">
                        Pilih minimal satu area untuk melanjutkan, atau lewati jika merasa semua sudah baik.
                    </p>
                </div>
            )}

            {/* Summary when selected */}
            {value.length > 0 && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3.5">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-primary/70 mb-2">
                        Area yang akan diprioritaskan
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {value.map((id) => {
                            const opt = KELEMAHAN_OPTIONS.find((o) => o.id === id);
                            if (!opt) return null;
                            return (
                                <span
                                    key={id}
                                    className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border ${opt.selectedBg} ${opt.color}`}
                                >
                                    {opt.emoji} {opt.label}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
