// components/site-footer.jsx
"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Phone, Mail, Clock, MapPin, Instagram, Facebook, MessageCircle, Youtube, Send } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-[#0E1B2E] text-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #B89968 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      />
      <div className="max-w-[1240px] mx-auto px-5 lg:px-8 pt-16 pb-6 relative">
        <div className="grid md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.3fr] gap-10 mb-12">
          <div>
            <Image src="/images/logo.png" alt="Cottonesia" width={250} height={40} className="h-14 w-auto brightness-0 invert mb-5" />
            <p className="text-[14px] text-white/55 leading-[1.7] max-w-[260px]">
              Marketplace supplier kaos polos premium — kualitas terbaik, pilihan terlengkap, pengiriman aman ke seluruh Indonesia.
            </p>
            <div className="flex gap-2 mt-6">
              {[Instagram, Facebook, MessageCircle, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 hover:bg-[#B89968] hover:border-[#B89968] flex items-center justify-center transition-colors" aria-label="Social">
                  <Icon className="w-4 h-4" strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-serif text-[15px] text-white mb-4">Menu</h4>
            <ul className="space-y-2.5">
              {[["Beranda", "/"], ["Katalog", "/katalog"], ["Tentang Kami", "/tentang-kami"], ["Bantuan", "/bantuan"]].map(([l, h]) => (
                <li key={l}><Link href={h} className="text-sm text-white/55 hover:text-[#B89968] transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-[15px] text-white mb-4">Informasi</h4>
            <ul className="space-y-2.5">
              {[["Cara Belanja", "/informasi/cara-belanja"], ["Pembayaran", "/informasi/pembayaran"], ["Pengiriman", "/informasi/pengiriman"], ["Kebijakan Return", "/informasi/kebijakan-return"], ["Syarat & Ketentuan", "/informasi/syarat-ketentuan"]].map(([l, h]) => (
                <li key={h}><Link href={h} className="text-sm text-white/55 hover:text-[#B89968] transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-[15px] text-white mb-4">Kontak</h4>
            <ul className="space-y-3">
              {[
                [Phone, "0812-3456-7890"],
                [Mail, "info@cottonesia.com"],
                [Clock, "Senin–Sabtu, 08.00–17.00"],
                [MapPin, "Tanah Abang, Jakarta"],
              ].map(([Icon, text], i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Icon className="w-4 h-4 text-[#B89968] flex-shrink-0 mt-0.5" strokeWidth={1.8} />
                  <span className="text-sm text-white/55">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-[15px] text-white mb-4">Newsletter</h4>
            <p className="text-sm text-white/55 mb-4 leading-relaxed">Dapatkan promo & info produk terbaru.</p>
            <div className="relative">
              <Input
                type="email"
                placeholder="Email kamu"
                className="h-11 pr-12 bg-white/[0.06] border-white/15 text-white placeholder:text-white/35 rounded-lg focus-visible:ring-[#B89968]/50 focus-visible:border-[#B89968] text-sm"
              />
              <Button size="icon" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-[#B89968] hover:bg-[#a08458]" aria-label="Subscribe">
                <Send className="w-3.5 h-3.5 text-white" strokeWidth={2} />
              </Button>
            </div>
          </div>
        </div>
        <Separator className="bg-white/10" />
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/40">
          <span>© 2026 Cottonesia. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="/bantuan" className="hover:text-[#B89968] transition-colors">Privacy Policy</Link>
            <Link href="/bantuan" className="hover:text-[#B89968] transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
