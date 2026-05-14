// app/tentang-kami/page.jsx
"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/partials/SiteHeader"
import { SiteFooter } from "@/components/partials/SiteFooter"
import { TEAM } from "@/lib/dummy-data"
import {
  ArrowRight, Award, Leaf, ShieldCheck, Users,
  ChevronRight, Heart, Globe, Package,
} from "lucide-react"

const VALUES = [
  { icon: Award, title: "Kualitas Tanpa Kompromi", desc: "Setiap produk melewati quality control ketat. Kami tidak mengorbankan kualitas demi margin." },
  { icon: Leaf, title: "Ramah Lingkungan", desc: "Mendorong penggunaan bahan berkelanjutan dan proses produksi yang bertanggung jawab." },
  { icon: ShieldCheck, title: "Kepercayaan & Transparansi", desc: "Informasi harga, spesifikasi, dan stok selalu akurat. Tidak ada biaya tersembunyi." },
  { icon: Heart, title: "Fokus pada Pelanggan", desc: "Tim kami selalu siap membantu dan menemukan solusi terbaik untuk kebutuhan bisnis Anda." },
]

const MILESTONES = [
  { year: "2022", title: "Cottonesia Berdiri", desc: "Didirikan dengan visi menjadi marketplace cotton terpercaya di Indonesia." },
  { year: "2023 Q1", title: "1.000 Pelanggan", desc: "Mencapai 1.000 pelanggan aktif dalam 6 bulan pertama beroperasi." },
  { year: "2023 Q3", title: "Ekspansi Produk", desc: "Menambahkan lini Cotton Bamboo dan Oversize Series untuk memenuhi permintaan pasar." },
  { year: "2024", title: "10.000+ Pelanggan", desc: "Dipercaya oleh lebih dari 10.000 pelaku bisnis tekstil di seluruh Indonesia." },
]

const STATS = [
  { num: "10.000+", label: "Pelanggan Aktif", icon: Users },
  { num: "100K+", label: "Produk Terjual", icon: Package },
  { num: "34", label: "Provinsi Terlayani", icon: Globe },
  { num: "2+", label: "Tahun Pengalaman", icon: Award },
]

export default function TentangKamiPage() {
  return (
    <div className="min-h-screen bg-[#F8F5EE]">
      <SiteHeader />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#1A3461]">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle,#B89968 1px,transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#B89968]/15 blur-3xl" />
        <div className="max-w-[1240px] mx-auto px-5 lg:px-8 py-20 lg:py-28 relative">
          <div className="flex items-center gap-2 text-xs text-white/50 mb-8">
            <Link href="/" className="hover:text-white/80 transition-colors">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80">Tentang Kami</span>
          </div>
          <div className="max-w-2xl">
            <span className="inline-block text-[11px] font-semibold tracking-[0.22em] text-[#B89968] uppercase mb-4">
              Tentang Cottonesia
            </span>
            <h1 className="font-serif text-4xl lg:text-[56px] leading-[1.08] text-white tracking-tight mb-6">
              Kami hadir untuk
              <br />
              <em className="not-italic text-[#D4BC95]">memajukan bisnis</em>
              <br />
              tekstil Indonesia.
            </h1>
            <p className="text-white/70 text-[16px] lg:text-[17px] leading-[1.75] max-w-xl">
              Cottonesia adalah platform marketplace yang menghubungkan pelaku bisnis tekstil
              dengan supplier kaos polos premium terpercaya di seluruh Indonesia.
            </p>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white border-b border-[#E8E1D2]">
        <div className="max-w-[1240px] mx-auto px-5 lg:px-8 py-12 grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-[#E8E1D2]">
          {STATS.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className={`text-center ${i > 1 ? "pt-6 lg:pt-0" : ""} ${i > 0 ? "lg:pl-6" : ""}`}>
                <div className="w-10 h-10 rounded-xl bg-[#ECE4D4] flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-[#B89968]" strokeWidth={1.7} />
                </div>
                <div className="font-serif text-3xl text-[#1A3461] leading-none">{s.num}</div>
                <div className="text-xs text-[#6B7280] tracking-wide uppercase mt-1.5">{s.label}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-[32px] border border-[#B89968]/25 -z-10" />
              <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden shadow-xl">
                <Image
                  src={`https://picsum.photos/seed/about-story/800/1000`}
                  alt="Cerita Cottonesia"
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px)100vw,50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A3461]/40 to-transparent" />
              </div>
              {/* Float card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-[#E8E1D2]/60">
                <p className="font-serif text-[15px] italic text-[#1A3461] leading-relaxed">
                  &ldquo;Kami percaya setiap bisnis berhak mendapatkan bahan baku terbaik dengan harga yang adil.&rdquo;
                </p>
                <p className="text-xs text-[#6B7280] mt-2 font-semibold">— Budi Santoso, Founder</p>
              </div>
            </div>

            <div className="space-y-6">
              <span className="text-[11px] font-semibold tracking-[0.22em] text-[#B89968] uppercase">Cerita Kami</span>
              <h2 className="font-serif text-3xl lg:text-[44px] leading-[1.1] text-[#1A3461]">
                Dimulai dari satu masalah sederhana.
              </h2>
              <div className="space-y-4 text-[15px] text-[#6B7280] leading-[1.8]">
                <p>
                  Pada tahun 2022, kami melihat bahwa pelaku bisnis tekstil Indonesia — terutama UMKM — kesulitan
                  menemukan supplier kaos polos yang konsisten kualitasnya, kompetitif harganya, dan mudah diakses.
                </p>
                <p>
                  Cottonesia hadir sebagai solusi: satu platform yang memudahkan proses dari pencarian produk,
                  perbandingan kualitas, hingga pengiriman ke seluruh Indonesia.
                </p>
                <p>
                  Hari ini, kami melayani lebih dari 10.000 pelanggan aktif dari berbagai kota, dari reseller
                  kecil hingga brand clothing nasional.
                </p>
              </div>
              <Button asChild className="bg-[#1A3461] hover:bg-[#142847] text-white rounded-lg h-12 px-7 font-medium group">
                <Link href="/katalog">
                  Lihat Produk Kami
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-20 lg:py-24 bg-[#ECE4D4]/35">
        <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[11px] font-semibold tracking-[0.22em] text-[#B89968] uppercase block mb-3">Nilai-Nilai Kami</span>
            <h2 className="font-serif text-3xl lg:text-[44px] text-[#1A3461] leading-tight">
              Yang kami yakini & junjung tinggi
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => {
              const Icon = v.icon
              return (
                <Card key={i} className="bg-white border-[#E8E1D2]/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 py-7 group">
                  <CardContent className="px-6">
                    <div className="w-12 h-12 rounded-xl bg-[#ECE4D4] flex items-center justify-center mb-4 group-hover:bg-[#1A3461] transition-colors duration-500">
                      <Icon className="w-6 h-6 text-[#B89968]" strokeWidth={1.6} />
                    </div>
                    <h3 className="font-serif text-[17px] text-[#1A3461] mb-2 leading-tight">{v.title}</h3>
                    <p className="text-[13.5px] text-[#6B7280] leading-relaxed">{v.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[11px] font-semibold tracking-[0.22em] text-[#B89968] uppercase block mb-3">Perjalanan Kami</span>
            <h2 className="font-serif text-3xl lg:text-[44px] text-[#1A3461] leading-tight">
              Milestone Cottonesia
            </h2>
          </div>
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-[19px] lg:left-1/2 top-0 bottom-0 w-px bg-[#E8E1D2]" />
            <div className="space-y-10">
              {MILESTONES.map((m, i) => (
                <div
                  key={i}
                  className={`relative flex gap-6 lg:gap-0 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                >
                  {/* Dot */}
                  <div className="absolute left-0 lg:left-1/2 lg:-translate-x-1/2 w-10 h-10 rounded-full bg-[#B89968] flex items-center justify-center z-10 shadow-md flex-shrink-0">
                    <span className="text-white font-serif text-xs font-bold">{i + 1}</span>
                  </div>

                  {/* Content */}
                  <div className={`ml-14 lg:ml-0 lg:w-[46%] ${i % 2 === 0 ? "lg:pr-10 lg:text-right" : "lg:pl-10 lg:ml-auto"}`}>
                    <div className="bg-white rounded-2xl border border-[#E8E1D2] p-5 hover:shadow-lg transition-shadow">
                      <span className="inline-block text-[10px] font-bold tracking-[0.18em] text-[#B89968] uppercase mb-2">
                        {m.year}
                      </span>
                      <h3 className="font-serif text-[17px] text-[#1A3461] mb-1.5">{m.title}</h3>
                      <p className="text-sm text-[#6B7280] leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-20 lg:py-24 bg-[#ECE4D4]/35">
        <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[11px] font-semibold tracking-[0.22em] text-[#B89968] uppercase block mb-3">Tim Kami</span>
            <h2 className="font-serif text-3xl lg:text-[44px] text-[#1A3461] leading-tight">Orang-orang di balik Cottonesia</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {TEAM.map((member, i) => (
              <Card key={i} className="bg-white border-[#E8E1D2]/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 py-0 gap-0 overflow-hidden text-center group">
                <div className="aspect-square overflow-hidden bg-[#ECE4D4]/30">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <CardContent className="px-5 py-5">
                  <h3 className="font-serif text-[17px] text-[#1A3461] mb-0.5">{member.name}</h3>
                  <p className="text-[11px] font-bold tracking-[0.14em] text-[#B89968] uppercase mb-3">{member.role}</p>
                  <Separator className="bg-[#E8E1D2] mb-3" />
                  <p className="text-[13px] text-[#6B7280] leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 lg:py-20">
        <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
          <div className="relative bg-[#1A3461] rounded-3xl px-8 py-14 lg:p-16 overflow-hidden text-center">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#B89968]/15 blur-3xl pointer-events-none" />
            <span className="text-[11px] font-semibold tracking-[0.22em] text-[#B89968] uppercase block mb-4">
              Bergabung Bersama Kami
            </span>
            <h2 className="font-serif text-3xl lg:text-[44px] text-white leading-tight mb-4">
              Siap memulai perjalanan bisnis<br />bersama Cottonesia?
            </h2>
            <p className="text-white/65 mb-8 max-w-md mx-auto">
              Daftarkan bisnis Anda sekarang dan akses ribuan produk premium dengan harga grosir.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button className="bg-[#B89968] hover:bg-[#a08458] text-white rounded-lg h-12 px-7 font-medium shadow-md">
                Mulai Belanja
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button asChild variant="outline" className="border-white/25 text-white hover:bg-white hover:text-[#1A3461] rounded-lg h-12 px-7 font-medium bg-transparent">
                <Link href="/bantuan">Hubungi Kami</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
