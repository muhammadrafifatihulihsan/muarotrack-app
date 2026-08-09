// Orchestrator for offline-to-online data sync.
// Called when connectivity transitions from offline → online.

import apiFetch from "@/lib/apiClient";
import apiFetch_ from "@/lib/apiClient";
import { connectivity } from "@/lib/connectivity";

export interface SyncResult {
    laporanSynced: number;
    titikFavoritSynced: number;
    sosSynced: number;
}

async function runSync(): Promise<SyncResult> {
    if (!connectivity.isOnline()) {
        return { laporanSynced: 0, titikFavoritSynced: 0, sosSynced: 0 };
    }

    const result: SyncResult = { laporanSynced: 0, titikFavoritSynced: 0, sosSynced: 0 };

    // Sync pending laporan batch.
    try {
        const pendingLaporan = await getPendingLaporan();
        if (pendingLaporan.length > 0) {
            await apiFetch_("/sync/laporan-batch", {
                method: "POST",
                body: JSON.stringify({ laporan: pendingLaporan }),
            });
            await markLaporanSynced(pendingLaporan.map((l: any) => l.id).filter(Boolean));
            result.laporanSynced = pendingLaporan.length;
        }
    } catch {
        // Retry on next sync cycle.
    }

    // Sync pending titik favorit.
    try {
        const pendingTitik = await getPendingTitikFavorit();
        for (const t of pendingTitik) {
            try {
                await apiFetch("/titik-favorit", {
                    method: "POST",
                    body: JSON.stringify(t),
                });
                await markTitikFavoritSynced(t.id);
                result.titikFavoritSynced++;
            } catch {
                // Continue to next item.
            }
        }
    } catch {
        // Retry on next sync cycle.
    }

    // Sync pending SOS signals.
    try {
        const pendingSos = await getPendingSos();
        for (const s of pendingSos) {
            try {
                await apiFetch("/sos", {
                    method: "POST",
                    body: JSON.stringify({
                        lat: s.lat,
                        lng: s.lng,
                        pesan: s.pesan,
                        waktu_kejadian: s.waktu_kejadian,
                    }),
                });
                await markSosSent(s.id);
                result.sosSynced++;
            } catch {
                // Continue to next item.
            }
        }
    } catch {
        // Retry on next sync cycle.
    }

    return result;
}

// Stub functions — real implementations write/read from expo-sqlite.
// Replace with LocalDatabase queries after db.ts is written.

async function getPendingLaporan(): Promise<any[]> {
    return []; // TODO: query laporan_local WHERE pending_sync = 1
}

async function markLaporanSynced(ids: string[]): Promise<void> {
    // TODO: UPDATE laporan_local SET pending_sync = 0 WHERE id IN (...)
}

async function getPendingTitikFavorit(): Promise<any[]> {
    return []; // TODO: query titik_favorit_local WHERE pending_sync = 1
}

async function markTitikFavoritSynced(id: string): Promise<void> {
    // TODO: UPDATE titik_favorit_local SET pending_sync = 0 WHERE id = ?
}

async function getPendingSos(): Promise<any[]> {
    return []; // TODO: query sos_queue_local WHERE status = 'tertunda'
}

async function markSosSent(id: string): Promise<void> {
    // TODO: UPDATE sos_queue_local SET status = 'terkirim' WHERE id = ?
}

export { runSync };