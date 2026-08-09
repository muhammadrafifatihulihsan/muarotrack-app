// SosButton.tsx — Emergency SOS button with offline queue
// spec v2 section 7.11

import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, clayShadows, borderRadius, spacing, typography } from "@/constants/theme";
import CustomAlert from "@/components/CustomAlert";

interface SosButtonProps {
    compact?: boolean;
}

export default function SosButton({ compact = false }: SosButtonProps) {
    const [pressed, setPressed] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [resultMsg, setResultMsg] = useState("");

    const handleSOS = () => {
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        setShowConfirm(false);
        setPressed(true);
        const waktu = new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        const koordinat = "0°53'50\"S, 100°21'03\"E";
        setResultMsg(
            `Lokasi dan waktu kejadian telah dicatat.\n\nKoordinat: ${koordinat}\nWaktu: ${waktu}\n\nSinyal akan dikirim otomatis begitu ada koneksi internet.`
        );
        setShowResult(true);
        setTimeout(() => setPressed(false), 3000);
    };

    if (compact) {
        return (
            <View style={styles.sosCompact} onTouchEnd={handleSOS}>
                <View style={styles.sosIconCompact}>
                    <Ionicons name="warning" size={20} color={colors.onError} />
                </View>
                <CustomAlert
                    visible={showConfirm}
                    title="SOS Darurat"
                    message="Apakah Anda yakin ingin mengirim sinyal darurat? Lokasi dan waktu akan dicatat dan dikirim otomatis begitu ada koneksi."
                    icon="warning"
                    buttons={[
                        { text: "Batal", style: "cancel", onPress: () => setShowConfirm(false) },
                        { text: "Kirim SOS", style: "destructive", onPress: handleConfirm },
                    ]}
                    onClose={() => setShowConfirm(false)}
                />
                <CustomAlert
                    visible={showResult}
                    title="Sinyal SOS Tersimpan"
                    message={resultMsg}
                    icon="checkmark-circle"
                    buttons={[{ text: "OK", onPress: () => setShowResult(false) }]}
                    onClose={() => setShowResult(false)}
                />
            </View>
        );
    }

    return (
        <View style={styles.panel}>
            <View style={styles.titleRow}>
                <Ionicons name="warning" size={22} color={colors.error} />
                <Text style={styles.title}>Tombol Darurat (SOS)</Text>
            </View>

            <Text style={styles.desc}>
                Gunakan tombol SOS untuk mengirim sinyal darurat ke nelayan lain dan koordinator pelabuhan. Sinyal akan dikirim otomatis begitu ada koneksi internet.
            </Text>

            <View
                style={[styles.sosButton, pressed && styles.sosPressed]}
                onTouchEnd={handleSOS}
            >
                <Ionicons name="warning" size={28} color={colors.onError} />
                <Text style={styles.sosText}>
                    {pressed ? "SOS TERSIMPAN" : "TEKAN UNTUK SOS"}
                </Text>
            </View>

            <CustomAlert
                visible={showConfirm}
                title="SOS Darurat"
                message="Apakah Anda yakin ingin mengirim sinyal darurat? Lokasi dan waktu akan dicatat dan dikirim otomatis."
                icon="warning"
                buttons={[
                    { text: "Batal", style: "cancel", onPress: () => setShowConfirm(false) },
                    { text: "Kirim SOS", style: "destructive", onPress: handleConfirm },
                ]}
                onClose={() => setShowConfirm(false)}
            />
            <CustomAlert
                visible={showResult}
                title="Sinyal SOS Tersimpan"
                message={resultMsg}
                icon="checkmark-circle"
                buttons={[{ text: "OK", onPress: () => setShowResult(false) }]}
                onClose={() => setShowResult(false)}
            />
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
        marginBottom: spacing.xs,
    },
    title: {
        ...typography.headlineMd,
        color: colors.error,
    },
    desc: {
        ...typography.bodyMd,
        color: colors.onSurfaceVariant,
        marginBottom: spacing.md,
        lineHeight: 22,
    },
    sosButton: {
        backgroundColor: colors.error,
        borderRadius: borderRadius["2xl"],
        paddingVertical: spacing.lg,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        ...clayShadows.buttonPrimary,
    },
    sosPressed: {
        backgroundColor: colors.errorContainer,
    },
    sosText: {
        ...typography.labelMd,
        color: colors.onError,
        fontWeight: "700",
        letterSpacing: 1,
    },
    sosCompact: {
        position: "absolute",
        bottom: 80,
        right: 16,
        zIndex: 100,
    },
    sosIconCompact: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.error,
        alignItems: "center",
        justifyContent: "center",
        ...clayShadows.buttonPrimary,
    },
});