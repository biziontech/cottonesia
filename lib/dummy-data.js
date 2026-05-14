// lib/dummy-data.js
const P = (seed, size = 800) =>
  `https://picsum.photos/seed/${seed}/${size}/${size}`

export const COLORS = [
  { name: "Hitam", hex: "#0E1B2E" },
  { name: "Putih", hex: "#FAFAF8" },
  { name: "Abu Muda", hex: "#C4C8D0" },
  { name: "Navy", hex: "#1A3461" },
  { name: "Maroon", hex: "#7A2828" },
  { name: "Olive", hex: "#5E7A52" },
  { name: "Krem", hex: "#E0D5BE" },
  { name: "Kuning Gs", hex: "#D9B84C" },
  { name: "Dusty Pink", hex: "#C98E8E" },
  { name: "Sage", hex: "#8FA896" },
]

export const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"]

export const CATEGORIES = [
  { slug: "cotton-combed-30s", name: "Cotton Combed 30s", count: 24, seed: "cat-30s" },
  { slug: "cotton-combed-24s", name: "Cotton Combed 24s", count: 32, seed: "cat-24s" },
  { slug: "cotton-combed-20s", name: "Cotton Combed 20s", count: 18, seed: "cat-20s" },
  { slug: "cotton-bamboo", name: "Cotton Bamboo", count: 12, seed: "cat-bamboo" },
  { slug: "oversize", name: "Oversize", count: 16, seed: "cat-oversize" },
  { slug: "kids", name: "Kids Series", count: 20, seed: "cat-kids" },
]

export const PRODUCTS = [
  {
    id: 1, slug: "basic-tee-30s",
    name: "Basic Tee 30s", category: "Cotton Combed 30s", categorySlug: "cotton-combed-30s",
    tag: "Best Seller",
    image: P("prod-1a"),
    images: [P("prod-1a"), P("prod-1b"), P("prod-1c"), P("prod-1d")],
    colors: COLORS.slice(0, 7), sizes: SIZES,
    material: "100% Cotton Combed 30s", weight: "140–150 gsm", moq: "50 pcs",
    price: 38000, priceMax: 45000,
    priceDisplay: "Rp 38.000", priceMaxDisplay: "Rp 45.000",
    rating: 4.9, reviews: 256,
    description: "Kaos polos cotton combed 30s premium dengan bahan yang lembut, nyaman, dan breathable. Gramasi 140–150 gsm memberikan kenyamanan optimal untuk pemakaian sehari-hari maupun sablon. Cocok untuk semua teknik sablon: rubber, DTF, DTG, dan screen printing.",
    specs: { "Bahan": "100% Cotton Combed 30s", "Gramasi": "140–150 gsm", "Ukuran": "S, M, L, XL, 2XL, 3XL", "Warna": "30+ pilihan", "Teknik Sablon": "Rubber, DTF, DTG, Screen" },
    isBestSeller: true,
  },
  {
    id: 2, slug: "basic-tee-24s",
    name: "Basic Tee 24s", category: "Cotton Combed 24s", categorySlug: "cotton-combed-24s",
    tag: "Baru",
    image: P("prod-2a"),
    images: [P("prod-2a"), P("prod-2b"), P("prod-2c"), P("prod-2d")],
    colors: COLORS.slice(0, 8), sizes: SIZES,
    material: "100% Cotton Combed 24s", weight: "160–170 gsm", moq: "50 pcs",
    price: 34000, priceMax: 40000,
    priceDisplay: "Rp 34.000", priceMaxDisplay: "Rp 40.000",
    rating: 4.8, reviews: 183,
    description: "Kaos cotton combed 24s dengan gramasi lebih tebal 160–170 gsm. Pilihan tepat untuk sablon tebal dan desain detail. Daya tahan lebih baik dengan tetap nyaman di kulit.",
    specs: { "Bahan": "100% Cotton Combed 24s", "Gramasi": "160–170 gsm", "Ukuran": "S, M, L, XL, 2XL, 3XL", "Warna": "30+ pilihan", "Teknik Sablon": "Rubber, DTF, DTG, Screen" },
  },
  {
    id: 3, slug: "oversize-urban-20s",
    name: "Oversize Urban 20s", category: "Oversize", categorySlug: "oversize",
    tag: null,
    image: P("prod-3a"),
    images: [P("prod-3a"), P("prod-3b"), P("prod-3c"), P("prod-3d")],
    colors: COLORS.slice(0, 6), sizes: ["M", "L", "XL", "2XL"],
    material: "100% Cotton Combed 20s", weight: "200–220 gsm", moq: "30 pcs",
    price: 42000, priceMax: 50000,
    priceDisplay: "Rp 42.000", priceMaxDisplay: "Rp 50.000",
    rating: 4.9, reviews: 97,
    description: "Model oversize dengan cutting urban yang trendy. Gramasi tebal 200–220 gsm memberikan struktur yang sempurna untuk tampilan oversized yang premium.",
    specs: { "Bahan": "100% Cotton Combed 20s", "Gramasi": "200–220 gsm", "Fit": "Oversized", "Ukuran": "M, L, XL, 2XL", "Warna": "20+ pilihan" },
  },
  {
    id: 4, slug: "cotton-bamboo-tee",
    name: "Cotton Bamboo Tee", category: "Cotton Bamboo", categorySlug: "cotton-bamboo",
    tag: "Premium",
    image: P("prod-4a"),
    images: [P("prod-4a"), P("prod-4b"), P("prod-4c"), P("prod-4d")],
    colors: COLORS.slice(0, 5), sizes: SIZES.slice(0, 5),
    material: "60% Cotton 40% Bamboo", weight: "160–180 gsm", moq: "30 pcs",
    price: 48000, priceMax: 55000,
    priceDisplay: "Rp 48.000", priceMaxDisplay: "Rp 55.000",
    rating: 5.0, reviews: 64,
    description: "Perpaduan sempurna antara cotton dan serat bambu untuk pengalaman berpakaian yang lembut, anti-bakteri, dan ramah lingkungan. Pilihan premium untuk brand yang mengutamakan sustainability.",
    specs: { "Bahan": "60% Cotton, 40% Bamboo Fiber", "Gramasi": "160–180 gsm", "Keunggulan": "Anti-bakteri, Eco-friendly", "Ukuran": "S, M, L, XL, 2XL", "Warna": "15+ pilihan" },
  },
  {
    id: 5, slug: "heavy-tee-20s",
    name: "Heavy Tee 20s", category: "Cotton Combed 20s", categorySlug: "cotton-combed-20s",
    tag: null,
    image: P("prod-5a"),
    images: [P("prod-5a"), P("prod-5b"), P("prod-5c"), P("prod-5d")],
    colors: COLORS.slice(0, 9), sizes: SIZES,
    material: "100% Cotton Combed 20s", weight: "200–210 gsm", moq: "50 pcs",
    price: 45000, priceMax: 52000,
    priceDisplay: "Rp 45.000", priceMaxDisplay: "Rp 52.000",
    rating: 4.7, reviews: 142,
    description: "Kaos heavy duty dengan gramasi 200–210 gsm. Ideal untuk streetwear dan pakaian kerja yang membutuhkan bahan tebal dan tahan lama.",
    specs: { "Bahan": "100% Cotton Combed 20s", "Gramasi": "200–210 gsm", "Ukuran": "S, M, L, XL, 2XL, 3XL", "Warna": "30+ pilihan" },
  },
  {
    id: 6, slug: "basic-tee-30s-kids",
    name: "Kids Tee 30s", category: "Kids Series", categorySlug: "kids",
    tag: "Populer",
    image: P("prod-6a"),
    images: [P("prod-6a"), P("prod-6b"), P("prod-6c"), P("prod-6d")],
    colors: COLORS.slice(0, 8), sizes: ["S (anak)", "M (anak)", "L (anak)", "XL (anak)"],
    material: "100% Cotton Combed 30s", weight: "120–130 gsm", moq: "50 pcs",
    price: 28000, priceMax: 35000,
    priceDisplay: "Rp 28.000", priceMaxDisplay: "Rp 35.000",
    rating: 4.8, reviews: 210,
    description: "Kaos anak dari bahan cotton combed 30s yang lembut dan aman untuk kulit sensitif anak. Gramasi ringan 120–130 gsm agar tidak gerah.",
    specs: { "Bahan": "100% Cotton Combed 30s", "Gramasi": "120–130 gsm", "Ukuran": "S-XL (anak)", "Warna": "30+ pilihan" },
  },
  {
    id: 7, slug: "oversize-crop-20s",
    name: "Oversize Crop 20s", category: "Oversize", categorySlug: "oversize",
    tag: "Baru",
    image: P("prod-7a"),
    images: [P("prod-7a"), P("prod-7b"), P("prod-7c"), P("prod-7d")],
    colors: COLORS.slice(0, 6), sizes: ["S", "M", "L", "XL"],
    material: "100% Cotton Combed 20s", weight: "185–200 gsm", moq: "30 pcs",
    price: 44000, priceMax: 52000,
    priceDisplay: "Rp 44.000", priceMaxDisplay: "Rp 52.000",
    rating: 4.6, reviews: 58,
    description: "Model oversize crop dengan panjang lebih pendek di bagian depan, menciptakan siluet yang stylish dan modern.",
    specs: { "Bahan": "100% Cotton Combed 20s", "Gramasi": "185–200 gsm", "Fit": "Oversize Crop", "Ukuran": "S, M, L, XL" },
  },
  {
    id: 8, slug: "cotton-bamboo-polo",
    name: "Bamboo Polo Tee", category: "Cotton Bamboo", categorySlug: "cotton-bamboo",
    tag: null,
    image: P("prod-8a"),
    images: [P("prod-8a"), P("prod-8b"), P("prod-8c"), P("prod-8d")],
    colors: COLORS.slice(0, 4), sizes: SIZES.slice(0, 5),
    material: "60% Cotton 40% Bamboo", weight: "170–190 gsm", moq: "30 pcs",
    price: 52000, priceMax: 60000,
    priceDisplay: "Rp 52.000", priceMaxDisplay: "Rp 60.000",
    rating: 4.9, reviews: 41,
    description: "Polo shirt dari bahan bamboo blend. Kesan formal namun tetap nyaman untuk penggunaan sehari-hari.",
    specs: { "Bahan": "60% Cotton, 40% Bamboo", "Gramasi": "170–190 gsm", "Model": "Polo Shirt", "Ukuran": "S, M, L, XL, 2XL" },
  },
]

export const TEAM = [
  { name: "Budi Santoso", role: "CEO & Founder", avatar: "https://i.pravatar.cc/200?img=11", bio: "10 tahun pengalaman di industri tekstil Indonesia." },
  { name: "Dewi Rahayu", role: "Head of Quality", avatar: "https://i.pravatar.cc/200?img=44", bio: "Memastikan setiap produk memenuhi standar premium Cottonesia." },
  { name: "Arif Kurniawan", role: "Head of Operations", avatar: "https://i.pravatar.cc/200?img=33", bio: "Mengawal proses dari supplier hingga ke tangan pelanggan." },
]

export const FAQS = [
  {
    category: "Pembelian & Pesanan",
    items: [
      { q: "Berapa minimum order quantity (MOQ)?", a: "MOQ kami bervariasi per produk. Untuk kaos combed 30s dan 24s minimal 50 pcs per warna. Untuk oversize minimal 30 pcs. Cotton bamboo minimal 30 pcs. Informasi detail ada di halaman produk." },
      { q: "Apakah ada diskon untuk pembelian dalam jumlah besar?", a: "Ya! Kami memberikan harga khusus untuk pembelian di atas 100 pcs, 500 pcs, dan 1000 pcs. Hubungi tim kami untuk mendapatkan penawaran harga terbaik." },
      { q: "Bagaimana cara memesan?", a: "Pilih produk → Pilih warna dan ukuran → Masukkan jumlah pesanan → Checkout dan pilih metode pembayaran → Konfirmasi pesanan. Tim kami akan memproses dalam 1x24 jam." },
      { q: "Apakah bisa pesan warna custom (di luar yang tersedia)?", a: "Ya, untuk pembelian di atas 500 pcs per warna kami dapat membuat warna custom sesuai request. Waktu produksi 14–21 hari kerja. Hubungi kami untuk detail." },
    ],
  },
  {
    category: "Pengiriman",
    items: [
      { q: "Berapa lama waktu pengiriman?", a: "Dalam kota (Jakarta): 1–2 hari kerja. Luar kota Jawa: 2–4 hari kerja. Luar Jawa: 3–7 hari kerja tergantung lokasi. Kami bekerja sama dengan JNE, J&T, SiCepat, dan Ninja Xpress." },
      { q: "Apakah ada biaya ongkos kirim?", a: "Ongkos kirim dihitung berdasarkan berat dan tujuan pengiriman. Untuk pembelian di atas Rp 2.000.000 dalam satu transaksi, kami memberikan subsidi ongkir untuk wilayah Jawa." },
      { q: "Apakah bisa pickup langsung?", a: "Ya, tersedia pickup di gudang kami di kawasan Tanah Abang, Jakarta Pusat. Silakan hubungi kami terlebih dahulu untuk jadwal pickup." },
    ],
  },
  {
    category: "Produk & Kualitas",
    items: [
      { q: "Apakah produk Cottonesia sudah tersertifikasi?", a: "Semua bahan baku kami memiliki sertifikasi OEKO-TEX Standard 100, menjamin bebas zat berbahaya. Proses produksi dilakukan di fasilitas bersertifikasi SNI." },
      { q: "Apakah ada jaminan kualitas?", a: "Ya, setiap batch produksi melewati quality control ketat. Jika ada produk cacat yang lolos dari QC kami, kami akan mengganti atau mengembalikan dana penuh." },
      { q: "Bagaimana cara merawat kaos agar warna tidak cepat pudar?", a: "Cuci dengan air dingin, hindari pemutih, balik kaos saat mencuci, jangan direndam terlalu lama, dan jemur di tempat teduh. Untuk kaos sablon, hindari menyetrika langsung di atas sablon." },
    ],
  },
  {
    category: "Pembayaran",
    items: [
      { q: "Metode pembayaran apa saja yang tersedia?", a: "Transfer bank (BCA, Mandiri, BNI, BRI), QRIS, GoPay, OVO, Dana, ShopeePay, kartu kredit/debit. Untuk order besar, tersedia opsi pembayaran bertahap (DP 50%)." },
      { q: "Apakah ada sistem COD?", a: "COD tersedia untuk wilayah Jakarta, Bogor, Depok, Tangerang, dan Bekasi (Jabodetabek) dengan minimum pembelian Rp 500.000." },
    ],
  },
]
