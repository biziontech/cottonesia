// app/informasi/syarat-ketentuan/page.jsx
import { Separator } from "@/components/ui/separator"
import { AlertCircle } from "lucide-react"

const LAST_UPDATED = "1 Januari 2024"

const SECTIONS = [
    {
        id: "definisi",
        title: "1. Definisi",
        content: [
            {
                type: "para",
                text: 'Dalam Syarat dan Ketentuan ini, istilah-istilah berikut memiliki arti sebagaimana didefinisikan di bawah ini:',
            },
            {
                type: "list",
                items: [
                    '"Cottonesia" atau "Kami" mengacu pada PT Cottonesia Indonesia, perusahaan yang mengelola platform marketplace ini.',
                    '"Platform" berarti website, aplikasi, dan layanan yang dioperasikan oleh Cottonesia.',
                    '"Pengguna" atau "Anda" berarti individu atau badan usaha yang menggunakan Platform.',
                    '"Produk" berarti kaos polos dan produk tekstil lainnya yang ditawarkan melalui Platform.',
                    '"Transaksi" berarti setiap pembelian atau penjualan yang terjadi melalui Platform.',
                ],
            },
        ],
    },
    {
        id: "penerimaan",
        title: "2. Penerimaan Syarat",
        content: [
            {
                type: "para",
                text: 'Dengan mengakses atau menggunakan Platform Cottonesia, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat dan Ketentuan ini beserta Kebijakan Privasi kami.',
            },
            {
                type: "para",
                text: "Jika Anda tidak menyetujui salah satu ketentuan dalam dokumen ini, Anda tidak diperkenankan untuk menggunakan Platform kami. Cottonesia berhak untuk mengubah Syarat dan Ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya.",
            },
        ],
    },
    {
        id: "akun",
        title: "3. Pendaftaran Akun",
        content: [
            {
                type: "para",
                text: "Untuk menggunakan fitur pembelian, Anda diwajibkan mendaftar dan membuat akun. Dalam proses pendaftaran, Anda wajib memberikan informasi yang akurat, lengkap, dan terkini.",
            },
            {
                type: "list",
                items: [
                    "Anda bertanggung jawab menjaga kerahasiaan kata sandi akun Anda.",
                    "Anda bertanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda.",
                    "Anda wajib segera memberitahu Cottonesia jika terdapat akses tidak sah ke akun Anda.",
                    "Cottonesia berhak menonaktifkan akun yang melanggar Syarat dan Ketentuan ini.",
                    "Satu orang/entitas hanya boleh memiliki satu akun aktif.",
                ],
            },
        ],
    },
    {
        id: "pembelian",
        title: "4. Ketentuan Pembelian",
        content: [
            {
                type: "para",
                text: "Setiap pembelian di Platform Cottonesia tunduk pada ketentuan berikut:",
            },
            {
                type: "list",
                items: [
                    "Harga yang tertera adalah harga per pcs dan belum termasuk ongkos kirim.",
                    "MOQ (minimum order quantity) berlaku sesuai yang tertera di setiap halaman produk.",
                    "Cottonesia berhak membatalkan pesanan jika stok habis setelah konfirmasi dan mengembalikan pembayaran penuh.",
                    "Pesanan yang sudah dikonfirmasi dan dibayar tidak dapat dibatalkan kecuali dalam kondisi tertentu.",
                    "Cottonesia berhak menolak pesanan dari pengguna yang terbukti melakukan kecurangan.",
                    "Harga grosir dan diskon berlaku sesuai ketentuan yang berlaku saat pemesanan dilakukan.",
                ],
            },
        ],
    },
    {
        id: "hak-kekayaan",
        title: "5. Hak Kekayaan Intelektual",
        content: [
            {
                type: "para",
                text: "Seluruh konten pada Platform Cottonesia, termasuk namun tidak terbatas pada teks, grafik, logo, gambar produk, dan desain antarmuka, adalah milik PT Cottonesia Indonesia dan dilindungi oleh hukum kekayaan intelektual yang berlaku di Indonesia.",
            },
            {
                type: "list",
                items: [
                    "Dilarang menyalin, mendistribusikan, atau mereproduksi konten Platform tanpa izin tertulis.",
                    "Penggunaan logo atau merek Cottonesia untuk keperluan komersial memerlukan izin tertulis.",
                    "Pengguna yang mengunggah konten ke Platform memberikan lisensi non-eksklusif kepada Cottonesia untuk menggunakannya.",
                ],
            },
        ],
    },
    {
        id: "larangan",
        title: "6. Larangan Penggunaan",
        content: [
            {
                type: "para",
                text: "Anda dilarang menggunakan Platform untuk:",
            },
            {
                type: "list",
                items: [
                    "Aktivitas ilegal atau yang bertentangan dengan peraturan perundang-undangan yang berlaku",
                    "Mengirim spam, konten berbahaya, atau malware",
                    "Mengumpulkan data pengguna lain tanpa izin",
                    "Memanipulasi harga atau melakukan kecurangan dalam transaksi",
                    "Membuat ulasan palsu atau menyesatkan",
                    "Menggunakan bot atau alat otomatis untuk mengakses Platform",
                ],
            },
        ],
    },
    {
        id: "privasi",
        title: "7. Kebijakan Privasi",
        content: [
            {
                type: "para",
                text: "Cottonesia mengumpulkan dan memproses data pribadi Anda sesuai dengan Kebijakan Privasi yang merupakan bagian tidak terpisahkan dari Syarat dan Ketentuan ini. Dengan menggunakan Platform, Anda menyetujui pemrosesan data pribadi Anda sebagaimana dijelaskan dalam Kebijakan Privasi.",
            },
            {
                type: "list",
                items: [
                    "Data yang dikumpulkan mencakup: nama, email, nomor HP, alamat pengiriman, dan data transaksi.",
                    "Data digunakan untuk: pemrosesan pesanan, komunikasi, dan peningkatan layanan.",
                    "Cottonesia tidak menjual data pribadi Anda kepada pihak ketiga.",
                    "Data disimpan dengan enkripsi dan langkah keamanan yang memadai.",
                ],
            },
        ],
    },
    {
        id: "batasan",
        title: "8. Batasan Tanggung Jawab",
        content: [
            {
                type: "para",
                text: "Sejauh diizinkan oleh hukum yang berlaku, Cottonesia tidak bertanggung jawab atas:",
            },
            {
                type: "list",
                items: [
                    "Kerugian tidak langsung, insidental, atau konsekuensial akibat penggunaan Platform",
                    "Gangguan layanan akibat pemeliharaan, serangan siber, atau force majeure",
                    "Keterlambatan pengiriman yang disebabkan oleh pihak ekspedisi",
                    "Kerugian akibat penggunaan akun oleh pihak yang tidak berwenang",
                    "Perubahan harga produk sebelum pesanan dikonfirmasi",
                ],
            },
        ],
    },
    {
        id: "penyelesaian",
        title: "9. Penyelesaian Sengketa",
        content: [
            {
                type: "para",
                text: "Dalam hal terjadi perselisihan antara Pengguna dan Cottonesia, para pihak sepakat untuk menyelesaikan perselisihan tersebut secara musyawarah untuk mufakat dalam jangka waktu 30 (tiga puluh) hari kalender.",
            },
            {
                type: "para",
                text: "Apabila penyelesaian secara musyawarah tidak tercapai, para pihak sepakat untuk menyelesaikan perselisihan melalui Badan Arbitrase Nasional Indonesia (BANI) atau pengadilan yang berwenang di Jakarta Pusat, dengan menggunakan hukum Negara Republik Indonesia.",
            },
        ],
    },
    {
        id: "perubahan",
        title: "10. Perubahan Syarat & Ketentuan",
        content: [
            {
                type: "para",
                text: "Cottonesia berhak mengubah Syarat dan Ketentuan ini sewaktu-waktu. Perubahan material akan diberitahukan kepada Pengguna melalui email atau notifikasi pada Platform setidaknya 7 (tujuh) hari sebelum berlaku.",
            },
            {
                type: "para",
                text: "Penggunaan Platform yang berlanjut setelah tanggal berlakunya perubahan dianggap sebagai penerimaan Anda terhadap Syarat dan Ketentuan yang telah diubah.",
            },
        ],
    },
]

export default function SyaratKetentuanPage() {
    return (
        <article className="space-y-8">
            {/* Header */}
            <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] text-[#B89968] uppercase mb-3">
                    Dokumen Resmi
                </p>
                <h1 className="font-serif text-3xl lg:text-[42px] leading-[1.1] text-[#1A3461] mb-3">
                    Syarat & Ketentuan
                </h1>
                <p className="text-[13px] text-[#6B7280]">
                    Terakhir diperbarui: <span className="font-medium text-[#1A3461]">{LAST_UPDATED}</span>
                </p>
            </div>

            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" strokeWidth={1.8} />
                <p className="text-[13px] text-amber-800 leading-relaxed">
                    Harap baca Syarat dan Ketentuan ini dengan seksama sebelum menggunakan layanan Cottonesia. Dengan menggunakan Platform kami, Anda dianggap telah menyetujui seluruh ketentuan di bawah ini.
                </p>
            </div>

            {/* Quick navigation */}
            <div className="bg-[#ECE4D4]/40 rounded-2xl border border-[#E8E1D2] p-5">
                <p className="text-[11px] font-bold tracking-[0.16em] text-[#B89968] uppercase mb-3">Daftar Isi</p>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                    {SECTIONS.map((s) => (
                        <a
                            key={s.id}
                            href={`#${s.id}`}
                            className="text-[13px] text-[#1A3461] hover:text-[#B89968] transition-colors"
                        >
                            {s.title}
                        </a>
                    ))}
                </div>
            </div>

            <Separator className="bg-[#E8E1D2]" />

            {/* Sections */}
            <div className="space-y-8">
                {SECTIONS.map((section) => (
                    <section key={section.id} id={section.id} className="scroll-mt-24">
                        <h2 className="font-serif text-[20px] text-[#1A3461] mb-4 pb-3 border-b border-[#E8E1D2]">
                            {section.title}
                        </h2>
                        <div className="space-y-3">
                            {section.content.map((block, i) => {
                                if (block.type === "para") {
                                    return (
                                        <p key={i} className="text-[14px] text-[#6B7280] leading-[1.85]">
                                            {block.text}
                                        </p>
                                    )
                                }
                                if (block.type === "list") {
                                    return (
                                        <ul key={i} className="space-y-2 ml-1">
                                            {block.items.map((item, j) => (
                                                <li key={j} className="flex items-start gap-2.5 text-[14px] text-[#6B7280] leading-relaxed">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#B89968] flex-shrink-0 mt-[7px]" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )
                                }
                                return null
                            })}
                        </div>
                    </section>
                ))}
            </div>

            <Separator className="bg-[#E8E1D2]" />

            {/* Contact */}
            <div className="bg-white rounded-2xl border border-[#E8E1D2] p-6">
                <h3 className="font-serif text-[18px] text-[#1A3461] mb-2">Ada Pertanyaan?</h3>
                <p className="text-[13px] text-[#6B7280] mb-4 leading-relaxed">
                    Jika Anda memiliki pertanyaan mengenai Syarat dan Ketentuan ini, silakan hubungi tim legal kami.
                </p>
                <div className="space-y-2 text-[13px] text-[#6B7280]">
                    <p>📧 <span className="font-medium text-[#1A3461]">legal@cottonesia.com</span></p>
                    <p>🏢 <span className="font-medium text-[#1A3461]">PT Cottonesia Indonesia — Kawasan Grosir Tanah Abang, Jakarta Pusat 10560</span></p>
                </div>
            </div>
        </article>
    )
}