'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ClipboardList, Timer, BarChart3, Target,
    Footprints, ArrowUpToLine, Dumbbell, Repeat, Move3d,
} from 'lucide-react';

import Navbar from '@/components/partials/Navbar';
import {
    Stepper,
    StepperList,
    StepperItem,
    StepperTrigger,
    StepperIndicator,
    StepperTitle,
    StepperDescription,
    StepperSeparator,
    StepperContent,
    StepperPrev,
    StepperNext,
} from '@/components/ui/stepper';

import StepProfile from '@/components/register/StepProfile';
import StepHistory from '@/components/register/StepHistory';
import StepBaseline from '@/components/register/StepBaseline';
import StepSelfAssess from '@/components/register/StepSelfAssess';

const STEP_KEYS = ['profile', 'history', 'baseline', 'selfassess'];

const STEP_LABELS = {
    profile: { title: 'Profil Fisik', desc: 'Tinggi, berat & usia' },
    history: { title: 'Riwayat', desc: 'Kondisi olahraga' },
    baseline: { title: 'Tes Baseline', desc: '5 tes mandiri' },
    selfassess: { title: 'Self-Assessment', desc: 'Identifikasi kelemahan' },
};

export default function AssessmentPage() {
    const router = useRouter();
 
    const [step, setStep] = useState('profile');
 
    // ─── form state ──────────────────────────────────────────────────────────
    const [profile, setProfile] = useState({ tinggi: '', berat: '', usia: '' });
    const [history, setHistory] = useState({ riwayat: '', cedera: '' });
    const [baseline, setBaseline] = useState({
        lari: '', pullup: '', pushup: '', situp: '', shuttle: '',
    });
    const [selfAssess, setSelfAssess] = useState([]);
 
    // ─── per-step validation ─────────────────────────────────────────────────
    const profileValid = useMemo(() => {
        return Boolean(profile.tinggi && profile.berat && profile.usia);
    }, [profile]);
 
    const historyValid = useMemo(() => Boolean(history.riwayat), [history.riwayat]);
 
    const baselineValid = useMemo(() => {
        return ['lari', 'pullup', 'pushup', 'situp', 'shuttle'].every((k) => baseline[k]);
    }, [baseline]);
 
    const handleValidate = async (target, direction) => {
        if (direction !== 'next') return true;
 
        const fromIdx = STEP_KEYS.indexOf(step);
        const toIdx = STEP_KEYS.indexOf(target);
 
        if (fromIdx <= 0 && toIdx >= 1 && !profileValid) return false;
        if (fromIdx <= 1 && toIdx >= 2 && !historyValid) return false;
        if (fromIdx <= 2 && toIdx >= 3 && !baselineValid) return false;
 
        return true;
    };
 
    const handleSubmit = () => {
        router.push('/diagnosis');
    };
 
    const stepIndex = STEP_KEYS.indexOf(step);
    const isLastStep = stepIndex === STEP_KEYS.length - 1;
    const progressPct = Math.round(((stepIndex + 1) / STEP_KEYS.length) * 100);
 
    return (
        <div className="dark bg-background text-foreground min-h-screen font-body antialiased">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                .grid-bg {
                    background-image:
                        linear-gradient(rgba(219, 149, 73, 0.06) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(219, 149, 73, 0.06) 1px, transparent 1px);
                    background-size: 56px 56px;
                }
                @keyframes float-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .anim-float-up { animation: float-up 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
            `}</style>
 
            {/* <Navbar variant="solid" ctaHref="/dashboard" ctaLabel="Lewati" showLinks={false} /> */}
 
            <main className="relative">
                {/* ═════════════════════════════════════════════════════════ */}
                {/* SECTION 1 — HERO                                          */}
                {/* ═════════════════════════════════════════════════════════ */}
                <section className="relative overflow-hidden border-b border-border/40">
                    <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
                    <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
 
                    <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20 pb-14 lg:pb-20 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary mb-7 anim-float-up">
                            <ClipboardList className="h-3.5 w-3.5" />
                            ASESMEN FISIK AWAL
                        </div>
 
                        <h1 className="font-display font-bold leading-[0.95] text-5xl sm:text-6xl lg:text-7xl tracking-tight anim-float-up">
                            <span className="block">MARI UKUR</span>
                            <span className="block text-primary">KONDISIMU.</span>
                        </h1>
 
                        <p
                            className="mt-7 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed anim-float-up"
                            style={{ animationDelay: '0.1s' }}
                        >
                            Asesmen 4 langkah ini akan menentukan{' '}
                            <span className="text-foreground font-semibold">program latihan yang dirancang khusus</span>{' '}
                            untukmu — sesuai kondisi awal &amp; target seleksi.
                        </p>
 
                        {/* 3 features — horizontal grid */}
                        <div
                            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto anim-float-up"
                            style={{ animationDelay: '0.2s' }}
                        >
                            {[
                                {
                                    icon: ClipboardList,
                                    title: '4 Langkah Mudah',
                                    desc: 'Profil, riwayat, tes baseline, & self-assessment.',
                                },
                                {
                                    icon: Timer,
                                    title: '5–10 Menit Selesai',
                                    desc: 'Singkat tapi menyeluruh untuk akurasi maksimal.',
                                },
                                {
                                    icon: BarChart3,
                                    title: 'Diagnosa Instan',
                                    desc: 'Skor kesiapan & rekomendasi langsung tampil.',
                                },
                            ].map((f) => (
                                <div
                                    key={f.title}
                                    className="rounded-2xl border border-border bg-card/40 backdrop-blur p-5 sm:p-6 text-left hover:border-primary/30 transition-all"
                                >
                                    <div className="h-11 w-11 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center mb-4">
                                        <f.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="font-display font-bold text-base">{f.title}</div>
                                    <div className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                                        {f.desc}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
 
                {/* ═════════════════════════════════════════════════════════ */}
                {/* SECTION 2 — ASSESSMENT FORM                               */}
                {/* ═════════════════════════════════════════════════════════ */}
                <section id="form" className="relative py-14 lg:py-20 bg-card/20">
                    <div className="absolute inset-0 grid-bg opacity-15 [mask-image:radial-gradient(ellipse_at_center,black,transparent_60%)]" />
 
                    {/* ── Wrapper lebar untuk stepper list + card ── */}
                    <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
 
                        {/* Section heading */}
                        <div className="text-center mb-10">
                            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-3">
                                — Mulai Asesmen
                            </div>
                            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                                Isi dengan <span className="text-primary">Jujur</span>
                            </h2>
                            <p className="text-sm text-muted-foreground mt-3">
                                Akurasi data menentukan ketepatan program latihan untukmu.
                            </p>
                        </div>
 
                        <Stepper value={step} onValueChange={setStep} onValidate={handleValidate}>
 
                            {/* ══════════════════════════════════════════════════
                                STEPPER LIST — di LUAR card, lebar penuh max-w-5xl
                            ══════════════════════════════════════════════════ */}
                            <StepperList className="mb-16">
                                {STEP_KEYS.map((key) => (
                                    <StepperItem key={key} value={key}>
                                        <StepperTrigger>
                                            <StepperIndicator />
                                            <div className="hidden sm:block">
                                                <StepperTitle>{STEP_LABELS[key].title}</StepperTitle>
                                                <StepperDescription>{STEP_LABELS[key].desc}</StepperDescription>
                                            </div>
                                        </StepperTrigger>
                                        <StepperSeparator />
                                    </StepperItem>
                                ))}
                            </StepperList>
 
                            {/* ══════════════════════════════════════════════════
                                FORM CARD — lebih sempit, konten terpusat
                            ══════════════════════════════════════════════════ */}
                            <div className="mx-auto max-w-xl">
                                <div className="rounded-2xl border border-border bg-card/80 backdrop-blur shadow-2xl shadow-black/20 p-6 sm:p-8">
 
                                    {/* Linear Progress Bar */}
                                    <div className="mb-7">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-xs">
                                                <span className="text-muted-foreground">Langkah </span>
                                                <span className="font-display font-bold text-primary">{stepIndex + 1}</span>
                                                <span className="text-muted-foreground"> dari {STEP_KEYS.length}</span>
                                            </div>
                                            <div className="font-display font-bold text-sm text-primary">{progressPct}%</div>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(219,149,73,0.6)]"
                                                style={{ width: `${progressPct}%` }}
                                            />
                                        </div>
                                    </div>
 
                                    {/* ─── STEP CONTENT ─── */}
                                    <StepperContent value="profile">
                                        <StepProfile value={profile} onChange={setProfile} />
                                    </StepperContent>
 
                                    <StepperContent value="history">
                                        <StepHistory value={history} onChange={setHistory} />
                                    </StepperContent>
 
                                    <StepperContent value="baseline">
                                        <StepBaseline value={baseline} onChange={setBaseline} />
                                    </StepperContent>
 
                                    <StepperContent value="selfassess">
                                        <StepSelfAssess value={selfAssess} onChange={setSelfAssess} />
                                    </StepperContent>
 
                                    {/* ─── NAV BUTTONS ─── */}
                                    <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 pt-6 border-t border-border/40">
                                        {step !== 'profile' && (
                                            <StepperPrev className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-xl text-sm font-semibold border border-border bg-card hover:bg-accent transition disabled:opacity-40 disabled:cursor-not-allowed sm:w-auto w-full">
                                                Kembali
                                            </StepperPrev>
                                        )}
 
                                        {isLastStep ? (
                                            <button
                                                type="button"
                                                onClick={handleSubmit}
                                                className="sm:flex-1 w-full inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99] transition shadow-lg shadow-primary/20"
                                            >
                                                <Target className="h-4 w-4" />
                                                Lihat Diagnosis Saya
                                            </button>
                                        ) : (
                                            <StepperNext className="sm:flex-1 w-full inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99] transition shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none">
                                                Lanjut
                                            </StepperNext>
                                        )}
                                    </div>
                                </div>
 
                                <p className="text-center text-sm text-muted-foreground mt-6">
                                    Belum mendaftar?{' '}
                                    <Link href="/register" className="text-primary font-semibold hover:underline">
                                        Daftar dulu di sini
                                    </Link>
                                </p>
                            </div>
 
                        </Stepper>
                    </div>
                </section>
 
                {/* ═════════════════════════════════════════════════════════ */}
                {/* SECTION 3 — APA YANG DIUKUR                               */}
                {/* ═════════════════════════════════════════════════════════ */}
                <section className="relative py-14 lg:py-20 border-t border-border/40">
                    <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
                    <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-3">
                                — Yang Akan Diukur
                            </div>
                            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                                Standar Penilaian <span className="text-primary">Resmi</span>
                            </h2>
                            <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto">
                                5 kategori tes baseline yang menjadi indikator utama seleksi TNI, POLRI &amp; Kedinasan.
                            </p>
                        </div>
 
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {[
                                { icon: Footprints, title: 'Daya Tahan', test: 'Lari Cooper 12 menit', target: '≥ 2400 m', color: 'red' },
                                { icon: ArrowUpToLine, title: 'Kekuatan Lengan', test: 'Pull-up maksimal', target: '≥ 10 rep', color: 'amber' },
                                { icon: Dumbbell, title: 'Kekuatan Atas', test: 'Push-up 1 menit', target: '≥ 35 rep', color: 'amber' },
                                { icon: Repeat, title: 'Kekuatan Inti', test: 'Sit-up 1 menit', target: '≥ 38 rep', color: 'emerald' },
                                { icon: Move3d, title: 'Kelincahan', test: 'Shuttle Run 4×10m', target: '≤ 11.5 dtk', color: 'emerald' },
                            ].map((c) => (
                                <div
                                    key={c.title}
                                    className="relative rounded-2xl border border-border bg-card/60 backdrop-blur p-5 hover:border-primary/30 transition-all group"
                                >
                                    <div className="h-11 w-11 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition">
                                        <c.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="font-display font-bold text-base mb-1.5">{c.title}</div>
                                    <div className="text-xs text-muted-foreground mb-3 leading-relaxed">
                                        {c.test}
                                    </div>
                                    <div className="pt-3 border-t border-border/40">
                                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70">Target</div>
                                        <div className="font-display font-bold text-sm text-primary mt-0.5">{c.target}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
 
                        {/* Bottom note */}
                        <div className="mt-10 text-center">
                            <p className="text-xs text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
                                Standar ini berdasarkan rata-rata batas kelulusan seleksi TNI/POLRI tahun 2024.
                                Target spesifik per instansi akan dijelaskan di hasil diagnosis.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}