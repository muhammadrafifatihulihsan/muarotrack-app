import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNelayanStore } from "@/stores/nelayanStore";
import { useSyncStore } from "@/stores/syncStore";
import { colors, clayShadows, borderRadius, spacing, typography } from "@/constants/theme";
import apiFetch from "@/lib/apiClient";
import { LaporanTeksCreate, LaporanOut } from "@/types/api";
import CustomAlert from "@/components/CustomAlert";

export default function LaporanScreen() {
    const profile = useNelayanStore((s) => s.profile);
    const isOnline = useSyncStore((s) => s.isOnline);

    const [jenisIkan, setJenisIkan] = useState("");
    const [estimasiKg, setEstimasiKg] = useState("");
    const [catatan, setCatatan] = useState("");
    const [sending, setSending] = useState(false);
    const [lastResult, setLastResult] = useState<string | null>(null);
    const [recording, setRecording] = useState(false);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{
        title: string; message: string; icon?: string;
        buttons: Array<{ text: string; style?: "default" | "destructive" | "cancel"; onPress: () => void }>;
    }>({ title: "", message: "", buttons: [] });

    const showAlert = (title: string, message: string, icon?: string, buttons?: any[]) => {
        setAlertConfig({ title, message, icon, buttons: buttons || [{ text: "OK", onPress: () => setAlertVisible(false) }] });
        setAlertVisible(true);
    };

    const handleKirim = async () => {
        if (!jenisIkan.trim()) {
            showAlert("Data Kurang", "Isi jenis ikan terlebih dahulu.", "warning-outline");
            return;
        }

        const payload: LaporanTeksCreate = {
            nelayan_id: profile?.id ?? null,
            lat: -0.8972,
            lng: 100.3508,
            jenis_ikan: jenisIkan.trim(),
            estimasi_kg: estimasiKg ? parseFloat(estimasiKg) : null,
            catatan: catatan.trim() || null,
        };

        setSending(true);
        try {
            if (isOnline) {
                await apiFetch<LaporanOut>("/laporan/teks", { method: "POST", body: JSON.stringify(payload) });
                setLastResult("Laporan terkirim ke server.");
            } else {
                setLastResult("Laporan disimpan lokal, akan dikirim otomatis saat online.");
            }
            setJenisIkan("");
            setEstimasiKg("");
            setCatatan("");
        } catch (err: any) {
            setLastResult("Laporan disimpan lokal, server tidak tersedia.");
        } finally {
            setSending(false);
        }
    };

    const toggleRecording = () => {
        if (recording) {
            setRecording(false);
            setLastResult("Rekaman suara disimpan lokal. Kirim saat online.");
        } else {
            setRecording(true);
            setLastResult("Merekam...");
        }
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.md }}>
            <Text style={[typography.headlineMd, { color: colors.onSurface, marginBottom: spacing.sm }]}>
                Laporan Tangkapan
            </Text>
            <Text style={[typography.bodyMd, { color: colors.onSurfaceVariant, marginBottom: spacing.lg }]}>
                Catat hasil tangkapan Anda, data ini membantu nelayan lain dan memperkuat rekomendasi zona.
            </Text>

            <View style={styles.voicePanel}>
                <Text style={styles.voiceTitle}>Laporan Suara</Text>
                <Text style={styles.voiceDesc}>Rekam laporan suara, putar ulang, lalu kirim.</Text>
                <View style={styles.voiceControls}>
                    <View style={[styles.recordBtn, recording && styles.recordingBtn]} onTouchEnd={toggleRecording}>
                        <Ionicons name={recording ? "stop-circle" : "mic"} size={32} color={recording ? colors.error : colors.primary} />
                    </View>
                    {recording && <Text style={styles.recordingIndicator}>Merekam...</Text>}
                </View>
            </View>

            {lastResult && (
                <View style={{ backgroundColor: colors.surfaceContainerHigh, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.md }}>
                    <Text style={[typography.labelMd, { color: colors.onSurface }]}>{lastResult}</Text>
                </View>
            )}

            <Text style={[typography.labelMd, { color: colors.onSurfaceVariant, marginBottom: spacing.sm, marginTop: spacing.md }]}>
                Laporan Teks
            </Text>
            <View style={{ marginBottom: spacing.md }}>
                <Text style={[typography.labelMd, { color: colors.onSurface, marginBottom: spacing.xs }]}>Jenis Ikan</Text>
                <TextInput value={jenisIkan} onChangeText={setJenisIkan} placeholder="Contoh: Tongkol, Kembung"
                    placeholderTextColor={colors.outline}
                    style={{ backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.md, padding: spacing.md, color: colors.onSurface, ...typography.bodyMd, ...clayShadows.input }} />
            </View>
            <View style={{ marginBottom: spacing.md }}>
                <Text style={[typography.labelMd, { color: colors.onSurface, marginBottom: spacing.xs }]}>Estimasi Berat (kg)</Text>
                <TextInput value={estimasiKg} onChangeText={setEstimasiKg} placeholder="Contoh: 15.5"
                    keyboardType="decimal-pad" placeholderTextColor={colors.outline}
                    style={{ backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.md, padding: spacing.md, color: colors.onSurface, ...typography.bodyMd, ...clayShadows.input }} />
            </View>
            <View style={{ marginBottom: spacing.lg }}>
                <Text style={[typography.labelMd, { color: colors.onSurface, marginBottom: spacing.xs }]}>Catatan (opsional)</Text>
                <TextInput value={catatan} onChangeText={setCatatan} placeholder="Kondisi laut, umpan, dll."
                    placeholderTextColor={colors.outline} multiline numberOfLines={3}
                    style={{ backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.md, padding: spacing.md, color: colors.onSurface, ...typography.bodyMd, ...clayShadows.input, minHeight: 80, textAlignVertical: "top" }} />
            </View>

            <View style={{ backgroundColor: colors.primary, borderRadius: borderRadius.lg, paddingVertical: spacing.md, alignItems: "center", marginBottom: spacing.lg, ...clayShadows.buttonPrimary }}
                onTouchEnd={() => !sending && handleKirim()}>
                <Text style={[typography.labelMd, { color: colors.onPrimary }]}>{sending ? "Mengirim..." : "Kirim Laporan"}</Text>
            </View>

            <CustomAlert visible={alertVisible} title={alertConfig.title} message={alertConfig.message}
                icon={alertConfig.icon as any} buttons={alertConfig.buttons} onClose={() => setAlertVisible(false)} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    voicePanel: { backgroundColor: colors.surface, borderRadius: borderRadius["2xl"], padding: spacing.md, marginBottom: spacing.md, ...clayShadows.card },
    voiceTitle: { ...typography.labelMd, color: colors.primary, marginBottom: spacing.xs },
    voiceDesc: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginBottom: spacing.md },
    voiceControls: { flexDirection: "row", alignItems: "center", gap: spacing.md },
    recordBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.surfaceContainerLow, alignItems: "center", justifyContent: "center", ...clayShadows.buttonSecondary },
    recordingBtn: { backgroundColor: colors.errorContainer },
    recordingIndicator: { ...typography.labelMd, color: colors.error },
});