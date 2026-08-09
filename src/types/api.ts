// Mirror Pydantic schemas in server/schemas/*.py.
// Coordinates: lat/lng as separate fields (server stores GEOGRAPHY(Point,4326)).

export interface NelayanOut {
    id: string;
    nama: string;
    konsumsi_bbm_per_km: number;
    created_at: string;
}

export interface NelayanCreate {
    nama: string;
    total_liter_biasa: number;
    jarak_km_biasa: number;
}

export interface DetailSkor {
    sst: number;
    klorofil: number;
    turbiditas: number;
    batimetri: number;
    fase_bulan: number;
    jarak_muara: number;
    bonus_komunitas: number;
    faktor_hemat_bbm: number;
}

export interface ZonaRekomendasi {
    id: string;
    lat: number;
    lng: number;
    skor: number;
    detail_skor: DetailSkor;
    dihitung_pada: string;
    jarak_km: number | null;
    estimasi_bbm_liter: number | null;
    peringkat: number | null;
    skor_efektif: number | null;
    terdampak_sedimen: boolean;
    catatan_sedimen: string | null;
}

export interface ZonaRekomendasiResponse {
    zonas: ZonaRekomendasi[];
}

export interface LaporanTeksCreate {
    nelayan_id: string | null;
    lat: number;
    lng: number;
    jenis_ikan?: string | null;
    estimasi_kg?: number | null;
    catatan?: string | null;
}

export interface LaporanOut {
    id: string;
    nelayan_id: string | null;
    lat: number;
    lng: number;
    jenis_ikan: string | null;
    estimasi_kg: number | null;
    catatan: string | null;
    perlu_review: boolean;
    waktu: string;
    synced: boolean;
}

export interface LaporanSuaraOut {
    id: string;
    jenis_ikan: string | null;
    estimasi_kg: number | null;
    catatan: string | null;
    perlu_review: boolean;
}

export interface LaporanBatchItem {
    id?: string | null;
    nelayan_id?: string | null;
    lat: number;
    lng: number;
    jenis_ikan?: string | null;
    estimasi_kg?: number | null;
    catatan?: string | null;
    perlu_review?: boolean | null;
    waktu?: string | null;
}

export interface LaporanBatchRequest {
    laporan: LaporanBatchItem[];
}

export interface GelombangItem {
    waktu: string;
    tinggi_m: number;
    arah_derajat: number;
    periode_detik: number;
}

export interface CuacaItem {
    waktu: string;
    suhu_c: number;
    kelembapan_persen: number;
    tekanan_hpa: number;
    uv_index: number;
    presipitasi_mm: number;
    probabilitas_presipitasi_persen: number;
    kecepatan_angin_kmh: number;
    arah_angin_derajat: number;
    hembusan_angin_kmh: number;
}

export interface PasangSurutItem {
    waktu: string;
    tinggi_m: number;
    tipe: "pasang" | "surut" | "sampel";
}

export interface KondisiLaut {
    id: string;
    lat: number;
    lng: number;
    diperbarui_pada: string;
    gelombang_gabungan: GelombangItem[];
    gelombang_angin: GelombangItem[];
    gelombang_swell: GelombangItem[];
    cuaca_per_jam: CuacaItem[];
    pasang_surut: PasangSurutItem[];
}

export interface TitikFavoritCreate {
    nelayan_id: string;
    nama_label: string;
    lat: number;
    lng: number;
    catatan?: string | null;
    laporan_tangkapan_id?: string | null;
}

export interface TitikFavoritOut {
    id: string;
    nelayan_id: string;
    nama_label: string;
    lat: number;
    lng: number;
    catatan: string | null;
    laporan_tangkapan_id: string | null;
    dibuat_pada: string;
    synced: boolean;
}

export interface SosCreate {
    nelayan_id: string | null;
    lat: number;
    lng: number;
    pesan?: string | null;
    waktu_kejadian: string;
}

export interface SosOut {
    id: string;
    nelayan_id: string | null;
    lat: number;
    lng: number;
    pesan: string | null;
    waktu_kejadian: string;
    waktu_terkirim: string | null;
    status: "tertunda" | "terkirim" | "dibatalkan" | "selesai";
    dibuat_pada: string;
}

export interface PushTokenCreate {
    nelayan_id: string;
    expo_push_token: string;
}

export interface TripBbmCreate {
    nelayan_id: string;
    jarak_km: number;
    prediksi_liter: number;
    liter_aktual?: number | null;
}

export interface TripBbmOut {
    id: string;
    nelayan_id: string;
    jarak_km: number;
    prediksi_liter: number;
    liter_aktual: number | null;
    waktu: string;
}