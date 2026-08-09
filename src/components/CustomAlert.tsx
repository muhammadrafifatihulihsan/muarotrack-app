// CustomAlert.tsx — Styled modal replacing Alert.alert()
// Claymorphism design matching MuaroTrack theme

import React from "react";
import { View, Text, Modal, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, clayShadows, borderRadius, spacing, typography } from "@/constants/theme";

export interface CustomAlertButton {
    text: string;
    style?: "default" | "destructive" | "cancel";
    onPress: () => void;
}

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    icon?: keyof typeof Ionicons.glyphMap;
    buttons: CustomAlertButton[];
    onClose: () => void;
}

export default function CustomAlert({ visible, title, message, icon, buttons, onClose }: CustomAlertProps) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.dialog}>
                    {/* Icon */}
                    {icon && (
                        <View style={styles.iconContainer}>
                            <Ionicons name={icon} size={32} color={colors.primary} />
                        </View>
                    )}

                    {/* Title */}
                    <Text style={styles.title}>{title}</Text>

                    {/* Message */}
                    <Text style={styles.message}>{message}</Text>

                    {/* Buttons */}
                    <View style={styles.buttonRow}>
                        {buttons.map((btn, idx) => (
                            <Pressable
                                key={idx}
                                style={[
                                    styles.button,
                                    btn.style === "destructive" && styles.buttonDestructive,
                                    btn.style === "cancel" && styles.buttonCancel,
                                ]}
                                onPress={() => {
                                    btn.onPress();
                                    onClose();
                                }}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        btn.style === "destructive" && styles.buttonTextDestructive,
                                        btn.style === "cancel" && styles.buttonTextCancel,
                                    ]}
                                >
                                    {btn.text}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        padding: spacing.lg,
    },
    dialog: {
        width: "100%",
        maxWidth: 340,
        backgroundColor: colors.surface,
        borderRadius: borderRadius["3xl"],
        padding: spacing.lg,
        alignItems: "center",
        ...clayShadows.card,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.surfaceContainerLow,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: spacing.sm,
    },
    title: {
        ...typography.headlineMd,
        color: colors.onSurface,
        textAlign: "center",
        marginBottom: spacing.xs,
    },
    message: {
        ...typography.bodyMd,
        color: colors.onSurfaceVariant,
        textAlign: "center",
        marginBottom: spacing.lg,
        lineHeight: 22,
    },
    buttonRow: {
        flexDirection: "row",
        gap: spacing.sm,
        width: "100%",
    },
    button: {
        flex: 1,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primary,
        alignItems: "center",
        ...clayShadows.buttonPrimary,
    },
    buttonDestructive: {
        backgroundColor: colors.error,
    },
    buttonCancel: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: colors.outlineVariant,
    },
    buttonText: {
        ...typography.labelMd,
        color: colors.onPrimary,
    },
    buttonTextDestructive: {
        color: colors.onError,
    },
    buttonTextCancel: {
        color: colors.onSurfaceVariant,
    },
});