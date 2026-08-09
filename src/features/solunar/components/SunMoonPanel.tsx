// SunMoonPanel.tsx — displays sun & moon info (100% offline)
// Uses suncalc via moon.ts lib, spec v2 section 7.7

import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, clayShadows, borderRadius, spacing, typography } from "@/constants/theme";
import { getMoonInfo, getMoonRiseSet, getSunRiseSet } from "@/lib/moon";
import { POSISI_LAUT_DEFAULT } from "@/constants/config";

interface SunMoonPanelProps {
    lat?: number;
    lng?: number;
}

/** Moon phase emojis for visual representation */
function moonEmoji(illum: number): string {
    if (illum < 0.03) return "🌑";
    if (illum < 0.20) return "🌒";
    if (illum < 0.40) return "🌓";
    if (illum < 0.60) return "🌔";
    if (illum < 0.80) return "🌕";
    if (illum < 0.97) return "🌖";
    return "🌗";
}

export default function SunMoonPanel({ lat, lng }: SunMoonPanelProps) {
    const today = useMemo(() => new Date(), []);
    const centerLat = lat ?? POSISI_LAUT_DEFAULT.lat;
    const centerLng = lng ?? POSISI_LAUT_DEFAULT.lng;

    const moonInfo = useMemo(() => getMoonInfo(today, centerLat, centerLng), [centerLat, centerLng]);
    const moonTimes = useMemo(() => getMoonRiseSet(today, centerLat, centerLng), [centerLat, centerLng]);
    const sunTimes = useMemo(() => getSunRiseSet(today, centerLat, centerLng), [centerLat, centerLng]);

    const formatTime = (d: Date | null) => {
        if (!d) return "--:--";
        return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" });
    };

    const emoji = moonEmoji(moonInfo.iluminasi);

    return (
        <View style={styles.panel}>
            {/* Title */}
            <View style={styles.titleRow}>
                <Ionicons name="sunny" size={22} color={colors.primary} />
                <Text style={styles.title}>Matahari & Bulan</Text>
            </View>

            <Text style={styles.desc}>
                Fase bulan mempengaruhi kekuatan pasang surut dan prediksi solunar. Bulan purnama dan bulan baru menghasilkan pasang tertinggi (spring tide).
            </Text>

            <View style={styles.statusBox}>
                <Ionicons
                    name={moonInfo.iluminasi > 0.9 || moonInfo.iluminasi < 0.1 ? "checkmark-circle" : "checkmark-circle"}
                    size={18}
                    color={moonInfo.iluminasi > 0.9 || moonInfo.iluminasi < 0.1 ? "#4CAF50" : colors.onSurfaceVariant}
                />
                <Text style={[styles.statusText, { color: moonInfo.iluminasi > 0.9 || moonInfo.iluminasi < 0.1 ? "#4CAF50" : colors.onSurfaceVariant }]}>
                    {moonInfo.iluminasi > 0.9
                        ? "Purnama — pasang tinggi maksimal, waktu baik untuk memancing"
                        : moonInfo.iluminasi < 0.1
                            ? "Bulan baru — pasang tinggi, aktivitas ikan meningkat"
                            : "Fase bulan normal — pasang surut sedang"}
                </Text>
            </View>

            {/* Sun row */}
            <View style={styles.row}>
                <View style={styles.labelRow}>
                    <Text style={{ fontSize: 18 }}>☀️</Text>
                    <Text style={styles.rowLabel}>Matahari</Text>
                </View>
                <View style={styles.valueCol}>
                    <Text style={styles.mainText}>
                        Terbit {formatTime(sunTimes.sunrise)}, Terbenam {formatTime(sunTimes.sunset)}
                    </Text>
                    <Text style={styles.subText}>
                        Fajar {formatTime(sunTimes.dawn)}, Senja {formatTime(sunTimes.dusk)}
                    </Text>
                </View>
            </View>

            {/* Moon row */}
            <View style={[styles.row, { borderBottomWidth: 0 }]}>
                <View style={styles.labelRow}>
                    <Text style={styles.moonSymbol}>{emoji}</Text>
                    <Text style={styles.rowLabel}>Bulan</Text>
                </View>
                <View style={styles.valueCol}>
                    <Text style={styles.moonPhaseName}>
                        {moonInfo.fase} ({(moonInfo.iluminasi * 100).toFixed(0)}%)
                    </Text>
                    <Text style={styles.mainText}>
                        {moonTimes.alwaysUp ? "Selalu di atas" :
                            moonTimes.alwaysDown ? "Selalu di bawah" :
                                `Terbit ${formatTime(moonTimes.rise)}, Terbenam ${formatTime(moonTimes.set)}`}
                    </Text>
                    <Text style={styles.subText}>
                        Umur {moonInfo.umurHari.toFixed(1)} h, {moonInfo.jarakKm.toFixed(0)} km
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    panel: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius["2xl"],
        padding: spacing.md,
        marginBottom: spacing.sm,
        ...clayShadows.card,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: spacing.sm,
    },
    title: {
        ...typography.headlineMd,
        color: colors.onSurface,
    },
    statusBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        padding: spacing.xs,
        marginBottom: spacing.sm,
    },
    statusText: {
        ...typography.labelSm,
        fontWeight: "600",
        flex: 1,
    },
    desc: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
        marginBottom: spacing.sm,
        lineHeight: 18,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: spacing.md,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.outlineVariant,
    },
    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        width: 110,
    },
    rowLabel: {
        ...typography.labelMd,
        color: colors.primary,
    },
    moonSymbol: {
        fontSize: 20,
        color: colors.primary,
        width: 22,
        textAlign: "center",
    },
    valueCol: {
        flex: 1,
        alignItems: "flex-end",
    },
    mainText: {
        ...typography.bodyMd,
        color: colors.onSurface,
    },
    subText: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
        marginTop: 2,
    },
    moonPhaseName: {
        ...typography.labelMd,
        color: colors.primary,
        marginBottom: 2,
        fontWeight: "600",
    },
});