// DashboardContent.tsx — All dashboard panels for BottomSheet
// Single unified view: no conditional snap rendering, no delay

import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, clayShadows, borderRadius, spacing, typography } from "@/constants/theme";
import { ZonaRekomendasiResponse, ZonaRekomendasi } from "@/types/api";
import WavePanel from "@/features/kondisi-laut/components/WavePanel";
import WeatherPanel from "@/features/kondisi-laut/components/WeatherPanel";
import TidePanel from "@/features/kondisi-laut/components/TidePanel";
import AktivitasIkanPanel from "@/features/solunar/components/AktivitasIkanPanel";
import SunMoonPanel from "@/features/solunar/components/SunMoonPanel";
import { POSISI_LAUT_DEFAULT } from "@/constants/config";

interface DashboardContentProps {
    snapIndex: number;
    zonaData: ZonaRekomendasiResponse | null;
    onSelectZona?: (zona: ZonaRekomendasi) => void;
}

export default function DashboardContent({ snapIndex, zonaData, onSelectZona }: DashboardContentProps) {
    return (
        <ScrollView
            style={styles.fullContent}
            contentContainerStyle={{ paddingTop: 0, paddingHorizontal: spacing.md, paddingBottom: 200 }}
            scrollEnabled={snapIndex >= 1}
        >
            {/* Header: always visible preview + hint */}
            <View style={styles.header}>
                {zonaData && zonaData.zonas.length > 0 ? (
                    <View style={styles.previewRow}>
                        <Ionicons name="compass" size={18} color={colors.primary} />
                        <Text style={styles.previewText}>
                            Zona terbaik: {zonaData.zonas[0].jarak_km?.toFixed(1)} km, {(zonaData.zonas[0].skor * 100).toFixed(0)}%
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.previewText}>Memuat data zona...</Text>
                )}
                <Text style={styles.hint}>Geser ke atas untuk detail lengkap</Text>
            </View>

            {/* Zona Rekomendasi */}
            <Text style={styles.sectionTitle}>Zona Rekomendasi</Text>
            <Text style={styles.sectionDesc}>
                Skor dihitung dari suhu laut, klorofil, kekeruhan, kedalaman, fase bulan, dan jarak muara. Semakin tinggi skor, semakin potensial lokasi tangkapan.
            </Text>

            {/* Status indicator for zona */}
            {(() => {
                if (!zonaData || zonaData.zonas.length === 0) {
                    return (
                        <View style={styles.statusBox}>
                            <Ionicons name="sync-outline" size={18} color={colors.onSurfaceVariant} />
                            <Text style={[styles.statusText, { color: colors.onSurfaceVariant }]}>
                                Menunggu data zona...
                            </Text>
                        </View>
                    );
                }

                const bestScore = zonaData.zonas[0].skor;
                const isGood = bestScore > 0.6;
                const isOk = bestScore >= 0.3;

                let icon: "checkmark-circle" | "warning" = "checkmark-circle";
                let statusColor = "#4CAF50";
                let message = "";

                if (isGood) {
                    icon = "checkmark-circle";
                    statusColor = "#4CAF50";
                    message = "Tersedia zona rekomendasi — peluang tangkapan baik";
                } else if (isOk) {
                    icon = "checkmark-circle";
                    statusColor = "#4CAF50";
                    message = "Zona rekomendasi tersedia";
                } else {
                    icon = "warning";
                    statusColor = "#FF9800";
                    message = "Zona terbatas — tetap waspada";
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

            {zonaData && zonaData.zonas.length > 0 ? (
                zonaData.zonas.slice(0, 5).map((z) => (
                    <TouchableOpacity
                        key={z.id}
                        style={styles.zonaCard}
                        activeOpacity={0.7}
                        onPress={() => onSelectZona?.(z)}
                    >
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={styles.zonaRank}>#{z.peringkat}</Text>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                                <Text style={styles.zonaScore}>{(z.skor * 100).toFixed(0)}%</Text>
                                <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                            </View>
                        </View>
                        {z.jarak_km != null && (
                            <Text style={styles.zonaInfo}>
                                Jarak: {z.jarak_km.toFixed(1)} km
                                {z.estimasi_bbm_liter != null ? `, BBM: ${z.estimasi_bbm_liter.toFixed(1)} L (sekali jalan)` : ""}
                            </Text>
                        )}
                        {z.terdampak_sedimen && (
                            <Text style={styles.sedimenText}>{z.catatan_sedimen ?? "Area terdampak sedimen"}</Text>
                        )}
                        <Text style={styles.tapHint}>Tap untuk lihat di peta →</Text>
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={styles.emptyText}>Memuat data zona...</Text>
            )}

            {/* Kondisi Laut */}
            <Text style={styles.sectionTitle}>Kondisi Laut</Text>
            <WavePanel />
            <WeatherPanel />
            <TidePanel />

            {/* Aktivitas Ikan */}
            <Text style={styles.sectionTitle}>Aktivitas Ikan</Text>
            <AktivitasIkanPanel lat={POSISI_LAUT_DEFAULT.lat} lng={POSISI_LAUT_DEFAULT.lng} />

            {/* Matahari & Bulan */}
            <Text style={styles.sectionTitle}>Matahari & Bulan</Text>
            <SunMoonPanel lat={POSISI_LAUT_DEFAULT.lat} lng={POSISI_LAUT_DEFAULT.lng} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    fullContent: {
        flex: 1,
    },
    header: {
        paddingTop: 0,
        paddingBottom: spacing.md,
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: colors.outlineVariant,
        marginBottom: spacing.sm,
    },
    previewRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 2,
    },
    previewText: {
        ...typography.labelMd,
        color: colors.primary,
    },
    hint: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
    },
    sectionTitle: {
        ...typography.headlineMd,
        color: colors.onSurface,
        marginBottom: spacing.xs,
        marginTop: spacing.sm,
    },
    sectionDesc: {
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
    zonaCard: {
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.sm,
        ...clayShadows.card,
    },
    zonaRank: {
        ...typography.labelMd,
        color: colors.onSurface,
    },
    zonaScore: {
        ...typography.headlineMd,
        color: colors.primary,
    },
    zonaInfo: {
        ...typography.bodyMd,
        color: colors.onSurfaceVariant,
        marginTop: spacing.xs,
    },
    sedimenText: {
        ...typography.labelSm,
        color: colors.error,
        marginTop: spacing.xs,
    },
    emptyText: {
        ...typography.bodyMd,
        color: colors.onSurfaceVariant,
        marginBottom: spacing.lg,
    },
    tapHint: {
        ...typography.labelSm,
        color: colors.primary,
        marginTop: spacing.xs,
        fontSize: 10,
    },
});