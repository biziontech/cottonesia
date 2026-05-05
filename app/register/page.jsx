'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Shield, Sparkles, TrendingUp, Quote, Star, Award,
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

import StepAccount from '@/components/register/StepAccount';
import StepTarget from '@/components/register/StepTarget';
import StepConfirm from '@/components/register/StepConfirm';

const STEP_KEYS = ['account', 'target', 'confirm'];

const STEP_LABELS = {
    account: { title: 'Data Diri', desc: 'Akun & profil dasar' },
    target: { title: 'Target Sekolah', desc: 'Pilih instansi tujuan' },
    confirm: { title: 'Konfirmasi', desc: 'Selesaikan pendaftaran' },
};


export default function RegisterPage() {
    const router = useRouter();

    const [step, setStep] = useState('account');

    const [account, setAccount] = useState({
        nama: '', email: '', hp: '', password: '', confirmPassword: '', gender: '',
    });
    const [targets, setTargets] = useState([]);

    // ─── per-step validation ────────────────────────────────────────────────
    const errors = useMemo(() => {
        const e = {};
        if (account.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.email)) {
            e.email = 'Format email tidak valid';
        }
        if (account.password && account.password.length < 8) {
            e.password = 'Password minimal 8 karakter';
        }
        if (account.confirmPassword && account.password !== account.confirmPassword) {
            e.confirmPassword = 'Password tidak cocok';
        }
        return e;
    }, [account]);

    const accountValid = useMemo(() => {
        const filled =
            account.nama && account.email && account.hp &&
            account.password && account.confirmPassword && account.gender;
        return Boolean(filled) && Object.keys(errors).length === 0;
    }, [account, errors]);

    /**
     * Forward navigation guard. Used by Stepper for both Trigger clicks and Next button.
     * Returns false to block; true to allow.
     */
    const handleValidate = async (target, direction) => {
        if (direction !== 'next') return true;

        const fromIdx = STEP_KEYS.indexOf(step);
        const toIdx = STEP_KEYS.indexOf(target);

        // crossing past Account → require account valid
        if (fromIdx <= 0 && toIdx >= 1 && !accountValid) return false;
        // crossing past Target → require at least 1 target picked
        if (fromIdx <= 1 && toIdx >= 2 && targets.length === 0) return false;

        return true;
    };

    const handleSubmit = () => {
        // TODO: API call here
        // await fetch('/api/register', { method:'POST', body: JSON.stringify({ account, targets }) })
        router.push('/assessment');
    };

    // progress percentage for the linear bar
    const stepIndex = STEP_KEYS.indexOf(step);
    const progressPct = Math.round(((stepIndex + 1) / STEP_KEYS.length) * 100);

    return (
        <div className="dark bg-background text-foreground min-h-screen font-body antialiased">
            <style jsx global>{`
                .grid-bg {
                    background-image:
                        linear-gradient(rgba(219, 149, 73, 0.06) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(219, 149, 73, 0.06) 1px, transparent 1px);
                    background-size: 56px 56px;
                }
                @keyframes float-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .anim-float-up { animation: float-up 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
            `}</style>

            <Navbar variant="solid" ctaHref="/login" ctaLabel="Masuk" showLinks={false} />

            <main className="relative">
                {/* ═════════════════════════════════════════════════════════ */}
                {/* SECTION 1 — HERO (full width, centered)                   */}
                {/* ═════════════════════════════════════════════════════════ */}
                <section className="relative overflow-hidden border-b border-border/40">
                    <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
                    <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

                    <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20 pb-14 lg:pb-20 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary mb-7 anim-float-up">
                            <Sparkles className="h-3.5 w-3.5" />
                            GRATIS · TANPA KARTU KREDIT
                        </div>

                        <h1 className="font-display font-bold leading-[0.95] text-5xl sm:text-6xl lg:text-7xl tracking-tight anim-float-up">
                            <span className="block">SIAP HADAPI</span>
                            <span className="block text-primary">SELEKSI?</span>
                        </h1>

                        <p
                            className="mt-7 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed anim-float-up"
                            style={{ animationDelay: '0.1s' }}
                        >
                            Bergabung dengan{' '}
                            <span className="text-foreground font-semibold">2.500+ calon prajurit &amp; taruna</span>{' '}
                            yang sudah memulai persiapan bersama BINSIK PRO.
                        </p>

                        {/* 3 features — horizontal grid */}
                        <div
                            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto anim-float-up"
                            style={{ animationDelay: '0.2s' }}
                        >
                            {[
                                { icon: Shield, title: 'Program Terstruktur', desc: 'Dirancang sesuai standar seleksi resmi.' },
                                { icon: TrendingUp, title: 'Monitoring Digital', desc: 'Pantau progres latihanmu secara real-time.' },
                                { icon: Sparkles, title: 'Coach Berpengalaman', desc: 'Dibimbing langsung oleh alumni & expert.' },
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
                {/* SECTION 2 — REGISTER FORM (with progress bar)            */}
                {/* ═════════════════════════════════════════════════════════ */}
                <section id="form" className="relative py-14 lg:py-20 bg-card/20">
                    <div className="absolute inset-0 grid-bg opacity-15 [mask-image:radial-gradient(ellipse_at_center,black,transparent_60%)]" />
                    <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-3">
                                — Pendaftaran
                            </div>
                            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                                Daftar untuk <span className="text-primary">Mulai</span>
                            </h2>
                            <p className="text-sm text-muted-foreground mt-3">
                                Isi form di bawah — kurang dari 2 menit selesai.
                            </p>
                        </div>

                        {/* Form Card */}
                        {/* ── Wrapper lebar untuk stepper list + card ── */}
                        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

                            <Stepper value={step} onValueChange={setStep} onValidate={handleValidate}>

                                {/* ══════════════════════════════════════════════════
            STEPPER LIST — di LUAR card, lebar penuh max-w-5xl
        ══════════════════════════════════════════════════ */}
                                <StepperList className=" mb-16">
                                    <StepperItem value="account">
                                        <StepperTrigger>
                                            <StepperIndicator />
                                            <div className="hidden sm:block">
                                                <StepperTitle>{STEP_LABELS.account.title}</StepperTitle>
                                                <StepperDescription>{STEP_LABELS.account.desc}</StepperDescription>
                                            </div>
                                        </StepperTrigger>
                                        <StepperSeparator />
                                    </StepperItem>

                                    <StepperItem value="target">
                                        <StepperTrigger>
                                            <StepperIndicator />
                                            <div className="hidden sm:block">
                                                <StepperTitle>{STEP_LABELS.target.title}</StepperTitle>
                                                <StepperDescription>{STEP_LABELS.target.desc}</StepperDescription>
                                            </div>
                                        </StepperTrigger>
                                        <StepperSeparator />
                                    </StepperItem>

                                    <StepperItem value="confirm">
                                        <StepperTrigger>
                                            <StepperIndicator />
                                            <div className="hidden sm:block">
                                                <StepperTitle>{STEP_LABELS.confirm.title}</StepperTitle>
                                                <StepperDescription>{STEP_LABELS.confirm.desc}</StepperDescription>
                                            </div>
                                        </StepperTrigger>
                                    </StepperItem>
                                </StepperList>

                                {/* ══════════════════════════════════════════════════
            FORM CARD — sempit & terpusat
        ══════════════════════════════════════════════════ */}
                                <div className="mx-auto max-w-2xl">
                                    <div className="rounded-2xl border border-border bg-card/80 backdrop-blur shadow-2xl shadow-black/20 p-6 sm:p-8 lg:p-10">

                                        {/* Linear Progress Bar */}
                                        <div className="mb-9">
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
                                        <StepperContent value="account">
                                            <StepAccount value={account} onChange={setAccount} errors={errors} />
                                        </StepperContent>

                                        <StepperContent value="target">
                                            <StepTarget value={targets} onChange={setTargets} />
                                        </StepperContent>

                                        <StepperContent value="confirm">
                                            <StepConfirm data={{ account, targets }} onSubmit={handleSubmit} />
                                        </StepperContent>

                                        {/* ─── NAV BUTTONS (hide on confirm — has own CTA) ─── */}
                                        {step !== 'confirm' && (
                                            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 pt-6 border-t border-border/40">
                                                {step === 'account' ? (
                                                    <Link
                                                        href="/"
                                                        className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-xl text-sm font-semibold border border-border bg-card hover:bg-accent transition sm:w-auto w-full"
                                                    >
                                                        Batal
                                                    </Link>
                                                ) : (
                                                    <StepperPrev className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-xl text-sm font-semibold border border-border bg-card hover:bg-accent transition disabled:opacity-40 disabled:cursor-not-allowed sm:w-auto w-full">
                                                        Kembali
                                                    </StepperPrev>
                                                )}
                                                <StepperNext className="sm:flex-1 w-full inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99] transition shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none">
                                                    Lanjut
                                                </StepperNext>
                                            </div>
                                        )}

                                    </div>
                                </div>

                            </Stepper>
                        </div>

                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Sudah punya akun?{' '}
                            <Link href="/login" className="text-primary font-semibold hover:underline">
                                Masuk di sini
                            </Link>
                        </p>
                    </div>
                </section>

                {/* ═════════════════════════════════════════════════════════ */}
                {/* SECTION 3 — TESTIMONIALS                                  */}
                {/* ═════════════════════════════════════════════════════════ */}
                <section className="relative py-14 lg:py-20 border-t border-border/40">
                    <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
                    <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-3">
                                — Cerita Member
                            </div>
                            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                                Mereka sudah <span className="text-primary">lolos</span>
                            </h2>
                            <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto">
                                Bergabung dengan ribuan alumni yang sudah membuktikan program ini berhasil.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[
                                {
                                    name: 'Andi Saputra', badge: 'Lolos TNI AD 2024', initials: 'AS',
                                    text: 'Dari nol sampai lolos TNI AD! Program disiplin, atmosfer latihan keren. Highly recommended.',
                                },
                                {
                                    name: 'Rizky Pratama', badge: 'Lolos POLRI 2024', initials: 'RP',
                                    text: 'Coach-nya benar-benar perhatian. Setiap minggu ada evaluasi dan koreksi. Hasilnya kelihatan banget.',
                                },
                                {
                                    name: 'Nabila Putri', badge: 'Lolos IPDN 2024', initials: 'NP',
                                    text: 'Latihannya menantang tapi efektif. Simulasi tesnya mirip dengan yang asli. Alhamdulillah lolos IPDN.',
                                },
                            ].map((t) => (
                                <div
                                    key={t.name}
                                    className="relative rounded-2xl border border-border bg-card/60 backdrop-blur p-6 hover:border-primary/30 transition-all"
                                >
                                    <Quote className="absolute -top-3 left-5 h-7 w-7 text-primary fill-primary" />

                                    <div className="flex items-center gap-3 mb-4 pt-2">
                                        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 ring-1 ring-primary/30 flex items-center justify-center font-display font-bold text-sm">
                                            {t.initials}
                                        </div>
                                        <div className="leading-tight">
                                            <div className="font-semibold">{t.name}</div>
                                            <div className="text-xs text-primary flex items-center gap-1">
                                                <Award className="h-3 w-3" />
                                                {t.badge}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-0.5 mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                                        &ldquo;{t.text}&rdquo;
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* trust mini-stats */}
                        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-center">
                            <div>
                                <div className="font-display font-bold text-2xl sm:text-3xl text-primary">2.500+</div>
                                <div className="text-xs text-muted-foreground mt-1">Member Aktif</div>
                            </div>
                            <div className="h-10 w-px bg-border/60" />
                            <div>
                                <div className="font-display font-bold text-2xl sm:text-3xl text-primary">78%</div>
                                <div className="text-xs text-muted-foreground mt-1">Tingkat Kelulusan</div>
                            </div>
                            <div className="h-10 w-px bg-border/60" />
                            <div>
                                <div className="font-display font-bold text-2xl sm:text-3xl text-primary">25+</div>
                                <div className="text-xs text-muted-foreground mt-1">Coach Profesional</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}