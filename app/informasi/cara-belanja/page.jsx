// app/informasi/cara-belanja/page.jsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    UserCircle, Search, ShoppingCart, CreditCard,
    Package, Star, ArrowRight, CheckCircle,
} from "lucide-react"

const STEPS = [
    {
        icon: UserCircle,
        title: "Buat Akun atau Masuk",
        desc: "Daftar dengan email dan nomor HP Anda. Akun diperlukan untuk melakukan pemesanan, menyimpan wishlist, dan mengakses riwayat transaksi.",
        tips: [
            "Daftar gratis, tidak ada biaya apapun",
            "Verifikasi email untuk keamanan akun",
            "Bisa login dengan Google untuk kemudahan",
        ],
    },
    {
        icon: Search,
        title: "Temukan Produk",
        desc: "Jelajahi katalog produk kami melalui halaman Katalog atau Kategori. Gunakan filter untuk mempersempit pencarian berdasarkan bahan, gramasi, ukuran, dan harga.",
        tips: [
            "Gunakan filter Kategori untuk pencarian lebih cepat",
            "Bandingkan produk dari spesifikasi di halaman detail",
            "Perhatikan MOQ (minimum order quantity) setiap produk",
        ],
    },
    {
        icon: ShoppingCart,
        title: "Masukkan ke Keranjang",
        desc: "Pilih warna, ukuran, dan jumlah yang Anda butuhkan. Klik 'Tambahkan ke Keranjang'. Anda dapat menambahkan beberapa produk sekaligus sebelum checkout.",
        tips: [
            "Cek stok warna yang Anda inginkan",
            "Manfaatkan diskon quantity — semakin banyak semakin hemat",
            "Simpan produk ke Wishlist jika belum siap beli",
        ],
    },
    {
        icon: CreditCard,
        title: "Checkout & Pilih Pembayaran",
        desc: "Isi data pengiriman, pilih jasa ekspedisi, masukkan kode voucher jika ada, lalu pilih metode pembayaran yang tersedia.",
        tips: [
            "Pastikan alamat pengiriman sudah benar",
            "Gratis ongkir untuk pembelian di atas Rp 2.000.000",
            "Tersedia DP 50% untuk order dalam jumlah besar",
        ],
    },
    {
        icon: Package,
        title: "Pesanan Dikemas & Dikirim",
        desc: "Setelah pembayaran dikonfirmasi, tim kami akan memproses dan mengemas pesanan dalam 1×24 jam. Anda akan menerima notifikasi dan nomor resi pengiriman.",
        tips: [
            "Estimasi proses: 1×24 jam hari kerja",
            "Packing menggunakan plastik pelindung & karton",
            "Nomor resi dikirim via email dan WhatsApp",
        ],
    },
    {
        icon: Star,
        title: "Terima & Beri Ulasan",
        desc: "Periksa pesanan saat diterima. Jika sesuai, berikan ulasan untuk membantu pembeli lain. Hubungi kami jika ada masalah dalam 3×24 jam.",
        tips: [
            "Cek kondisi paket sebelum menandatangani bukti terima",
            "Foto produk jika ada kerusakan sebagai bukti",
            "Ulasan Anda sangat membantu komunitas kami",
        ],
    },
]

export default function CaraBelanja() {
    return (
        <article className="space-y-10">
            {/* Header */}
            <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] text-[#B89968] uppercase mb-3">
                    Panduan Lengkap
                </p>
                <h1 className="font-serif text-3xl lg:text-[42px] leading-[1.1] text-[#1A3461] mb-4">
                    Cara Belanja di Cottonesia
                </h1>
                <p className="text-[#6B7280] leading-[1.8] text-[15px] max-w-2xl">
                    Berbelanja di Cottonesia sangat mudah. Ikuti 6 langkah sederhana di bawah ini untuk melakukan pemesanan pertama Anda.
                </p>
            </div>

            <Separator className="bg-[#E8E1D2]" />

            {/* Steps */}
            <div className="space-y-8">
                {STEPS.map((step, i) => {
                    const Icon = step.icon
                    return (
                        <div key={i} className="relative">
                            {/* Connector line */}
                            {i < STEPS.length - 1 && (
                                <div className="absolute left-6 top-16 bottom-0 w-px bg-[#E8E1D2]" style={{ top: "56px", bottom: "-32px" }} />
                            )}

                            <div className="flex gap-5">
                                {/* Step number + icon */}
                                <div className="flex-shrink-0 relative z-10">
                                    <div className="w-12 h-12 rounded-full bg-[#1A3461] flex items-center justify-center shadow-md">
                                        <Icon className="w-5 h-5 text-[#D4BC95]" strokeWidth={1.7} />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#B89968] flex items-center justify-center">
                                        <span className="text-white text-[10px] font-bold">{i + 1}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-2">
                                    <h2 className="font-serif text-[19px] text-[#1A3461] mb-2">{step.title}</h2>
                                    <p className="text-[#6B7280] text-[14px] leading-[1.8] mb-3">{step.desc}</p>

                                    {/* Tips */}
                                    <div className="bg-[#ECE4D4]/50 rounded-xl p-4 border border-[#E8E1D2]/60">
                                        <p className="text-[10px] font-bold tracking-[0.16em] text-[#B89968] uppercase mb-2.5">Tips</p>
                                        <ul className="space-y-1.5">
                                            {step.tips.map((tip, j) => (
                                                <li key={j} className="flex items-start gap-2 text-[13px] text-[#0E1B2E]/75">
                                                    <CheckCircle className="w-3.5 h-3.5 text-[#B89968] flex-shrink-0 mt-0.5" strokeWidth={2} />
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <Separator className="bg-[#E8E1D2]" />

            {/* FAQ quick */}
            <div>
                <h2 className="font-serif text-[22px] text-[#1A3461] mb-5">Pertanyaan Umum</h2>
                <div className="space-y-4">
                    {[
                        {
                            q: "Apakah ada minimum pembelian?",
                            a: "Ya. MOQ (minimum order quantity) bervariasi per produk — umumnya 30–50 pcs per warna. Detail MOQ tertera di setiap halaman produk.",
                        },
                        {
                            q: "Berapa lama proses order?",
                            a: "Setelah pembayaran dikonfirmasi, pesanan diproses dalam 1×24 jam hari kerja. Estimasi total waktu termasuk pengiriman: 2–7 hari tergantung lokasi.",
                        },
                        {
                            q: "Bisa minta sample dulu?",
                            a: "Ya, tersedia pembelian sample dengan harga normal (tidak grosir). Hubungi tim kami via WhatsApp untuk informasi lebih lanjut.",
                        },
                    ].map((item, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-[#E8E1D2] p-5">
                            <p className="font-semibold text-[14px] text-[#1A3461] mb-2">{item.q}</p>
                            <p className="text-[13px] text-[#6B7280] leading-relaxed">{item.a}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-[#1A3461] rounded-2xl p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="flex-1">
                    <h3 className="font-serif text-[18px] text-white mb-1">Siap mulai belanja?</h3>
                    <p className="text-white/60 text-sm">Jelajahi ribuan produk kaos polos premium kami sekarang.</p>
                </div>
                <Button asChild className="bg-[#B89968] hover:bg-[#a08458] text-white rounded-lg h-11 px-6 font-medium flex-shrink-0">
                    <Link href="/katalog">
                        Lihat Katalog <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Link>
                </Button>
            </div>
        </article>
    )
}