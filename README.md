# Warung Kita

Aplikasi kasir, stok, utang-piutang, laporan keuangan (laba rugi dan neraca), dan perhitungan PPh final UMKM untuk warung dan usaha kecil.

Arsitektur klien-server:

| Lapisan | Teknologi | Peran |
|---|---|---|
| Klien | HTML, CSS, JavaScript murni (`public/index.html`) | Seluruh antarmuka. Data disimpan lebih dulu di HP (offline-first), lalu disinkronkan ke server |
| Server | Vercel Serverless Functions (`api/*.js`, Node.js) | Registrasi, login (JWT), dan penyimpanan data toko per akun |
| Database | PostgreSQL (Neon) | Tabel `users` dan `stores` (`db/schema.sql`) |

## Endpoint

| Metode | Path | Fungsi |
|---|---|---|
| POST | `/api/register` | Daftar akun (`email`, `password` minimal 8 karakter) |
| POST | `/api/login` | Masuk, mengembalikan token JWT 30 hari |
| GET | `/api/data` | Ambil data toko milik akun (butuh header `Authorization: Bearer <token>`) |
| PUT | `/api/data` | Simpan data toko `{ "data": {...} }` |
| GET | `/api/health` | Cek server |

Sinkronisasi: data dengan cap waktu `upd` yang lebih baru menang. Pemakaian offline tetap berjalan, dan data dikirim saat koneksi kembali.

## Menjalankan lokal

```bash
npm install
cp .env.example .env      # isi DATABASE_URL dan JWT_SECRET
npm i -g vercel
vercel dev                # buka http://localhost:3000
```

## Deploy

### 1. Database (Neon)
1. Buat project Postgres di https://neon.tech (atau Vercel Dashboard > Storage > Neon).
2. Buka SQL Editor, jalankan isi `db/schema.sql`.
3. Salin connection string sebagai `DATABASE_URL`.

### 2. GitHub
```bash
git init
git add .
git commit -m "Warung Kita: versi klien-server"
git branch -M main
git remote add origin https://github.com/<username>/warung-kita.git
git push -u origin main
```
Atau dengan GitHub CLI: `gh repo create warung-kita --private --source=. --push`

### 3. Vercel
1. Buka https://vercel.com/new, impor repositori `warung-kita`.
2. Framework preset: **Other**. Biarkan build command kosong (folder `public/` disajikan statis, `api/` menjadi fungsi server).
3. Tambahkan Environment Variables: `DATABASE_URL` dan `JWT_SECRET` (buat dengan `openssl rand -hex 32`).
4. Klik **Deploy**. Setiap `git push` ke `main` akan deploy otomatis.

Dengan CLI: `vercel link`, `vercel env add DATABASE_URL`, `vercel env add JWT_SECRET`, lalu `vercel --prod`.

## Catatan keamanan dan batasan

- Tambahkan pembatasan percobaan login (rate limiting) sebelum dipakai publik, misalnya Vercel Firewall atau Upstash Ratelimit.
- Kata sandi disimpan sebagai hash bcrypt. Token JWT disimpan di `localStorage`; pertimbangkan cookie `HttpOnly` untuk produksi.
- Batas ukuran body Vercel Functions sekitar 4,5 MB. Foto produk disimpan sebagai base64 di dalam data toko, jadi jangan menyimpan terlalu banyak foto besar. Untuk skala lebih besar, pindahkan foto ke penyimpanan objek (Vercel Blob atau S3).
- Data berisi informasi usaha dan pelanggan. Patuhi UU Pelindungan Data Pribadi (UU PDP) dan sediakan kebijakan privasi sebelum peluncuran.
- Perhitungan pajak berupa perkiraan, bukan pengganti perhitungan resmi.

## Lisensi

MIT, Copyright (c) 2026 Septa Aji. Lihat berkas `LICENSE`.
