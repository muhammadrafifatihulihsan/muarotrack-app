import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, clayShadows, borderRadius, spacing, typography } from "@/constants/theme";

// Mock trip history data
const MOCK_TRIPS = [
    {
        id: "1",
        tanggal: "8 Agu 2026",
        waktu: "06:30 - 14:00",
        jenisIkan: "Tongkol",
        estimasiKg: 25.5,
        jarakKm: 18.2,
        bbmLiter: 14.5,
    },
    {
        id: "2",
        tanggal: "6 Agu 2026",
        waktu: "05:00 - 13:00",
        jenisIkan: "Kembung",
        estimasiKg: 18.0,
        jarakKm: 15.8,
        bbmLiter: 12.0,
    },
    {
        id: "3",
        tanggal: "4 Agu 2026",
        waktu: "06:00 - 11:30",
        jenisIkan: "Tongkol + Layur",
        estimasiKg: 32.0,
        jarakKm: 22.5,
        bbmLiter: 18.0,
    },
];

export default function RiwayatScreen() {
    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: colors.background }}
            contentContainerStyle={{ padding: spacing.md }}
        >
            <Text style={[typography.headlineMd, { color: colors.onSurface, marginBottom: spacing.sm }]}>
                Riwayat Trip
            </Text>
            <Text style={[typography.bodyMd, { color: colors.onSurfaceVariant, marginBottom: spacing.lg }]}>
                Riwayat laporan tangkapan, prediksi vs aktual BBM, dan SOS aktif.
            </Text>

            {MOCK_TRIPS.map((trip) => (
                <View key={trip.id} style={styles.tripCard}>
                    <View style={styles.tripHeader}>
                        <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                        <Text style={styles.tripDate}>{trip.tanggal}</Text>
                        <Text style={styles.tripTime}>{trip.waktu}</Text>
                    </View>

                    <View style={styles.tripBody}>
                        <View style={styles.tripStat}>
                            <Ionicons name="fish-outline" size={18} color={colors.primary} />
                            <View>
                                <Text style={styles.statValue}>{trip.jenisIkan}</Text>
                                <Text style={styles.statLabel}>{trip.estimasiKg.toFixed(1)} kg</Text>
                            </View>
                        </View>

                        <View style={styles.tripStat}>
                            <Ionicons name="map-outline" size={18} color={colors.primary} />
                            <View>
                                <Text style={styles.statValue}>{trip.jarakKm.toFixed(1)} km</Text>
                                <Text style={styles.statLabel}>Jarak tempuh</Text>
                            </View>
                        </View>

                        <View style={styles.tripStat}>
                            <Ionicons name="speedometer-outline" size={18} color={colors.primary} />
                            <View>
                                <Text style={styles.statValue}>{trip.bbmLiter.toFixed(1)} L</Text>
                                <Text style={styles.statLabel}>BBM digunakan</Text>
                            </View>
                        </View>
                    </View>
                </View>
            ))}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    tripCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius["2xl"],
        padding: spacing.md,
        marginBottom: spacing.sm,
        ...clayShadows.card,
    },
    tripHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: spacing.sm,
        paddingBottom: spacing.sm,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.outlineVariant,
    },
    tripDate: {
        ...typography.labelMd,
        color: colors.primary,
        flex: 1,
    },
    tripTime: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
    },
    tripBody: {
        gap: spacing.sm,
    },
    tripStat: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },
    statValue: {
        ...typography.labelMd,
        color: colors.onSurface,
    },
    statLabel: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
    },
    footer: {
        marginTop: spacing.md,
        alignItems: "center",
        padding: spacing.md,
    },
    footerText: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
        textAlign: "center",
    },
});