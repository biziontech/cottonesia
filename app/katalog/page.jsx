// app/katalog/page.jsx
"use client"
import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SiteHeader } from "@/components/partials/SiteHeader"
import { SiteFooter } from "@/components/partials/SiteFooter"
import { PRODUCTS, CATEGORIES } from "@/lib/dummy-data"
import { Star, Heart, SlidersHorizontal, ChevronRight, ArrowRight, X } from "lucide-react"
import { useCart } from "@/lib/use-cart"
import { CartToast } from "@/components/partials/CartToast"

const SORT_OPTIONS = [
  { value: "default", label: "Terpopuler" },
  { value: "price-asc", label: "Harga: Terendah" },
  { value: "price-desc", label: "Harga: Tertinggi" },
  { value: "rating", label: "Rating Terbaik" },
]

function ProductCard({ p }) {
  const [wish, setWish] = useState(false)
  const { addItem } = useCart()

  const handleQuickAdd = (e) => {
    e.preventDefault()
    addItem({
      id: p.id, slug: p.slug, name: p.name, image: p.image,
      price: p.price, priceDisplay: p.priceDisplay,
      color: p.colors[0].hex, colorName: p.colors[0].name,
      size: "M", qty: 1,
    })
  }

  return (
    <Link href={`/katalog/${p.slug}`} className="group block">
      <Card className="bg-white border-[#E8E1D2]/80 hover:border-[#B89968]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-400 py-0 gap-0 overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-[#ECE4D4]/30">
          {p.tag && (
            <Badge className={`absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-wider px-2.5 rounded-full border-0 ${
              p.tag === "Baru" ? "bg-[#1A3461] text-white" :
              p.tag === "Best Seller" ? "bg-[#B89968] text-white" :
              "bg-[#0E1B2E] text-white"}`}>
              {p.tag}
            </Badge>
          )}
          <button
            onClick={(e) => { e.preventDefault(); setWish(!wish) }}
            className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full border backdrop-blur-md flex items-center justify-center transition-all ${
              wish ? "bg-rose-50 border-rose-200 text-rose-500" : "bg-white/90 border-[#E8E1D2] text-[#1A3461] hover:bg-[#B89968] hover:text-white hover:border-[#B89968]"
            }`}
            aria-label="Wishlist"
          >
            <Heart className="w-3.5 h-3.5" strokeWidth={2} fill={wish ? "currentColor" : "none"} />
          </button>
          <Image
            src={p.image}
            alt={p.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width:640px)100vw,(max-width:1024px)50vw,25vw"
          />
          {/* Quick add overlay */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3">
            <button
              onClick={handleQuickAdd}
              className="w-full h-9 bg-[#1A3461]/90 backdrop-blur-md hover:bg-[#1A3461] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              + Keranjang
            </button>
          </div>
        </div>
        <CardContent className="px-4 pt-3.5 pb-1">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-[#B89968] uppercase mb-1">{p.category}</p>
          <h3 className="font-serif text-[15px] text-[#1A3461] leading-snug mb-1.5">{p.name}</h3>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Star className="w-3 h-3 fill-[#B89968] text-[#B89968]" strokeWidth={0} />
            <span className="text-xs font-semibold text-[#0E1B2E]">{p.rating}</span>
            <span className="text-xs text-[#6B7280]">({p.reviews})</span>
          </div>
          <p className="font-serif text-[15px] font-semibold text-[#1A3461]">
            {p.priceDisplay} <span className="text-xs text-[#6B7280] font-sans font-normal">– {p.priceMaxDisplay}</span>
          </p>
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-2.5">
          <Button variant="outline" className="w-full h-9 border-[#E8E1D2] text-white text-xs font-semibold hover:bg-[#1A3461] hover:text-white hover:border-[#1A3461] bg-white rounded-lg transition-all">
            Lihat Detail <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

function FilterPanel({ activeCategories, setActiveCategories }) {
  const toggle = (slug) =>
    setActiveCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-[15px] text-[#1A3461] mb-3.5">Kategori</h3>
        <div className="space-y-2.5">
          {CATEGORIES.map((cat) => (
            <div key={cat.slug} className="flex items-center gap-2.5">
              <Checkbox
                id={cat.slug}
                checked={activeCategories.includes(cat.slug)}
                onCheckedChange={() => toggle(cat.slug)}
                className="border-[#D4BC95] data-[state=checked]:bg-[#1A3461] data-[state=checked]:border-[#1A3461]"
              />
              <label htmlFor={cat.slug} className="text-sm text-[#0E1B2E]/80 cursor-pointer flex-1">
                {cat.name}
              </label>
              <span className="text-xs text-[#6B7280]">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>
      <Separator className="bg-[#E8E1D2]" />
      <div>
        <h3 className="font-serif text-[15px] text-[#1A3461] mb-3.5">Gramasi</h3>
        <div className="space-y-2">
          {["Ringan (< 150 gsm)", "Medium (150–180 gsm)", "Berat (> 180 gsm)"].map((g) => (
            <div key={g} className="flex items-center gap-2.5">
              <Checkbox id={g} className="border-[#D4BC95] data-[state=checked]:bg-[#1A3461] data-[state=checked]:border-[#1A3461]" />
              <label htmlFor={g} className="text-sm text-[#0E1B2E]/80 cursor-pointer">{g}</label>
            </div>
          ))}
        </div>
      </div>
      <Separator className="bg-[#E8E1D2]" />
      <div>
        <h3 className="font-serif text-[15px] text-[#1A3461] mb-3.5">Ukuran</h3>
        <div className="flex flex-wrap gap-2">
          {["S", "M", "L", "XL", "2XL", "3XL"].map((s) => (
            <button key={s} className="w-10 h-10 rounded-lg border border-[#E8E1D2] text-xs font-semibold text-[#1A3461] hover:bg-[#1A3461] hover:text-white hover:border-[#1A3461] transition-all">
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function KatalogPage() {
  const [sort, setSort] = useState("default")
  const [activeCategories, setActiveCategories] = useState([])

  const filtered = useMemo(() => {
    let list = [...PRODUCTS]
    if (activeCategories.length)
      list = list.filter((p) => activeCategories.includes(p.categorySlug))
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price)
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price)
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating)
    return list
  }, [sort, activeCategories])

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#0E1B2E]">
      <SiteHeader />
      <CartToast />

      {/* Breadcrumb + header */}
      <div className="bg-white border-b border-[#E8E1D2]">
        <div className="max-w-[1240px] mx-auto px-5 lg:px-8 py-5">
          <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-4">
            <Link href="/" className="hover:text-[#1A3461] transition-colors">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1A3461] font-medium">Katalog</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl lg:text-[40px] text-[#1A3461] leading-tight">Katalog Produk</h1>
              <p className="text-[#6B7280] mt-1.5 text-sm">{filtered.length} produk tersedia</p>
            </div>
            <div className="flex items-center gap-2.5">
              {/* Mobile filter sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden border-[#E8E1D2] text-[#1A3461] bg-white h-10 text-sm">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filter
                    {activeCategories.length > 0 && (
                      <Badge className="ml-1.5 h-4 w-4 p-0 bg-[#B89968] text-white text-[9px] rounded-full flex items-center justify-center">
                        {activeCategories.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-[#F8F5EE] border-[#E8E1D2] w-72">
                  <SheetHeader>
                    <SheetTitle className="font-serif text-[#1A3461]">Filter Produk</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterPanel activeCategories={activeCategories} setActiveCategories={setActiveCategories} />
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-44 border-[#E8E1D2] text-[#0E1B2E] bg-white h-10 text-sm focus:ring-[#B89968]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#E8E1D2]">
                  {SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value} className="text-sm hover:bg-[#ECE4D4]/50">
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-5 lg:px-8 py-10">
        <div className="flex gap-8">
          {/* Sidebar filter — desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0 self-start sticky top-[90px]">
            <div className="bg-white rounded-2xl border border-[#E8E1D2] p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-[16px] text-[#1A3461]">Filter</h2>
                {activeCategories.length > 0 && (
                  <button
                    onClick={() => setActiveCategories([])}
                    className="text-[11px] text-[#B89968] hover:underline flex items-center gap-0.5"
                  >
                    <X className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>
              <FilterPanel activeCategories={activeCategories} setActiveCategories={setActiveCategories} />
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {activeCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {activeCategories.map((slug) => {
                  const cat = CATEGORIES.find((c) => c.slug === slug)
                  return (
                    <button
                      key={slug}
                      onClick={() => setActiveCategories((prev) => prev.filter((s) => s !== slug))}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A3461]/8 text-[#1A3461] text-xs font-medium border border-[#1A3461]/15 hover:bg-[#1A3461] hover:text-white transition-all"
                    >
                      {cat?.name} <X className="w-3 h-3" />
                    </button>
                  )
                })}
              </div>
            )}

            {filtered.length > 0 ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                  {filtered.map((p) => (
                    <ProductCard key={p.id} p={p} />
                  ))}
                </div>
                {/* Load more */}
                <div className="flex justify-center mt-12">
                  <Button variant="outline" className="border-[#E8E1D2] text-white hover:bg-[#1A3461] hover:text-white bg-white rounded-full h-12 px-8 font-medium transition-all group">
                    Muat Lebih Banyak
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-full bg-[#ECE4D4] flex items-center justify-center mb-4">
                  <SlidersHorizontal className="w-8 h-8 text-[#B89968]" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl text-[#1A3461] mb-2">Produk tidak ditemukan</h3>
                <p className="text-sm text-[#6B7280]">Coba ubah atau reset filter pencarian Anda.</p>
                <Button onClick={() => setActiveCategories([])} className="mt-6 bg-[#1A3461] hover:bg-[#142847] text-white rounded-lg">
                  Reset Filter
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
