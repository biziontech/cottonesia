// components/product-card.jsx
"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star, Heart, ChevronRight } from "lucide-react"
import { useCart } from "@/lib/use-cart"

export function ProductCard({ p, size = "default" }) {
  const [wish, setWish] = useState(false)
  const { addItem } = useCart()

  const handleQuickAdd = (e) => {
    e.preventDefault()
    addItem({
      id: p.id, slug: p.slug, name: p.name,
      image: p.image, price: p.price, priceDisplay: p.priceDisplay,
      color: p.colors[0].hex, colorName: p.colors[0].name,
      size: "M", qty: 1,
    })
  }

  return (
    <Link href={`/katalog/${p.slug}`} className="group block h-full">
      <Card className="h-full bg-white border-[#E8E1D2]/80 hover:border-[#B89968]/35 hover:shadow-xl hover:-translate-y-1 transition-all duration-400 py-0 gap-0 overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-[#ECE4D4]/30">
          {p.tag && (
            <Badge
              className={`absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border-0 ${
                p.tag === "Baru" ? "bg-[#1A3461] text-white" :
                p.tag === "Best Seller" ? "bg-[#B89968] text-white" :
                p.tag === "Populer" ? "bg-[#5E7A52] text-white" :
                "bg-[#0E1B2E] text-white"
              }`}
            >
              {p.tag}
            </Badge>
          )}
          <button
            onClick={(e) => { e.preventDefault(); setWish(!wish) }}
            className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full border backdrop-blur-md flex items-center justify-center transition-all shadow-sm ${
              wish
                ? "bg-rose-50 border-rose-200 text-rose-500"
                : "bg-white/90 border-[#E8E1D2] text-[#1A3461] hover:bg-[#B89968] hover:text-white hover:border-[#B89968]"
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
          {/* Quick add */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3">
            <button
              onClick={handleQuickAdd}
              className="w-full h-9 bg-[#1A3461]/92 backdrop-blur-sm hover:bg-[#1A3461] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              + Tambah ke Keranjang
            </button>
          </div>
        </div>

        {/* Info */}
        <CardContent className="px-4 pt-3.5 pb-1">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-[#B89968] uppercase mb-1">
            {p.category}
          </p>
          <h3 className="font-serif text-[15px] text-[#1A3461] leading-snug mb-1.5">
            {p.name}
          </h3>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Star className="w-3 h-3 fill-[#B89968] text-[#B89968]" strokeWidth={0} />
            <span className="text-xs font-semibold text-[#0E1B2E]">{p.rating}</span>
            <span className="text-xs text-[#6B7280]">· {p.reviews} ulasan</span>
          </div>
          <p className="font-serif text-[15px] font-semibold text-[#1A3461]">
            {p.priceDisplay}
            <span className="text-xs text-[#6B7280] font-sans font-normal ml-1">
              – {p.priceMaxDisplay}
            </span>
          </p>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-2.5">
          <Button
            variant="outline"
            className="w-full h-9 border-[#E8E1D2] text-white text-xs font-semibold hover:bg-[#1A3461] hover:text-white hover:border-[#1A3461] bg-white rounded-lg transition-all"
          >
            Lihat Detail
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}