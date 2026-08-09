import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, borderRadius, typography } from "@/constants/theme";
import { useNelayanStore } from "@/stores/nelayanStore";
import { useSyncStore } from "@/stores/syncStore";
import { formatTanggalSync } from "@/lib/geoUtils";
import apiFetch from "@/lib/apiClient";
import { ZonaRekomendasiResponse, ZonaRekomendasi } from "@/types/api";
import { POSISI_LAUT_DEFAULT, DEFAULT_RADIUS_KM } from "@/constants/config";
import { derajatKeMataAngin } from "@/lib/bearing";
import MapViewWrapper from "@/features/peta/components/MapViewWrapper";
import MeasureTool from "@/features/peta/components/MeasureTool";
import BottomSheet, { BottomSheetHandle } from "@/components/BottomSheet";
import DashboardContent from "@/features/beranda/components/DashboardContent";
import { usePetaStore } from "@/stores/petaStore";

// Fixed fisherman position (Ulak Karang Utara, Padang)
const NELAYAN_LAT = -0.904949;
const NELAYAN_LNG = 100.345834;

export default function BerandaScreen() {
    const insets = useSafeAreaInsets();
    const profile = useNelayanStore((s) => s.profile);
    const { isOnline, lastSyncAt } = useSyncStore();
    const [zonaData, setZonaData] = useState<ZonaRekomendasiResponse | null>(null);
    const [snapIndex, setSnapIndex] = useState(0);
    const [heading] = useState(315);
    const [highlightZona, setHighlightZona] = useState<{ lat: number; lng: number } | null>(null);
    const bottomSheetRef = useRef<BottomSheetHandle>(null);

    const measureMode = usePetaStore((s) => s.measureMode);
    const measurePoints = usePetaStore((s) => s.measurePoints);
    const setMeasureMode = usePetaStore((s) => s.setMeasureMode);
    const addMeasurePoint = usePetaStore((s) => s.addMeasurePoint);
    const clearMeasurePoints = usePetaStore((s) => s.clearMeasurePoints);
    const setTargetZona = usePetaStore((s) => s.setTargetZona);

    const handleMapPress = (lat: number, lng: number) => {
        if (measureMode) {
            addMeasurePoint({ lat, lng });
        }
    };

    const handleSelectZona = (zona: ZonaRekomendasi) => {
        // Collapse BottomSheet immediately via ref
        bottomSheetRef.current?.snapTo(0);

        // Clear previous state
        clearMeasurePoints();
        setHighlightZona(null);

        // Small delay to let BottomSheet animate down, then auto-measure
        setTimeout(() => {
            // Activate measure mode
            setMeasureMode(true);

            // Point 1: Fisherman position (fixed)
            addMeasurePoint({ lat: NELAYAN_LAT, lng: NELAYAN_LNG });

            // Point 2: Zona center (from tapped card)
            addMeasurePoint({ lat: zona.lat, lng: zona.lng });

            // Set target zona for map tracking
            setTargetZona(zona.id, zona.lat, zona.lng);

            // Highlight the zona area
            setHighlightZona({ lat: zona.lat, lng: zona.lng });
        }, 400);
    };

    const handleClearAll = () => {
        clearMeasurePoints();
        setMeasureMode(false);
        setHighlightZona(null);
        setTargetZona(null, null, null);
    };

    const fetchZona = async () => {
        if (!profile) return;
        try {
            const data = await apiFetch<ZonaRekomendasiResponse>(
                `/zona-rekomendasi?lat=${POSISI_LAUT_DEFAULT.lat}&lng=${POSISI_LAUT_DEFAULT.lng}&radius_km=${DEFAULT_RADIUS_KM}&konsumsi_bbm_per_km=${profile.konsumsi_bbm_per_km}`
            );
            setZonaData(data);
        } catch {
            // Offline or server unavailable
        }
    };

    useEffect(() => {
        fetchZona();
    }, [profile?.id]);

    const arahHeading = derajatKeMataAngin(heading);

    return (
        <View style={styles.container}>
            {/* Full-screen Map — no shipLat/shipLng so camera stays fixed */}
            <MapViewWrapper
                onPressMap={handleMapPress}
                highlightZona={highlightZona}
            />

            {/* Top-left: Mini Compass overlay (safe area aware) */}
            <View style={[styles.compassOverlay, { top: insets.top + 12 }]}>
                <View style={styles.compassCircle}>
                    <View style={[styles.needle, { transform: [{ rotate: `${heading}deg` }] }]} />
                    <Text style={[styles.compassLabel, { position: "absolute", top: 1 }]}>U</Text>
                    <Text style={[styles.compassLabel, { position: "absolute", right: 1, top: "40%" }]}>T</Text>
                    <Text style={[styles.compassLabel, { position: "absolute", bottom: 1 }]}>S</Text>
                    <Text style={[styles.compassLabel, { position: "absolute", left: 1, top: "40%" }]}>B</Text>
                </View>
                <Text style={styles.compassInfo}>{heading}° {arahHeading}</Text>
            </View>

            {/* Top-right: Info chips (safe area aware) */}
            <View style={[styles.chipOverlay, { top: insets.top + 12 }]}>
                <View style={styles.chip}>
                    <Ionicons name="water-outline" size={14} color={colors.primary} />
                    <Text style={styles.chipText}>1.2m</Text>
                </View>
                <View style={styles.chip}>
                    <Ionicons name="thermometer-outline" size={14} color={colors.primary} />
                    <Text style={styles.chipText}>27°C</Text>
                </View>
                <View style={styles.chip}>
                    <Ionicons name="pulse-outline" size={14} color={colors.primary} />
                    <Text style={styles.chipText}>1.8m</Text>
                </View>
            </View>

            {/* Offline indicator */}
            {!isOnline && lastSyncAt && (
                <View style={styles.offlineBar}>
                    <Ionicons name="cloud-offline" size={14} color={colors.onSurfaceVariant} />
                    <Text style={styles.offlineText}>
                        Offline, {formatTanggalSync(lastSyncAt)}
                    </Text>
                </View>
            )}

            {/* Measure Tool (right side, below chips) */}
            <MeasureTool
                visible={measureMode}
                onMeasureChange={setMeasureMode}
                measurePoints={measurePoints}
                onClear={clearMeasurePoints}
                onClearAll={handleClearAll}
                nelayanLat={NELAYAN_LAT}
                nelayanLng={NELAYAN_LNG}
            />

            {/* Bottom Sheet */}
            <BottomSheet ref={bottomSheetRef} snapPoints={[0.18, 0.92]} initialSnap={0} onSnapChange={setSnapIndex}>
                <DashboardContent
                    snapIndex={snapIndex}
                    zonaData={zonaData}
                    onSelectZona={handleSelectZona}
                />
            </BottomSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    compassOverlay: {
        position: "absolute",
        left: 16,
        backgroundColor: "rgba(255,255,255,0.92)",
        borderRadius: borderRadius.lg,
        padding: 8,
        alignItems: "center",
    },
    compassCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    needle: {
        width: 2,
        height: 18,
        backgroundColor: colors.error,
        position: "absolute",
        top: 4,
    },
    compassLabel: {
        fontSize: 8,
        color: colors.onSurfaceVariant,
        fontWeight: "600",
    },
    compassInfo: {
        ...typography.labelSm,
        color: colors.primary,
        fontSize: 9,
        marginTop: 4,
    },
    chipOverlay: {
        position: "absolute",
        right: 16,
        gap: 6,
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(255,255,255,0.92)",
        borderRadius: borderRadius.full,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    chipText: {
        ...typography.labelSm,
        color: colors.primary,
        fontSize: 10,
    },
    offlineBar: {
        position: "absolute",
        top: 4,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        backgroundColor: colors.surfaceContainerHigh,
        paddingVertical: 4,
        zIndex: 20,
    },
    offlineText: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
        fontSize: 11,
    },
});