// app/informasi/kebijakan-return/page.jsx
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle, XCircle, AlertCircle, ArrowRight,
  Camera, MessageSquare, RefreshCw, Banknote,
} from "lucide-react"

const CAN_RETURN = [
  "Produk cacat dari pabrik (jahitan lepas, lubang, noda permanen dari produksi)",
  "Produk tidak sesuai spesifikasi yang dipesan (salah warna, salah ukuran dari pihak kami)",
  "Produk salah kirim (bukan yang dipesan)",
  "Produk rusak akibat pengiriman (dengan bukti foto yang valid)",
  "Jumlah produk kurang dari yang dipesan",
]

const CANNOT_RETURN = [
  "Produk yang sudah dicuci, diproses, atau disablon",
  "Kerusakan akibat kesalahan konsumen (salah pilih warna/ukuran, dll)",
  "Produk yang sudah digunakan",
  "Produk tanpa label/tag original",
  "Perubahan preferensi atau alasan estetika semata",
  "Laporan retur melebihi 3×24 jam setelah produk diterima",
]

const PROCESS = [
  {
    icon: Camera,
    title: "Laporkan & Foto",
    desc: "Hubungi kami via WhatsApp atau email dalam 3×24 jam setelah produk diterima. Sertakan foto/video produk yang bermasalah dengan jelas.",
  },
  {
    icon: MessageSquare,
    title: "Konfirmasi Tim",
    desc: "Tim kami akan meninjau laporan Anda dalam 1×24 jam. Jika disetujui, Anda akan mendapat instruksi pengiriman barang retur.",
  },
  {
    icon: ArrowRight,
    title: "Kirim Produk",
    desc: "Kirim produk ke alamat gudang kami. Ongkos kirim retur ditanggung Cottonesia jika kerusakan dari pihak kami.",
  },
  {
    icon: RefreshCw,
    title: "Pengecekan Gudang",
    desc: "Produk dicek di gudang dalam 2×24 jam setelah diterima. Keputusan akhir diberikan berdasarkan kondisi aktual produk.",
  },
  {
    icon: Banknote,
    title: "Penggantian / Refund",
    desc: "Jika retur disetujui: Produk diganti dengan yang baru (3–5 hari kerja) atau refund penuh ke rekening/dompet digital Anda (3–7 hari kerja).",
  },
]

export default function KebijakanReturnPage() {
  return (
    <article className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold tracking-[0.22em] text-[#B89968] uppercase mb-3">
          Retur & Penggantian
        </p>
        <h1 className="font-serif text-3xl lg:text-[42px] leading-[1.1] text-[#1A3461] mb-4">
          Kebijakan Return
        </h1>
        <p className="text-[#6B7280] leading-[1.8] text-[15px] max-w-2xl">
          Kepuasan Anda adalah prioritas utama kami. Kami memberikan jaminan retur yang jelas dan transparan untuk setiap produk yang tidak memenuhi standar yang telah disepakati.
        </p>
      </div>

      {/* Timeline notice */}
      <div className="flex items-center gap-4 bg-[#ECE4D4]/60 rounded-2xl border border-[#E8E1D2] p-5">
        <div className="w-14 h-14 rounded-2xl bg-[#1A3461] flex items-center justify-center flex-shrink-0">
          <span className="font-serif text-[22px] text-[#D4BC95] font-semibold">3</span>
        </div>
        <div>
          <p className="font-semibold text-[15px] text-[#1A3461]">Laporkan dalam 3×24 jam</p>
          <p className="text-[13px] text-[#6B7280] mt-0.5">
            Batas waktu pelaporan retur adalah <strong>3×24 jam setelah produk diterima</strong>. Laporan di luar batas waktu ini tidak dapat diproses.
          </p>
        </div>
      </div>

      <Separator className="bg-[#E8E1D2]" />

      {/* Can / Cannot return */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" strokeWidth={2} />
            </div>
            <h2 className="font-serif text-[18px] text-[#1A3461]">Dapat Diretur</h2>
          </div>
          <div className="space-y-2.5">
            {CAN_RETURN.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                <p className="text-[13px] text-green-800 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-500" strokeWidth={2} />
            </div>
            <h2 className="font-serif text-[18px] text-[#1A3461]">Tidak Dapat Diretur</h2>
          </div>
          <div className="space-y-2.5">
            {CANNOT_RETURN.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                <p className="text-[13px] text-red-800 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator className="bg-[#E8E1D2]" />

      {/* Process */}
      <div>
        <h2 className="font-serif text-[22px] text-[#1A3461] mb-6">Proses Retur</h2>
        <div className="space-y-5">
          {PROCESS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="relative flex gap-5">
                {i < PROCESS.length - 1 && (
                  <div className="absolute left-5 top-12 bottom-0 w-px bg-[#E8E1D2]" />
                )}
                <div className="relative z-10 w-10 h-10 rounded-full bg-[#1A3461] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icon className="w-4 h-4 text-[#D4BC95]" strokeWidth={1.8} />
                </div>
                <div className="flex-1 pb-5">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-[14px] text-[#1A3461]">{step.title}</p>
                    <span className="text-[10px] font-bold text-[#B89968] bg-[#ECE4D4] px-2 py-0.5 rounded-full">
                      Langkah {i + 1}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#6B7280] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Separator className="bg-[#E8E1D2]" />

      {/* Refund info */}
      <div>
        <h2 className="font-serif text-[22px] text-[#1A3461] mb-5">Informasi Refund</h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          {[
            { label: "Transfer Bank", time: "3–5 hari kerja" },
            { label: "Dompet Digital", time: "1–2 hari kerja" },
            { label: "Penggantian Produk", time: "3–7 hari kerja" },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#E8E1D2] p-4 text-center">
              <p className="text-[10px] font-bold tracking-[0.14em] text-[#B89968] uppercase mb-2">{item.label}</p>
              <p className="font-serif text-[17px] text-[#1A3461]">{item.time}</p>
            </div>
          ))}
        </div>
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" strokeWidth={1.8} />
          <p className="text-[13px] text-amber-800 leading-relaxed">
            Refund hanya dapat dikembalikan ke metode pembayaran asal. Cottonesia tidak bertanggung jawab atas keterlambatan yang disebabkan oleh pihak bank atau platform dompet digital.
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-[#1A3461] rounded-2xl p-6">
        <h3 className="font-serif text-[17px] text-white mb-2">Ada Produk yang Bermasalah?</h3>
        <p className="text-white/60 text-[13px] mb-4 leading-relaxed">
          Segera hubungi kami dalam 3×24 jam setelah produk diterima. Siapkan foto/video produk sebagai bukti.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="https://wa.me/6281234567890" className="inline-flex items-center gap-2 bg-[#B89968] hover:bg-[#a08458] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
            WhatsApp Tim Kami
          </a>
          <a href="mailto:retur@cottonesia.com" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
            Email: retur@cottonesia.com
          </a>
        </div>
      </div>
    </article>
  )
}