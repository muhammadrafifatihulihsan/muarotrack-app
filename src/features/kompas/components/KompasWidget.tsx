// KompasWidget.tsx — Compass heading + bearing to nearest zone (offline)
// spec v2 section 7.1-7.2

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, clayShadows, borderRadius, spacing, typography } from "@/constants/theme";
import { derajatKeMataAngin } from "@/lib/bearing";

interface KompasWidgetProps {
    heading?: number;  // ship heading in degrees (0-359)
    zoneBearing?: number; // bearing to nearest recommended zone
    zoneJarakKm?: number;
}

export default function KompasWidget({ heading = 315, zoneBearing = 290, zoneJarakKm = 4.2 }: KompasWidgetProps) {
    const arahHeading = derajatKeMataAngin(heading);
    const arahZona = derajatKeMataAngin(zoneBearing);

    return (
        <View style={styles.panel}>
            <View style={styles.titleRow}>
                <Ionicons name="compass-outline" size={22} color={colors.primary} />
                <Text style={styles.title}>Kompas & Arah</Text>
            </View>

            <View style={styles.compassRow}>
                {/* Simple compass display */}
                <View style={styles.compassCircle}>
                    <View style={[styles.needle, { transform: [{ rotate: `${heading}deg` }] }]} />
                    <View style={styles.compassLabels}>
                        <Text style={[styles.compassLabel, { position: "absolute", top: 2 }]}>U</Text>
                        <Text style={[styles.compassLabel, { position: "absolute", right: 2, top: "45%" }]}>T</Text>
                        <Text style={[styles.compassLabel, { position: "absolute", bottom: 2 }]}>S</Text>
                        <Text style={[styles.compassLabel, { position: "absolute", left: 2, top: "45%" }]}>B</Text>
                    </View>
                </View>

                {/* Info */}
                <View style={styles.infoCol}>
                    <View style={styles.infoRow}>
                        <Ionicons name="navigate" size={16} color={colors.primary} />
                        <Text style={styles.infoValue}>{heading}° {arahHeading}</Text>
                        <Text style={styles.infoLabel}>Heading</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="location" size={16} color={colors.primary} />
                        <Text style={styles.infoValue}>{zoneBearing}° {arahZona}</Text>
                        <Text style={styles.infoLabel}>
                            Zona terdekat ({zoneJarakKm.toFixed(1)} km)
                        </Text>
                    </View>
                </View>
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
    },
    compassRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
    },
    compassCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 2,
        borderColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    needle: {
        width: 2,
        height: 35,
        backgroundColor: colors.error,
        position: "absolute",
        top: 8,
    },
    compassLabels: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    compassLabel: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
        fontSize: 10,
    },
    infoCol: {
        flex: 1,
        gap: spacing.sm,
    },
    infoRow: {
        gap: 4,
    },
    infoValue: {
        ...typography.labelMd,
        color: colors.primary,
    },
    infoLabel: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
    },
});