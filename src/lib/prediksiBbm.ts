// Mirror server/services/geo.py — BBM prediction.
// Pure function, runs 100% offline on client.

export function prediksiBbm(
    jarakKm: number,
    konsumsiPerKm: number,
    pulangPergi: boolean = true
): number {
    const faktor = pulangPergi ? 2 : 1;
    return jarakKm * konsumsiPerKm * faktor;
}