// MeasureTool.tsx — Multi-point distance measurement + GPS sync button
// spec v2 section 7.9
// Buttons: fixed at bottom-right area
// Sync button above measure button, both with toast guides on first tap
// Location info shows beside buttons, auto-dismisses after 5s with close button

import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { colors, clayShadows, borderRadius, spacing, typography } from "@/constants/theme";
import { haversineKm } from "@/lib/haversine";
import { useNelayanStore } from "@/stores/nelayanStore";

interface MeasureToolProps {
    visible: boolean;
    onMeasureChange: (active: boolean) => void;
    measurePoints: { lat: number; lng: number }[];
    onClear: () => void;
    onClearAll?: () => void;
    nelayanLat?: number;
    nelayanLng?: number;
}

export default function MeasureTool({ visible, onMeasureChange, measurePoints, onClear, onClearAll, nelayanLat, nelayanLng }: MeasureToolProps) {
    const profile = useNelayanStore((s) => s.profile);

    const totalJarak = measurePoints.length >= 2
        ? measurePoints.slice(1).reduce((sum, p, i) =>
            sum + haversineKm(measurePoints[i].lat, measurePoints[i].lng, p.lat, p.lng),
            0)
        : 0;

    const bbmLiter = profile?.konsumsi_bbm_per_km
        ? totalJarak * profile.konsumsi_bbm_per_km
        : null;

    const jarakNm = totalJarak / 1.852;

    const [showGuide, setShowGuide] = useState(false);
    const [guideDismissed, setGuideDismissed] = useState(false);
    const [showLocGuide, setShowLocGuide] = useState(false);
    const [locGuideDismissed, setLocGuideDismissed] = useState(false);
    const [locating, setLocating] = useState(false);
    const [locInfo, setLocInfo] = useState<{ lat: number; lng: number; time: string } | null>(null);
    const locTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const FAB_BOTTOM = Dimensions.get("window").height * 0.12;

    const toggleMeasure = () => {
        if (!visible) {
            // Hide GPS guide toast when measure guide shows
            setShowLocGuide(false);
            if (!guideDismissed) {
                setShowGuide(true);
                setGuideDismissed(true);
            }
            if (measurePoints.length > 0) {
                onClear();
            }
        }
        onMeasureChange(!visible);
    };

    const clearLocInfo = () => {
        setLocInfo(null);
        if (locTimerRef.current) {
            clearTimeout(locTimerRef.current);
            locTimerRef.current = null;
        }
    };

    const handleLocate = async () => {
        // Hide measure guide toast when GPS guide shows
        setShowGuide(false);
        if (!locGuideDismissed) {
            setShowLocGuide(true);
            setLocGuideDismissed(true);
        }

        setLocating(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Izin Ditolak", "Aktifkan izin lokasi di pengaturan perangkat.");
                return;
            }
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
            const info = {
                lat: loc.coords.latitude,
                lng: loc.coords.longitude,
                time: `Diperbarui ${now}`,
            };
            setLocInfo(info);

            // Auto-dismiss after 5 seconds
            if (locTimerRef.current) clearTimeout(locTimerRef.current);
            locTimerRef.current = setTimeout(() => setLocInfo(null), 5000);
        } catch {
            Alert.alert("Gagal", "Tidak dapat mengakses lokasi. Pastikan GPS aktif.");
        } finally {
            setLocating(false);
        }
    };

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (locTimerRef.current) clearTimeout(locTimerRef.current);
        };
    }, []);

    useEffect(() => {
        if (showGuide) {
            const timer = setTimeout(() => setShowGuide(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showGuide]);

    useEffect(() => {
        if (showLocGuide) {
            const timer = setTimeout(() => setShowLocGuide(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showLocGuide]);

    return (
        <>
            {/* Loc info toast — positioned beside the buttons, to the left */}
            {locInfo && (
                <View style={[styles.locInfoToast, { bottom: FAB_BOTTOM + 75 }]}>
                    <View style={styles.locInfoContent}>
                        <Ionicons name="location" size={14} color={colors.primary} />
                        <Text style={styles.locInfoText}>
                            {locInfo.lat.toFixed(5)}°, {locInfo.lng.toFixed(5)}°
                        </Text>
                        <Text style={styles.locInfoTime}>{locInfo.time}</Text>
                    </View>
                    <View style={styles.toastClose} onTouchEnd={clearLocInfo}>
                        <Ionicons name="close" size={14} color={colors.onSurfaceVariant} />
                    </View>
                </View>
            )}

            {/* Sync location guide toast */}
            {showLocGuide && (
                <View style={[styles.locToast, { bottom: FAB_BOTTOM + 75, right: 72 }]}>
                    <View style={styles.toastContent}>
                        <Text style={styles.toastTitle}>Sinkronkan Posisi GPS</Text>
                        <Text style={styles.toastStep}>Tekan tombol GPS untuk memperbarui posisi Anda.</Text>
                        <Text style={styles.toastStep}>Posisi akan ditampilkan di samping tombol.</Text>
                    </View>
                    <View style={styles.toastClose} onTouchEnd={() => setShowLocGuide(false)}>
                        <Ionicons name="close" size={16} color={colors.onSurfaceVariant} />
                    </View>
                </View>
            )}

            {/* Measure guide toast */}
            {showGuide && (
                <View style={[styles.guideToast, { bottom: FAB_BOTTOM, right: 72 }]}>
                    <View style={styles.toastContent}>
                        <Text style={styles.toastTitle}>Mode Ukur Aktif</Text>
                        <Text style={styles.toastStep}>1. Tap peta untuk titik pertama</Text>
                        <Text style={styles.toastStep}>2. Tap lagi untuk titik berikutnya</Text>
                        <Text style={styles.toastStep}>3. Lihat hasil di bawah</Text>
                    </View>
                    <View style={styles.toastClose} onTouchEnd={() => setShowGuide(false)}>
                        <Ionicons name="close" size={16} color={colors.onSurfaceVariant} />
                    </View>
                </View>
            )}

            {/* Measure result panel */}
            {visible && measurePoints.length >= 2 && (
                <View style={[styles.resultPanel, { bottom: FAB_BOTTOM, right: 72 }]}>
                    <Text style={styles.resultTitle}>{measurePoints.length} Titik</Text>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Jarak</Text>
                        <Text style={styles.resultValue}>{totalJarak.toFixed(1)} km</Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Mil Laut</Text>
                        <Text style={styles.resultValue}>{jarakNm.toFixed(1)} nm</Text>
                    </View>
                    {bbmLiter != null && (
                        <>
                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>BBM</Text>
                                <Text style={styles.resultValue}>{bbmLiter.toFixed(1)} L</Text>
                            </View>
                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>BBM PP</Text>
                                <Text style={styles.resultValue}>{(bbmLiter * 2).toFixed(1)} L</Text>
                            </View>
                        </>
                    )}
                    <View style={styles.resultActions}>
                        <View style={styles.actionBtn} onTouchEnd={onClear}>
                            <Ionicons name="trash-outline" size={12} color={colors.error} />
                            <Text style={styles.actionText}>Hapus</Text>
                        </View>
                        {onClearAll && (
                            <View style={styles.closeBtn} onTouchEnd={onClearAll}>
                                <Ionicons name="close" size={14} color={colors.onSurfaceVariant} />
                            </View>
                        )}
                    </View>
                </View>
            )}

            {/* Sync location button */}
            <View style={[styles.syncContainer, { bottom: FAB_BOTTOM + 75 }]}>
                <View style={styles.syncFabBtn} onTouchEnd={handleLocate}>
                    <Ionicons name="locate" size={22} color={colors.primary} />
                </View>
                <Text style={styles.syncFabLabel}>GPS</Text>
            </View>

            {/* Measure button */}
            <View style={[styles.fabContainer, { bottom: FAB_BOTTOM }]}>
                <View
                    style={[styles.fabBtn, visible && styles.fabBtnActive]}
                    onTouchEnd={toggleMeasure}
                >
                    <Ionicons name="analytics" size={22} color={visible ? colors.onPrimary : colors.primary} />
                </View>
                <Text style={[styles.fabLabel, visible && styles.fabLabelActive]}>Ukur</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    fabContainer: {
        position: "absolute",
        right: 16,
        zIndex: 50,
        alignItems: "center",
    },
    fabBtn: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "rgba(255,255,255,0.92)",
        alignItems: "center",
        justifyContent: "center",
        ...clayShadows.buttonSecondary,
    },
    fabBtnActive: { backgroundColor: colors.primary },
    fabLabel: { ...typography.labelSm, color: colors.primary, fontSize: 10, marginTop: 2 },
    fabLabelActive: { color: colors.onPrimary },

    syncContainer: {
        position: "absolute",
        right: 16,
        zIndex: 50,
        alignItems: "center",
    },
    syncFabBtn: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "rgba(255,255,255,0.92)",
        alignItems: "center",
        justifyContent: "center",
        ...clayShadows.buttonSecondary,
    },
    syncFabLabel: { ...typography.labelSm, color: colors.primary, fontSize: 10, marginTop: 2 },

    guideToast: {
        position: "absolute",
        right: 16,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.sm,
        width: 200,
        flexDirection: "row",
        alignItems: "flex-start",
        zIndex: 50,
        ...clayShadows.card,
    },
    toastContent: { flex: 1 },
    toastTitle: { ...typography.labelMd, color: colors.primary, marginBottom: 4, fontSize: 13 },
    toastStep: { ...typography.labelSm, color: colors.onSurface, marginBottom: 3, lineHeight: 15, fontSize: 11 },
    toastClose: { padding: 2, marginLeft: spacing.xs },

    locToast: {
        position: "absolute",
        right: 16,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.sm,
        width: 200,
        flexDirection: "row",
        alignItems: "flex-start",
        zIndex: 50,
        ...clayShadows.card,
    },

    // Location info toast — shows to the LEFT of the buttons
    locInfoToast: {
        position: "absolute",
        right: 72, // snug beside buttons: 16 + 52 + 4px gap
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.sm,
        width: 180,
        flexDirection: "row",
        alignItems: "center",
        zIndex: 50,
        ...clayShadows.card,
    },
    locInfoContent: {
        flex: 1,
        alignItems: "flex-start",
        gap: 2,
    },
    locInfoText: { ...typography.labelSm, color: colors.primary, fontSize: 11 },
    locInfoTime: { ...typography.labelSm, color: colors.onSurfaceVariant, fontSize: 9 },

    resultPanel: {
        position: "absolute",
        right: 16,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.sm,
        width: 130,
        zIndex: 50,
        ...clayShadows.card,
    },
    resultTitle: {
        ...typography.labelSm,
        color: colors.primary,
        textAlign: "center",
        fontWeight: "700",
        marginBottom: 6,
        fontSize: 11,
    },
    resultRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 2,
    },
    resultLabel: { ...typography.labelSm, color: colors.onSurfaceVariant, fontSize: 10 },
    resultValue: { ...typography.labelMd, color: colors.primary, fontSize: 11 },
    resultActions: { flexDirection: "row", justifyContent: "center", marginTop: 6 },
    actionBtn: {
        flexDirection: "row", alignItems: "center", gap: 4,
        paddingHorizontal: 10, paddingVertical: 4,
        borderRadius: borderRadius.sm, backgroundColor: colors.errorContainer,
    },
    actionText: { ...typography.labelSm, color: colors.error, fontSize: 10 },
    closeBtn: {
        padding: 6,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.surfaceContainerLow,
    },
});
