import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useNelayanStore } from "@/stores/nelayanStore";
import { useSyncStore } from "@/stores/syncStore";
import { runSync } from "@/lib/sync";
import { colors, clayShadows, borderRadius, spacing, typography } from "@/constants/theme";
import CustomAlert from "@/components/CustomAlert";
import SosButton from "@/features/sos/components/SosButton";

export default function ProfilScreen() {
    const router = useRouter();
    const profile = useNelayanStore((s) => s.profile);
    const clearProfile = useNelayanStore((s) => s.clearProfile);
    const { isOnline, lastSyncAt, isSyncing, setSyncing, setLastSync } = useSyncStore();
    const [syncManual, setSyncManual] = useState(false);
    const [currentLoc, setCurrentLoc] = useState<{ lat: number; lng: number; time: string } | null>(null);
    const [locating, setLocating] = useState(false);

    // CustomAlert states
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{
        title: string;
        message: string;
        icon?: string;
        buttons: Array<{ text: string; style?: "default" | "destructive" | "cancel"; onPress: () => void }>;
    }>({ title: "", message: "", buttons: [] });

    const showAlert = (
        title: string,
        message: string,
        icon?: string,
        buttons?: Array<{ text: string; style?: "default" | "destructive" | "cancel"; onPress: () => void }>
    ) => {
        setAlertConfig({
            title,
            message,
            icon,
            buttons: buttons || [{ text: "OK", onPress: () => setAlertVisible(false) }],
        });
        setAlertVisible(true);
    };

    const handleSyncNow = async () => {
        if (!isOnline) {
            showAlert("Offline", "Tidak dapat menyinkronkan saat offline. Sambungkan ke internet terlebih dahulu.", "cloud-offline");
            return;
        }
        setSyncManual(true);
        setSyncing(true);
        try {
            const result = await runSync();
            setLastSync(new Date().toISOString());
            showAlert(
                "Sinkronisasi Selesai",
                `Laporan: ${result.laporanSynced}, Titik: ${result.titikFavoritSynced}, SOS: ${result.sosSynced}`,
                "cloud-done"
            );
        } catch {
            showAlert("Gagal", "Sinkronisasi gagal. Coba lagi.", "close-circle");
        } finally {
            setSyncing(false);
            setSyncManual(false);
        }
    };

    const handleLocate = async () => {
        setLocating(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                showAlert("Izin Ditolak", "Aktifkan izin lokasi di pengaturan perangkat.", "location-outline");
                return;
            }
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
            setCurrentLoc({
                lat: loc.coords.latitude,
                lng: loc.coords.longitude,
                time: `Diperbarui ${now}`,
            });
        } catch {
            showAlert("Gagal", "Tidak dapat mengakses lokasi. Pastikan GPS aktif.", "close-circle");
        } finally {
            setLocating(false);
        }
    };

    const handleLogout = () => {
        showAlert(
            "Keluar",
            "Data kapal akan terhapus dari perangkat ini.",
            "exit-outline",
            [
                { text: "Batal", style: "cancel", onPress: () => { } },
                {
                    text: "Keluar",
                    style: "destructive",
                    onPress: () => {
                        clearProfile();
                        router.replace("/onboarding");
                    },
                },
            ]
        );
    };

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: colors.background }}
            contentContainerStyle={{ padding: spacing.md }}
        >
            {/* Profil Kapal */}
            <Text style={[typography.headlineMd, { color: colors.onSurface, marginBottom: spacing.lg }]}>
                Profil Kapal
            </Text>

            <View style={styles.card}>
                <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>Nama</Text>
                    <Text style={styles.cardValue}>{profile?.nama ?? "-"}</Text>
                </View>
                <View style={[styles.cardRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.cardLabel}>Konsumsi BBM</Text>
                    <Text style={styles.cardValue}>
                        {profile?.konsumsi_bbm_per_km?.toFixed(2) ?? "-"} L/km
                    </Text>
                </View>
            </View>

            {/* Status Sinkronisasi */}
            <Text style={[typography.headlineMd, { color: colors.onSurface, marginBottom: spacing.sm, marginTop: spacing.md }]}>
                Status Sinkronisasi
            </Text>
            <View style={styles.card}>
                <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>Status</Text>
                    <View style={styles.statusBadge}>
                        <Ionicons
                            name={isOnline ? "cloud-done" : "cloud-offline"}
                            size={16}
                            color={isOnline ? colors.primary : colors.error}
                        />
                        <Text style={[styles.statusText, { color: isOnline ? colors.primary : colors.error }]}>
                            {isOnline ? "Online" : "Offline"}
                        </Text>
                    </View>
                </View>
                {lastSyncAt && (
                    <View style={[styles.cardRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.cardLabel}>Sinkron terakhir</Text>
                        <Text style={styles.cardValueSm}>
                            {new Date(lastSyncAt).toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta" })}
                        </Text>
                    </View>
                )}
                <View style={styles.syncBtn} onTouchEnd={handleSyncNow}>
                    <Ionicons name="sync" size={18} color={colors.onPrimary} />
                    <Text style={styles.syncBtnText}>
                        {isSyncing ? "Menyinkronkan..." : "Sinkronkan Data"}
                    </Text>
                </View>
                <View style={styles.locBtn} onTouchEnd={handleLocate}>
                    <Ionicons name="locate" size={18} color={colors.primary} />
                    <Text style={styles.locBtnText}>
                        {locating ? "Mencari..." : "Perbarui Lokasi"}
                    </Text>
                </View>
                {currentLoc && (
                    <View style={styles.locInfo}>
                        <Text style={styles.locCoords}>
                            {currentLoc.lat.toFixed(5)}°, {currentLoc.lng.toFixed(5)}°
                        </Text>
                        <Text style={styles.locTime}>{currentLoc.time}</Text>
                    </View>
                )}
            </View>

            {/* Tile Peta Offline */}
            <Text style={[typography.headlineMd, { color: colors.onSurface, marginBottom: spacing.sm, marginTop: spacing.md }]}>
                Tile Peta Offline
            </Text>
            <View style={styles.card}>
                <Text style={styles.tileDesc}>
                    Unduh tile peta untuk digunakan tanpa internet.{"\n"}
                    Area: Padang nearshore (3 titik muara)
                </Text>
                <View
                    style={styles.downloadBtn}
                    onTouchEnd={() => showAlert("Info", "Unduh tile peta melalui pengaturan MapLibre.", "download-outline")}
                >
                    <Ionicons name="download-outline" size={20} color={colors.primary} />
                    <Text style={styles.downloadBtnText}>Unduh Tile Offline</Text>
                </View>
            </View>

            {/* SOS Button */}
            <SosButton compact={false} />

            {/* Logout */}
            <View style={styles.logoutBtn} onTouchEnd={handleLogout}>
                <Ionicons name="exit-outline" size={20} color={colors.onErrorContainer} />
                <Text style={styles.logoutText}>Hapus Data & Keluar</Text>
            </View>

            {/* Custom Alert */}
            <CustomAlert
                visible={alertVisible}
                title={alertConfig.title}
                message={alertConfig.message}
                icon={alertConfig.icon as any}
                buttons={alertConfig.buttons}
                onClose={() => setAlertVisible(false)}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius["2xl"],
        padding: spacing.lg,
        marginBottom: spacing.sm,
        ...clayShadows.card,
    },
    cardRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: spacing.sm,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.outlineVariant,
    },
    cardLabel: { ...typography.bodyMd, color: colors.onSurfaceVariant },
    cardValue: { ...typography.headlineMd, color: colors.primary },
    cardValueSm: { ...typography.labelMd, color: colors.onSurface },
    statusBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
    statusText: { ...typography.labelMd },
    syncBtn: {
        flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
        marginTop: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.lg,
        backgroundColor: colors.primary, ...clayShadows.buttonPrimary,
    },
    syncBtnText: { ...typography.labelMd, color: colors.onPrimary },
    locBtn: {
        flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
        marginTop: spacing.sm, paddingVertical: spacing.sm, borderRadius: borderRadius.lg,
        borderWidth: 1, borderColor: colors.primary,
    },
    locBtnText: { ...typography.labelMd, color: colors.primary },
    locInfo: {
        marginTop: spacing.sm, alignItems: "center",
        padding: spacing.sm, backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.md,
    },
    locCoords: { ...typography.labelSm, color: colors.primary },
    locTime: { ...typography.labelSm, color: colors.onSurfaceVariant, marginTop: 2 },
    tileDesc: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginBottom: spacing.md },
    downloadBtn: {
        flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
        paddingVertical: spacing.sm, borderRadius: borderRadius.lg,
        borderWidth: 1, borderColor: colors.primary,
    },
    downloadBtnText: { ...typography.labelMd, color: colors.primary },
    logoutBtn: {
        flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
        marginTop: spacing.md, marginBottom: spacing.xl, paddingVertical: spacing.md,
        borderRadius: borderRadius.lg, backgroundColor: colors.errorContainer,
    },
    logoutText: { ...typography.labelMd, color: colors.onErrorContainer },
});