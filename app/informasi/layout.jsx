// app/informasi/layout.jsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SiteHeader } from "@/components/partials/SiteHeader"
import { SiteFooter } from "@/components/partials/SiteFooter"
import {
    ShoppingCart, CreditCard, Truck, RotateCcw, FileText,
    ChevronRight,
} from "lucide-react"

const LINKS = [
    { href: "/informasi/cara-belanja", label: "Cara Belanja", icon: ShoppingCart },
    { href: "/informasi/pembayaran", label: "Pembayaran", icon: CreditCard },
    { href: "/informasi/pengiriman", label: "Pengiriman", icon: Truck },
    { href: "/informasi/kebijakan-return", label: "Kebijakan Return", icon: RotateCcw },
    { href: "/informasi/syarat-ketentuan", label: "Syarat & Ketentuan", icon: FileText },
]

export default function InformasiLayout({ children }) {
    const pathname = usePathname()
    const current = LINKS.find((l) => l.href === pathname)

    return (
        <div className="min-h-screen bg-[#F8F5EE]">
            <SiteHeader />

            {/* Breadcrumb bar */}
            <div className="bg-white border-b border-[#E8E1D2]">
                <div className="max-w-[1240px] mx-auto px-5 lg:px-8 py-4">
                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                        <Link href="/" className="hover:text-[#1A3461] transition-colors">Beranda</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-[#6B7280]">Informasi</span>
                        {current && (
                            <>
                                <ChevronRight className="w-3 h-3" />
                                <span className="text-[#1A3461] font-medium">{current.label}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-[1240px] mx-auto px-5 lg:px-8 py-10 lg:py-14">
                <div className="grid lg:grid-cols-[260px_1fr] gap-8 lg:gap-12 items-start">

                    {/* ── SIDEBAR ── */}
                    <aside className="self-start lg:sticky lg:top-[94px] space-y-3">
                        <div className="bg-white rounded-2xl border border-[#E8E1D2] overflow-hidden">
                            <div className="px-5 py-4 bg-[#ECE4D4]/40 border-b border-[#E8E1D2]">
                                <p className="font-serif text-[15px] text-[#1A3461]">Pusat Informasi</p>
                                <p className="text-[11px] text-[#6B7280] mt-0.5">Panduan lengkap berbelanja</p>
                            </div>
                            <nav className="p-2">
                                {LINKS.map(({ href, label, icon: Icon }) => {
                                    const active = pathname === href
                                    return (
                                        <Link
                                            key={href}
                                            href={href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all group ${active
                                                    ? "bg-[#1A3461] text-white shadow-sm"
                                                    : "text-[#0E1B2E]/70 hover:bg-[#ECE4D4]/50 hover:text-[#1A3461]"
                                                }`}
                                        >
                                            <Icon
                                                className={`w-4 h-4 flex-shrink-0 ${active ? "text-[#D4BC95]" : "text-[#B89968]"}`}
                                                strokeWidth={1.8}
                                            />
                                            {label}
                                            {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#D4BC95]" />}
                                        </Link>
                                    )
                                })}
                            </nav>
                        </div>

                        {/* Help card */}
                        <div className="bg-[#1A3461] rounded-2xl p-5 text-white">
                            <p className="font-serif text-[15px] mb-1.5">Butuh Bantuan?</p>
                            <p className="text-white/60 text-xs leading-relaxed mb-4">
                                Tim kami siap membantu Senin–Sabtu, 08.00–17.00 WIB.
                            </p>
                            <Link
                                href="/bantuan"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B89968] hover:text-[#D4BC95] transition-colors"
                            >
                                Hubungi Kami <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </aside>

                    {/* ── CONTENT ── */}
                    <main className="min-w-0">{children}</main>
                </div>
            </div>

            <SiteFooter />
        </div>
    )
}