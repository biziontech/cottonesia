// app/kategori/[slug]/page.jsx
"use client"
import { use, useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SiteHeader } from "@/components/partials/SiteHeader";
import { SiteFooter } from "@/components/partials/SiteFooter"
import { CartToast } from "@/components/partials/CartToast"
import { ProductCard } from "@/components/partials/ProductCard"
import { CATEGORIES, PRODUCTS } from "@/lib/dummy-data"
import { ChevronRight, Layers, ArrowRight } from "lucide-react"

const P = (seed, w = 1200, h = 500) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

const SORT_OPTIONS = [
  { value: "default", label: "Terpopuler" },
  { value: "price-asc", label: "Harga: Terendah" },
  { value: "price-desc", label: "Harga: Tertinggi" },
  { value: "rating", label: "Rating Terbaik" },
]

const CAT_DESC = {
  "cotton-combed-30s": {
    desc: "Kaos combed 30s dengan gramasi ringan 140–150 gsm. Bahan lembut, breathable, dan cocok untuk sablon rubber, DTF, DTG, maupun screen printing. Pilihan utama untuk brand fashion dan UMKM tekstil.",
    specs: [
      { label: "Bahan", value: "100% Cotton Combed 30s" },
      { label: "Gramasi", value: "140–150 gsm" },
      { label: "Teknik Sablon", value: "Rubber, DTF, DTG, Screen" },
      { label: "MOQ", value: "50 pcs / warna" },
    ],
  },
  "cotton-combed-24s": {
    desc: "Cotton combed 24s dengan gramasi lebih tebal 160–170 gsm. Lebih kuat, tahan lama, dan cocok untuk brand premium dengan kebutuhan bahan berkualitas tinggi.",
    specs: [
      { label: "Bahan", value: "100% Cotton Combed 24s" },
      { label: "Gramasi", value: "160–170 gsm" },
      { label: "Teknik Sablon", value: "Rubber, DTF, DTG, Screen" },
      { label: "MOQ", value: "50 pcs / warna" },
    ],
  },
  "cotton-combed-20s": {
    desc: "Cotton combed 20s dengan gramasi berat 200–220 gsm. Pilihan utama untuk streetwear premium dan pakaian kerja yang membutuhkan bahan tebal dan berstruktur.",
    specs: [
      { label: "Bahan", value: "100% Cotton Combed 20s" },
      { label: "Gramasi", value: "200–220 gsm" },
      { label: "Teknik Sablon", value: "Rubber, DTF, Screen" },
      { label: "MOQ", value: "50 pcs / warna" },
    ],
  },
  "cotton-bamboo": {
    desc: "Perpaduan sempurna 60% cotton dan 40% serat bambu. Lembut seperti sutra, anti-bakteri alami, dan ramah lingkungan. Pilihan premium untuk brand yang peduli sustainability.",
    specs: [
      { label: "Bahan", value: "60% Cotton, 40% Bamboo Fiber" },
      { label: "Gramasi", value: "160–180 gsm" },
      { label: "Keunggulan", value: "Anti-bakteri, Eco-friendly" },
      { label: "MOQ", value: "30 pcs / warna" },
    ],
  },
  "oversize": {
    desc: "Model oversize dengan berbagai cutting dan gramasi. Dari urban fit hingga crop oversize, semua tersedia untuk memenuhi kebutuhan brand fashion modern.",
    specs: [
      { label: "Bahan", value: "Cotton Combed 20s / 24s" },
      { label: "Gramasi", value: "185–220 gsm" },
      { label: "Model", value: "Regular, Urban, Crop" },
      { label: "MOQ", value: "30 pcs / warna" },
    ],
  },
  "kids": {
    desc: "Kaos anak dari bahan cotton combed 30s yang lembut dan aman untuk kulit sensitif anak. Gramasi ringan 120–130 gsm agar tidak gerah, dengan warna-warna cerah yang tahan cuci.",
    specs: [
      { label: "Bahan", value: "100% Cotton Combed 30s" },
      { label: "Gramasi", value: "120–130 gsm" },
      { label: "Ukuran", value: "S–XL (ukuran anak)" },
      { label: "MOQ", value: "50 pcs / warna" },
    ],
  },
}

export default function KategoriDetailPage({ params }) {
  const { slug } = use(params)
  const [sort, setSort] = useState("default")

  const category = CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES[0]
  const catInfo = CAT_DESC[slug] ?? CAT_DESC["cotton-combed-30s"]

  const otherCategories = CATEGORIES.filter((c) => c.slug !== slug)

  const products = useMemo(() => {
    let list = PRODUCTS.filter((p) => p.categorySlug === slug)
    if (!list.length) list = PRODUCTS // fallback
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price)
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price)
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating)
    return list
  }, [slug, sort])

  return (
    <div className="min-h-screen bg-[#F8F5EE]">
      <SiteHeader />
      <CartToast />

      {/* ── CATEGORY HERO BANNER ── */}
      <div className="relative overflow-hidden">
        <div className="relative h-52 sm:h-64 lg:h-72">
          <Image
            src={P(`cat-banner-${slug}`, 1400, 500)}
            alt={category.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E1B2E]/80 via-[#0E1B2E]/50 to-transparent" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end max-w-[1240px] mx-auto px-5 lg:px-8 pb-8 lg:pb-10">
          <div className="flex items-center gap-2 text-xs text-white/60 mb-4">
            <Link href="/" className="hover:text-white/90 transition-colors">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/kategori" className="hover:text-white/90 transition-colors">Kategori</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90">{category.name}</span>
          </div>
          <h1 className="font-serif text-3xl lg:text-5xl text-white leading-tight mb-2">
            {category.name}
          </h1>
          <div className="flex items-center gap-3">
            <Badge className="bg-[#B89968]/80 backdrop-blur-sm text-white border-0 text-[11px] px-3 py-1">
              {category.count} Produk
            </Badge>
            <span className="text-white/70 text-sm">{catInfo.specs[0].value}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-5 lg:px-8 py-10 lg:py-14">

        {/* ── CATEGORY INFO ── */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-8 mb-12">
          <div>
            <p className="text-[#6B7280] leading-[1.8] text-[15px] mb-5">{catInfo.desc}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {catInfo.specs.map((s) => (
                <div key={s.label} className="bg-white rounded-xl border border-[#E8E1D2] p-3.5">
                  <p className="text-[10px] font-bold tracking-[0.14em] text-[#B89968] uppercase mb-1">{s.label}</p>
                  <p className="text-sm font-semibold text-[#1A3461] leading-snug">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#1A3461] rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-[#B89968]" strokeWidth={1.5} />
              <h3 className="font-serif text-[16px]">Kategori Lainnya</h3>
            </div>
            <div className="space-y-1.5">
              {otherCategories.slice(0, 5).map((c) => (
                <Link
                  key={c.slug}
                  href={`/kategori/${c.slug}`}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/8 hover:bg-white/15 transition-colors group"
                >
                  <span className="text-[13px] text-white/85 font-medium">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-white/45">{c.count}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:text-[#B89968] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── PRODUCTS TOOLBAR ── */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#E8E1D2]">
          <p className="text-sm text-[#6B7280]">
            <span className="font-semibold text-[#1A3461]">{products.length} produk</span> dalam kategori ini
          </p>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-44 border-[#E8E1D2] bg-white text-[#0E1B2E] h-10 text-sm focus:ring-[#B89968]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-[#E8E1D2]">
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value} className="text-sm">
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ── PRODUCT GRID ── */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-[#ECE4D4] flex items-center justify-center mb-4">
              <Layers className="w-8 h-8 text-[#B89968]" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl text-[#1A3461] mb-2">Belum ada produk</h3>
            <p className="text-sm text-[#6B7280] mb-6">Produk dalam kategori ini akan segera hadir.</p>
            <Link href="/katalog">
              <Button className="bg-[#1A3461] hover:bg-[#142847] text-white rounded-lg">
                Lihat Semua Produk
              </Button>
            </Link>
          </div>
        )}

        {/* ── LOAD MORE ── */}
        {products.length >= 8 && (
          <div className="flex justify-center mt-12">
            <Button variant="outline" className="border-[#E8E1D2] text-[#1A3461] hover:bg-[#1A3461] hover:text-white bg-white rounded-full h-12 px-8 font-medium group">
              Muat Lebih Banyak
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  )
}