import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useNelayanStore } from "@/stores/nelayanStore";
import { colors, clayShadows, borderRadius, spacing, typography } from "@/constants/theme";
import apiFetch from "@/lib/apiClient";
import { NelayanCreate, NelayanOut } from "@/types/api";

export default function OnboardingScreen() {
    const router = useRouter();
    const setProfile = useNelayanStore((s) => s.setProfile);

    const [nama, setNama] = useState("");
    const [literBiasa, setLiterBiasa] = useState("");
    const [jarakBiasa, setJarakBiasa] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!nama.trim() || !literBiasa || !jarakBiasa) {
            Alert.alert("Mohon isi semua data.");
            return;
        }

        const payload: NelayanCreate = {
            nama: nama.trim(),
            total_liter_biasa: parseFloat(literBiasa),
            jarak_km_biasa: parseFloat(jarakBiasa),
        };

        if (payload.total_liter_biasa <= 0 || payload.jarak_km_biasa <= 0) {
            Alert.alert("Nilai liter dan jarak harus lebih dari 0.");
            return;
        }

        setLoading(true);
        try {
            const result = await apiFetch<NelayanOut>("/nelayan", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            setProfile(result);
            router.replace("/(tabs)");
        } catch (err: any) {
            Alert.alert("Pendaftaran gagal", err?.message ?? "Coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                padding: spacing.lg,
                backgroundColor: colors.background,
            }}
        >
            <Text
                style={[
                    typography.headlineLgMobile,
                    { color: colors.primary, marginBottom: spacing.xs },
                ]}
            >
                MuaroTrack
            </Text>
            <Text
                style={[
                    typography.bodyMd,
                    { color: colors.onSurfaceVariant, marginBottom: spacing.xl },
                ]}
            >
                Masukkan data kapal Anda untuk memulai.
            </Text>

            <View style={{ marginBottom: spacing.md }}>
                <Text style={[typography.labelMd, { color: colors.onSurface, marginBottom: spacing.xs }]}>
                    Nama
                </Text>
                <TextInput
                    value={nama}
                    onChangeText={setNama}
                    placeholder="Nama nelayan"
                    placeholderTextColor={colors.outline}
                    style={{
                        backgroundColor: colors.surfaceContainerLow,
                        borderRadius: borderRadius.md,
                        padding: spacing.md,
                        color: colors.onSurface,
                        ...typography.bodyMd,
                        ...clayShadows.input,
                    }}
                />
            </View>

            <View style={{ marginBottom: spacing.md }}>
                <Text style={[typography.labelMd, { color: colors.onSurface, marginBottom: spacing.xs }]}>
                    BBM biasanya (liter)
                </Text>
                <TextInput
                    value={literBiasa}
                    onChangeText={setLiterBiasa}
                    placeholder="Contoh: 10"
                    keyboardType="decimal-pad"
                    placeholderTextColor={colors.outline}
                    style={{
                        backgroundColor: colors.surfaceContainerLow,
                        borderRadius: borderRadius.md,
                        padding: spacing.md,
                        color: colors.onSurface,
                        ...typography.bodyMd,
                        ...clayShadows.input,
                    }}
                />
            </View>

            <View style={{ marginBottom: spacing.lg }}>
                <Text style={[typography.labelMd, { color: colors.onSurface, marginBottom: spacing.xs }]}>
                    Jarak tempuh biasanya (km)
                </Text>
                <TextInput
                    value={jarakBiasa}
                    onChangeText={setJarakBiasa}
                    placeholder="Contoh: 20"
                    keyboardType="decimal-pad"
                    placeholderTextColor={colors.outline}
                    style={{
                        backgroundColor: colors.surfaceContainerLow,
                        borderRadius: borderRadius.md,
                        padding: spacing.md,
                        color: colors.onSurface,
                        ...typography.bodyMd,
                        ...clayShadows.input,
                    }}
                />
            </View>

            <View
                style={{
                    backgroundColor: colors.primary,
                    borderRadius: borderRadius.lg,
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.lg,
                    alignItems: "center",
                    ...clayShadows.buttonPrimary,
                }}
                onTouchEnd={() => !loading && handleRegister()}
            >
                <Text style={[typography.labelMd, { color: colors.onPrimary }]}>
                    {loading ? "Mendaftarkan..." : "Mulai"}
                </Text>
            </View>
        </ScrollView>
    );
}