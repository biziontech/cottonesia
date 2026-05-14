// app/keranjang/page.jsx
"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/partials/SiteHeader"
import { SiteFooter } from "@/components/partials/SiteFooter"
import { useCart } from "@/lib/use-cart"
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowLeft,
  ArrowRight, ShieldCheck, Truck, Tag, ChevronRight,
} from "lucide-react"

const FMT = (n) => "Rp " + n.toLocaleString("id-ID")
const SHIP = 25000
const FREE_SHIP = 2000000

export default function KeranjangPage() {
  const { items, removeItem, updateQty, subtotal, totalItems } = useCart()

  const shipping = subtotal >= FREE_SHIP ? 0 : SHIP
  const total = subtotal + shipping
  const freeShipRemaining = FREE_SHIP - subtotal

  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-[#F8F5EE]">
        <SiteHeader />
        <div className="max-w-[1240px] mx-auto px-5 lg:px-8 py-20 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full bg-[#ECE4D4] flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-[#B89968]" strokeWidth={1.4} />
          </div>
          <h2 className="font-serif text-2xl lg:text-3xl text-[#1A3461] mb-3">Keranjangmu masih kosong</h2>
          <p className="text-[#6B7280] mb-8 max-w-sm">
            Temukan kaos polos premium pilihan kami dan mulai belanja sekarang.
          </p>
          <Button asChild className="bg-[#1A3461] hover:bg-[#142847] text-white rounded-lg h-12 px-8 font-medium">
            <Link href="/katalog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Lihat Katalog
            </Link>
          </Button>
        </div>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F5EE]">
      <SiteHeader />

      <div className="max-w-[1240px] mx-auto px-5 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-7">
          <Link href="/" className="hover:text-[#1A3461] transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1A3461] font-medium">Keranjang</span>
        </div>

        <h1 className="font-serif text-3xl lg:text-[40px] text-[#1A3461] mb-8">
          Keranjang Belanja
          <span className="font-sans text-[18px] font-normal text-[#6B7280] ml-3">({totalItems} item)</span>
        </h1>

        {/* Free shipping progress */}
        {freeShipRemaining > 0 && (
          <div className="bg-[#ECE4D4]/60 border border-[#E8E1D2] rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#B89968] flex-shrink-0" strokeWidth={1.7} />
            <div className="flex-1">
              <p className="text-sm text-[#1A3461] mb-2">
                Tambah <span className="font-bold">{FMT(freeShipRemaining)}</span> lagi untuk gratis ongkir!
              </p>
              <div className="h-1.5 bg-[#E8E1D2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#B89968] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (subtotal / FREE_SHIP) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}
        {freeShipRemaining <= 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
            <Truck className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-sm text-green-700 font-medium">Selamat! Kamu mendapatkan gratis ongkir! 🎉</p>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Cart items */}
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.key} className="bg-white border-[#E8E1D2]/80 py-0 gap-0 overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex gap-4">
                    {/* Image */}
                    <Link href={`/katalog/${item.slug}`} className="flex-shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#ECE4D4]/40 border border-[#E8E1D2]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link href={`/katalog/${item.slug}`} className="font-serif text-[16px] text-[#1A3461] hover:text-[#B89968] transition-colors leading-snug">
                            {item.name}
                          </Link>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-[#E8E1D2] flex-shrink-0"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-xs text-[#6B7280]">{item.colorName}</span>
                            </div>
                            <span className="text-xs text-[#6B7280]">·</span>
                            <span className="text-xs text-[#6B7280]">Size {item.size}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.key)}
                          className="w-8 h-8 rounded-lg text-[#6B7280] hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all flex-shrink-0"
                          aria-label="Hapus item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        {/* Qty */}
                        <div className="flex items-center border border-[#E8E1D2] rounded-lg overflow-hidden bg-[#F8F5EE]">
                          <button
                            onClick={() => updateQty(item.key, item.qty - 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#1A3461] hover:bg-[#ECE4D4]/50 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center text-sm font-semibold text-[#1A3461]">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.key, item.qty + 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#1A3461] hover:bg-[#ECE4D4]/50 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                          <p className="font-serif text-[17px] font-semibold text-[#1A3461]">
                            {FMT(item.price * item.qty)}
                          </p>
                          <p className="text-[11px] text-[#6B7280] mt-0.5">
                            {item.qty} × {FMT(item.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between items-center pt-2">
              <Link href="/katalog" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1A3461] hover:text-[#B89968] transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Lanjut Belanja
              </Link>
              <p className="text-xs text-[#6B7280]">{totalItems} item · {FMT(subtotal)} subtotal</p>
            </div>
          </div>

          {/* Order summary */}
          <div className="space-y-4 lg:sticky lg:top-[90px]">
            {/* Voucher */}
            <Card className="bg-white border-[#E8E1D2]/80 py-0 gap-0">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-[#B89968]" strokeWidth={2} />
                  <span className="font-semibold text-sm text-[#1A3461]">Gunakan Voucher</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Masukkan kode voucher"
                    className="flex-1 h-10 rounded-lg border border-[#E8E1D2] px-3 text-sm text-[#0E1B2E] bg-[#F8F5EE] placeholder:text-[#6B7280]/60 focus:outline-none focus:border-[#B89968]"
                  />
                  <Button variant="outline" className="border-[#E8E1D2] text-[#1A3461] hover:bg-[#1A3461] hover:text-white h-10 px-4 text-sm bg-white">
                    Pakai
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="bg-white border-[#E8E1D2]/80 py-0 gap-0">
              <CardContent className="p-5">
                <h3 className="font-serif text-lg text-[#1A3461] mb-4">Ringkasan Pesanan</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-[#0E1B2E]/75">
                    <span>Subtotal ({totalItems} item)</span>
                    <span className="font-medium">{FMT(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#0E1B2E]/75">
                    <span>Ongkos Kirim</span>
                    <span className={`font-medium ${shipping === 0 ? "text-green-600" : ""}`}>
                      {shipping === 0 ? "Gratis" : FMT(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#0E1B2E]/75">
                    <span>Diskon Voucher</span>
                    <span className="font-medium text-green-600">–</span>
                  </div>
                </div>

                <Separator className="bg-[#E8E1D2] my-4" />

                <div className="flex justify-between items-center mb-5">
                  <span className="font-semibold text-[#1A3461]">Total Pembayaran</span>
                  <span className="font-serif text-[22px] font-semibold text-[#1A3461]">{FMT(total)}</span>
                </div>

                <Button className="w-full bg-[#1A3461] hover:bg-[#142847] text-white h-12 rounded-xl font-semibold text-[14px] shadow-sm hover:shadow-md transition-all group">
                  Lanjut ke Pembayaran
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                </Button>

                <div className="flex items-center gap-1.5 justify-center mt-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B89968]" strokeWidth={2} />
                  <span className="text-[11px] text-[#6B7280]">Pembayaran dijamin aman & terenkripsi</span>
                </div>
              </CardContent>
            </Card>

            {/* Accepted payments */}
            <div className="text-center">
              <p className="text-[11px] text-[#6B7280] mb-2">Metode pembayaran yang diterima</p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {["BCA", "Mandiri", "BNI", "QRIS", "GoPay", "OVO"].map((m) => (
                  <span key={m} className="text-[10px] font-semibold px-2 py-1 rounded-md bg-white border border-[#E8E1D2] text-[#6B7280]">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
