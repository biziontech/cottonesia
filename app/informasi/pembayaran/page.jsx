// app/informasi/pembayaran/page.jsx
import { Separator } from "@/components/ui/separator"
import {
    Building2, Smartphone, CreditCard, HandCoins,
    ShieldCheck, Clock, AlertCircle, CheckCircle,
} from "lucide-react"

const METHODS = [
    {
        icon: Building2,
        title: "Transfer Bank",
        color: "bg-blue-50 border-blue-100",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        items: [
            { name: "BCA", detail: "a.n. PT Cottonesia Indonesia · No. Rek. 1234-5678-90" },
            { name: "Mandiri", detail: "a.n. PT Cottonesia Indonesia · No. Rek. 9876-5432-10" },
            { name: "BNI", detail: "a.n. PT Cottonesia Indonesia · No. Rek. 1122-3344-55" },
            { name: "BRI", detail: "a.n. PT Cottonesia Indonesia · No. Rek. 5566-7788-99" },
        ],
        note: "Konfirmasi pembayaran via WhatsApp atau email setelah transfer.",
    },
    {
        icon: Smartphone,
        title: "QRIS & Dompet Digital",
        color: "bg-purple-50 border-purple-100",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        items: [
            { name: "QRIS", detail: "Scan QR Code yang muncul saat checkout — berlaku untuk semua aplikasi" },
            { name: "GoPay", detail: "Bayar langsung melalui checkout, tanpa perlu keluar aplikasi" },
            { name: "OVO", detail: "Tersedia via gateway pembayaran saat checkout" },
            { name: "Dana", detail: "Tersedia via gateway pembayaran saat checkout" },
            { name: "ShopeePay", detail: "Tersedia via gateway pembayaran saat checkout" },
        ],
        note: "Pembayaran dikonfirmasi otomatis dalam hitungan menit.",
    },
    {
        icon: CreditCard,
        title: "Kartu Kredit / Debit",
        color: "bg-emerald-50 border-emerald-100",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        items: [
            { name: "Visa", detail: "Kartu kredit dan debit Visa diterima" },
            { name: "Mastercard", detail: "Kartu kredit dan debit Mastercard diterima" },
            { name: "JCB", detail: "Kartu kredit JCB diterima" },
        ],
        note: "Transaksi diproses melalui payment gateway berenkripsi SSL.",
    },
    {
        icon: HandCoins,
        title: "COD (Bayar di Tempat)",
        color: "bg-amber-50 border-amber-100",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        items: [
            { name: "Area COD", detail: "Jakarta, Bogor, Depok, Tangerang, Bekasi (Jabodetabek)" },
            { name: "Minimum Order", detail: "Rp 500.000 per transaksi" },
            { name: "Ekspedisi", detail: "Tersedia via J&T dan SiCepat" },
        ],
        note: "COD hanya tersedia untuk wilayah Jabodetabek dengan batas minimum order.",
    },
]

export default function PembayaranPage() {
    return (
        <article className="space-y-10">
            {/* Header */}
            <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] text-[#B89968] uppercase mb-3">
                    Metode Pembayaran
                </p>
                <h1 className="font-serif text-3xl lg:text-[42px] leading-[1.1] text-[#1A3461] mb-4">
                    Cara Pembayaran
                </h1>
                <p className="text-[#6B7280] leading-[1.8] text-[15px] max-w-2xl">
                    Kami menyediakan berbagai metode pembayaran yang aman, mudah, dan fleksibel untuk mendukung kebutuhan bisnis Anda.
                </p>
            </div>

            <Separator className="bg-[#E8E1D2]" />

            {/* Payment methods */}
            <div className="space-y-5">
                {METHODS.map((m, i) => {
                    const Icon = m.icon
                    return (
                        <div key={i} className={`rounded-2xl border p-5 lg:p-6 ${m.color}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-10 h-10 rounded-xl ${m.iconBg} flex items-center justify-center flex-shrink-0`}>
                                    <Icon className={`w-5 h-5 ${m.iconColor}`} strokeWidth={1.8} />
                                </div>
                                <h2 className="font-serif text-[18px] text-[#1A3461]">{m.title}</h2>
                            </div>

                            <div className="space-y-2.5 mb-4">
                                {m.items.map((item, j) => (
                                    <div key={j} className="flex items-start gap-3 bg-white/70 rounded-xl px-4 py-3">
                                        <CheckCircle className="w-4 h-4 text-[#B89968] flex-shrink-0 mt-0.5" strokeWidth={2} />
                                        <div>
                                            <span className="font-semibold text-sm text-[#1A3461]">{item.name}</span>
                                            <span className="text-[13px] text-[#6B7280] ml-2">— {item.detail}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-start gap-2 text-[13px] text-[#6B7280]">
                                <AlertCircle className="w-4 h-4 text-[#B89968] flex-shrink-0 mt-0.5" strokeWidth={1.8} />
                                <span className="italic">{m.note}</span>
                            </div>
                        </div>
                    )
                })}
            </div>

            <Separator className="bg-[#E8E1D2]" />

            {/* Payment for large orders */}
            <div>
                <h2 className="font-serif text-[22px] text-[#1A3461] mb-2">Pembayaran Order Besar</h2>
                <p className="text-[#6B7280] text-[14px] leading-relaxed mb-5">
                    Untuk pembelian di atas Rp 5.000.000, kami menyediakan opsi pembayaran yang lebih fleksibel.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                    {[
                        {
                            title: "DP 50% + Pelunasan",
                            desc: "Bayar 50% di depan sebagai tanda jadi, pelunasan 50% sebelum barang dikirim.",
                            badge: "Order > Rp 5 juta",
                        },
                        {
                            title: "Tempo Pembayaran",
                            desc: "Tersedia untuk mitra bisnis terverifikasi dengan rekam jejak pembelian yang baik. Hubungi tim untuk evaluasi.",
                            badge: "Mitra Terverifikasi",
                        },
                    ].map((item, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-[#E8E1D2] p-5">
                            <span className="inline-block text-[10px] font-bold tracking-[0.14em] text-[#B89968] uppercase mb-2.5 bg-[#ECE4D4] px-2.5 py-1 rounded-full">
                                {item.badge}
                            </span>
                            <h3 className="font-serif text-[16px] text-[#1A3461] mb-2">{item.title}</h3>
                            <p className="text-[13px] text-[#6B7280] leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Separator className="bg-[#E8E1D2]" />

            {/* Security */}
            <div className="bg-[#ECE4D4]/50 rounded-2xl border border-[#E8E1D2] p-6">
                <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-6 h-6 text-[#B89968]" strokeWidth={1.7} />
                    <h2 className="font-serif text-[18px] text-[#1A3461]">Keamanan Pembayaran</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                    {[
                        "Semua transaksi dienkripsi dengan SSL 256-bit",
                        "Payment gateway bersertifikasi PCI DSS",
                        "Data kartu tidak disimpan di server kami",
                        "Verifikasi OTP untuk transaksi besar",
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-[13px] text-[#0E1B2E]/75">
                            <CheckCircle className="w-4 h-4 text-[#B89968] flex-shrink-0 mt-0.5" strokeWidth={2} />
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* Confirmation timeline */}
            <div>
                <h2 className="font-serif text-[22px] text-[#1A3461] mb-5">Estimasi Konfirmasi Pembayaran</h2>
                <div className="space-y-3">
                    {[
                        { method: "QRIS / Dompet Digital", time: "Otomatis (real-time)", icon: "⚡" },
                        { method: "Transfer Bank (Mobile/Internet Banking)", time: "15–30 menit", icon: "⏱️" },
                        { method: "Transfer Bank (ATM/Teller)", time: "1–3 jam kerja", icon: "🏦" },
                        { method: "Kartu Kredit/Debit", time: "Otomatis (real-time)", icon: "⚡" },
                        { method: "COD", time: "Saat barang diterima", icon: "📦" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between bg-white rounded-xl border border-[#E8E1D2] px-5 py-3.5">
                            <span className="text-sm text-[#0E1B2E]/80">{item.icon} {item.method}</span>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-[#B89968]" strokeWidth={2} />
                                <span className="text-xs font-semibold text-[#1A3461]">{item.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </article>
    )
}