// Single source of truth for all application configuration.
// Import from this file; change values here and all consumers update.

// API & server
export const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";
export const API_TIMEOUT_MS = 15_000;

// Zona tangkap (mirrors server env)
export const DEFAULT_RADIUS_KM = 15;
export const ZONA_JUMLAH_TITIK = 5;
export const POSISI_LAUT_DEFAULT = { lat: -0.9045, lng: 100.3400 };

// Map defaults
export const MATA_ANGIN = [
    "Utara",
    "Timur Laut",
    "Timur",
    "Tenggara",
    "Selatan",
    "Barat Daya",
    "Barat",
    "Barat Laut",
] as const;
export const DEFAULT_ZOOM = 15;
export const MIN_ZOOM = 6;
export const MAX_ZOOM = 18;

// Scoring factor labels for UI display
export const FAKTOR_SKOR_LABEL: Record<string, string> = {
    sst: "Suhu Laut",
    klorofil: "Klorofil",
    turbiditas: "Kekeruhan",
    batimetri: "Kedalaman",
    fase_bulan: "Fase Bulan",
    jarak_muara: "Jarak Muara",
    bonus_komunitas: "Bonus Komunitas",
    faktor_hemat_bbm: "Hemat BBM",
};

// SOS
export const SOS_RADIUS_KM = 10;
export const SOS_REFRESH_INTERVAL_MS = 30_000;

// Sync
export const SYNC_RETRY_MAX = 5;
export const SYNC_RETRY_DELAY_MS = 10_000;

// Solunar (offline astronomical calculation)
export const SOLUNAR_MAJOR_WINDOW_HOURS = 2;
export const SOLUNAR_MINOR_WINDOW_START_MIN = -15;
export const SOLUNAR_MINOR_WINDOW_END_MIN = 45;

// Thresholds
export const MIN_LAPORAN_KOMUNITAS = 3;
export const JARAK_SEDIMEN_KM = 3;