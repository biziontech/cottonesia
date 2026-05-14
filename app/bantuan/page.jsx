// app/bantuan/page.jsx
"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SiteHeader } from "@/components/partials/SiteHeader"
import { SiteFooter } from "@/components/partials/SiteFooter"
import { FAQS } from "@/lib/dummy-data"
import {
  Search, Phone, Mail, MessageCircle, Clock,
  ChevronRight, ShoppingCart, Truck, Star, CreditCard, ArrowRight,
  Send, CheckCircle,
} from "lucide-react"

const QUICK_LINKS = [
  { icon: ShoppingCart, title: "Cara Pemesanan", desc: "Panduan lengkap pembelian grosir", href: "#pembelian" },
  { icon: Truck, title: "Info Pengiriman", desc: "Estimasi & cakupan wilayah", href: "#pengiriman" },
  { icon: CreditCard, title: "Metode Pembayaran", desc: "Transfer, QRIS, dompet digital", href: "#pembayaran" },
  { icon: Star, title: "Garansi Kualitas", desc: "Kebijakan retur & penggantian", href: "#kualitas" },
]

export default function BantuanPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState(FAQS[0].category)
  const [contactState, setContactState] = useState("idle") // idle | sending | sent

  const activeFaqs = FAQS.find((f) => f.category === activeCategory)

  const filtered = search.trim()
    ? FAQS.flatMap((f) => f.items).filter(
        (item) =>
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
      )
    : null

  const handleSend = () => {
    setContactState("sending")
    setTimeout(() => setContactState("sent"), 1200)
  }

  return (
    <div className="min-h-screen bg-[#F8F5EE]">
      <SiteHeader />

      {/* ── HERO ── */}
      <section className="relative bg-[#1A3461] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle,#B89968 1px,transparent 1px)", backgroundSize: "22px 22px" }}
        />
        <div className="max-w-[1240px] mx-auto px-5 lg:px-8 py-16 lg:py-20 relative">
          <div className="flex items-center gap-2 text-xs text-white/50 mb-6">
            <Link href="/" className="hover:text-white/80 transition-colors">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80">Bantuan</span>
          </div>
          <div className="max-w-xl mx-auto text-center">
            <h1 className="font-serif text-4xl lg:text-5xl text-white mb-4">Ada yang bisa kami bantu?</h1>
            <p className="text-white/65 mb-8">Temukan jawaban dari pertanyaan yang paling sering ditanyakan.</p>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari pertanyaan, misal: cara pembayaran..."
                className="h-14 pl-11 pr-14 bg-white border-white rounded-2xl text-[#0E1B2E] placeholder:text-[#6B7280]/70 shadow-lg text-sm focus-visible:ring-[#B89968] focus-visible:border-[#B89968]"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#0E1B2E]"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK LINKS ── */}
      <section className="py-10 bg-white border-b border-[#E8E1D2]">
        <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_LINKS.map((ql, i) => {
              const Icon = ql.icon
              return (
                <a
                  key={i}
                  href={ql.href}
                  className="group flex items-start gap-3 p-4 rounded-xl border border-[#E8E1D2] bg-[#F8F5EE] hover:border-[#B89968]/40 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#ECE4D4] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1A3461] transition-colors">
                    <Icon className="w-5 h-5 text-[#B89968]" strokeWidth={1.6} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-[#1A3461] leading-tight">{ql.title}</p>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">{ql.desc}</p>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
          {/* Search results */}
          {filtered !== null ? (
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl text-[#1A3461]">
                  Hasil pencarian{" "}
                  <span className="text-[#B89968]">&ldquo;{search}&rdquo;</span>
                </h2>
                <span className="text-sm text-[#6B7280]">{filtered.length} hasil</span>
              </div>
              {filtered.length > 0 ? (
                <Accordion type="multiple" className="space-y-3">
                  {filtered.map((item, i) => (
                    <AccordionItem
                      key={i}
                      value={`search-${i}`}
                      className="bg-white border border-[#E8E1D2] rounded-2xl px-0 overflow-hidden"
                    >
                      <AccordionTrigger className="px-6 py-4 text-left text-sm font-semibold text-[#1A3461] hover:text-[#B89968] hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-5 text-sm text-[#6B7280] leading-relaxed">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-16">
                  <p className="text-[#6B7280]">Tidak ada hasil ditemukan. Coba kata kunci lain.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid lg:grid-cols-[240px_1fr] gap-8 lg:gap-12">
              {/* Category sidebar */}
              <aside className="self-start lg:sticky lg:top-[90px]">
                <h2 className="font-serif text-lg text-[#1A3461] mb-4">Topik Bantuan</h2>
                <nav className="space-y-1">
                  {FAQS.map((f) => (
                    <button
                      key={f.category}
                      onClick={() => setActiveCategory(f.category)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        activeCategory === f.category
                          ? "bg-[#1A3461] text-white"
                          : "text-[#0E1B2E]/70 hover:bg-[#ECE4D4]/50 hover:text-[#1A3461]"
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        {f.category}
                        <span className={`text-xs ${activeCategory === f.category ? "text-white/60" : "text-[#6B7280]"}`}>
                          {f.items.length}
                        </span>
                      </span>
                    </button>
                  ))}
                </nav>
              </aside>

              {/* FAQ accordion */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-px flex-1 bg-[#E8E1D2]" />
                  <span className="text-[11px] font-semibold tracking-[0.18em] text-[#B89968] uppercase">
                    {activeCategory}
                  </span>
                  <span className="h-px flex-1 bg-[#E8E1D2]" />
                </div>

                <Accordion type="multiple" className="space-y-3">
                  {activeFaqs?.items.map((item, i) => (
                    <AccordionItem
                      key={i}
                      value={`faq-${i}`}
                      className="bg-white border border-[#E8E1D2] rounded-2xl px-0 overflow-hidden data-[state=open]:border-[#B89968]/30 transition-colors"
                    >
                      <AccordionTrigger className="px-6 py-4 text-left text-sm font-semibold text-[#1A3461] hover:text-[#B89968] hover:no-underline [&[data-state=open]]:text-[#B89968]">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-5 text-[14px] text-[#6B7280] leading-[1.8]">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="py-16 lg:py-20 bg-[#ECE4D4]/40">
        <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[11px] font-semibold tracking-[0.22em] text-[#B89968] uppercase block mb-3">Masih Ada Pertanyaan?</span>
            <h2 className="font-serif text-3xl lg:text-[40px] text-[#1A3461] leading-tight">Hubungi Tim Kami</h2>
            <p className="text-[#6B7280] mt-3 max-w-md mx-auto">Kami siap membantu Anda Senin – Sabtu, pukul 08.00 – 17.00 WIB.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {[
              { icon: Phone, title: "WhatsApp", desc: "0812-3456-7890", note: "Respons < 1 jam", href: "https://wa.me/6281234567890" },
              { icon: Mail, title: "Email", desc: "info@cottonesia.com", note: "Respons 1×24 jam", href: "mailto:info@cottonesia.com" },
              { icon: MessageCircle, title: "Live Chat", desc: "Chat langsung di website", note: "08.00 – 17.00 WIB", href: "#" },
            ].map((c, i) => {
              const Icon = c.icon
              return (
                <a
                  key={i}
                  href={c.href}
                  className="group bg-white rounded-2xl border border-[#E8E1D2] p-6 text-center hover:border-[#B89968]/40 hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#ECE4D4] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#1A3461] transition-colors duration-500">
                    <Icon className="w-7 h-7 text-[#B89968]" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-[17px] text-[#1A3461] mb-1">{c.title}</h3>
                  <p className="text-sm font-semibold text-[#0E1B2E]">{c.desc}</p>
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    <Clock className="w-3 h-3 text-[#B89968]" />
                    <span className="text-[11px] text-[#6B7280]">{c.note}</span>
                  </div>
                </a>
              )
            })}
          </div>

          {/* Contact form */}
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white border-[#E8E1D2] py-0 gap-0">
              <CardContent className="p-6 lg:p-8">
                {contactState === "sent" ? (
                  <div className="py-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-xl text-[#1A3461] mb-2">Pesan Terkirim!</h3>
                    <p className="text-[#6B7280] text-sm max-w-sm">
                      Terima kasih! Tim kami akan menghubungi Anda dalam 1×24 jam.
                    </p>
                    <Button onClick={() => setContactState("idle")} variant="outline" className="mt-6 border-[#E8E1D2] text-[#1A3461] hover:bg-[#1A3461] hover:text-white bg-white">
                      Kirim Pesan Lain
                    </Button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-serif text-xl text-[#1A3461] mb-6">Kirim Pesan</h3>
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-[#1A3461] mb-1.5 block">Nama Lengkap</label>
                          <Input
                            placeholder="Masukkan nama Anda"
                            className="border-[#E8E1D2] bg-[#F8F5EE] focus-visible:ring-[#B89968] focus-visible:border-[#B89968] text-sm h-11"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-[#1A3461] mb-1.5 block">Email</label>
                          <Input
                            type="email"
                            placeholder="email@domain.com"
                            className="border-[#E8E1D2] bg-[#F8F5EE] focus-visible:ring-[#B89968] focus-visible:border-[#B89968] text-sm h-11"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#1A3461] mb-1.5 block">Subjek</label>
                        <Input
                          placeholder="Apa yang ingin Anda tanyakan?"
                          className="border-[#E8E1D2] bg-[#F8F5EE] focus-visible:ring-[#B89968] focus-visible:border-[#B89968] text-sm h-11"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#1A3461] mb-1.5 block">Pesan</label>
                        <textarea
                          placeholder="Tuliskan pesan atau pertanyaan Anda di sini..."
                          rows={4}
                          className="w-full rounded-lg border border-[#E8E1D2] bg-[#F8F5EE] px-3 py-2.5 text-sm text-[#0E1B2E] placeholder:text-[#6B7280]/60 focus:outline-none focus:border-[#B89968] focus:ring-1 focus:ring-[#B89968] resize-none"
                        />
                      </div>
                      <Button
                        onClick={handleSend}
                        disabled={contactState === "sending"}
                        className="w-full bg-[#1A3461] hover:bg-[#142847] text-white h-12 rounded-xl font-semibold text-sm transition-all"
                      >
                        {contactState === "sending" ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            Mengirim...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            Kirim Pesan
                          </span>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
