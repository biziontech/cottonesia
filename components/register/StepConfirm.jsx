'use client';

import Link from 'next/link';
import { Check, ArrowRight, Sparkles, Activity, Target } from 'lucide-react';

/**
 * Step 3 — Konfirmasi & Review
 *
 * data: full form data { account: {...}, targets: [...] }
 */
export default function StepConfirm({ data, onSubmit }) {
    const { account = {}, targets = [] } = data || {};

    return (
        <div className="space-y-6">
            {/* Hero icon */}
            <div className="flex flex-col items-center text-center">
                <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-2xl shadow-primary/30 mb-5">
                    <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
                    <Check className="relative h-9 w-9 text-primary-foreground" strokeWidth={3} />
                </div>
                <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
                    Hampir <span className="text-primary">Selesai!</span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-md">
                    Akun kamu sudah siap. Langkah terakhir — selesaikan asesmen fisik agar kami bisa
                    membuat program yang tepat untukmu.
                </p>
            </div>

            {/* Summary card */}
            <div className="rounded-2xl border border-border bg-card/60 p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                        — Ringkasan Akun
                    </div>
                    <Sparkles className="h-4 w-4 text-primary/70" />
                </div>

                {/* Account info */}
                <div className="space-y-3">
                    <Row label="Nama" value={account.nama || '—'} />
                    <Row label="Email" value={account.email || '—'} />
                    <Row label="No. WhatsApp" value={account.hp || '—'} />
                    <Row
                        label="Jenis Kelamin"
                        value={account.gender === 'L' ? 'Laki-laki' : account.gender === 'P' ? 'Perempuan' : '—'}
                    />
                </div>

                {/* Divider */}
                <div className="h-px bg-border/60" />

                {/* Targets */}
                <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-3">
                        Target Sekolah ({targets.length})
                    </div>
                    {targets.length === 0 ? (
                        <p className="text-sm text-muted-foreground/70 italic">Belum ada target dipilih.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {targets.map((t) => (
                                <span
                                    key={t}
                                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-primary/10 border border-primary/30 text-xs font-medium text-primary"
                                >
                                    <Check className="h-3 w-3" />
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Next steps preview */}
            <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 sm:p-6">
                <div className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-xl bg-primary/20 ring-1 ring-primary/30 flex items-center justify-center shrink-0">
                        <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-lg">Asesmen Fisik Awal</h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            Tes baseline 4 langkah untuk mengukur kondisi awal kamu — profil fisik,
                            riwayat olahraga, tes baseline, dan self-assessment. Estimasi 5 menit.
                        </p>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                    {['Profil Fisik', 'Riwayat', 'Tes Baseline', 'Self-Assessment'].map((step, i) => (
                        <div
                            key={step}
                            className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-background/60 border border-border/60"
                        >
                            <span className="font-display font-bold text-primary">0{i + 1}</span>
                            <span className="text-muted-foreground">{step}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3 pt-2">
                <button
                    type="button"
                    onClick={onSubmit}
                    className="w-full h-13 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold inline-flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.99] transition shadow-xl shadow-primary/25"
                >
                    <Target className="h-4 w-4" />
                    Mulai Asesmen Fisik
                    <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                    href="/dashboard"
                    className="text-center text-sm text-muted-foreground hover:text-primary transition py-2"
                >
                    Lewati dulu, isi nanti →
                </Link>
            </div>
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
            <span className="text-sm font-medium text-foreground truncate max-w-[60%]">{value}</span>
        </div>
    );
}
