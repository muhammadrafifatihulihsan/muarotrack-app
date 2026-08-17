# MuaroTrack — Aplikasi Mobile

> **GEMASTIK XIX (2026) — Cabang Kompetisi VIII: Pengembangan Perangkat Lunak (Software Development)**
> Tim: **alamak dahpulkam pulak** · ID Tim: **260010321952850** · Universitas Negeri Padang

**MuaroTrack: Rekomendasi Zona Tangkap dan Prediksi Kebutuhan Bahan Bakar Berbasis Parameter Oseanografi Lokal bagi Nelayan Tradisional Pesisir Padang Pascabencana**

Aplikasi mobile **offline-first** bagi nelayan tradisional di kawasan pesisir Padang yang menggabungkan parameter oseanografi standar (SST dan klorofil-a, mengacu PPDPI BROL–KKP) dengan faktor lokal pascabencana (turbiditas/NDTI, batimetri, fase bulan, jarak ke muara terdampak), serta menyediakan prediksi kebutuhan BBM yang dipersonalisasi per profil kapal. Fungsi inti aplikasi tetap andal digunakan di tengah laut tanpa koneksi internet.

## Fitur Utama

- **Registrasi profil kapal (onboarding)** — kalibrasi konsumsi BBM per kilometer dari data pengguna (nama, BBM per trip, jarak tempuh biasa)
- **Rekomendasi zona tangkap** — skor gabungan 6 faktor (SST 20%, klorofil-a 15%, turbiditas 25%, batimetri 15%, fase bulan 10%, jarak muara 15%) + bonus komunitas 0,10
- **Prediksi kebutuhan BBM personal** — Haversine × konsumsi per km × faktor pulang-pergi
- **Navigasi & posisi kapal** — GPS realtime, rotasi marker, heading 8 mata angin (offline)
- **Kompas & solunar** — panduan arah + aktivitas ikan berbasis fase bulan (suncalc, offline)
- **Kondisi laut** — gelombang, cuaca, pasang surut dari cache sinkronisasi terakhir
- **Laporan tangkapan** — input teks atau suara (faster-whisper → DeepSeek API), antrean sinkronisasi offline
- **Titik favorit** — simpan lokasi tangkap dengan label
- **SOS darurat** — antrean sinyal offline, push notification ke nelayan sekitar (radius 10 km)
- **Sinkronisasi** — unduh zona/tile peta, kirim data tertunda (batch, retry 5×, jeda 10 detik)

## Tech Stack

| Lapisan | Teknologi |
|---|---|
| Framework | Expo SDK 54, React Native 0.81.5, React 19.1, TypeScript 5.9 |
| Routing | expo-router 6.0, React Navigation bottom-tabs 7.4 |
| Peta | MapLibre React Native 10.0 (tile offline: OSM/Esri/CARTO/OpenSeaMap) |
| Cache & sensor | expo-sqlite 16.0, expo-location 19.0, expo-av 16.0, expo-notifications 0.32 |
| State & data | Zustand 5.0, TanStack Query 5.60, AsyncStorage 2.0 |
| Utilitas | suncalc 1.9, NetInfo 11.4 |

## Struktur Proyek

```
app/
├── app/                    # Routing berbasis berkas (expo-router)
│   ├── _layout.tsx         # Lapisan akar (font, QueryClient, sinkronisasi)
│   ├── index.tsx           # Gerbang pemeriksaan status onboarding
│   ├── onboarding.tsx      # Registrasi profil kapal
│   └── (tabs)/             # Beranda, Laporan, Riwayat, Profil
├── src/
│   ├── components/         # BottomSheet, CustomAlert
│   ├── constants/          # config, mapStyles, theme
│   ├── features/           # beranda, kompas, kondisi-laut, peta, solunar, sos
│   ├── lib/                # haversine, bearing, moon, solunar, prediksiBbm, sync, dll.
│   ├── stores/             # nelayanStore, petaStore, syncStore (Zustand)
│   └── types/              # Tipe API
├── assets/images/          # Ikon & splash
├── .env.example            # Contoh konfigurasi environment
├── app.json                # Konfigurasi Expo (package: com.muarotrack.app)
└── eas.json                # Profil build EAS (preview → APK)
```

## Prasyarat

- Node.js 20+ (disarankan LTS)
- Android Studio / emulator Android, atau perangkat Android dengan Expo Go
- Backend server MuaroTrack (lihat [muarotrack-backend](https://github.com/muhammadrafifatihulihsan/muarotrack-backend)) — atau gunakan APK yang sudah terhubung ke server yang di-host

## Menjalankan (Development)

```bash
npm install
cp .env.example .env        # lalu atur EXPO_PUBLIC_API_BASE_URL
npx expo start
```

Konfigurasi `EXPO_PUBLIC_API_BASE_URL`:

| Lingkungan | Nilai |
|---|---|
| Emulator Android | `http://10.0.2.2:8000` |
| Perangkat fisik | `http://<alamat-IP-komputer>:8000` |
| Produksi | Alamat server yang telah di-host |

## Build APK

```bash
# APK distribusi internal (EAS Build)
npx eas build -p android --profile preview

# Atau jalankan langsung ke emulator/device
npx expo run:android
```

## Lisensi

- Lisensi kode sumber aplikasi: **MIT License** — lihat berkas [`LICENSE`](LICENSE)
- Daftar lisensi komponen pihak ketiga: [`THIRD_PARTY_LICENSES.md`](THIRD_PARTY_LICENSES.md)

## Tautan Terkait

- Backend server: https://github.com/muhammadrafifatihulihsan/muarotrack-backend
- APK Android: https://drive.google.com/drive/folders/1hroWpdvEJpyKpmBJho8lzwqTEA6m6NHC
- Video demo: https://youtu.be/_h3ZziaByIQ

---

*Dikembangkan untuk Pagelaran Mahasiswa Nasional Bidang TIK (GEMASTIK) XIX Tahun 2026 — Universitas Negeri Padang.*
