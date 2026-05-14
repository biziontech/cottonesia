// app/kategori/page.jsx
"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SiteHeader } from "@/components/partials/SiteHeader"
import { SiteFooter } from "@/components/partials/SiteFooter"
import { CartToast } from "@/components/partials/CartToast"
import { ProductCard } from "@/components/partials/ProductCard"
import { CATEGORIES, PRODUCTS } from "@/lib/dummy-data"
import { ChevronRight, ArrowUpRight, ArrowRight } from "lucide-react"

const P = (seed, w = 800, h = 800) =>
    `https://picsum.photos/seed/${seed}/${w}/${h}`

const CAT_DESC = {
    "cotton-combed-30s": "Kaos combed 30s dengan gramasi ringan 140–150 gsm, ideal untuk sablon dan pemakaian harian yang nyaman.",
    "cotton-combed-24s": "Gramasi lebih tebal 160–170 gsm dengan bahan yang lebih kuat. Cocok untuk brand dengan kebutuhan daya tahan tinggi.",
    "cotton-combed-20s": "Heavy duty 200–220 gsm, bahan tebal untuk streetwear premium dan pakaian kerja.",
    "cotton-bamboo": "Perpaduan cotton dan bambu yang lembut, anti-bakteri, dan ramah lingkungan.",
    "oversize": "Potongan longgar trendy dengan berbagai gramasi untuk tampilan modern dan kasual.",
    "kids": "Bahan ringan dan lembut, aman untuk kulit sensitif anak-anak dengan warna ceria.",
}

export default function KategoriPage() {
    return (
        <div className="min-h-screen bg-[#F8F5EE]">
            <SiteHeader />
            <CartToast />

            {/* ── PAGE HEADER ── */}
            <div className="bg-white border-b border-[#E8E1D2]">
                <div className="max-w-[1240px] mx-auto px-5 lg:px-8 py-8 lg:py-10">
                    <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-4">
                        <Link href="/" className="hover:text-[#1A3461] transition-colors">Beranda</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-[#1A3461] font-medium">Kategori</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#B89968] uppercase mb-2">
                                Koleksi Kami
                            </p>
                            <h1 className="font-serif text-3xl lg:text-[46px] leading-[1.1] text-[#1A3461]">
                                Semua Kategori Produk
                            </h1>
                            <p className="text-[#6B7280] mt-2 max-w-md">
                                Temukan koleksi kaos polos premium dari berbagai jenis bahan, gramasi, dan fit sesuai kebutuhan bisnismu.
                            </p>
                        </div>
                        <Link href="/katalog">
                            <Button variant="outline" className="border-[#E8E1D2] text-white hover:bg-[#1A3461] hover:text-white bg-white rounded-lg h-10 text-sm font-medium">
                                Lihat Semua Produk
                                <ArrowUpRight className="w-4 h-4 ml-1.5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── CATEGORY GRID ── */}
            <section className="py-14 lg:py-20">
                <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
                        {CATEGORIES.map((cat, i) => {
                            const catProducts = PRODUCTS.filter((p) => p.categorySlug === cat.slug)
                            return (
                                <Link
                                    key={cat.slug}
                                    href={`/kategori/${cat.slug}`}
                                    className="group relative block overflow-hidden rounded-3xl bg-white border border-[#E8E1D2] hover:border-[#B89968]/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                                >
                                    {/* Main image */}
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <Image
                                            src={P(cat.seed, 800, 600)}
                                            alt={cat.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width:640px)100vw,(max-width:1024px)50vw,33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1B2E]/55 via-[#0E1B2E]/10 to-transparent" />

                                        {/* Product count pill */}
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#B89968]" />
                                            <span className="text-[11px] font-semibold text-[#1A3461]">{cat.count} produk</span>
                                        </div>

                                        {/* Title overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-5">
                                            <h2 className="font-serif text-xl lg:text-[22px] text-white leading-tight mb-1">
                                                {cat.name}
                                            </h2>
                                            <p className="text-white/70 text-[13px] leading-relaxed line-clamp-2">
                                                {CAT_DESC[cat.slug]}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Mini product preview */}
                                    {catProducts.length > 0 && (
                                        <div className="px-5 py-4">
                                            <p className="text-[10px] font-semibold tracking-[0.14em] text-[#6B7280] uppercase mb-3">
                                                Produk Unggulan
                                            </p>
                                            <div className="flex gap-2.5">
                                                {catProducts.slice(0, 3).map((p) => (
                                                    <div
                                                        key={p.id}
                                                        className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#E8E1D2] flex-shrink-0"
                                                    >
                                                        <Image
                                                            src={p.image}
                                                            alt={p.name}
                                                            fill
                                                            className="object-cover"
                                                            sizes="56px"
                                                        />
                                                    </div>
                                                ))}
                                                {catProducts.length > 3 && (
                                                    <div className="w-14 h-14 rounded-xl bg-[#ECE4D4] border border-[#E8E1D2] flex items-center justify-center flex-shrink-0">
                                                        <span className="text-xs font-semibold text-[#B89968]">
                                                            +{catProducts.length - 3}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* CTA row */}
                                    <div className="px-5 pb-5 flex items-center justify-between">
                                        <span className="text-sm font-semibold text-[#1A3461]">
                                            Mulai dari {catProducts[0]?.priceDisplay ?? "–"}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-[#ECE4D4] flex items-center justify-center group-hover:bg-[#1A3461] transition-colors duration-300">
                                            <ArrowUpRight className="w-4 h-4 text-[#B89968] group-hover:text-white transition-colors duration-300" />
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ── PER-CATEGORY PRODUCT ROW ── */}
            {CATEGORIES.map((cat) => {
                const catProducts = PRODUCTS.filter((p) => p.categorySlug === cat.slug)
                if (!catProducts.length) return null
                return (
                    <section key={cat.slug} className="py-12 lg:py-16 border-t border-[#E8E1D2]">
                        <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
                            <div className="flex items-end justify-between mb-8">
                                <div>
                                    <p className="text-[11px] font-semibold tracking-[0.2em] text-[#B89968] uppercase mb-1.5">
                                        {cat.count} produk
                                    </p>
                                    <h2 className="font-serif text-2xl lg:text-3xl text-[#1A3461]">{cat.name}</h2>
                                    <p className="text-[13px] text-[#6B7280] mt-1.5 max-w-md">
                                        {CAT_DESC[cat.slug]}
                                    </p>
                                </div>
                                <Link
                                    href={`/kategori/${cat.slug}`}
                                    className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A3461] hover:text-[#B89968] transition-colors group flex-shrink-0"
                                >
                                    Lihat Semua
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
                                {catProducts.map((p) => (
                                    <ProductCard key={p.id} p={p} />
                                ))}
                            </div>

                            <div className="flex justify-center mt-8 sm:hidden">
                                <Link href={`/kategori/${cat.slug}`}>
                                    <Button variant="outline" className="border-[#E8E1D2] text-[#1A3461] hover:bg-[#1A3461] hover:text-white bg-white rounded-full h-10 px-6 text-sm">
                                        Lihat Semua {cat.name} <ArrowRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </section>
                )
            })}

            <SiteFooter />
        </div>
    )
}