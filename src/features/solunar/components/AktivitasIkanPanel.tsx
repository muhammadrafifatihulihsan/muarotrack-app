// AktivitasIkanPanel.tsx — Solunar forecast (offline)
// Main card: today with detailed major/minor periods
// Below: 3 days ahead in horizontal scroll
// spec v2 section 7.3

import React, { useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, clayShadows, borderRadius, spacing, typography } from "@/constants/theme";
import {
    getDailySolunar,
    formatJam,
    namaHari,
    tanggalPendek,
    DailySolunar,
} from "@/lib/solunar";
import { POSISI_LAUT_DEFAULT } from "@/constants/config";

interface AktivitasIkanPanelProps {
    lat?: number;
    lng?: number;
}

// Moon phase emojis for visual representation
function moonEmoji(illum: number): string {
    if (illum < 0.03) return "🌑";       // new moon
    if (illum < 0.20) return "🌒";       // waxing crescent
    if (illum < 0.40) return "🌓";       // first quarter
    if (illum < 0.60) return "🌔";       // waxing gibbous
    if (illum < 0.80) return "🌕";       // full moon
    if (illum < 0.97) return "🌖";       // waning gibbous
    return "🌗";                          // last quarter
}

export default function AktivitasIkanPanel({ lat, lng }: AktivitasIkanPanelProps) {
    const today = useMemo(() => new Date(), []);
    const centerLat = lat ?? POSISI_LAUT_DEFAULT.lat;
    const centerLng = lng ?? POSISI_LAUT_DEFAULT.lng;

    // Today + 3 days ahead
    const daysData = useMemo(() => {
        const results: DailySolunar[] = [];
        for (let i = 0; i <= 3; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() + i);
            results.push(getDailySolunar(d, centerLat, centerLng));
        }
        return results;
    }, [centerLat, centerLng]);

    const todayData = daysData[0];
    const nextDays = daysData.slice(1);
    const emoji = moonEmoji(todayData.illumination);

    // Separate major/minor for today
    const majorPeriods = todayData.periods.filter(p => p.type === "major");
    const minorPeriods = todayData.periods.filter(p => p.type === "minor");

    return (
        <View style={styles.panel}>
            {/* Title */}
            <View style={styles.titleRow}>
                <Ionicons name="fish" size={22} color={colors.primary} />
                <Text style={styles.title}>Aktivitas Ikan (Solunar)</Text>
            </View>

            {/* Description */}
            <Text style={styles.desc}>
                Periode Major (2 jam) saat bulan tepat di atas/bawah, waktu puncak aktivitas ikan. Periode Minor (1 jam) saat bulan terbit/terbenam. Semakin dekat dengan bulan purnama atau bulan baru, semakin kuat pengaruhnya.
            </Text>

            {/* Status indicator */}
            {(() => {
                const maxStrength = todayData.periods
                    .filter(p => p.type === "major")
                    .reduce((max, p) => Math.max(max, p.strength), 0);
                const hasMajor = todayData.periods.some(p => p.type === "major");
                const isGood = hasMajor && maxStrength > 0.7;
                const isOk = hasMajor && maxStrength >= 0.3;
                const isLow = !hasMajor || maxStrength < 0.3;

                let icon: "checkmark-circle" | "warning" = "checkmark-circle";
                let statusColor = "#4CAF50";
                let message = "";

                if (isGood) {
                    icon = "checkmark-circle";
                    statusColor = "#4CAF50";
                    message = "Waktu puncak aktivitas ikan hari ini — kondisi baik untuk melaut";
                } else if (isOk) {
                    icon = "checkmark-circle";
                    statusColor = "#4CAF50";
                    message = "Aktivitas ikan sedang — tetap bisa melaut";
                } else {
                    icon = "warning";
                    statusColor = "#FF9800";
                    message = "Aktivitas ikan rendah — pertimbangkan waktu lain";
                }

                return (
                    <View style={styles.statusBox}>
                        <Ionicons name={icon} size={18} color={statusColor} />
                        <Text style={[styles.statusText, { color: statusColor }]}>
                            {message}
                        </Text>
                    </View>
                );
            })()}

            {/* Today's main card */}
            <View style={styles.todayCard}>
                <View style={styles.todayHeader}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                        <Text style={styles.todayMoon}>{emoji}</Text>
                        <View>
                            <Text style={styles.todayDate}>
                                {namaHari(todayData.date)}, {tanggalPendek(todayData.date)}
                            </Text>
                            <Text style={styles.todayIllum}>
                                {(todayData.illumination * 100).toFixed(0)}% iluminasi
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Periods today */}
                {majorPeriods.length > 0 && (
                    <View style={styles.periodSection}>
                        <Text style={styles.periodSectionLabel}>Major Period (waktu puncak)</Text>
                        {majorPeriods.map((p, j) => (
                            <View key={j} style={styles.todayPeriod}>
                                <Text style={styles.todayPeriodTime}>
                                    {formatJam(p.start)} - {formatJam(p.end)}
                                </Text>
                                <Text style={styles.todayPeriodStrength}>
                                    Kekuatan: {(p.strength * 100).toFixed(0)}%
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {minorPeriods.length > 0 && (
                    <View style={styles.periodSection}>
                        <Text style={styles.periodSectionLabel}>Minor Period</Text>
                        {minorPeriods.map((p, j) => (
                            <View key={j} style={styles.todayPeriod}>
                                <Text style={styles.todayPeriodTime}>
                                    {formatJam(p.start)} - {formatJam(p.end)}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {todayData.periods.length === 0 && (
                    <Text style={styles.noPeriods}>Tidak ada periode hari ini</Text>
                )}
            </View>

            {/* Next 3 days horizontal scroll */}
            <Text style={styles.nextTitle}>3 Hari Ke Depan</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {nextDays.map((day, idx) => (
                    <View key={idx} style={styles.nextCard}>
                        <Text style={styles.nextDay}>{namaHari(day.date)}</Text>
                        <Text style={styles.nextDate}>{tanggalPendek(day.date)}</Text>
                        <Text style={styles.nextMoon}>{moonEmoji(day.illumination)}</Text>
                        <Text style={styles.nextIllum}>{(day.illumination * 100).toFixed(0)}%</Text>
                        {day.periods.slice(0, 2).map((p, j) => (
                            <View key={j} style={[
                                styles.nextPeriod,
                                p.type === "major" ? styles.nextMajor : styles.nextMinor,
                            ]}>
                                <Text style={styles.nextPeriodLabel}>
                                    {p.type === "major" ? "Major" : "Minor"}
                                </Text>
                                <Text style={styles.nextPeriodTime}>
                                    {formatJam(p.start)}-{formatJam(p.end)}
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>

            {/* Disclaimer */}
            <View style={styles.disclaimerRow}>
                <Ionicons name="warning-outline" size={12} color={colors.error} />
                <Text style={styles.disclaimer}>
                    Prediksi berdasarkan teori solunar, bukan jaminan ilmiah.
                </Text>
            </View>
        </View>
    );
}

// Simplified inline styles for brevity - matches design system
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
        marginBottom: spacing.xs,
    },
    title: {
        ...typography.headlineMd,
        color: colors.onSurface,
    },
    desc: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
        marginBottom: spacing.sm,
        lineHeight: 18,
    },
    statusBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        padding: spacing.xs,
        paddingLeft: spacing.xs,
        marginBottom: spacing.sm,
    },
    statusText: {
        ...typography.labelSm,
        fontWeight: "600",
        flex: 1,
    },
    todayCard: {
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    todayHeader: {
        marginBottom: spacing.sm,
    },
    todayMoon: {
        fontSize: 36,
        color: colors.primary,
    },
    todayDate: {
        ...typography.labelMd,
        color: colors.onSurface,
    },
    todayIllum: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
    },
    periodSection: {
        marginTop: spacing.sm,
    },
    periodSectionLabel: {
        ...typography.labelSm,
        color: colors.primary,
        fontWeight: "600",
        marginBottom: 4,
    },
    todayPeriod: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: "rgba(61,94,132,0.08)",
        borderRadius: borderRadius.sm,
        marginBottom: 4,
    },
    todayPeriodTime: {
        ...typography.labelMd,
        color: colors.onSurface,
    },
    todayPeriodStrength: {
        ...typography.labelSm,
        color: colors.primary,
    },
    noPeriods: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
        textAlign: "center",
        marginTop: spacing.sm,
    },
    nextTitle: {
        ...typography.labelMd,
        color: colors.onSurface,
        marginBottom: spacing.sm,
    },
    nextCard: {
        width: 120,
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: borderRadius.lg,
        padding: spacing.sm,
        marginRight: spacing.sm,
        alignItems: "center",
    },
    nextDay: {
        ...typography.labelMd,
        color: colors.primary,
        marginBottom: 2,
    },
    nextDate: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
        marginBottom: spacing.xs,
    },
    nextMoon: {
        fontSize: 24,
        color: colors.primary,
        marginBottom: 2,
    },
    nextIllum: {
        ...typography.labelSm,
        color: colors.onSurface,
        marginBottom: spacing.xs,
    },
    nextPeriod: {
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderRadius: borderRadius.sm,
        marginBottom: 4,
        width: "100%",
        alignItems: "center",
    },
    nextMajor: {
        backgroundColor: "rgba(61,94,132,0.15)",
    },
    nextMinor: {
        backgroundColor: "rgba(61,94,132,0.07)",
    },
    nextPeriodLabel: {
        fontSize: 9,
        fontWeight: "700",
        color: colors.primary,
    },
    nextPeriodTime: {
        ...typography.labelSm,
        color: colors.onSurface,
        fontSize: 10,
    },
    disclaimerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: spacing.sm,
    },
    disclaimer: {
        ...typography.labelSm,
        color: colors.error,
        fontStyle: "italic",
        flex: 1,
    },
});