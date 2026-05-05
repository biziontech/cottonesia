'use client';

import { useState } from 'react';
import {
    Menu, X, ArrowRight, Users, ShieldCheck, TrendingUp, Calendar,
    ClipboardCheck, Dumbbell, UserCog, Activity, Target, Star,
    Check, ShieldQuestion, Headphones, MapPin, Phone, Mail, Globe,
    ChevronDown, Instagram, Youtube, MessageCircle, Award, Flame,
    Crosshair, Medal, Zap
} from 'lucide-react';

import Navbar from '@/components/partials/Navbar';

export default function Page() {
    const [openFaq, setOpenFaq] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const heroStats = [
        { icon: Users, value: '2.500+', label: 'Member Aktif' },
        { icon: ShieldCheck, value: '25+', label: 'Coach Profesional' },
        { icon: TrendingUp, value: '78%', label: 'Rata-rata Kenaikan Performa' },
        { icon: Calendar, value: '120+', label: 'Offline Sessions Per Bulan' },
    ];

    const trustStats = [
        { icon: Users, value: '2.500+', label: 'Member Aktif' },
        { icon: ShieldCheck, value: '25+', label: 'Coach Berpengalaman' },
        { icon: TrendingUp, value: '78%', label: 'Rata-rata Kenaikan Performa' },
        { icon: MapPin, value: '120+', label: 'Sesi Offline / Bulan' },
    ];

    const programs = [
        {
            title: 'TNI',
            subtitle: 'Siap Hadapi Seleksi',
            detail: 'TNI AD, AL, AU',
            icon: Crosshair,
            tint: 'from-emerald-700/30 via-emerald-900/20 to-transparent',
            ring: 'ring-emerald-500/20',
        },
        {
            title: 'POLRI',
            subtitle: 'Persiapan Fisik',
            detail: 'Polri Terpadu',
            icon: ShieldCheck,
            tint: 'from-sky-700/30 via-sky-900/20 to-transparent',
            ring: 'ring-sky-500/20',
        },
        {
            title: 'KEDINASAN',
            subtitle: 'Sekolah Kedinasan',
            detail: '& Ikatan Dinas',
            icon: Medal,
            tint: 'from-amber-700/30 via-amber-900/20 to-transparent',
            ring: 'ring-amber-500/20',
        },
    ];

    const benefits = [
        { icon: ClipboardCheck, title: 'Assessment Awal', desc: 'Tes awal untuk memetakan kondisi & potensi diri.' },
        { icon: Target, title: 'Program Terstruktur', desc: 'Program latihan periodisasi yang terukur & progresif.' },
        { icon: UserCog, title: 'Coach Offline', desc: 'Dibimbing langsung oleh coach berpengalaman.' },
        { icon: Activity, title: 'Monitoring Progress', desc: 'Pantau perkembangan lewat sistem digital BINSIK PRO.' },
        { icon: Flame, title: 'Simulasi Tes', desc: 'Simulasi berkala sesuai standar seleksi resmi.' },
    ];

    const steps = [
        { num: '1', title: 'Assessment Awal', desc: 'Tes fisik awal untuk mengetahui kondisi, kekuatan & area yang perlu ditingkatkan.', icon: ClipboardCheck },
        { num: '2', title: 'Program Latihan', desc: 'Program latihan disusun sesuai hasil assessment & target seleksi yang kamu tuju.', icon: Dumbbell },
        { num: '3', title: 'Pendampingan Coach', desc: 'Latihan offline bersama coach berpengalaman dengan koreksi dan motivasi setiap sesi.', icon: UserCog },
        { num: '4', title: 'Simulasi & Evaluasi', desc: 'Simulasi tes berkala & evaluasi untuk memastikan kamu siap maksimal saat ujian.', icon: Target },
    ];

    const testimonials = [
        {
            name: 'Rizky Pratama',
            badge: 'Lolos TNI AD 2024',
            text: 'BINSIK PRO sangat membantu saya meningkatkan fisik dan mental. Programnya terstruktur dan coach-nya benar-benar perhatian. Hasilnya, saya lolos TNI AD!',
            initials: 'RP',
        },
        {
            name: 'Nabila Putri',
            badge: 'Lolos Polri 2024',
            text: 'Latihannya menantang tapi efektif. Simulasi tesnya mirip dengan yang asli. Alhamdulillah saya bisa lolos Polri berkat bimbingan dari BINSIK PRO.',
            initials: 'NP',
        },
    ];

    const pricing = [
        {
            name: '1 BULAN',
            tag: 'Fokus & Adaptasi',
            price: '950.000',
            popular: false,
            features: ['12x Sesi Latihan Offline', 'Assessment Awal', 'Monitoring Digital', 'Simulasi Tes 1x'],
        },
        {
            name: '3 BULAN',
            tag: 'Progres Optimal',
            price: '800.000',
            popular: true,
            features: ['36x Sesi Latihan Offline', 'Assessment Awal & Akhir', 'Monitoring Digital', 'Simulasi Tes 3x', 'Konsultasi Coach'],
        },
        {
            name: '6 BULAN',
            tag: 'Persiapan Maksimal',
            price: '750.000',
            popular: false,
            features: ['72x Sesi Latihan Offline', 'Assessment Awal & Akhir', 'Monitoring Digital', 'Simulasi Tes 6x', 'Konsultasi Coach Prioritas'],
        },
    ];

    const faqs = [
        { q: 'Siapa saja yang bisa bergabung di BINSIK PRO?', a: 'Calon TNI, POLRI, dan siswa Sekolah Kedinasan/Ikatan Dinas berusia minimal 16 tahun yang ingin mempersiapkan diri secara serius untuk menghadapi seleksi fisik.' },
        { q: 'Apakah ada jaminan lolos seleksi?', a: 'Kami tidak menjanjikan kelulusan instan, namun program dirancang berbasis standar resmi. Garansi: jika tidak ada hasil setelah 1 bulan, kamu bisa mengulang program GRATIS.' },
        { q: 'Apakah latihan dilakukan setiap hari?', a: 'Latihan offline dilakukan 3x seminggu (12 sesi/bulan), dengan tambahan latihan mandiri yang bisa dipantau melalui aplikasi monitoring digital.' },
        { q: 'Bagaimana jika saya tidak bisa hadir latihan?', a: 'Kamu bisa rescheduling ke jadwal lain pada minggu yang sama. Tim kami fleksibel dengan kebutuhan jadwal peserta.' },
        { q: 'Bagaimana sistem monitoring progress?', a: 'Setiap peserta mendapat akses dashboard digital yang mencatat hasil tes, progres latihan, target mingguan, dan evaluasi coach.' },
        { q: 'Kapan saya bisa mulai latihan?', a: 'Setelah mendaftar dan menyelesaikan Assessment Awal, kamu bisa langsung memulai program di sesi terdekat (3-7 hari).' },
    ];

    const navLinks = ['Program', 'Jadwal', 'Coach', 'Testimoni', 'FAQ'];

    return (
        <div className="dark bg-background text-foreground min-h-screen font-geist antialiased selection:bg-primary/30 selection:text-primary-foreground">
            {/* Font + decorative styles */}
            <style jsx global>{`
                .font-body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
                @keyframes float-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes scan-line { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
                @keyframes pulse-glow { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.85; } }
                .anim-float-up { animation: float-up 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
                .grid-bg {
                    background-image:
                        linear-gradient(rgba(219, 149, 73, 0.06) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(219, 149, 73, 0.06) 1px, transparent 1px);
                    background-size: 56px 56px;
                }
                .dot-bg {
                    background-image: radial-gradient(circle at 1px 1px, rgba(219, 149, 73, 0.18) 1px, transparent 0);
                    background-size: 28px 28px;
                }
                .text-shadow-strong { text-shadow: 0 4px 30px rgba(0, 0, 0, 0.6); }
            `}</style>

            {/* ─── NAVBAR (separated component) ─── */}
            <Navbar variant="transparent" ctaHref="/login" ctaLabel="Masuk" ctaClassName="shadow-white/20 bg-white hover:bg-gray-100" />

            {/* ============================================ */}
            {/* HERO                                          */}
            {/* ============================================ */}
            <section className="relative overflow-hidden min-h-vh">
                {/* atmospheric backgrounds */}
                <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
                <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />

                <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
                    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                        {/* Copy */}
                        <div className="lg:col-span-7 anim-float-up">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary mb-7">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                                </span>
                                BATCH BARU DIBUKA — KUOTA TERBATAS
                            </div>

                            <h1 className="font-display font-bold leading-[0.95] text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight">
                                <span className="block">TRAIN HARD.</span>
                                <span className="block text-primary">PASS STRONG.</span>
                            </h1>

                            <p className="mt-7 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                                Program latihan fisik <span className="text-foreground font-medium">terstruktur, offline premium</span> dengan
                                monitoring digital untuk calon <span className="text-foreground font-medium">TNI, POLRI &amp; Kedinasan</span>.
                            </p>

                            <p className="mt-3 italic text-sm text-muted-foreground/80">
                                Disiplin hari ini, lolos seleksi esok hari.
                            </p>

                            <div className="mt-9 flex flex-wrap gap-3">
                                <a href="#daftar" className="group inline-flex items-center gap-2 h-13 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 active:scale-[0.98] transition shadow-xl shadow-primary/25">
                                    Daftar Assessment
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                </a>
                                <a href="#program" className="inline-flex items-center gap-2 h-13 px-7 py-3.5 rounded-xl border border-border bg-card/50 backdrop-blur font-semibold hover:bg-accent transition">
                                    Lihat Program
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>

                            {/* Hero stat strip */}
                            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {heroStats.map((s) => (
                                    <div key={s.label} className="rounded-xl border border-border/60 bg-card/40 backdrop-blur p-4 hover:border-primary/30 transition">
                                        <s.icon className="h-5 w-5 text-primary mb-3" />
                                        <div className="font-display font-bold text-2xl">{s.value}</div>
                                        <div className="text-[11px] text-muted-foreground mt-1 leading-tight">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hero visual */}
                        <div className="lg:col-span-5 relative">
                            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-border/60 shadow-2xl shadow-black/40">
                                {/* layered gradient stand-in for athlete photo (replace `<img/>` here with your asset) */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#1a3556] via-[#0d1f36] to-[#011021]" />
                                <div className="absolute inset-0 dot-bg opacity-50" />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/40 to-transparent" />

                                {/* athlete silhouette SVG */}
                                <svg viewBox="0 0 400 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="bodyG" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#0b1c30" />
                                            <stop offset="100%" stopColor="#000814" />
                                        </linearGradient>
                                        <linearGradient id="skinG" x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stopColor="#c8956a" />
                                            <stop offset="100%" stopColor="#7a4d28" />
                                        </linearGradient>
                                    </defs>
                                    {/* sun behind */}
                                    <circle cx="280" cy="180" r="90" fill="rgba(219,149,73,0.18)" />
                                    <circle cx="280" cy="180" r="50" fill="rgba(219,149,73,0.32)" />
                                    {/* track lines */}
                                    <path d="M0 460 Q 200 430 400 460 L400 500 L0 500 Z" fill="rgba(219,149,73,0.08)" />
                                    <path d="M0 480 Q 200 450 400 480" stroke="rgba(219,149,73,0.25)" strokeWidth="1.5" fill="none" />
                                    {/* runner silhouette */}
                                    <g transform="translate(120 120)">
                                        {/* head */}
                                        <circle cx="80" cy="30" r="22" fill="url(#skinG)" />
                                        {/* torso */}
                                        <path d="M55 55 Q 80 50 105 55 L 115 160 Q 80 170 45 160 Z" fill="url(#bodyG)" />
                                        {/* arm raised */}
                                        <path d="M55 65 Q 30 100 25 140 Q 35 145 45 105 Q 55 85 65 75 Z" fill="url(#skinG)" />
                                        {/* arm down */}
                                        <path d="M105 65 Q 130 100 135 145 Q 125 150 115 110 Q 110 85 95 75 Z" fill="url(#skinG)" />
                                        {/* leg forward */}
                                        <path d="M65 160 Q 60 240 80 300 L 95 300 Q 90 240 90 160 Z" fill="url(#bodyG)" />
                                        {/* leg back */}
                                        <path d="M90 160 Q 105 220 130 270 L 145 265 Q 120 215 110 160 Z" fill="url(#bodyG)" />
                                        {/* shoes */}
                                        <ellipse cx="85" cy="305" rx="18" ry="6" fill="#1a1a1a" />
                                        <ellipse cx="138" cy="270" rx="14" ry="5" fill="#1a1a1a" />
                                        {/* watch glint */}
                                        <circle cx="135" cy="143" r="3" fill="#db9549" />
                                    </g>
                                </svg>

                                {/* corner brackets */}
                                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/70" />
                                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/70" />
                                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/70" />
                                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/70" />

                                {/* badge bottom */}
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex items-center gap-2 rounded-full border border-primary/40 bg-background/70 backdrop-blur px-4 py-1.5 text-xs font-medium">
                                    <Zap className="h-3.5 w-3.5 text-primary" />
                                    Offline · Bekasi
                                </div>
                            </div>

                            {/* floating spec card */}
                            <div className="hidden md:flex absolute -bottom-6 -left-6 items-center gap-3 rounded-2xl border border-border bg-card/95 backdrop-blur p-3.5 shadow-xl">
                                <div className="h-11 w-11 rounded-xl bg-primary/15 flex items-center justify-center">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                </div>
                                <div className="leading-tight">
                                    <div className="text-xs text-muted-foreground">Performa rata-rata</div>
                                    <div className="font-display font-bold text-xl">+78% <span className="text-xs font-medium text-primary">/ 3 bulan</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl mt-16 border border-border bg-card/60 backdrop-blur p-6 sm:p-8">
                        <div className="text-center mb-7">
                            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                                Dipercaya oleh ribuan calon prajurit &amp; taruna
                            </div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border/60">
                            {trustStats.map((s) => (
                                <div key={s.label} className="flex items-center gap-4 px-4 py-4 lg:py-2">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center shrink-0">
                                        <s.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-display font-bold text-2xl sm:text-3xl">{s.value}</div>
                                        <div className="text-[12px] text-muted-foreground leading-tight">{s.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            {/* ============================================ */}
            {/* PROGRAM + BENEFITS                            */}
            {/* ============================================ */}
            <section id="program" className="relative py-16 lg:py-24">
                <div className="absolute inset-0 dot-bg opacity-30 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mb-12">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-3">
                            — Program Kami
                        </div>
                        <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight">
                            Kenapa Pilih <span className="text-primary">BINSIK PRO</span>?
                        </h2>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-6">
                        {/* Program cards (left) */}
                        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                            {programs.map((p) => (
                                <a key={p.title} href="#" className={`group relative overflow-hidden rounded-2xl border border-border ring-1 ${p.ring} aspect-[4/5] sm:aspect-[3/4] lg:aspect-[16/7] flex flex-col justify-end p-5 transition hover:border-primary/40`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${p.tint}`} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                                    <div className="absolute inset-0 grid-bg opacity-25" />
                                    <p.icon className="absolute top-5 right-5 h-7 w-7 text-primary/60 group-hover:text-primary transition" />
                                    <div className="relative">
                                        <div className="font-display font-bold text-3xl">{p.title}</div>
                                        <div className="text-sm text-muted-foreground mt-1">{p.subtitle}</div>
                                        <div className="text-xs text-primary/90 font-medium mt-0.5">{p.detail}</div>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Benefits grid (right) */}
                        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4 content-start">
                            {benefits.map((b, i) => (
                                <div
                                    key={b.title}
                                    className={`group relative rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition ${i === 0 || i === 1 || i === 2 ? '' : 'sm:col-span-1'}`}
                                >
                                    <div className="h-11 w-11 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition">
                                        <b.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="font-display font-semibold text-lg mb-1.5">{b.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                                    <div className="absolute top-4 right-4 text-xs font-mono text-muted-foreground/40">0{i + 1}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* HOW IT WORKS                                  */}
            {/* ============================================ */}
            <section id="jadwal" className="relative py-16 lg:py-40 border-y border-border/40 bg-card/30">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-3">
                            — Cara Kerja
                        </div>
                        <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight">
                            4 Langkah Menuju <span className="text-primary">Lolos Seleksi</span>
                        </h2>
                    </div>

                    <div className="relative">
                        {/* Connector line */}
                        <div className="hidden lg:block absolute top-9 left-12 right-12 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                            {steps.map((step) => (
                                <div key={step.num} className="relative">
                                    {/* numbered node */}
                                    <div className="relative z-10 mx-auto h-16 w-16 rounded-full bg-background border-2 border-primary flex items-center justify-center mb-5 shadow-lg shadow-primary/20">
                                        <span className="font-display font-bold text-2xl text-primary">{step.num}</span>
                                        <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
                                    </div>
                                    <div className="rounded-2xl border border-border bg-card p-6 text-center hover:border-primary/30 transition h-full">
                                        <step.icon className="h-6 w-6 text-primary mx-auto mb-3" />
                                        <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* TESTIMONIALS                                  */}
            {/* ============================================ */}
            <section id="testimoni" className="relative py-16 lg:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mb-10">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-3">
                            — Testimoni Member
                        </div>
                        <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight">
                            Cerita dari <span className="text-primary">yang sudah lolos</span>
                        </h2>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-6">
                        {/* Member testimonials */}
                        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
                            {testimonials.map((t) => (
                                <div key={t.name} className="relative rounded-2xl border border-border bg-card p-6 hover:border-primary/30 transition">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 ring-1 ring-primary/30 flex items-center justify-center font-display font-bold text-sm">
                                            {t.initials}
                                        </div>
                                        <div className="leading-tight">
                                            <div className="font-semibold">{t.name}</div>
                                            <div className="text-xs text-primary">{t.badge}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5 mb-3">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />)}
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                                </div>
                            ))}
                        </div>

                        {/* Coach feature card */}
                        <div className="lg:col-span-5 relative rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 overflow-hidden">
                            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
                            <div className="relative flex flex-col sm:flex-row gap-6 items-start">
                                <div className="relative shrink-0">
                                    <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/5 ring-1 ring-primary/30 flex items-center justify-center">
                                        <span className="font-display font-bold text-3xl text-primary">RP</span>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                                        <Award className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-display font-bold text-xl">Coach Reza Pradana</div>
                                    <div className="text-xs uppercase tracking-wider text-primary mt-1 font-semibold">Head Coach BINSIK PRO</div>
                                    <ul className="mt-4 space-y-2 text-sm">
                                        {[
                                            'Certified Strength & Conditioning Coach',
                                            '8+ Tahun Pengalaman Melatih',
                                            'Spesialis Fisik TNI, POLRI & Kedinasan',
                                            'Alumni Akademi Militer',
                                        ].map((item) => (
                                            <li key={item} className="flex items-start gap-2 text-muted-foreground">
                                                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <a href="#coach" className="mt-5 inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition">
                                        Kenali Coach Lainnya <ArrowRight className="h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* PRICING                                       */}
            {/* ============================================ */}
            <section id="daftar" className="relative py-16 lg:py-24 bg-card/30 border-y border-border/40">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-3">
                            — Pilih Paket Terbaikmu
                        </div>
                        <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight">
                            Investasi untuk <span className="text-primary">masa depanmu</span>
                        </h2>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-6">
                        {/* pricing cards */}
                        <div className="lg:col-span-9 grid md:grid-cols-3 gap-5">
                            {pricing.map((p) => (
                                <div key={p.name} className={`relative rounded-2xl border ${p.popular ? 'border-primary/60 bg-gradient-to-b from-primary/10 to-card shadow-2xl shadow-primary/10 lg:scale-[1.03]' : 'border-border bg-card'} p-6 sm:p-7 flex flex-col`}>
                                    {p.popular && (
                                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold tracking-[0.18em] uppercase shadow-lg">
                                            Paling Populer
                                        </div>
                                    )}
                                    <div className="text-center mb-6">
                                        <div className="font-display font-bold text-2xl">{p.name}</div>
                                        <div className="text-xs text-muted-foreground mt-1">{p.tag}</div>
                                    </div>
                                    <div className="text-center mb-6">
                                        <div className="font-display font-bold text-4xl">
                                            <span className="text-base font-medium text-muted-foreground align-top mr-1">Rp</span>
                                            {p.price}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-0.5">/ bulan</div>
                                    </div>
                                    <ul className="space-y-2.5 mb-7 flex-1">
                                        {p.features.map((f) => (
                                            <li key={f} className="flex items-start gap-2.5 text-sm">
                                                <div className={`h-5 w-5 rounded-full ${p.popular ? 'bg-primary' : 'bg-primary/15 ring-1 ring-primary/30'} flex items-center justify-center shrink-0 mt-0.5`}>
                                                    <Check className={`h-3 w-3 ${p.popular ? 'text-primary-foreground' : 'text-primary'}`} />
                                                </div>
                                                <span className="text-muted-foreground">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <a href="#" className={`inline-flex items-center justify-center h-11 px-5 rounded-xl font-semibold text-sm transition ${p.popular
                                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
                                        : 'border border-border hover:bg-accent'
                                        }`}>
                                        Pilih Paket
                                    </a>
                                </div>
                            ))}
                        </div>

                        {/* side info */}
                        <div className="lg:col-span-3 flex flex-col gap-5">
                            <div className="rounded-2xl border border-border bg-card p-6">
                                <div className="h-11 w-11 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center mb-4">
                                    <ShieldQuestion className="h-5 w-5 text-primary" />
                                </div>
                                <div className="font-display font-bold text-base mb-1.5">Garansi Progres</div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Tidak ada hasil? Ulang program <span className="text-primary font-semibold">GRATIS</span> 1 bulan.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-border bg-card p-6">
                                <div className="h-11 w-11 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center mb-4">
                                    <Headphones className="h-5 w-5 text-primary" />
                                </div>
                                <div className="font-display font-bold text-base mb-1.5">Konsultasi Gratis</div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Masih ragu? Konsultasikan kondisi kamu sekarang.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* FAQ                                           */}
            {/* ============================================ */}
            <section id="faq" className="relative py-16 lg:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-3">
                            — FAQ
                        </div>
                        <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight">
                            Pertanyaan yang sering <span className="text-primary">ditanyakan</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 max-w-5xl mx-auto">
                        {faqs.map((f, i) => (
                            <button
                                key={i}
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className={`text-left h-fit rounded-2xl border bg-card transition overflow-hidden ${openFaq === i ? 'border-primary/40' : 'border-border hover:border-primary/20'}`}
                            >
                                <div className="flex items-start justify-between gap-4 p-5">
                                    <span className="font-medium text-sm sm:text-base">{f.q}</span>
                                    <ChevronDown className={`h-5 w-5 text-primary shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                                </div>
                                {openFaq === i && (
                                    <div className="px-5 pb-5 -mt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                                        {f.a}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* FOOTER                                        */}
            {/* ============================================ */}
            <footer className="relative border-t border-border/40 bg-card/40">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 py-14">
                    <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-10">
                        {/* brand */}
                        <div className="lg:col-span-4">
                            <a href="#" className="flex items-center gap-2.5">
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                                    <span className="font-display font-bold text-xl text-primary-foreground">B</span>
                                </div>
                                <div className="leading-none">
                                    <div className="font-display font-bold text-lg tracking-wide">BINSIK <span className="text-primary">PRO</span></div>
                                    <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground/80 mt-0.5">Train Hard. Pass Strong.</div>
                                </div>
                            </a>
                            <p className="mt-5 text-sm text-muted-foreground max-w-md leading-relaxed">
                                BINSIK PRO adalah program latihan fisik premium untuk calon TNI, POLRI &amp; Kedinasan dengan metode terstruktur, coach berpengalaman, dan monitoring digital.
                            </p>
                            <div className="mt-6 flex gap-3">
                                {[Instagram, Youtube, MessageCircle].map((Ic, i) => (
                                    <a key={i} href="#" className="h-9 w-9 rounded-lg border border-border bg-background flex items-center justify-center hover:border-primary/40 hover:text-primary transition">
                                        <Ic className="h-4 w-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* link cepat */}
                        <div className="lg:col-span-2">
                            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4">Link Cepat</h4>
                            <ul className="space-y-2.5">
                                {['Program', 'Jadwal', 'Coach', 'Testimoni', 'FAQ', 'Daftar Assessment'].map((x) => (
                                    <li key={x}><a href="#" className="text-sm text-muted-foreground hover:text-primary transition">{x}</a></li>
                                ))}
                            </ul>
                        </div>

                        {/* program */}
                        <div className="lg:col-span-2">
                            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4">Program</h4>
                            <ul className="space-y-2.5">
                                {['TNI', 'POLRI', 'Kedinasan', 'Simulasi Tes', 'Paket & Harga'].map((x) => (
                                    <li key={x}><a href="#" className="text-sm text-muted-foreground hover:text-primary transition">{x}</a></li>
                                ))}
                            </ul>
                        </div>

                        {/* kontak */}
                        <div className="lg:col-span-4">
                            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4">Kontak</h4>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                    <span>Jl. Patriot No.45, Bekasi, Jawa Barat 17141</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-primary shrink-0" />
                                    <a href="tel:08123456789" className="hover:text-primary transition">0812-3456-7890</a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-primary shrink-0" />
                                    <a href="mailto:info@binsikpro.id" className="hover:text-primary transition">info@binsikpro.id</a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Globe className="h-4 w-4 text-primary shrink-0" />
                                    <span>www.binsikpro.id</span>
                                </li>
                            </ul>

                            {/* newsletter */}
                            <div className="mt-7">
                                <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-3">Newsletter</h4>
                                <p className="text-xs text-muted-foreground mb-3">Dapatkan tips latihan, info seleksi &amp; promo terbaru dari BINSIK PRO.</p>
                                <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="Masukkan email kamu"
                                        className="flex-1 h-11 px-4 rounded-xl bg-background border border-border text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
                                    />
                                    <button className="h-11 w-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition shrink-0">
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs text-muted-foreground">
                        <div>© 2026 BINSIK PRO. All Rights Reserved.</div>
                        <div className="flex gap-5">
                            <a href="#" className="hover:text-primary transition">Privacy Policy</a>
                            <a href="#" className="hover:text-primary transition">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}