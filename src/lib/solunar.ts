// solunar.ts — Major/Minor solunar periods (100% offline, based on suncalc)
// Algorithm: scan moon altitude to find transit (max) and antitransit (min)
// per spec v2 section 7.3

let SunCalc: any = null;
function getSunCalc() {
    if (!SunCalc) {
        SunCalc = require("suncalc");
    }
    return SunCalc;
}

export interface SolunarPeriod {
    type: "major" | "minor";
    start: Date;
    end: Date;
    strength: number; // 0-1, based on spring-tide proximity
}

export interface DailySolunar {
    date: Date;
    periods: SolunarPeriod[];
    moonPhase: number; // 0-1
    illumination: number; // 0-1
}

/** Cari waktu transit/antitransit bulan dengan sapuan altitude */
function cariEkstremAltitudeBulan(
    tengahHari: Date,
    lat: number,
    lng: number,
    cariMaksimum: boolean
): Date {
    const sc = getSunCalc();
    let terbaik = tengahHari;
    let nilaiTerbaik = cariMaksimum ? -Infinity : Infinity;

    // Sapuan kasar: setiap 10 menit, ±13 jam dari tengah hari
    for (let menit = -13 * 60; menit <= 13 * 60; menit += 10) {
        const t = new Date(tengahHari.getTime() + menit * 60000);
        const pos = sc.getMoonPosition(t, lat, lng);
        const lebihBaik = cariMaksimum
            ? pos.altitude > nilaiTerbaik
            : pos.altitude < nilaiTerbaik;
        if (lebihBaik) {
            nilaiTerbaik = pos.altitude;
            terbaik = t;
        }
    }

    // Perhalusan: ±10 menit, langkah 30 detik
    let terbaikHalus = terbaik;
    let nilaiHalus = nilaiTerbaik;
    for (let detik = -600; detik <= 600; detik += 30) {
        const t = new Date(terbaik.getTime() + detik * 1000);
        const pos = sc.getMoonPosition(t, lat, lng);
        const lebihBaik = cariMaksimum
            ? pos.altitude > nilaiHalus
            : pos.altitude < nilaiHalus;
        if (lebihBaik) {
            nilaiHalus = pos.altitude;
            terbaikHalus = t;
        }
    }
    return terbaikHalus;
}

/** Hitung kekuatan pasang purnama (spring tide proximity) */
function kekuatanSpringTide(tanggal: Date): number {
    const sc = getSunCalc();
    const { phase } = sc.getMoonIllumination(tanggal);
    // 1.0 at new/full moon, 0.0 at quarter moons
    return Math.abs(Math.cos(2 * Math.PI * phase));
}

/** Dapatkan daily solunar untuk satu tanggal */
export function getDailySolunar(
    tanggal: Date,
    lat: number,
    lng: number
): DailySolunar {
    const sc = getSunCalc();

    // Tengah hari UTC untuk sapuan altitude
    const tengahHari = new Date(Date.UTC(
        tanggal.getFullYear(),
        tanggal.getMonth(),
        tanggal.getDate(),
        12, 0, 0
    ));

    // Moon info
    const { phase, fraction: illumination } = sc.getMoonIllumination(tanggal);

    // Moon rise/set (minor periods)
    const moonTimes = sc.getMoonTimes(tanggal, lat, lng);
    const strength = kekuatanSpringTide(tanggal);

    const periods: SolunarPeriod[] = [];

    // Major 1: transit (altitude max)
    const transit = cariEkstremAltitudeBulan(tengahHari, lat, lng, true);
    periods.push({
        type: "major",
        start: new Date(transit.getTime() - 60 * 60 * 1000),
        end: new Date(transit.getTime() + 60 * 60 * 1000),
        strength,
    });

    // Major 2: antitransit (altitude min)
    const antitransit = cariEkstremAltitudeBulan(tengahHari, lat, lng, false);
    periods.push({
        type: "major",
        start: new Date(antitransit.getTime() - 60 * 60 * 1000),
        end: new Date(antitransit.getTime() + 60 * 60 * 1000),
        strength,
    });

    // Minor 1: moonrise
    if (moonTimes.rise && !moonTimes.alwaysUp && !moonTimes.alwaysDown) {
        periods.push({
            type: "minor",
            start: new Date(moonTimes.rise.getTime() - 15 * 60 * 1000),
            end: new Date(moonTimes.rise.getTime() + 45 * 60 * 1000),
            strength,
        });
    }

    // Minor 2: moonset
    if (moonTimes.set && !moonTimes.alwaysUp && !moonTimes.alwaysDown) {
        periods.push({
            type: "minor",
            start: new Date(moonTimes.set.getTime() - 15 * 60 * 1000),
            end: new Date(moonTimes.set.getTime() + 45 * 60 * 1000),
            strength,
        });
    }

    return {
        date: tanggal,
        periods,
        moonPhase: phase,
        illumination,
    };
}

/** Dapatkan solunar untuk 7 hari (H-3 s.d. H+3) */
export function getWeeklySolunar(
    today: Date,
    lat: number,
    lng: number
): DailySolunar[] {
    const results: DailySolunar[] = [];
    for (let i = -3; i <= 3; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        results.push(getDailySolunar(d, lat, lng));
    }
    return results;
}

/** Format jam HH:MM dari Date */
export function formatJam(d: Date): string {
    return d.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
    });
}

/** Nama hari pendek */
export function namaHari(d: Date): string {
    return d.toLocaleDateString("id-ID", { weekday: "short" });
}

/** Tanggal pendek */
export function tanggalPendek(d: Date): string {
    return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
    });
}