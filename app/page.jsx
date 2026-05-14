"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"

import {
    Search,
    ShoppingCart,
    Heart,
    Star,
    ArrowRight,
    ArrowUpRight,
    Award,
    Tag,
    Palette,
    Truck,
    Sliders,
    CreditCard,
    Package,
    Users,
    Clock,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Instagram,
    Youtube,
    MessageCircle,
    Quote,
    Menu,
    X,
    Shirt,
    Send,
    ShieldCheck,
} from "lucide-react"
import { SiteHeader } from "@/components/partials/SiteHeader"
import { SiteFooter } from "@/components/partials/SiteFooter"

/* =========================================================================
   COTTONESIA — REFINED PREMIUM PALETTE
   Carefully tuned to feel editorial, gallery-grade, and luxurious.

   #F8F5EE   page-bg          warm off-white (page background)
   #FFFFFF   surface          pure white (cards, elevated surfaces)
   #ECE4D4   beige-section    soft beige (secondary section bg)
   #1A3461   navy             primary navy (from logo)
   #142847   navy-deep        darker hover state
   #0E1B2E   ink              body text (near-black with navy tint)
   #6B7280   muted            descriptions, secondary text
   #B89968   gold             refined warm gold (accent)
   #D4BC95   gold-soft        lighter gold for highlights/borders
   #E8E1D2   border           soft warm border
   ========================================================================= */

/* -------------------------------------------------------------------------
   IMAGE SIZE GUIDE — please prepare images at these dimensions
   -------------------------------------------------------------------------
   • HERO IMAGE:        1000 × 1200 px   (5:6 portrait)   /public/hero.jpg
   • CATEGORY IMAGES:    600 × 600 px   (1:1 square)     /public/categories/
   • PRODUCT IMAGES:     800 × 800 px   (1:1 square)     /public/products/
   • SHOWCASE IMAGES:    900 × 900 px   (1:1 square)
   • AVATAR IMAGES:      200 × 200 px   (1:1 square)     (tightly cropped face)

   Format: jpg/webp, optimized < 200 KB each.
   For now we use picsum.photos with stable seeds as placeholders.
   ------------------------------------------------------------------------- */

const PLACEHOLDER = (seed, size = 600) =>
    `https://picsum.photos/seed/${seed}/${size}/${size}`

const PLACEHOLDER_PORTRAIT = (seed) =>
    `https://picsum.photos/seed/${seed}/1000/1200`

const AVATAR = (n) => `https://i.pravatar.cc/200?img=${n}`

/* -------------------------------------------------------------------------
   Tiny typographic primitives
   ------------------------------------------------------------------------- */

const Eyebrow = ({ children }) => (
    <div className="flex items-center justify-center gap-3 mb-4">
        <span className="h-px w-8 bg-[#B89968]/50" />
        <span className="text-[11px] font-semibold tracking-[0.28em] text-[#B89968] uppercase">
            {children}
        </span>
        <span className="h-px w-8 bg-[#B89968]/50" />
    </div>
)

const SectionHeading = ({ children, className = "" }) => (
    <h2
        className={`text-center font-serif text-[32px] sm:text-4xl lg:text-[44px] leading-[1.1] tracking-tight text-[#1A3461] ${className}`}
    >
        {children}
    </h2>
)

const SectionLead = ({ children }) => (
    <p className="text-center text-[#6B7280] text-base leading-relaxed max-w-lg mx-auto mt-4">
        {children}
    </p>
)

/* =========================================================================
   PAGE
   ========================================================================= */
export default function Page() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [activeThumb, setActiveThumb] = useState(0)
    const [activeColor, setActiveColor] = useState(0)
    const [wishlisted, setWishlisted] = useState({})

    const navItems = ["Beranda", "Katalog", "Kategori", "Tentang Kami", "Bantuan"]

    /* ---- DATA ---- */
    const categories = [
        { name: "Cotton Combed 30s", count: "24 produk", seed: "cotton-30s-tee" },
        { name: "Cotton Combed 24s", count: "32 produk", seed: "cotton-24s-tee" },
        { name: "Cotton Combed 20s", count: "18 produk", seed: "cotton-20s-tee" },
        { name: "Cotton Bamboo", count: "12 produk", seed: "cotton-bamboo" },
        { name: "Oversize", count: "16 produk", seed: "oversize-fit" },
        { name: "Kids", count: "20 produk", seed: "kids-tee" },
    ]

    const showcaseThumbs = [
        '/images/1.png',
        '/images/2.png',
        '/images/3.png',
    ]

    const productColors = [
        { hex: "#0E1B2E", name: "Hitam" },
        { hex: "#FAFAF8", name: "Putih" },
        { hex: "#A4AAB4", name: "Abu" },
        { hex: "#1A3461", name: "Navy" },
        { hex: "#9A3838", name: "Maroon" },
        { hex: "#5E7A6E", name: "Olive" },
        { hex: "#E0D5BE", name: "Krem" },
    ]

    const benefits = [
        {
            icon: Award,
            title: "Kualitas Premium",
            desc: "Bahan pilihan terbaik yang nyaman, adem, dan awet untuk pemakaian harian.",
        },
        {
            icon: Tag,
            title: "Harga Grosir",
            desc: "Harga kompetitif khusus pembelian grosir, makin banyak makin hemat.",
        },
        {
            icon: Palette,
            title: "30+ Pilihan Warna",
            desc: "Koleksi warna terlengkap untuk semua kebutuhan brand bisnismu.",
        },
        {
            icon: Truck,
            title: "Pengiriman Cepat",
            desc: "Proses cepat, packing rapi, dikirim aman ke seluruh Indonesia.",
        },
    ]

    const steps = [
        { icon: Shirt, title: "Pilih Produk", desc: "Temukan kategori yang sesuai kebutuhan." },
        { icon: Sliders, title: "Pilih Opsi", desc: "Tentukan ukuran, warna, dan jumlah pesanan." },
        { icon: CreditCard, title: "Checkout", desc: "Lakukan pembayaran dengan metode aman." },
        { icon: Package, title: "Pesanan Dikirim", desc: "Pesanan dikemas dan dikirim tepat waktu." },
    ]

    const stats = [
        { num: "10.000+", label: "Customer Terpercaya" },
        { num: "50+", label: "Pilihan Warna" },
        { num: "100.000+", label: "Produk Terjual" },
        { num: "2+ Tahun", label: "Pengalaman" },
    ]

    const featured = [
        {
            id: 1,
            slug: "basic-tee-30s",
            tag: "Best Seller",
            category: "Cotton Combed 30s",
            name: "Basic Tee 30s",
            seed: "product-basic-30s",
            rating: 4.9,
            reviews: 256,
            price: "Rp 38.000",
            priceMax: "Rp 45.000",
        },
        {
            id: 2,
            slug: "basic-tee-24s",
            tag: "Baru",
            category: "Cotton Combed 24s",
            name: "Basic Tee 24s",
            seed: "product-basic-24s",
            rating: 4.8,
            reviews: 183,
            price: "Rp 34.000",
            priceMax: "Rp 40.000",
        },
        {
            id: 3,
            slug: "oversize-urban-20s",
            category: "Oversize",
            name: "Oversize Urban 20s",
            seed: "product-oversize",
            rating: 4.9,
            reviews: 97,
            price: "Rp 42.000",
            priceMax: "Rp 50.000",
        },
        {
            id: 4,
            slug: "cotton-bamboo-tee",
            tag: "Premium",
            category: "Bamboo Series",
            name: "Cotton Bamboo Tee",
            seed: "product-bamboo",
            rating: 5.0,
            reviews: 64,
            price: "Rp 48.000",
            priceMax: "Rp 55.000",
        },
    ]

    const testimonials = [
        {
            name: "Rizky Hendriara",
            role: "Owner Clothing",
            avatar: AVATAR(12),
            text: "Kualitas kaosnya premium, jahitan rapi dan warna sesuai. Sudah 2 tahun jadi langganan terus.",
        },
        {
            name: "Siti Nurhaliza",
            role: "Reseller",
            avatar: AVATAR(45),
            text: "Langganan di Cottonesia selalu puas. Warna lengkap, harga bersaing, pengiriman juga cepat.",
        },
        {
            name: "Andi Setiawan",
            role: "Pengusaha Sablon",
            avatar: AVATAR(33),
            text: "Rekomendasi supplier kaos polos terbaik. Bahan tebal, nyaman, dan cocok untuk semua jenis sablon.",
        },
    ]

    const toggleWish = (id) =>
        setWishlisted((p) => ({ ...p, [id]: !p[id] }))

    /* ============================================================
       RENDER
       ============================================================ */
    return (
        <div className="min-h-screen bg-[#F8F5EE] text-[#0E1B2E] font-sans antialiased selection:bg-[#B89968]/30">

            {/* =====================================================
          HEADER
          ===================================================== */}
         <SiteHeader />
            {/* =====================================================
          HERO  —  min-h-dvh
          ===================================================== */}
            <section className="relative min-h-dvh flex items-center overflow-hidden">
                <div className="absolute -top-32 -left-40 w-[520px] h-[520px] rounded-full bg-[#ECE4D4]/70 blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 -right-32 w-[460px] h-[460px] rounded-full bg-[#B89968]/8 blur-3xl pointer-events-none" />

                <div className="max-w-[1240px] mx-auto px-5 lg:px-8 py-16 lg:py-20 w-full relative">
                    <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">

                        {/* Left */}
                        <div className="space-y-7 order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full bg-white border border-[#E8E1D2] shadow-[0_2px_8px_rgba(26,52,97,0.04)]">
                                <span className="w-6 h-6 rounded-full bg-[#ECE4D4] flex items-center justify-center">
                                    <ShieldCheck className="w-3 h-3 text-[#B89968]" strokeWidth={2.2} />
                                </span>
                                <span className="text-[11px] font-semibold tracking-[0.16em] text-[#1A3461] uppercase">
                                    Supplier Kaos Polos Premium
                                </span>
                            </div>

                            <h1 className="font-serif text-[44px] sm:text-5xl lg:text-[64px] leading-[1.04] tracking-[-0.02em] text-[#1A3461]">
                                Cotton Premium.
                                <br />
                                Kualitas Terbaik.
                                <br />
                                <em className="not-italic font-normal text-[#B89968]">Harga Kompetitif.</em>
                            </h1>

                            <p className="text-[16px] lg:text-[17px] text-[#6B7280] max-w-[460px] leading-[1.7]">
                                Cottonesia adalah marketplace supplier kaos polos dengan kualitas
                                terbaik, pilihan terbanyak, dan harga kompetitif untuk skala bisnis Anda.
                            </p>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <Button className="bg-[#1A3461] hover:bg-[#142847] text-white rounded-lg h-12 px-7 text-[14px] font-medium shadow-sm hover:shadow-md group transition-all">
                                    Belanja Sekarang
                                    <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-0.5" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-[#E8E1D2] text-white hover:bg-white hover:border-[#1A3461] rounded-lg h-12 px-7 text-[14px] font-medium bg-white/50 transition-all"
                                >
                                    Lihat Katalog
                                </Button>
                            </div>

                            <div className="flex items-center gap-6 pt-4">
                                <div className="flex -space-x-2">
                                    {[14, 22, 47, 52].map((n, i) => (
                                        <Avatar
                                            key={i}
                                            className="w-9 h-9 border-2 border-[#F8F5EE] ring-0"
                                        >
                                            <AvatarImage src={AVATAR(n)} alt="Customer" />
                                            <AvatarFallback>C{i}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                </div>
                                <div className="text-sm">
                                    <div className="flex items-center gap-1 text-[#B89968]">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className="w-3.5 h-3.5 fill-current" strokeWidth={0} />
                                        ))}
                                        <span className="text-[#0E1B2E] font-semibold ml-1">4.9</span>
                                    </div>
                                    <p className="text-[#6B7280] text-[13px] mt-0.5">
                                        Dipercaya 10.000+ pelaku bisnis
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right – portrait image */}
                        <div className="relative order-1 lg:order-2">
                            <div className="relative">
                                {/* Decorative offset frame */}
                                <div className="absolute -inset-3 lg:-inset-4 rounded-[32px] border border-[#B89968]/30 -z-10" />
                                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-[#B89968]/10 blur-2xl -z-10" />

                                <div className="relative overflow-hidden rounded-[28px] bg-[#ECE4D4]/40 shadow-[0_30px_60px_-20px_rgba(26,52,97,0.25)]">
                                    {/*
                    HERO IMAGE — recommended 1000 × 1200 px (5:6)
                    Replace with: /public/hero.jpg
                  */}
                                    <div className="relative aspect-[5/6] w-full">
                                        <Image
                                            src='/images/hero-1.webp'
                                            alt="Koleksi kaos polos premium Cottonesia"
                                            fill
                                            className="object-cover"
                                            priority
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />
                                    </div>
                                </div>

                                {/* Floating quality badge */}
                                <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-xl border border-[#E8E1D2]/60">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ECE4D4] to-[#D4BC95]/40 flex items-center justify-center flex-shrink-0">
                                        <ShieldCheck className="w-5 h-5 text-[#B89968]" strokeWidth={1.8} />
                                    </div>
                                    <div>
                                        <p className="font-serif text-sm font-semibold text-[#1A3461] leading-tight">
                                            Import Quality
                                        </p>
                                        <p className="text-[11px] text-[#6B7280] mt-0.5">100% Cotton Combed</p>
                                    </div>
                                </div>

                                {/* Floating stat badge */}
                                <div className="absolute top-6 right-6 sm:top-8 sm:right-8 flex flex-col items-center bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xl border border-[#E8E1D2]/60">
                                    <span className="font-serif text-2xl font-semibold text-[#1A3461] leading-none">
                                        100K+
                                    </span>
                                    <span className="text-[10px] text-[#6B7280] tracking-wider uppercase mt-1">
                                        Terjual
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
          KATEGORI — image grid
          ===================================================== */}
            <section className="py-20 lg:py-28">
                <div className="max-w-[1240px] mx-auto px-5 lg:px-8">

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
                        <div>
                            <Eyebrow>Kategori Produk</Eyebrow>
                            <h2 className="font-serif text-[32px] sm:text-4xl lg:text-[44px] leading-[1.1] tracking-tight text-[#1A3461] max-w-xl">
                                Pilihan Kaos Polos Terlengkap
                            </h2>
                            <p className="text-[#6B7280] text-base leading-relaxed mt-4 max-w-md">
                                Berbagai jenis bahan, warna, dan ukuran untuk semua kebutuhan bisnismu.
                            </p>
                        </div>
                        <Link
                            href="/katalog"
                            className="hidden lg:inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A3461] hover:text-[#B89968] transition-colors group"
                        >
                            Lihat Semua Kategori
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </div>

                    {/*
            CATEGORY IMAGES — recommended 600 × 600 px (1:1 square)
            Replace with: /public/categories/{slug}.jpg
          */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
                        {categories.map((cat) => (
                            <Link
                                key={cat.name}
                                href={`/katalog/${cat.seed}`}
                                className="group flex flex-col gap-3"
                            >
                                <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#ECE4D4]/40 border border-[#E8E1D2] transition-all duration-500 group-hover:shadow-lg group-hover:border-[#B89968]/40">
                                    <Image
                                        src={'/images/2.png'}
                                        alt={cat.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E1B2E]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white text-[#1A3461] flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                        <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
                                    </div>
                                </div>
                                <div className="px-1">
                                    <h3 className="font-serif text-[15px] text-[#1A3461] leading-tight group-hover:text-[#B89968] transition-colors">
                                        {cat.name}
                                    </h3>
                                    <p className="text-[11px] text-[#6B7280] tracking-wider uppercase mt-1">
                                        {cat.count}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="flex justify-center mt-10 lg:hidden">
                        <Link
                            href="/katalog"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A3461] hover:text-[#B89968] transition-colors"
                        >
                            Lihat Semua Kategori
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* =====================================================
          PRODUCT SHOWCASE — editorial split
          ===================================================== */}
            <section className="py-20 lg:py-28 bg-[#ECE4D4]/35">
                <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
                    <div className="grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-16 items-start">

                        {/* Gallery */}
                        <div className="flex gap-3 lg:gap-4">
                            <div className="flex flex-col gap-2.5 w-[68px] sm:w-20 flex-shrink-0">
                                {showcaseThumbs.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveThumb(i)}
                                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeThumb === i
                                                ? "border-[#B89968] shadow-sm"
                                                : "border-[#E8E1D2] hover:border-[#B89968]/50"
                                            }`}
                                    >
                                        <Image
                                            src={src}
                                            alt={`Tampilan ${i + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                    </button>
                                ))}
                            </div>
                            <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden border border-[#E8E1D2] bg-white">
                                <Image
                                    src={showcaseThumbs[activeThumb]}
                                    alt="Cotton Combed 30s"
                                    fill
                                    className="object-cover transition-all duration-500"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleWish("showcase")}
                                    className={`absolute top-4 right-4 rounded-full backdrop-blur-md border transition-all ${wishlisted["showcase"]
                                            ? "bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100"
                                            : "bg-white/90 border-[#E8E1D2] text-[#1A3461] hover:bg-white"
                                        }`}
                                    aria-label="Wishlist"
                                >
                                    <Heart
                                        className="w-4 h-4"
                                        strokeWidth={1.8}
                                        fill={wishlisted["showcase"] ? "currentColor" : "none"}
                                    />
                                </Button>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-6 lg:pt-2">
                            <Badge className="bg-[#ECE4D4] text-[#B89968] hover:bg-[#ECE4D4] border border-[#B89968]/20 text-[10px] tracking-[0.18em] uppercase font-semibold px-3 py-1 rounded-full">
                                Cotton Combed 30s
                            </Badge>

                            <h2 className="font-serif text-[34px] lg:text-[46px] leading-[1.05] tracking-tight text-[#1A3461]">
                                Premium Cotton Combed
                                <br />
                                <em className="not-italic text-[#B89968]">untuk bisnis Anda.</em>
                            </h2>

                            <div className="flex items-center gap-3">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className="w-4 h-4 fill-[#B89968] text-[#B89968]" strokeWidth={0} />
                                    ))}
                                </div>
                                <Separator orientation="vertical" className="h-4 bg-[#E8E1D2]" />
                                <span className="text-sm text-[#6B7280]">
                                    <span className="font-semibold text-[#0E1B2E]">4.8</span> · 120+ ulasan
                                </span>
                            </div>

                            <div className="flex items-baseline gap-3 font-serif">
                                <span className="text-3xl lg:text-[36px] font-semibold text-[#1A3461]">
                                    Rp 38.000
                                </span>
                                <span className="text-lg text-[#6B7280]">— Rp 45.000</span>
                            </div>

                            <p className="text-[#6B7280] leading-[1.75] max-w-[480px]">
                                Terbuat dari 100% cotton combed premium yang lembut, nyaman, dan
                                tidak panas. Ideal untuk sablon rubber, DTF, DTG, dan screen printing.
                            </p>

                            <Separator className="bg-[#E8E1D2]" />

                            <dl className="grid grid-cols-1 gap-2.5">
                                {[
                                    ["Bahan", "100% Cotton Combed"],
                                    ["Gramasi", "140–150 gsm"],
                                    ["Ukuran", "S, M, L, XL, 2XL, 3XL"],
                                    ["Warna", "30+ pilihan warna"],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex items-center text-sm">
                                        <dt className="w-24 text-[#6B7280]">{k}</dt>
                                        <dd className="text-[#0E1B2E] font-medium">{v}</dd>
                                    </div>
                                ))}
                            </dl>

                            <Separator className="bg-[#E8E1D2]" />

                            <div>
                                <p className="text-sm text-[#6B7280] mb-3">
                                    Pilih Warna ·{" "}
                                    <span className="text-[#1A3461] font-semibold">
                                        {productColors[activeColor].name}
                                    </span>
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {productColors.map((c, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveColor(i)}
                                            className={`w-9 h-9 rounded-full border-2 transition-all ${activeColor === i
                                                    ? "border-[#B89968] scale-110 shadow-md"
                                                    : "border-[#E8E1D2] hover:border-[#B89968]/60"
                                                }`}
                                            style={{ backgroundColor: c.hex }}
                                            aria-label={c.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1  border-[#E8E1D2] text-white hover:bg-[#1A3461] hover:text-white hover:border-[#1A3461] rounded-lg h-12 px-6 font-medium bg-white transition-all"
                                >
                                    Pilih Opsi
                                </Button>
                                <Button className="flex-1 bg-[#B89968] hover:bg-[#a08458] text-white rounded-lg h-12 px-6 font-medium shadow-sm hover:shadow-md transition-all">
                                    <ShoppingCart className="w-4 h-4 mr-1.5" />
                                    Tambahkan ke Keranjang
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
          BENEFITS
          ===================================================== */}
            <section className="py-20 lg:py-28">
                <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
                    <Eyebrow>Kenapa Cottonesia?</Eyebrow>
                    <SectionHeading>Keunggulan yang Bisa Diandalkan</SectionHeading>
                    <SectionLead>
                        Kami hadir agar bisnis tekstilmu berjalan lebih mudah, cepat, dan menguntungkan.
                    </SectionLead>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
                        {benefits.map((b, i) => {
                            const Icon = b.icon
                            return (
                                <Card
                                    key={i}
                                    className="group bg-white border-[#E8E1D2]/80 hover:border-[#B89968]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 py-7"
                                >
                                    <CardContent className="px-6">
                                        <div className="w-12 h-12 rounded-xl bg-[#ECE4D4] flex items-center justify-center mb-5 group-hover:bg-[#1A3461] transition-colors duration-500">
                                            <Icon
                                                className="w-6 h-6 text-[#B89968] transition-colors duration-500"
                                                strokeWidth={1.6}
                                            />
                                        </div>
                                        <h3 className="font-serif text-[18px] text-[#1A3461] mb-2 leading-tight">
                                            {b.title}
                                        </h3>
                                        <p className="text-[13.5px] text-[#6B7280] leading-relaxed">{b.desc}</p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* =====================================================
          HOW IT WORKS
          ===================================================== */}
            <section className="py-20 lg:py-28 bg-[#ECE4D4]/35">
                <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
                    <Eyebrow>Cara Kerja</Eyebrow>
                    <SectionHeading>Belanja Mudah dalam 4 Langkah</SectionHeading>
                    <SectionLead>Proses sederhana, transparan, dan bisa diandalkan.</SectionLead>

                    <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 mt-16">
                        <div
                            className="hidden lg:block absolute top-6 left-[14%] right-[14%] h-px"
                            style={{
                                backgroundImage:
                                    "repeating-linear-gradient(to right,#B89968 0,#B89968 5px,transparent 5px,transparent 11px)",
                            }}
                        />
                        {steps.map((s, i) => {
                            const Icon = s.icon
                            return (
                                <div key={i} className="relative flex flex-col items-center text-center">
                                    <div className="relative z-10 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-[#B89968] flex items-center justify-center font-serif text-white text-[17px] font-semibold shadow-md ring-[6px] ring-[#F8F5EE]">
                                            {i + 1}
                                        </div>
                                    </div>
                                    <div className="w-14 h-14 rounded-2xl bg-white border border-[#E8E1D2] flex items-center justify-center mb-4 shadow-sm">
                                        <Icon className="w-6 h-6 text-[#1A3461]" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="font-serif text-[18px] text-[#1A3461] mb-2">{s.title}</h3>
                                    <p className="text-sm text-[#6B7280] leading-relaxed max-w-[200px]">
                                        {s.desc}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* =====================================================
          STATS BAR — dark navy
          ===================================================== */}
            <section className="bg-[#1A3461] relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: "radial-gradient(circle, #B89968 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                />
                <div className="max-w-[1240px] mx-auto px-5 lg:px-8 py-14 lg:py-16 relative">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-4 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                        {stats.map((s, i) => (
                            <div
                                key={i}
                                className={`text-center ${i > 1 ? "pt-10 lg:pt-0" : ""} ${i > 0 ? "lg:pl-4" : ""}`}
                            >
                                <div className="font-serif text-[36px] lg:text-[44px] text-white leading-none tracking-tight">
                                    {s.num}
                                </div>
                                <div className="text-[12px] text-[#B89968] tracking-[0.18em] uppercase mt-2 font-medium">
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =====================================================
          FEATURED PRODUCTS — clean white cards, square images
          ===================================================== */}
            <section className="py-20 lg:py-28">
                <div className="max-w-[1240px] mx-auto px-5 lg:px-8">

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
                        <div>
                            <Eyebrow>Produk Unggulan</Eyebrow>
                            <h2 className="font-serif text-[32px] sm:text-4xl lg:text-[44px] leading-[1.1] tracking-tight text-[#1A3461] max-w-xl">
                                Produk Pilihan Kami
                            </h2>
                            <p className="text-[#6B7280] text-base leading-relaxed mt-4 max-w-md">
                                Produk berkualitas dengan harga terbaik, dipilih khusus untuk bisnismu.
                            </p>
                        </div>
                        <Link
                            href="/katalog"
                            className="hidden lg:inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-[#B89968] transition-colors group"
                        >
                            Lihat Semua Produk
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </div>

                    {/*
            PRODUCT IMAGES — recommended 800 × 800 px (1:1 square)
            Replace with: /public/products/{slug}.jpg
          */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {featured.map((p) => (
                            <Card
                                key={p.id}
                                className="group bg-white border-[#E8E1D2]/80 hover:border-[#B89968]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 py-0 gap-0 overflow-hidden"
                            >
                                {/* Image — square */}
                                <div className="relative aspect-square overflow-hidden bg-[#ECE4D4]/30">
                                    {p.tag && (
                                        <Badge
                                            className={`absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border-0 ${p.tag === "Baru"
                                                    ? "bg-[#1A3461] text-white"
                                                    : p.tag === "Best Seller"
                                                        ? "bg-[#B89968] text-white"
                                                        : "bg-[#0E1B2E] text-white"
                                                }`}
                                        >
                                            {p.tag}
                                        </Badge>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => toggleWish(p.id)}
                                        className={`absolute top-2.5 right-2.5 z-10 h-9 w-9 rounded-full backdrop-blur-md border transition-all ${wishlisted[p.id]
                                                ? "bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100"
                                                : "bg-white/90 border-[#E8E1D2] text-[#1A3461] hover:bg-white"
                                            }`}
                                        aria-label="Wishlist"
                                    >
                                        <Heart
                                            className="w-3.5 h-3.5"
                                            strokeWidth={2}
                                            fill={wishlisted[p.id] ? "currentColor" : "none"}
                                        />
                                    </Button>
                                    <Image
                                        src={'/images/2.png'}
                                        alt={p.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                </div>

                                <CardContent className="px-5 pt-4 pb-1">
                                    <p className="text-[10px] font-semibold tracking-[0.16em] text-[#B89968] uppercase mb-1.5">
                                        {p.category}
                                    </p>
                                    <h3 className="font-serif text-[17px] text-[#1A3461] leading-snug mb-2">
                                        {p.name}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mb-3">
                                        <Star className="w-3.5 h-3.5 fill-[#B89968] text-[#B89968]" strokeWidth={0} />
                                        <span className="text-xs text-[#0E1B2E] font-semibold">{p.rating}</span>
                                        <span className="text-xs text-[#6B7280]">· {p.reviews} ulasan</span>
                                    </div>
                                    <Separator className="bg-[#E8E1D2] my-1" />
                                    <div className="pt-3 flex items-baseline gap-2">
                                        <span className="font-serif text-[17px] font-semibold text-[#1A3461]">
                                            {p.price}
                                        </span>
                                        <span className="text-xs text-[#6B7280]">— {p.priceMax}</span>
                                    </div>
                                </CardContent>

                                <CardFooter className="px-5 pb-5 pt-3">
                                    <Button
                                        asChild
                                        className="w-full h-10 bg-[#1A3461] hover:bg-[#142847] text-white text-[12px] font-semibold rounded-lg transition-all"
                                    >
                                        <Link href={`/katalog/${p.slug}`}>
                                            Lihat Detail
                                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-center mt-12">
                        <Button
                            asChild
                            variant="outline"
                            className="border-[#1A3461]/15 bg-white text-white hover:bg-[#1A3461] hover:text-white hover:border-[#1A3461] rounded-full h-12 px-8 font-medium transition-all group"
                        >
                            <Link href="/katalog">
                                Jelajahi Semua Produk
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* =====================================================
          TESTIMONIALS
          ===================================================== */}
            <section className="py-20 lg:py-28 bg-[#ECE4D4]/35">
                <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
                    <Eyebrow>Apa Kata Mereka?</Eyebrow>
                    <SectionHeading>Testimoni Customer</SectionHeading>
                    <SectionLead>Cerita dari pelaku bisnis yang telah mempercayakan produk mereka kepada kami.</SectionLead>

                    <div className="grid md:grid-cols-3 gap-5 lg:gap-6 mt-14">
                        {testimonials.map((t, i) => (
                            <Card
                                key={i}
                                className="bg-white border-[#E8E1D2]/80 hover:border-[#B89968]/25 hover:shadow-lg transition-all duration-500 py-7 relative"
                            >
                                <Quote
                                    className="absolute top-6 right-6 w-10 h-10 text-[#B89968]/15"
                                    fill="#B89968"
                                    strokeWidth={0}
                                />
                                <CardContent className="px-7">
                                    <div className="flex gap-0.5 mb-4">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                className="w-4 h-4 fill-[#B89968] text-[#B89968]"
                                                strokeWidth={0}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[15px] text-[#0E1B2E]/80 leading-[1.7] mb-6 font-serif italic min-h-[70px]">
                                        &ldquo;{t.text}&rdquo;
                                    </p>
                                    <Separator className="bg-[#E8E1D2] mb-4" />
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-11 h-11 border border-[#E8E1D2]">
                                            <AvatarImage src={t.avatar} alt={t.name} />
                                            <AvatarFallback className="bg-[#1A3461] text-white text-sm font-semibold">
                                                {t.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-serif text-[14px] font-semibold text-[#1A3461] leading-tight">
                                                {t.name}
                                            </p>
                                            <p className="text-[12px] text-[#6B7280] mt-0.5">{t.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* =====================================================
          CTA BANNER
          ===================================================== */}
            <section className="py-20 lg:py-24">
                <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl bg-[#1A3461] px-6 py-14 lg:p-16">
                        <div
                            className="absolute inset-0 opacity-[0.06]"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle, #B89968 1px, transparent 1px)",
                                backgroundSize: "26px 26px",
                            }}
                        />
                        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#B89968]/15 blur-3xl pointer-events-none" />

                        <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
                            <div className="text-center lg:text-left">
                                <span className="inline-block text-[10px] font-semibold tracking-[0.22em] text-[#B89968] uppercase mb-3">
                                    Mulai Hari Ini
                                </span>
                                <h2 className="font-serif text-3xl lg:text-[44px] leading-[1.1] text-white tracking-tight">
                                    Siap memulai bisnis tekstil
                                    <br />
                                    <em className="not-italic text-[#D4BC95]">bersama Cottonesia?</em>
                                </h2>
                                <p className="text-white/70 mt-4 lg:max-w-md leading-relaxed">
                                    Daftar sekarang dan dapatkan akses ke katalog lengkap, harga grosir, dan dukungan tim kami.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 lg:items-end lg:justify-end">
                                <Button className="bg-[#B89968] hover:bg-[#a08458] text-white rounded-lg h-12 px-7 font-medium shadow-md">
                                    Daftar Sekarang
                                    <ArrowRight className="w-4 h-4 ml-1.5" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-white/20 text-white hover:bg-white hover:text-[#1A3461] hover:border-white rounded-lg h-12 px-7 font-medium bg-transparent"
                                >
                                    Hubungi Kami
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
          FOOTER — dark
          ===================================================== */}
            <SiteFooter />
        </div>
    )
}