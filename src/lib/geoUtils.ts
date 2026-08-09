// Formatting utilities for distances and timestamps.

export function formatJarak(km: number): string {
    const nm = km / 1.852;
    return `${km.toFixed(1)} km · ${nm.toFixed(1)} nm`;
}

export function kmKeNm(km: number): number {
    return km / 1.852;
}

export function formatTanggalSync(iso: string): string {
    const date = new Date(iso);
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
    });
}

export function totalJarakJalur(
    titik: { lat: number; lng: number }[]
): number {
    let total = 0;
    for (let i = 0; i < titik.length - 1; i++) {
        total += haversineSimple(
            titik[i].lat,
            titik[i].lng,
            titik[i + 1].lat,
            titik[i + 1].lng
        );
    }
    return total;
}

function haversineSimple(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}