// Mirror server/services/geo.py — bearing calculation.
// Normalized to 0-360 degrees.

import { MATA_ANGIN } from "@/constants/config";

export function hitungBearing(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const toDeg = (r: number) => (r * 180) / Math.PI;

    const phi1 = toRad(lat1);
    const phi2 = toRad(lat2);
    const dLambda = toRad(lng2 - lng1);

    const y = Math.sin(dLambda) * Math.cos(phi2);
    const x =
        Math.cos(phi1) * Math.sin(phi2) -
        Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLambda);

    const theta = Math.atan2(y, x);
    return (toDeg(theta) + 360) % 360;
}

export function derajatKeMataAngin(derajat: number): string {
    const index = Math.round(derajat / 45) % 8;
    return MATA_ANGIN[index];
}