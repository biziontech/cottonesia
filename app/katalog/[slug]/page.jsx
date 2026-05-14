// app/katalog/[slug]/page.jsx
"use client"
import { useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { SiteHeader } from "@/components/partials/SiteHeader"
import { SiteFooter } from "@/components/partials/SiteFooter"
import { CartToast } from "@/components/partials/CartToast"
import { PRODUCTS } from "@/lib/dummy-data"
import { useCart } from "@/lib/use-cart"
import {
  Star, Heart, ShoppingCart, ChevronRight, Minus, Plus,
  Share2, ShieldCheck, Truck, RotateCcw, Check, Loader2,
} from "lucide-react"

const FMT = (n) => "Rp " + n.toLocaleString("id-ID")

export default function ProductDetailPage({ params }) {
  const { slug } = use(params)
  const product = PRODUCTS.find((p) => p.slug === slug) ?? PRODUCTS[0]
  const related = PRODUCTS.filter((p) => p.slug !== product.slug && p.categorySlug === product.categorySlug).slice(0, 4)

  const [activeImg, setActiveImg] = useState(0)
  const [activeColor, setActiveColor] = useState(0)
  const [activeSize, setActiveSize] = useState(1) // default M
  const [qty, setQty] = useState(1)
  const [wish, setWish] = useState(false)
  const [addState, setAddState] = useState("idle") // idle | loading | success

  const { addItem } = useCart()

  const handleAddToCart = () => {
    if (addState !== "idle") return
    setAddState("loading")
    setTimeout(() => {
      setAddState("success")
      addItem({
        id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        price: product.price,
        priceDisplay: product.priceDisplay,
        color: product.colors[activeColor].hex,
        colorName: product.colors[activeColor].name,
        size: product.sizes[activeSize],
        qty,
      })
      setTimeout(() => setAddState("idle"), 1800)
    }, 600)
  }

  const unitPrice = product.price + activeColor * 1000
  const totalPrice = unitPrice * qty

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#0E1B2E]">
      <SiteHeader />
      <CartToast />

      <div className="max-w-[1240px] mx-auto px-5 lg:px-8 py-7">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-8">
          <Link href="/" className="hover:text-[#1A3461] transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/katalog" className="hover:text-[#1A3461] transition-colors">Katalog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1A3461] font-medium">{product.name}</span>
        </div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-start">

          {/* === Gallery === */}
          <div className="flex gap-3 lg:gap-4">
            {/* Thumbs */}
            <div className="flex flex-col gap-2.5 w-[66px] sm:w-[76px] flex-shrink-0">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activeImg === i ? "border-[#B89968] shadow-sm" : "border-[#E8E1D2] hover:border-[#B89968]/50"
                  }`}
                >
                  <Image src={src} alt={`Gambar ${i + 1}`} fill className="object-cover" sizes="76px" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-white border border-[#E8E1D2] shadow-sm">
              <Image
                key={activeImg}
                src={product.images[activeImg]}
                alt={product.name}
                fill
                className="object-cover transition-opacity duration-300"
                priority
                sizes="(max-width:1024px)100vw,50vw"
              />
              {product.tag && (
                <Badge className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-2.5 rounded-full border-0 ${
                  product.tag === "Best Seller" ? "bg-[#B89968] text-white" :
                  product.tag === "Baru" ? "bg-[#1A3461] text-white" : "bg-[#0E1B2E] text-white"
                }`}>
                  {product.tag}
                </Badge>
              )}
              <button
                onClick={() => setWish(!wish)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full border backdrop-blur-md flex items-center justify-center transition-all ${
                  wish ? "bg-rose-50 border-rose-200 text-rose-500" : "bg-white/90 border-[#E8E1D2] text-[#1A3461] hover:bg-[#B89968] hover:text-white hover:border-[#B89968]"
                }`}
              >
                <Heart className="w-4 h-4" strokeWidth={1.8} fill={wish ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          {/* === Product Info === */}
          <div className="space-y-5 lg:pt-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge className="bg-[#ECE4D4] text-[#B89968] hover:bg-[#ECE4D4] border border-[#B89968]/20 text-[10px] tracking-[0.16em] uppercase font-semibold px-3 rounded-full mb-3">
                  {product.category}
                </Badge>
                <h1 className="font-serif text-3xl lg:text-[38px] leading-[1.1] text-[#1A3461]">
                  {product.name}
                </h1>
              </div>
              <button className="w-9 h-9 rounded-full border border-[#E8E1D2] flex items-center justify-center text-[#6B7280] hover:text-[#1A3461] hover:border-[#1A3461] transition-all flex-shrink-0 mt-1">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? "fill-[#B89968] text-[#B89968]" : "text-[#E8E1D2]"}`} strokeWidth={0} />
                ))}
              </div>
              <Separator orientation="vertical" className="h-4 bg-[#E8E1D2]" />
              <span className="text-sm text-[#6B7280]">
                <span className="font-semibold text-[#0E1B2E]">{product.rating}</span> · {product.reviews} ulasan
              </span>
              <Separator orientation="vertical" className="h-4 bg-[#E8E1D2]" />
              <span className="text-sm text-[#6B7280]">MOQ <span className="font-semibold text-[#0E1B2E]">{product.moq}</span></span>
            </div>

            {/* Price */}
            <div className="bg-[#ECE4D4]/40 rounded-2xl px-5 py-4 border border-[#E8E1D2]/50">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-serif text-[30px] font-semibold text-[#1A3461]">{FMT(unitPrice)}</span>
                <span className="text-base text-[#6B7280]">– {FMT(product.priceMax)}</span>
              </div>
              <p className="text-xs text-[#6B7280]">Harga per pcs · Belum termasuk ongkos kirim</p>
            </div>

            <Separator className="bg-[#E8E1D2]" />

            {/* Color picker */}
            <div>
              <p className="text-sm font-semibold text-[#0E1B2E] mb-3">
                Warna ·{" "}
                <span className="font-normal text-[#6B7280]">{product.colors[activeColor].name}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveColor(i)}
                    title={c.name}
                    className={`relative w-9 h-9 rounded-full border-2 transition-all ${
                      activeColor === i ? "border-[#B89968] scale-110 shadow-md" : "border-[#E8E1D2] hover:border-[#B89968]/60"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {c.hex === "#FAFAF8" && <span className="absolute inset-0.5 rounded-full border border-[#E8E1D2]" />}
                    {activeColor === i && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" style={{ color: c.hex === "#FAFAF8" ? "#1A3461" : "white" }} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size picker */}
            <div>
              <p className="text-sm font-semibold text-[#0E1B2E] mb-3">
                Ukuran ·{" "}
                <span className="font-normal text-[#6B7280]">{product.sizes[activeSize]}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setActiveSize(i)}
                    className={`min-w-[44px] h-10 px-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                      activeSize === i
                        ? "border-[#1A3461] bg-[#1A3461] text-white"
                        : "border-[#E8E1D2] text-[#1A3461] hover:border-[#1A3461]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Total */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#0E1B2E] mb-2">Jumlah</p>
                <div className="flex items-center border border-[#E8E1D2] rounded-xl overflow-hidden bg-white w-fit">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#1A3461] hover:bg-[#ECE4D4]/50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold text-[#1A3461]">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-[#1A3461] hover:bg-[#ECE4D4]/50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#6B7280] mb-1">Total estimasi</p>
                <p className="font-serif text-xl font-semibold text-[#1A3461]">{FMT(totalPrice)}</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setWish(!wish)}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  wish ? "border-rose-300 bg-rose-50 text-rose-500" : "border-[#E8E1D2] text-[#1A3461] hover:border-[#B89968]"
                }`}
              >
                <Heart className="w-5 h-5" strokeWidth={1.8} fill={wish ? "currentColor" : "none"} />
              </button>

              <button
                onClick={handleAddToCart}
                disabled={addState !== "idle"}
                className={`flex-1 h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                  addState === "success"
                    ? "bg-[#4CAF7D] text-white"
                    : addState === "loading"
                    ? "bg-[#B89968]/70 text-white cursor-not-allowed"
                    : "bg-[#B89968] hover:bg-[#a08458] text-white shadow-sm hover:shadow-md"
                }`}
              >
                {addState === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                {addState === "success" && <Check className="w-4 h-4" strokeWidth={2.5} />}
                {addState === "idle" && <ShoppingCart className="w-4 h-4" />}
                {addState === "idle" ? "Tambahkan ke Keranjang" :
                 addState === "loading" ? "Menambahkan..." : "Berhasil Ditambahkan!"}
              </button>
            </div>

            {/* Trust row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                [ShieldCheck, "Kualitas Terjamin"],
                [Truck, "Kirim ke Seluruh Indonesia"],
                [RotateCcw, "Garansi Retur"],
              ].map(([Icon, label], i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 text-center p-3 rounded-xl bg-[#ECE4D4]/40 border border-[#E8E1D2]/50">
                  <Icon className="w-5 h-5 text-[#B89968]" strokeWidth={1.6} />
                  <span className="text-[10px] font-medium text-[#1A3461] leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === Tabs: Detail / Spesifikasi / Ulasan === */}
        <div className="mt-14 lg:mt-16">
          <Tabs defaultValue="detail">
            <TabsList className="bg-transparent border-b border-[#E8E1D2] rounded-none w-full justify-start h-auto p-0 gap-8 mb-8">
              {["detail", "spesifikasi", "ulasan"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-none pb-3 px-0 text-sm font-semibold capitalize data-[state=active]:text-[#1A3461] data-[state=active]:border-b-2 data-[state=active]:border-[#B89968] data-[state=inactive]:text-[#6B7280] transition-colors shadow-none bg-transparent"
                >
                  {tab === "detail" ? "Deskripsi" : tab === "spesifikasi" ? "Spesifikasi" : "Ulasan"}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="detail" className="text-[#0E1B2E]/75 leading-[1.85] text-[15px] max-w-3xl">
              {product.description}
            </TabsContent>

            <TabsContent value="spesifikasi">
              <div className="max-w-xl rounded-2xl overflow-hidden border border-[#E8E1D2]">
                {Object.entries(product.specs).map(([k, v], i) => (
                  <div key={k} className={`flex text-sm ${i % 2 === 0 ? "bg-[#ECE4D4]/30" : "bg-white"}`}>
                    <div className="w-40 px-5 py-3.5 font-semibold text-[#1A3461] flex-shrink-0">{k}</div>
                    <div className="px-5 py-3.5 text-[#0E1B2E]/75 border-l border-[#E8E1D2]">{v}</div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ulasan">
              <div className="max-w-2xl space-y-4">
                {[
                  { name: "Rizky H.", rating: 5, comment: "Kualitas sesuai ekspektasi. Bahan nyaman dan warna tajam.", date: "12 Apr 2024" },
                  { name: "Siti N.", rating: 5, comment: "Sudah order 3x dan selalu puas. Pengiriman cepat, packing rapi.", date: "8 Apr 2024" },
                  { name: "Andi S.", rating: 4, comment: "Bagus untuk sablon. Sedikit lebih tipis dari yang dijanjikan tapi overall oke.", date: "2 Apr 2024" },
                ].map((r, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-[#E8E1D2] p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm text-[#1A3461]">{r.name}</p>
                        <div className="flex gap-0.5 mt-1">
                          {[1,2,3,4,5].map((s) => (
                            <Star key={s} className={`w-3 h-3 ${s <= r.rating ? "fill-[#B89968] text-[#B89968]" : "text-[#E8E1D2]"}`} strokeWidth={0} />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-[#6B7280]">{r.date}</span>
                    </div>
                    <p className="text-sm text-[#0E1B2E]/75 leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16 lg:mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl lg:text-[32px] text-[#1A3461]">Produk Serupa</h2>
              <Link href="/katalog" className="text-sm font-semibold text-[#B89968] hover:text-[#1A3461] transition-colors">
                Lihat Semua →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {related.map((rp) => (
                <Link key={rp.id} href={`/katalog/${rp.slug}`} className="group block">
                  <Card className="bg-white border-[#E8E1D2]/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-400 py-0 gap-0 overflow-hidden">
                    <div className="aspect-square overflow-hidden bg-[#ECE4D4]/30">
                      <Image src={rp.image} alt={rp.name} width={400} height={400} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <CardContent className="px-4 pt-3.5 pb-4">
                      <h3 className="font-serif text-[14px] text-[#1A3461] mb-1">{rp.name}</h3>
                      <p className="text-xs font-semibold text-[#B89968]">{rp.priceDisplay}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  )
}
