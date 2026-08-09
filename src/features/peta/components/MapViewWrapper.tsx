import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, clayShadows, borderRadius, spacing, typography } from "@/constants/theme";
import MapLibreView from "./MapLibreView";

interface MapViewWrapperProps {
    shipLat?: number;
    shipLng?: number;
    shipHeading?: number;
    highlightZona?: { lat: number; lng: number } | null;
    onPressMap?: (lat: number, lng: number) => void;
}

export default function MapViewWrapper({ onPressMap, highlightZona, ...mapProps }: MapViewWrapperProps) {
    return (
        <ErrorBoundary fallback={<MapPlaceholder />}>
            <MapLibreView {...mapProps} onPressMap={onPressMap} highlightZona={highlightZona} />
        </ErrorBoundary>
    );
}

function MapPlaceholder() {
    return (
        <View style={styles.placeholder}>
            <Text style={styles.placeholderTitle}>Peta & Posisi Kapal</Text>
            <Text style={styles.placeholderText}>
                Peta akan ditampilkan di sini dengan MapLibre.{"\n"}
                Aktifkan GPS untuk melihat posisi kapal Anda.
            </Text>
            <Text style={styles.placeholderHint}>
                Gunakan Expo Dev Client untuk peta penuh.
            </Text>
        </View>
    );
}

class ErrorBoundary extends React.Component<
    { children: React.ReactNode; fallback: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) return this.props.fallback;
        return this.props.children;
    }
}

const styles = StyleSheet.create({
    placeholder: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius["2xl"],
        padding: spacing.md,
        minHeight: 200,
        alignItems: "center",
        justifyContent: "center",
        ...clayShadows.card,
    },
    placeholderTitle: {
        ...typography.headlineMd,
        color: colors.primary,
        marginBottom: spacing.xs,
    },
    placeholderText: {
        ...typography.bodyMd,
        color: colors.onSurfaceVariant,
        textAlign: "center",
    },
    placeholderHint: {
        ...typography.labelSm,
        color: colors.outline,
        marginTop: spacing.sm,
    },
});