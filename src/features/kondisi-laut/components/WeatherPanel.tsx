// WeatherPanel.tsx — Mock weather display (spec v2 section 7.6)
// Real data: Open-Meteo Forecast API via backend cache

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, clayShadows, borderRadius, spacing, typography } from "@/constants/theme";
import { derajatKeMataAngin } from "@/lib/bearing";

// Mock data for Padang coast
const MOCK_WEATHER = {
    suhu_c: 27.3,
    kelembapan_persen: 84,
    tekanan_hpa: 1010,
    uv_index: 3.1,
    presipitasi_mm: 0.0,
    probabilitas_presipitasi_persen: 10,
    kecepatan_angin_kmh: 14.2,
    arah_angin_derajat: 250,
    hembusan_angin_kmh: 22.5,
};

export default function WeatherPanel() {
    const w = MOCK_WEATHER;

    return (
        <View style={styles.panel}>
            <View style={styles.titleRow}>
                <Ionicons name="partly-sunny" size={22} color={colors.primary} />
                <Text style={styles.title}>Cuaca</Text>
            </View>

            <Text style={styles.desc}>
                Suhu udara dan kondisi angin permukaan. Angin di atas 20 km/h dapat membahayakan kapal kecil.
            </Text>

            <View style={styles.statusBox}>
                <Ionicons
                    name={w.kecepatan_angin_kmh < 20 ? "checkmark-circle" : "warning"}
                    size={18}
                    color={w.kecepatan_angin_kmh < 20 ? "#4CAF50" : colors.error}
                />
                <Text style={[styles.statusText, { color: w.kecepatan_angin_kmh < 20 ? "#4CAF50" : colors.error }]}>
                    {w.kecepatan_angin_kmh < 20
                        ? "Kondisi cerah, angin normal — aman untuk melaut"
                        : "Angin kencang — hati-hati jika melaut"}
                </Text>
            </View>

            {/* Large temperature */}
            <View style={styles.tempRow}>
                <Text style={styles.tempValue}>{w.suhu_c}°</Text>
                <Text style={styles.tempLabel}>Suhu udara</Text>
            </View>

            {/* Grid stats */}
            <View style={styles.grid}>
                <View style={styles.gridItem}>
                    <Ionicons name="water-outline" size={18} color={colors.primary} />
                    <Text style={styles.gridValue}>{w.kelembapan_persen}%</Text>
                    <Text style={styles.gridLabel}>Kelembapan</Text>
                </View>
                <View style={styles.gridItem}>
                    <Ionicons name="speedometer-outline" size={18} color={colors.primary} />
                    <Text style={styles.gridValue}>{w.tekanan_hpa}</Text>
                    <Text style={styles.gridLabel}>hPa</Text>
                </View>
                <View style={styles.gridItem}>
                    <Ionicons name="sunny-outline" size={18} color={colors.primary} />
                    <Text style={styles.gridValue}>{w.uv_index}</Text>
                    <Text style={styles.gridLabel}>UV Index</Text>
                </View>
                <View style={styles.gridItem}>
                    <Ionicons name="rainy-outline" size={18} color={colors.primary} />
                    <Text style={styles.gridValue}>{w.probabilitas_presipitasi_persen}%</Text>
                    <Text style={styles.gridLabel}>Hujan</Text>
                </View>
            </View>

            {/* Wind info */}
            <View style={styles.windRow}>
                <Ionicons name="navigate-outline" size={16} color={colors.onSurfaceVariant} />
                <Text style={styles.windText}>
                    Angin {w.kecepatan_angin_kmh} km/h {derajatKeMataAngin(w.arah_angin_derajat)} ({w.arah_angin_derajat}°), Hembusan {w.hembusan_angin_kmh} km/h
                </Text>
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
        flex: 1,
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
    tempRow: {
        alignItems: "center",
        marginBottom: spacing.md,
    },
    tempValue: {
        fontSize: 48,
        fontFamily: "Manrope_700Bold",
        color: colors.primary,
        lineHeight: 52,
    },
    tempLabel: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    gridItem: {
        width: "47%",
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: borderRadius.lg,
        padding: spacing.sm,
        alignItems: "center",
        gap: 4,
    },
    gridValue: {
        ...typography.labelMd,
        color: colors.onSurface,
    },
    gridLabel: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
    },
    windRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        padding: spacing.sm,
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: borderRadius.md,
    },
    windText: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
        flex: 1,
    },
});