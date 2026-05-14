// app/informasi/pengiriman/page.jsx
import { Separator } from "@/components/ui/separator"
import { Truck, Package, MapPin, Clock, Star, Gift, AlertCircle, CheckCircle } from "lucide-react"

const COURIERS = [
    { name: "JNE", service: "YES, REG, OKE", desc: "Jangkauan terluas, cocok untuk pengiriman ke seluruh Indonesia." },
    { name: "J&T Express", service: "EZ, Economy", desc: "Cepat dengan harga kompetitif, tersedia di hampir semua kota." },
    { name: "SiCepat", service: "Halu, BEST, REG", desc: "Proses pickup dan drop cepat, ideal untuk pengiriman hari yang sama." },
    { name: "AnterAja", service: "Same Day, Next Day, Reguler", desc: "Pilihan same-day delivery untuk area Jabodetabek." },
    { name: "Ninja Xpress", service: "Standard, Express", desc: "Tracking real-time dengan sistem logistik modern." },
]

const ZONES = [
    { zone: "Zona 1 — Jabodetabek", time: "1–2 hari kerja", cost: "Rp 12.000 – Rp 20.000 / kg" },
    { zone: "Zona 2 — Jawa (non-Jabodetabek)", time: "2–3 hari kerja", cost: "Rp 15.000 – Rp 25.000 / kg" },
    { zone: "Zona 3 — Sumatera, Bali, Kalimantan", time: "3–5 hari kerja", cost: "Rp 20.000 – Rp 35.000 / kg" },
    { zone: "Zona 4 — Sulawesi, NTB, NTT", time: "4–7 hari kerja", cost: "Rp 28.000 – Rp 45.000 / kg" },
    { zone: "Zona 5 — Papua, Maluku, daerah terpencil", time: "5–10 hari kerja", cost: "Rp 35.000 – Rp 70.000 / kg" },
]

export default function PengirimanPage() {
    return (
        <article className="space-y-10">
            {/* Header */}
            <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] text-[#B89968] uppercase mb-3">
                    Info Pengiriman
                </p>
                <h1 className="font-serif text-3xl lg:text-[42px] leading-[1.1] text-[#1A3461] mb-4">
                    Pengiriman & Ekspedisi
                </h1>
                <p className="text-[#6B7280] leading-[1.8] text-[15px] max-w-2xl">
                    Kami bekerja sama dengan ekspedisi terpercaya untuk memastikan pesanan Anda tiba dengan aman, tepat waktu, dan dalam kondisi sempurna.
                </p>
            </div>

            {/* Free shipping banner */}
            <div className="bg-[#1A3461] rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#B89968]/20 flex items-center justify-center flex-shrink-0">
                    <Gift className="w-6 h-6 text-[#B89968]" strokeWidth={1.7} />
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-white text-[15px]">
                        Gratis Ongkos Kirim untuk pembelian di atas <span className="text-[#D4BC95]">Rp 2.000.000</span>
                    </p>
                    <p className="text-white/60 text-[13px] mt-0.5">Berlaku untuk pengiriman ke seluruh Pulau Jawa via JNE REG / J&T EZ.</p>
                </div>
            </div>

            <Separator className="bg-[#E8E1D2]" />

            {/* Couriers */}
            <div>
                <h2 className="font-serif text-[22px] text-[#1A3461] mb-5">Mitra Ekspedisi Kami</h2>
                <div className="space-y-3">
                    {COURIERS.map((c, i) => (
                        <div key={i} className="bg-white rounded-xl border border-[#E8E1D2] p-4 flex items-start gap-4 hover:border-[#B89968]/30 transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-[#ECE4D4] flex items-center justify-center flex-shrink-0">
                                <Truck className="w-5 h-5 text-[#B89968]" strokeWidth={1.7} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="font-serif font-semibold text-[15px] text-[#1A3461]">{c.name}</span>
                                    <span className="text-[10px] font-bold tracking-wider text-[#B89968] bg-[#ECE4D4] px-2.5 py-0.5 rounded-full">
                                        {c.service}
                                    </span>
                                </div>
                                <p className="text-[13px] text-[#6B7280] mt-1">{c.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Separator className="bg-[#E8E1D2]" />

            {/* Zones */}
            <div>
                <h2 className="font-serif text-[22px] text-[#1A3461] mb-2">Estimasi Waktu & Biaya</h2>
                <p className="text-[#6B7280] text-[14px] mb-5">
                    Estimasi di bawah berlaku untuk layanan Reguler. Waktu dihitung dari saat pesanan diproses (setelah konfirmasi pembayaran).
                </p>
                <div className="rounded-2xl overflow-hidden border border-[#E8E1D2]">
                    <div className="grid grid-cols-3 bg-[#1A3461] px-5 py-3.5">
                        <span className="text-[11px] font-bold tracking-[0.12em] text-white/70 uppercase">Zona</span>
                        <span className="text-[11px] font-bold tracking-[0.12em] text-white/70 uppercase">Estimasi</span>
                        <span className="text-[11px] font-bold tracking-[0.12em] text-white/70 uppercase">Ongkos Kirim</span>
                    </div>
                    {ZONES.map((z, i) => (
                        <div
                            key={i}
                            className={`grid grid-cols-3 px-5 py-4 text-sm border-b border-[#E8E1D2] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#ECE4D4]/20"
                                }`}
                        >
                            <span className="font-medium text-[#1A3461] text-[13px]">{z.zone}</span>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-[#B89968]" strokeWidth={2} />
                                <span className="text-[13px] text-[#0E1B2E]/75">{z.time}</span>
                            </div>
                            <span className="text-[13px] text-[#0E1B2E]/75">{z.cost}</span>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-[#6B7280] mt-2 italic">
                    * Biaya pengiriman dihitung otomatis berdasarkan berat dan tujuan saat checkout.
                </p>
            </div>

            <Separator className="bg-[#E8E1D2]" />

            {/* Process timeline */}
            <div>
                <h2 className="font-serif text-[22px] text-[#1A3461] mb-5">Proses Pengiriman</h2>
                <div className="space-y-4">
                    {[
                        { icon: CheckCircle, step: "Pembayaran Dikonfirmasi", desc: "Sistem memverifikasi pembayaran Anda secara otomatis atau manual (maks. 2 jam)." },
                        { icon: Package, step: "Pesanan Diproses", desc: "Tim gudang mempersiapkan dan mengemas pesanan dalam 1×24 jam hari kerja." },
                        { icon: Truck, step: "Diserahkan ke Ekspedisi", desc: "Pesanan diserahkan ke kurir pilihan. Nomor resi dikirim via email dan WhatsApp." },
                        { icon: MapPin, step: "Dalam Proses Pengiriman", desc: "Lacak pesanan Anda secara real-time menggunakan nomor resi yang diberikan." },
                        { icon: Star, step: "Pesanan Tiba", desc: "Periksa kondisi paket sebelum menandatangani tanda terima. Hubungi kami jika ada masalah." },
                    ].map((item, i) => {
                        const Icon = item.icon
                        return (
                            <div key={i} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-9 h-9 rounded-full bg-[#ECE4D4] flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-4 h-4 text-[#B89968]" strokeWidth={2} />
                                    </div>
                                    {i < 4 && <div className="w-px flex-1 bg-[#E8E1D2] my-1" />}
                                </div>
                                <div className="pb-4">
                                    <p className="font-semibold text-[14px] text-[#1A3461] mb-1">{item.step}</p>
                                    <p className="text-[13px] text-[#6B7280] leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <Separator className="bg-[#E8E1D2]" />

            {/* Packing */}
            <div>
                <h2 className="font-serif text-[22px] text-[#1A3461] mb-5">Standar Pengemasan</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    {[
                        { title: "Plastik PE Tebal", desc: "Setiap kaos dibungkus plastik PE tebal untuk perlindungan dari kelembaban." },
                        { title: "Packing Rapi & Bersih", desc: "Kaos dilipat rapi dan disusun per warna/ukuran untuk memudahkan pengecekan." },
                        { title: "Karton Double Wall", desc: "Box pengiriman menggunakan karton double wall untuk pesanan besar." },
                        { title: "Label Fragile", desc: "Khusus produk premium, ditambahkan stiker 'Handle with Care' pada paket." },
                    ].map((item, i) => (
                        <div key={i} className="bg-[#ECE4D4]/40 rounded-xl border border-[#E8E1D2] p-4 flex gap-3">
                            <CheckCircle className="w-4 h-4 text-[#B89968] flex-shrink-0 mt-0.5" strokeWidth={2} />
                            <div>
                                <p className="font-semibold text-[14px] text-[#1A3461] mb-1">{item.title}</p>
                                <p className="text-[13px] text-[#6B7280]">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Note */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" strokeWidth={1.8} />
                <div className="text-[13px] text-amber-800 leading-relaxed">
                    <p className="font-semibold mb-1">Perlu diperhatikan</p>
                    Estimasi waktu pengiriman tidak termasuk hari Minggu dan hari libur nasional. Untuk area terpencil atau daerah bencana, estimasi dapat berbeda. Jika pesanan belum tiba melebihi estimasi, segera hubungi tim kami.
                </div>
            </div>
        </article>
    )
}