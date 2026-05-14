// components/cart-toast.jsx
"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, X } from "lucide-react"
import { useCart } from "@/lib/use-cart"

export function CartToast() {
  const { toast, setToast } = useCart()
  const { visible, item } = toast

  return (
    <div
      className={`fixed top-[88px] right-4 sm:right-6 z-[200] transition-all duration-500 ease-out ${
        visible ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"
      }`}
      aria-live="polite"
    >
      <div className="w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-[#E8E1D2] overflow-hidden">
        {/* Green progress bar */}
        <div
          className="h-0.5 bg-[#4CAF7D] origin-left"
          style={{
            animation: visible ? "shrink 3.2s linear forwards" : "none",
          }}
        />

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Product thumbnail */}
            {item?.image && (
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#ECE4D4]/60">
                <Image
                  src={item.image}
                  alt={item.name ?? ""}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-4 h-4 rounded-full bg-[#4CAF7D] flex items-center justify-center flex-shrink-0">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
                <span className="text-[11px] font-semibold text-[#4CAF7D]">
                  Ditambahkan ke keranjang!
                </span>
              </div>
              <p className="font-serif text-[14px] text-[#1A3461] leading-snug truncate">
                {item?.name}
              </p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">
                {item?.colorName} · Size {item?.size} · {item?.qty ?? 1} pcs
              </p>
            </div>

            <button
              onClick={() => setToast({ visible: false, item: null })}
              className="text-[#6B7280] hover:text-[#0E1B2E] transition-colors flex-shrink-0 mt-0.5"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 flex gap-2">
            <Button
              asChild
              variant="outline"
              className="flex-1 h-8 border-[#E8E1D2] text-[#1A3461] text-xs font-semibold hover:bg-[#1A3461] hover:text-white hover:border-[#1A3461] rounded-lg transition-all"
            >
              <Link href="/keranjang">
                Lihat Keranjang
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
            <Button
              onClick={() => setToast({ visible: false, item: null })}
              className="flex-1 h-8 bg-[#1A3461] hover:bg-[#142847] text-white text-xs font-semibold rounded-lg"
            >
              Lanjut Belanja
            </Button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shrink {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </div>
  )
}
