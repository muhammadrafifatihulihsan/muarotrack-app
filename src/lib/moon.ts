// moon.ts – Fase & informasi bulan & matahari (spesifikasi v2)
// 100% offline, pakai suncalc (matematika astronomi)
// Spec v2 section 7.7

let SunCalc: any = null;
function getSunCalc() {
    if (!SunCalc) {
        SunCalc = require("suncalc");
    }
    return SunCalc;
}

// ---------- Legacy exports (backward compat) ----------

export function hitungFaseBulan(tgl: Date): number {
    const refDate = new Date(Date.UTC(2000, 0, 6));
    const diffDays = (tgl.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24);
    const synodicCycle = 29.530588853;
    const phase = (diffDays % synodicCycle) / synodicCycle;
    return phase >= 0 ? phase : phase + 1.0;
}

export function fraksiIluminasiBulan(tgl: Date): number {
    const phase = hitungFaseBulan(tgl);
    return (1.0 - Math.cos(2 * Math.PI * phase)) / 2.0;
}

// ---------- Moon info using suncalc ----------

export interface MoonInfo {
    fase: string;
    iluminasi: number; // 0-1
    umurHari: number;
    jarakKm: number;
    sudutLimb: number; // radian
}

const FASE_NAMES = [
    "Bulan Baru",
    "Sabit Awal",
    "Kuartal Awal",
    "Cembung Awal",
    "Purnama",
    "Cembung Akhir",
    "Kuartal Akhir",
    "Sabit Akhir",
];

export function getMoonInfo(tanggal: Date, lat: number, lng: number): MoonInfo {
    const sc = getSunCalc();
    const illum = sc.getMoonIllumination(tanggal);
    const pos = sc.getMoonPosition(tanggal, lat, lng);
    const phaseIdx = Math.round(illum.phase * 8) % 8;
    const sudutLimb = illum.angle - pos.parallacticAngle;
    return {
        fase: FASE_NAMES[phaseIdx],
        iluminasi: illum.fraction,
        umurHari: illum.phase * 29.53059,
        jarakKm: pos.distance,
        sudutLimb,
    };
}

export function getMoonRiseSet(tanggal: Date, lat: number, lng: number) {
    const sc = getSunCalc();
    const times = sc.getMoonTimes(tanggal, lat, lng);
    return {
        rise: times.rise ?? null,
        set: times.set ?? null,
        alwaysUp: times.alwaysUp === true,
        alwaysDown: times.alwaysDown === true,
    };
}

export function getSunRiseSet(tanggal: Date, lat: number, lng: number) {
    const sc = getSunCalc();
    const times = sc.getTimes(tanggal, lat, lng);
    return {
        sunrise: times.sunrise,
        sunset: times.sunset,
        dawn: times.dawn,
        dusk: times.dusk,
    };
}