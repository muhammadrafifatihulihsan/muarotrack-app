// WavePanel.tsx — Mock display of wave conditions (offline preview)
// Real data from Open-Meteo Marine API via backend (spec v2 section 7.4)

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, clayShadows, borderRadius, spacing, typography } from "@/constants/theme";
import { derajatKeMataAngin } from "@/lib/bearing";

// Mock data for Padang coast (preview only)
const MOCK_WAVE = {
    tinggi_m: 1.2,
    arah_derajat: 210,
    periode_detik: 7.5,
    perJam: [
        { jam: "00", tinggi_m: 1.0 }, { jam: "03", tinggi_m: 1.1 },
        { jam: "06", tinggi_m: 1.3 }, { jam: "09", tinggi_m: 1.2 },
        { jam: "12", tinggi_m: 1.0 }, { jam: "15", tinggi_m: 0.9 },
        { jam: "18", tinggi_m: 1.2 }, { jam: "21", tinggi_m: 1.4 },
    ],
};

export default function WavePanel() {
    const w = MOCK_WAVE;
    const maxTinggi = Math.max(...w.perJam.map(p => p.tinggi_m));

    return (
        <View style={styles.panel}>
            <View style={styles.titleRow}>
                <Ionicons name="water" size={22} color={colors.primary} />
                <Text style={styles.title}>Gelombang Laut</Text>
            </View>

            <Text style={styles.desc}>
                Gabungan gelombang angin dan swell. Tinggi di bawah 1.5 m aman untuk kapal kecil tradisional.
            </Text>

            <View style={styles.statusBox}>
                <Ionicons
                    name={w.tinggi_m < 1.5 ? "checkmark-circle" : "warning"}
                    size={18}
                    color={w.tinggi_m < 1.5 ? "#4CAF50" : colors.error}
                />
                <Text style={[styles.statusText, { color: w.tinggi_m < 1.5 ? "#4CAF50" : colors.error }]}>
                    {w.tinggi_m < 1.5
                        ? "Aman untuk melaut — gelombang tenang"
                        : "Hati-hati — gelombang cukup tinggi"}
                </Text>
            </View>

            {/* Ringkasan */}
            <View style={styles.summaryRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{w.tinggi_m.toFixed(1)} m</Text>
                    <Text style={styles.statLabel}>Tinggi</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{w.arah_derajat}°</Text>
                    <Text style={styles.statLabel}>{derajatKeMataAngin(w.arah_derajat)}</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{w.periode_detik.toFixed(1)}s</Text>
                    <Text style={styles.statLabel}>Periode</Text>
                </View>
            </View>

            {/* Bar chart per jam */}
            <Text style={styles.chartLabel}>Tinggi gelombang per 3 jam</Text>
            <View style={styles.barChart}>
                {w.perJam.map((p, i) => (
                    <View key={i} style={styles.barCol}>
                        <Text style={styles.barValue}>{p.tinggi_m.toFixed(1)}</Text>
                        <View style={[
                            styles.bar,
                            { height: (p.tinggi_m / maxTinggi) * 60 },
                        ]} />
                        <Text style={styles.barLabel}>{p.jam}</Text>
                    </View>
                ))}
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
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: spacing.sm,
    },
    title: {
        ...typography.headlineMd,
        color: colors.onSurface,
        flex: 1,
    },
    desc: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
        marginBottom: spacing.sm,
        lineHeight: 18,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: spacing.md,
    },
    statBox: {
        alignItems: "center",
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: borderRadius.lg,
        padding: spacing.sm,
        minWidth: 80,
    },
    statValue: {
        ...typography.headlineLgMobile,
        color: colors.primary,
    },
    statLabel: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
        marginTop: 2,
    },
    chartLabel: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
        marginBottom: spacing.sm,
    },
    barChart: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        height: 90,
    },
    barCol: {
        alignItems: "center",
        flex: 1,
    },
    barValue: {
        ...typography.labelSm,
        color: colors.onSurface,
        fontSize: 9,
        marginBottom: 2,
    },
    bar: {
        width: 16,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.sm,
    },
    barLabel: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
        fontSize: 10,
        marginTop: 4,
    },
});