<p align="center">
  <img src="https://img.shields.io/github/stars/fjrmhri/Medicalist?style=for-the-badge&logo=github&color=8b5cf6" alt="Stars"/>
  <img src="https://img.shields.io/github/license/fjrmhri/Medicalist?style=for-the-badge&color=10b981" alt="License"/>
  <img src="https://img.shields.io/badge/React%20Native-0.76.6-61dafb?style=for-the-badge&logo=react" alt="React Native"/>
  <img src="https://img.shields.io/badge/Expo-52.0.26-000020?style=for-the-badge&logo=expo" alt="Expo"/>
  <img src="https://img.shields.io/badge/Firebase-11.0.2-FFCA28?style=for-the-badge&logo=firebase" alt="Firebase"/>
</p>

# Medicalist

Aplikasi Medicalist membantu pengguna menjelajahi obat, alat kesehatan, penyakit, serta menemukan apotek terdekat. Dibangun dengan React Native (Expo) dan Firebase, aplikasi ini menjaga antarmuka tetap bersih sambil menyediakan data real-time.

## Fitur Utama

- **Dashboard modern** dengan kartu hero gradien, sapaan personal, dan pintasan aksi cepat.
- **Rekomendasi apotek terdekat** berbasis izin lokasi serta perhitungan jarak menggunakan Haversine.
- **Katalog obat dan alat kesehatan** beserta halaman detail serta daftar favorit sinkron dengan Firebase Realtime Database.
- **Dukungan tema gelap** berkat integrasi `react-native-rapi-ui`.
- **Navigasi tab dan stack** menggunakan React Navigation untuk alur masuk/keluar yang jelas.

## Instalasi & Menjalankan Proyek

1. **Pasang dependensi**
   ```bash
   npm install
   ```

2. **Konfigurasi Firebase**
   - Buat proyek Firebase lalu aktifkan Authentication, Firestore, dan Realtime Database.
   - Salin konfigurasi web dan perbarui nilai di `src/screens/firebaseConfig.js`.

3. **Jalankan pengembangan**
   ```bash
   npm run start
   ```
   Gunakan output Expo untuk membuka aplikasi di Android, iOS, atau web. Pastikan Expo Go tersedia di perangkat/emulator Anda.

## Konfigurasi Lingkungan

- Sesuaikan kredensial Firebase di `src/screens/firebaseConfig.js`.
- Jika diperlukan, atur izin lokasi pada perangkat/emulator agar rekomendasi apotek berfungsi.

## Struktur Proyek

```
src/
├── navigation/      # Navigator stack dan tab
├── provider/        # Konteks autentikasi
├── screens/         # Seluruh layar fitur utama dan utilitas
└── components/      # Komponen pendukung
```

## Lisensi

Repositori ini belum menyertakan berkas lisensi khusus. Tambahkan lisensi sesuai kebutuhan sebelum distribusi lebih lanjut.

## Bantuan & Kontribusi

- Bersihkan cache Metro dengan `expo start -c` jika menemui aset lama atau error tidak jelas.
- Buka issue atau pull request untuk menyampaikan perbaikan dan ide baru.
