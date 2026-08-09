// BottomSheet.tsx — Draggable bottom sheet with 2 snap points
// Uses Animated.Value for smooth 60fps animations
// Style: GoFood-inspired with spring animations

import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { View, StyleSheet, Dimensions, PanResponder, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, borderRadius } from "@/constants/theme";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface BottomSheetProps {
    children: React.ReactNode;
    snapPoints?: number[];
    initialSnap?: number;
    onSnapChange?: (index: number) => void;
}

export interface BottomSheetHandle {
    snapTo: (index: number) => void;
}

const BottomSheet = forwardRef<BottomSheetHandle, BottomSheetProps>(function BottomSheet({
    children,
    snapPoints = [0.15, 0.92],
    initialSnap = 0,
    onSnapChange,
}, ref) {
    const snapPositions = snapPoints.map(p => SCREEN_HEIGHT * (1 - p));
    const translateY = useRef(new Animated.Value(snapPositions[initialSnap])).current;
    const currentSnapRef = useRef(initialSnap);
    const [hasDragged, setHasDragged] = useState(false);

    const clampY = (y: number) => {
        const min = snapPositions[snapPositions.length - 1];
        const max = snapPositions[0];
        return Math.min(max, Math.max(min, y));
    };

    const snapTo = (index: number) => {
        currentSnapRef.current = index;
        Animated.spring(translateY, {
            toValue: snapPositions[index],
            useNativeDriver: true,
            friction: 8,
            tension: 100,
        }).start();
        onSnapChange?.(index);
    };

    useImperativeHandle(ref, () => ({ snapTo }), []);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 3,
            onPanResponderGrant: () => {
                translateY.extractOffset();
            },
            onPanResponderMove: (_, gs) => {
                const baseY = snapPositions[currentSnapRef.current];
                const newY = clampY(baseY + gs.dy);
                translateY.setValue(newY - baseY);
            },
            onPanResponderRelease: (_, gs) => {
                translateY.flattenOffset();
                const baseY = snapPositions[currentSnapRef.current];
                const currentY = (translateY as any)._value;
                const projectedY = currentY + gs.dy * 0.2;

                // Auto-snap based on direction
                if (gs.vy < -0.2 && currentSnapRef.current < snapPositions.length - 1) {
                    snapTo(currentSnapRef.current + 1);
                } else if (gs.vy > 0.2 && currentSnapRef.current > 0) {
                    snapTo(currentSnapRef.current - 1);
                } else if (projectedY < (snapPositions[0] + snapPositions[1]) * 0.5) {
                    snapTo(0);
                } else {
                    snapTo(1);
                }

            },
        })
    ).current;

    return (
        <Animated.View
            style={[
                styles.container,
                { transform: [{ translateY }] },
            ]}
        >
            {/* Handle bar with enlarged drag area */}
            <View style={styles.dragZone}>
                <View {...panResponder.panHandlers} style={styles.handleArea}>
                    <View style={styles.handle} />
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>{children}</View>
        </Animated.View>
    );
});

export default BottomSheet;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        zIndex: 100,
        height: SCREEN_HEIGHT,
        backgroundColor: colors.surface,
        borderTopLeftRadius: borderRadius["3xl"],
        borderTopRightRadius: borderRadius["3xl"],
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 20,
    },
    dragZone: {
        paddingBottom: 16,
    },
    handleArea: {
        alignItems: "center",
        paddingTop: 12,
        paddingBottom: 4,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: colors.outlineVariant,
        borderRadius: 3,
    },
    content: {
        flex: 1,
    },
});