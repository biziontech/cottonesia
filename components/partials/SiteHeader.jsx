// components/site-header.jsx
"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart, Menu, X } from "lucide-react"
import { useCart } from "@/lib/use-cart"

const NAV = [
  { label: "Beranda", href: "/" },
  { label: "Katalog", href: "/katalog" },
  { label: "Kategori", href: "/kategori" },
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Bantuan", href: "/bantuan" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { totalItems, cartBump } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-[#F8F5EE]/90 backdrop-blur-xl border-b border-[#E8E1D2]/80">
      <div className="max-w-[1240px] mx-auto px-5 lg:px-8 h-[78px] flex items-center justify-between gap-4">
        <Link href="/" className="flex-shrink-0" aria-label="Cottonesia">
          <Image src="/images/logo.png" alt="Cottonesia" width={250} height={40} className="h-14 w-auto" priority />
        </Link>

        <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          {NAV.map(({ label, href }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href))
            return (
              <Link
                key={label}
                href={href}
                className={`text-[13px] font-medium tracking-wide transition-colors relative group py-1.5 ${
                  active ? "text-[#1A3461]" : "text-[#0E1B2E]/60 hover:text-[#1A3461]"
                }`}
              >
                {label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-[#B89968] rounded-full transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button variant="ghost" size="icon" className="rounded-full text-[#1A3461] hover:bg-[#ECE4D4]/60" aria-label="Cari">
            <Search className="w-[18px] h-[18px]" strokeWidth={1.8} />
          </Button>
          <Link href="/keranjang">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-[#1A3461] hover:bg-[#ECE4D4]/60 relative"
              aria-label="Keranjang"
            >
              <ShoppingCart
                className={`w-[18px] h-[18px] transition-transform ${cartBump ? "scale-125" : "scale-100"}`}
                strokeWidth={1.8}
                style={{ transition: "transform 0.15s cubic-bezier(0.34,1.56,0.64,1)" }}
              />
              {totalItems > 0 && (
                <Badge
                  className={`absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 bg-[#B89968] text-white text-[9px] font-bold border-2 border-[#F8F5EE] rounded-full pointer-events-none transition-transform ${
                    cartBump ? "scale-125" : "scale-100"
                  }`}
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
          <Button className="hidden sm:inline-flex bg-[#1A3461] hover:bg-[#142847] text-white rounded-lg px-5 h-10 text-[13px] font-medium ml-2">
            Masuk / Daftar
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            className="lg:hidden rounded-full text-[#1A3461]"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[#E8E1D2] bg-[#F8F5EE] px-5 py-5 flex flex-col gap-4">
          {NAV.map(({ label, href }) => (
            <Link key={label} href={href} className="text-sm font-medium text-[#1A3461]" onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <Button className="bg-[#1A3461] hover:bg-[#142847] text-white rounded-lg w-full mt-2">
            Masuk / Daftar
          </Button>
        </div>
      )}
    </header>
  )
}
