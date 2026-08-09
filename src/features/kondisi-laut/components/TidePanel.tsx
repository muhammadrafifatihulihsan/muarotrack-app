// TidePanel.tsx — Mock tide chart (spec v2 section 7.5)
// Real data: TideCheck API via backend cache

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, clayShadows, borderRadius, spacing, typography } from "@/constants/theme";

// Mock data for Padang coast
const MOCK_TIDE = {
    items: [
        { waktu: "04:00", tinggi_m: 0.3, tipe: "surut" },
        { waktu: "06:00", tinggi_m: 0.7, tipe: "sampel" },
        { waktu: "08:00", tinggi_m: 1.2, tipe: "sampel" },
        { waktu: "10:00", tinggi_m: 1.6, tipe: "pasang" },
        { waktu: "12:00", tinggi_m: 1.8, tipe: "pasang" },
        { waktu: "14:00", tinggi_m: 1.5, tipe: "sampel" },
        { waktu: "16:00", tinggi_m: 1.0, tipe: "sampel" },
        { waktu: "18:00", tinggi_m: 0.5, tipe: "surut" },
        { waktu: "20:00", tinggi_m: 0.3, tipe: "surut" },
        { waktu: "22:00", tinggi_m: 0.6, tipe: "sampel" },
    ],
    pasangBerikutnya: { waktu: "11:40", tinggi_m: 1.8 },
    surutBerikutnya: { waktu: "05:12", tinggi_m: 0.3 },
};

export default function TidePanel() {
    const t = MOCK_TIDE;
    const maxTinggi = 2.0;

    const isRising = t.items[t.items.length - 1].tinggi_m > t.items[0].tinggi_m;
    const isAccessible = t.pasangBerikutnya.tinggi_m > 1.0;

    return (
        <View style={styles.panel}>
            <View style={styles.titleRow}>
                <Ionicons name="pulse" size={22} color={colors.primary} />
                <Text style={styles.title}>Pasang Surut</Text>
            </View>

            <Text style={styles.desc}>
                Pasang surut mempengaruhi akses keluar-masuk muara. Pasang tinggi memudahkan kapal keluar, surut rendah menyulitkan.
            </Text>

            <View style={styles.statusBox}>
                <Ionicons
                    name={isAccessible ? "checkmark-circle" : "warning"}
                    size={18}
                    color={isAccessible ? "#4CAF50" : colors.error}
                />
                <Text style={[styles.statusText, { color: isAccessible ? "#4CAF50" : colors.error }]}>
                    {isAccessible
                        ? "Akses muara cukup — pasang tinggi memudahkan kapal keluar"
                        : "Akses muara terbatas — tunggu pasang naik"}
                </Text>
            </View>

            {/* Status ringkasan */}
            <View style={styles.statusRow}>
                <View style={styles.statusItem}>
                    <Ionicons
                        name="arrow-up-circle"
                        size={24}
                        color={isRising ? colors.primary : colors.onSurfaceVariant}
                    />
                    <Text style={styles.statusLabel}>
                        {isRising ? "Pasang naik" : "Surut turun"}
                    </Text>
                </View>
                <View style={styles.statusItem}>
                    <Text style={styles.statusValue}>Pasang</Text>
                    <Text style={styles.statusSub}>
                        {t.pasangBerikutnya.waktu} ({t.pasangBerikutnya.tinggi_m}m)
                    </Text>
                </View>
                <View style={styles.statusItem}>
                    <Text style={styles.statusValue}>Surut</Text>
                    <Text style={styles.statusSub}>
                        {t.surutBerikutnya.waktu} ({t.surutBerikutnya.tinggi_m}m)
                    </Text>
                </View>
            </View>

            {/* Tide curve */}
            <View style={styles.chartContainer}>
                <View style={styles.yAxis}>
                    <Text style={styles.yLabel}>{maxTinggi.toFixed(1)}</Text>
                    <Text style={styles.yLabel}>{(maxTinggi / 2).toFixed(1)}</Text>
                    <Text style={styles.yLabel}>0</Text>
                </View>
                <View style={styles.curveArea}>
                    {t.items.map((p, i) => (
                        <View key={i} style={styles.curvePoint}>
                            <View style={[
                                styles.dot,
                                p.tipe === "pasang"
                                    ? styles.pasangDot
                                    : p.tipe === "surut"
                                        ? styles.surutDot
                                        : styles.sampleDot,
                            ]} />
                            <View style={[
                                styles.heightBar,
                                { height: (p.tinggi_m / maxTinggi) * 80 },
                            ]} />
                            <Text style={styles.xLabel}>
                                {i % 2 === 0 ? p.waktu : ""}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Disclaimer */}
            <Text style={styles.disclaimer}>
                Data untuk informasi, bukan untuk navigasi
            </Text>
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
        marginBottom: spacing.sm,
    },
    statusText: {
        ...typography.labelSm,
        fontWeight: "600",
        flex: 1,
    },
    statusRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: spacing.sm,
        paddingVertical: spacing.xs,
    },
    statusItem: {
        alignItems: "center",
        flex: 1,
    },
    statusLabel: {
        ...typography.labelSm,
        color: colors.primary,
        marginTop: 4,
    },
    statusValue: {
        ...typography.labelMd,
        color: colors.primary,
    },
    statusSub: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
        marginTop: 2,
    },
    chartContainer: {
        flexDirection: "row",
        height: 110,
        marginBottom: spacing.xs,
    },
    yAxis: {
        justifyContent: "space-between",
        paddingRight: 4,
        width: 28,
    },
    yLabel: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
        fontSize: 9,
        textAlign: "right",
    },
    curveArea: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end",
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.outlineVariant,
    },
    curvePoint: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginBottom: 2,
    },
    pasangDot: {
        backgroundColor: colors.primary,
    },
    surutDot: {
        backgroundColor: colors.error,
    },
    sampleDot: {
        backgroundColor: colors.outline,
    },
    heightBar: {
        width: 3,
        backgroundColor: "rgba(61,94,132,0.2)",
        borderRadius: 1,
        position: "absolute",
        bottom: 0,
    },
    xLabel: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
        fontSize: 8,
        marginTop: 4,
        height: 14,
    },
    disclaimer: {
        ...typography.labelSm,
        color: colors.error,
        fontStyle: "italic",
        textAlign: "center",
        marginTop: spacing.xs,
    },
});