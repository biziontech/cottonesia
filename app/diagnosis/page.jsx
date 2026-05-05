'use client';

import Link from 'next/link';
import {
    FileText, Footprints, ArrowUpToLine, Dumbbell, Repeat, Move3d,
    AlertTriangle, CheckCircle2, Target, Dna,
    ChevronRight, RotateCcw, Flame, ShieldAlert, Trophy,
} from 'lucide-react';

import Navbar from '@/components/partials/Navbar';

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const REPORT = {
    nama: 'Andi Pratama',
    target: 'Akpol',
    tanggal: '5 Mei 2026',
    waktuTersisa: '4 bulan',
    overall: 68,

    scores: [
        {
            key: 'lari',
            icon: Footprints,
            label: 'Daya Tahan Lari',
            sub: 'Lari Cooper 12 Menit',
            nilai: 2100,
            unit: 'm',
            standar: 2400,
            status: 'kritis',
            reverseScore: false,
        },
        {
            key: 'pullup',
            icon: ArrowUpToLine,
            label: 'Kekuatan Lengan',
            sub: 'Pull-up Maksimal',
            nilai: 7,
            unit: 'rep',
            standar: 10,
            status: 'perlu_latihan',
            reverseScore: false,
        },
        {
            key: 'pushup',
            icon: Dumbbell,
            label: 'Kekuatan Dada & Bahu',
            sub: 'Push-up 1 Menit',
            nilai: 30,
            unit: 'rep',
            standar: 35,
            status: 'perlu_latihan',
            reverseScore: false,
        },
        {
            key: 'situp',
            icon: Repeat,
            label: 'Kekuatan Inti',
            sub: 'Sit-up 1 Menit',
            nilai: 35,
            unit: 'rep',
            standar: 38,
            status: 'perlu_latihan',
            reverseScore: false,
        },
        {
            key: 'shuttle',
            icon: Move3d,
            label: 'Kelincahan',
            sub: 'Shuttle Run 4x10m',
            nilai: 11.2,
            unit: 'dtk',
            standar: 11.5,
            status: 'baik',
            reverseScore: true,
        },
    ],

    prioritas: [
        'Daya tahan lari masih jauh di bawah standar Akpol.',
        'Kekuatan lengan (pull-up) perlu peningkatan signifikan.',
        'Kekuatan inti dan dada cukup tapi belum melewati batas minimal.',
    ],

    analisis: [
        [
            { text: 'Berdasarkan hasil asesmen, kondisi fisikmu saat ini berada di level ' },
            { text: '68% kesiapan', bold: true },
            { text: ' terhadap standar seleksi Akpol. Kabar baiknya, kelincahan kamu sudah melampaui standar yang dipersyaratkan — ini modal yang sangat baik.' },
        ],
        [
            { text: 'Yang perlu segera diperbaiki adalah ' },
            { text: 'daya tahan kardiovaskular', bold: true },
            { text: '. Jarak lari Cooper 2.100 meter masih 300 meter di bawah batas minimum. Dengan program lari interval 4x seminggu, target 2.400 meter realistis dicapai dalam 6-8 minggu.' },
        ],
        [
            { text: 'Kekuatan lengan, dada, dan inti berada di zona "perlu latihan" — tidak kritis, tapi butuh konsistensi. Latihan beban progresif 3x seminggu dikombinasikan dengan sirkuit bodyweight akan mengejar gap ini secara efisien.' },
        ],
        [
            { text: 'Secara keseluruhan, dengan ' },
            { text: 'program 4 bulan yang terstruktur', bold: true },
            { text: ', kamu memiliki peluang nyata untuk melewati batas minimal seleksi Akpol. Kunci utamanya adalah konsistensi dan tidak melewatkan sesi kardio.' },
        ],
    ],

    rekomendasi: [
        {
            fase: 'Bulan 1-2',
            fokus: 'Fondasi Kardio & Kekuatan Dasar',
            items: [
                'Lari interval 400m x 6 set, 4x seminggu',
                'Pull-up progresif: negatives + assisted, 3x seminggu',
                'Push-up & sit-up sirkuit: 3 set maksimal, 3x seminggu',
            ],
        },
        {
            fase: 'Bulan 3',
            fokus: 'Peningkatan Volume & Intensitas',
            items: [
                'Lari jarak jauh 5K-8K, 2x seminggu + interval 800m, 2x seminggu',
                'Pull-up: target 8 rep strict, tambah beban bertahap',
                'Push-up 40+ rep dalam 1 menit sebagai benchmark baru',
            ],
        },
        {
            fase: 'Bulan 4',
            fokus: 'Simulasi Seleksi & Puncak',
            items: [
                'Simulasi tes Cooper penuh setiap Jumat',
                'Drill lengkap 5 kategori tes dalam satu sesi',
                'Recovery & tapering 1 minggu sebelum seleksi',
            ],
        },
    ],
};

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    kritis: {
        label: 'Kritis',
        color: 'text-red-400',
        bg: 'bg-red-400/10',
        border: 'border-red-400/30',
        barFrom: '#ef4444',
        barTo: '#f87171',
    },
    perlu_latihan: {
        label: 'Perlu Latihan',
        color: 'text-amber-400',
        bg: 'bg-amber-400/10',
        border: 'border-amber-400/30',
        barFrom: '#d97706',
        barTo: '#fbbf24',
    },
    baik: {
        label: 'Baik',
        color: 'text-green-400',
        bg: 'bg-green-400/10',
        border: 'border-green-400/30',
        barFrom: '#16a34a',
        barTo: '#4ade80',
    },
};

function getOverallStyle(pct) {
    if (pct < 55) {
        return { textClass: 'text-red-400', glowColor: 'rgba(248,113,113,0.4)', barFrom: '#ef4444', barTo: '#f87171' };
    }
    if (pct < 75) {
        return { textClass: 'text-amber-400', glowColor: 'rgba(251,191,36,0.4)', barFrom: '#d97706', barTo: '#fbbf24' };
    }
    return { textClass: 'text-green-400', glowColor: 'rgba(74,222,128,0.4)', barFrom: '#16a34a', barTo: '#4ade80' };
}

function calcPct(s) {
    if (s.reverseScore) {
        return Math.min(100, Math.round((s.standar / s.nilai) * 100));
    }
    return Math.min(100, Math.round((s.nilai / s.standar) * 100));
}

function getGapText(s) {
    if (s.reverseScore) {
        const diff = (s.nilai - s.standar).toFixed(1);
        return parseFloat(diff) > 0
            ? diff + ' ' + s.unit + ' di atas batas'
            : 'Memenuhi standar';
    }
    if (s.nilai >= s.standar) {
        return '+' + (s.nilai - s.standar) + ' ' + s.unit + ' di atas standar';
    }
    return '-' + (s.standar - s.nilai) + ' ' + s.unit + ' dari standar';
}

// ─── RING SVG ─────────────────────────────────────────────────────────────────
function Ring({ value, size, stroke, glowColor, strokeColor }) {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (value / 100) * circ;
    const ov = getOverallStyle(value);

    return (
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle
                    cx={size / 2} cy={size / 2} r={r}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth={stroke}
                />
                <circle
                    cx={size / 2} cy={size / 2} r={r}
                    fill="none"
                    stroke={strokeColor || '#db9549'}
                    strokeWidth={stroke}
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{
                        transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)',
                        filter: 'drop-shadow(0 0 8px ' + (glowColor || 'rgba(219,149,73,0.5)') + ')',
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                    className={'font-display font-bold leading-none ' + ov.textClass}
                    style={{ fontSize: Math.round(size * 0.22) }}
                >
                    {value}%
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                    Siap
                </span>
            </div>
        </div>
    );
}

// ─── PROSE RENDERER ───────────────────────────────────────────────────────────
function AnalisisProse({ paragraphs }) {
    return (
        <div className="space-y-4">
            {paragraphs.map((segments, pi) => (
                <p key={pi} className="text-sm text-muted-foreground leading-relaxed">
                    {segments.map((seg, si) =>
                        seg.bold
                            ? <strong key={si} className="text-foreground font-semibold">{seg.text}</strong>
                            : <span key={si}>{seg.text}</span>
                    )}
                </p>
            ))}
        </div>
    );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function DiagnosisPage() {
    const ov = getOverallStyle(REPORT.overall);
    const kritisCount = REPORT.scores.filter(s => s.status === 'kritis').length;
    const baikCount = REPORT.scores.filter(s => s.status === 'baik').length;

    return (
        <div className="dark bg-background text-foreground min-h-screen font-body antialiased">
            <style jsx global>{`
                .grid-bg {
                    background-image:
                        linear-gradient(rgba(219,149,73,0.06) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(219,149,73,0.06) 1px, transparent 1px);
                    background-size: 56px 56px;
                }
                @keyframes float-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .anim-float-up { animation: float-up 0.7s cubic-bezier(0.2,0.8,0.2,1) both; }
            `}</style>

            {/* <Navbar variant="solid" ctaHref="/dashboard" ctaLabel="Ke Dashboard" showLinks={false} /> */}

            <main className="relative">

                {/* ══════════════════════════════════════════════════════════ */}
                {/* SECTION 1 — HERO RESULT                                   */}
                {/* ══════════════════════════════════════════════════════════ */}
                <section className="relative overflow-hidden border-b border-border/40">
                    <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
                    <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

                    <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20 pb-14 lg:pb-20">

                        {/* Badge */}
                        <div className="flex justify-center mb-8 anim-float-up">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary">
                                <FileText className="h-3.5 w-3.5" />
                                LAPORAN DIAGNOSIS FISIK &middot; {REPORT.tanggal}
                            </div>
                        </div>

                        {/* Hero grid */}
                        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-14 anim-float-up">

                            {/* Left: ring + nama */}
                            <div className="flex flex-col items-center text-center lg:text-left lg:items-start flex-shrink-0">
                                <Ring
                                    value={REPORT.overall}
                                    size={148}
                                    stroke={11}
                                    glowColor={ov.glowColor}
                                    strokeColor={ov.barTo}
                                />
                                <h1 className="font-display font-bold text-3xl sm:text-4xl mt-5 tracking-tight leading-tight">
                                    {REPORT.nama}
                                </h1>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Target:{' '}
                                    <span className="text-primary font-semibold">{REPORT.target}</span>
                                    {' · '}
                                    Waktu tersisa:{' '}
                                    <span className="font-medium text-foreground">{REPORT.waktuTersisa}</span>
                                </p>
                            </div>

                            {/* Right: stat cards */}
                            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-4">

                                <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Trophy className="h-4 w-4 text-primary" />
                                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                            Kesiapan
                                        </span>
                                    </div>
                                    <div className={'font-display font-bold text-4xl leading-none ' + ov.textClass}>
                                        {REPORT.overall}<span className="text-2xl">%</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                        Target kelulusan {REPORT.target}:{' '}
                                        <span className="text-foreground font-medium">80%</span>
                                    </p>
                                    <div className="mt-3 h-1.5 rounded-full bg-muted/40 overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{
                                                width: REPORT.overall + '%',
                                                background: 'linear-gradient(to right, ' + ov.barFrom + ', ' + ov.barTo + ')',
                                            }}
                                        />
                                    </div>
                                    <div className="text-[10px] text-muted-foreground/60 mt-1.5">Batas minimum 80%</div>
                                </div>

                                <div className="rounded-2xl border border-red-400/25 bg-red-400/5 backdrop-blur p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <ShieldAlert className="h-4 w-4 text-red-400" />
                                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                            Area Kritis
                                        </span>
                                    </div>
                                    <div className="font-display font-bold text-4xl leading-none text-red-400">
                                        {kritisCount}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                        dari 5 kategori butuh perhatian{' '}
                                        <span className="text-red-400 font-medium">segera</span>
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {REPORT.scores.filter(s => s.status === 'kritis').map(s => (
                                            <span key={s.key} className="text-[10px] bg-red-400/10 border border-red-400/25 text-red-400 rounded-full px-2 py-0.5">
                                                {s.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-green-400/25 bg-green-400/5 backdrop-blur p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                            Sudah Baik
                                        </span>
                                    </div>
                                    <div className="font-display font-bold text-4xl leading-none text-green-400">
                                        {baikCount}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                        kategori sudah{' '}
                                        <span className="text-green-400 font-medium">melewati standar</span>
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {REPORT.scores.filter(s => s.status === 'baik').map(s => (
                                            <span key={s.key} className="text-[10px] bg-green-400/10 border border-green-400/25 text-green-400 rounded-full px-2 py-0.5">
                                                {s.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════ */}
                {/* SECTION 2 — SKOR PER KATEGORI                             */}
                {/* ══════════════════════════════════════════════════════════ */}
                <section className="relative py-14 lg:py-20 bg-card/20 border-b border-border/40">
                    <div className="absolute inset-0 grid-bg opacity-15 [mask-image:radial-gradient(ellipse_at_center,black,transparent_60%)]" />
                    <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

                        <div className="text-center mb-10">
                            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-3">
                                — Hasil Per Kategori
                            </div>
                            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                                Skor <span className="text-primary">Baseline</span>
                            </h2>
                            <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto">
                                Perbandingan hasil tesmu dengan standar minimum seleksi {REPORT.target}.
                            </p>
                        </div>

                        <div className="space-y-3.5">
                            {REPORT.scores.map((s) => {
                                const cfg = STATUS_CONFIG[s.status];
                                const Icon = s.icon;
                                const pct = calcPct(s);
                                const gapText = getGapText(s);

                                return (
                                    <div
                                        key={s.key}
                                        className={'rounded-2xl border backdrop-blur overflow-hidden ' + cfg.border + ' ' + cfg.bg}
                                    >
                                        <div className="flex items-center gap-4 px-5 py-4">
                                            <div className={'h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 border ' + cfg.bg + ' ' + cfg.border}>
                                                <Icon className={'h-5 w-5 ' + cfg.color} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-semibold text-sm text-foreground">{s.label}</span>
                                                    <span className={'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ' + cfg.bg + ' ' + cfg.border + ' ' + cfg.color}>
                                                        {cfg.label}
                                                    </span>
                                                </div>
                                                <span className="text-[11px] text-muted-foreground">{s.sub}</span>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <div className={'font-display font-bold text-2xl leading-none ' + cfg.color}>
                                                    {s.nilai}
                                                    <span className="text-sm font-normal text-muted-foreground ml-1">{s.unit}</span>
                                                </div>
                                                <div className="text-[11px] text-muted-foreground mt-0.5">
                                                    Standar:{' '}
                                                    <span className="font-medium text-foreground">{s.standar} {s.unit}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-5 pb-4">
                                            <div className="flex justify-between text-[10px] text-muted-foreground/60 mb-1.5">
                                                <span>{gapText}</span>
                                                <span className={'font-semibold ' + cfg.color}>{pct}%</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-black/20 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-700"
                                                    style={{
                                                        width: Math.min(pct, 100) + '%',
                                                        background: 'linear-gradient(to right, ' + cfg.barFrom + ', ' + cfg.barTo + ')',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════ */}
                {/* SECTION 3 — ANALISIS NARATIF                              */}
                {/* ══════════════════════════════════════════════════════════ */}
                <section className="relative py-14 lg:py-20 border-b border-border/40">
                    <div className="absolute inset-0 grid-bg opacity-15 [mask-image:radial-gradient(ellipse_at_center,black,transparent_60%)]" />
                    <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

                        <div className="text-center mb-10">
                            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-3">
                                — Interpretasi Hasil
                            </div>
                            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                                Analisis <span className="text-primary">Mendalam</span>
                            </h2>
                        </div>

                        <div className="mx-auto max-w-2xl">
                            <div className="rounded-2xl border border-red-400/25 bg-red-400/5 p-5 mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
                                    <span className="font-display font-bold text-sm text-red-400 uppercase tracking-wide">
                                        Prioritas Utama
                                    </span>
                                </div>
                                <ul className="space-y-2">
                                    {REPORT.prioritas.map((p, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/90 leading-relaxed">
                                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" />
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-6 sm:p-8">
                                <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-border/40">
                                    <div className="h-7 w-7 rounded-lg bg-primary/15 ring-1 ring-primary/20 flex items-center justify-center">
                                        <Dna className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    <span className="font-display font-semibold text-sm tracking-wide text-foreground/80">
                                        Catatan Pelatih
                                    </span>
                                </div>
                                <AnalisisProse paragraphs={REPORT.analisis} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════ */}
                {/* SECTION 4 — RENCANA PROGRAM                               */}
                {/* ══════════════════════════════════════════════════════════ */}
                <section className="relative py-14 lg:py-20 bg-card/20 border-b border-border/40">
                    <div className="absolute inset-0 grid-bg opacity-15 [mask-image:radial-gradient(ellipse_at_center,black,transparent_60%)]" />
                    <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

                        <div className="text-center mb-10">
                            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-3">
                                — Rencana Tindak Lanjut
                            </div>
                            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                                Program{' '}
                                <span className="text-primary">{REPORT.waktuTersisa}</span>
                            </h2>
                            <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto">
                                Dirancang khusus berdasarkan gap antara kondisi fisikmu saat ini dengan standar {REPORT.target}.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {REPORT.rekomendasi.map((r, i) => (
                                <div
                                    key={i}
                                    className="relative rounded-2xl border border-border bg-card/60 backdrop-blur p-6 hover:border-primary/30 transition-all group overflow-hidden"
                                >
                                    <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-wider text-primary mb-4">
                                        <Flame className="h-3 w-3" />
                                        {r.fase}
                                    </div>
                                    <div className="font-display font-bold text-lg leading-tight mb-4 group-hover:text-primary transition-colors">
                                        {r.fokus}
                                    </div>
                                    <ul className="space-y-2.5">
                                        {r.items.map((item, j) => (
                                            <li key={j} className="flex items-start gap-2.5">
                                                <ChevronRight className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                                                <span className="text-xs text-muted-foreground leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="absolute bottom-3 right-4 font-display font-bold text-6xl text-foreground/[0.04] select-none pointer-events-none leading-none">
                                        {i + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════ */}
                {/* SECTION 5 — CTA                                           */}
                {/* ══════════════════════════════════════════════════════════ */}
                <section className="relative py-14 lg:py-20">
                    <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[500px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

                    <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-4">
                            — Langkah Selanjutnya
                        </div>
                        <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
                            Siap Mulai <span className="text-primary">Latihan?</span>
                        </h2>
                        <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed">
                            Program latihanmu sudah siap. Mulai hari ini, pantau progresmu setiap minggu,
                            dan capai standar {REPORT.target} tepat waktu.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center justify-center gap-2 px-8 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99] transition shadow-lg shadow-primary/25 text-sm"
                                style={{ height: 52 }}
                            >
                                <Target className="h-4 w-4" />
                                Mulai Program Latihan
                            </Link>
                            <Link
                                href="/assessment"
                                className="inline-flex items-center justify-center gap-2 px-6 rounded-xl font-semibold border border-border bg-card hover:bg-accent transition text-sm text-foreground"
                                style={{ height: 52 }}
                            >
                                <RotateCcw className="h-4 w-4" />
                                Ulangi Asesmen
                            </Link>
                        </div>
                        <p className="text-xs text-muted-foreground/50 mt-8">
                            Diagnosis ini dibuat berdasarkan standar seleksi TNI/POLRI 2024.
                            Konsultasikan dengan pelatih untuk penyesuaian lebih lanjut.
                        </p>
                    </div>
                </section>

            </main>
        </div>
    );
}