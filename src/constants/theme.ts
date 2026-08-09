// Color palette from docs/ui_design.md — Material 3 claymorphism.
// Fonts: Plus Jakarta Sans (body) + Manrope (headlines).

export const colors = {
    primary: "#3d5e84",
    primaryContainer: "#56779e",
    primaryFixed: "#d2e4ff",
    primaryFixedDim: "#a8c9f5",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#fdfcff",
    onPrimaryFixed: "#001d36",
    onPrimaryFixedVariant: "#26496e",

    secondary: "#585f67",
    secondaryContainer: "#dce3ec",
    secondaryFixed: "#dce3ec",
    secondaryFixedDim: "#c0c7d0",
    onSecondary: "#ffffff",
    onSecondaryContainer: "#5e656d",
    onSecondaryFixed: "#151c23",
    onSecondaryFixedVariant: "#40484f",

    tertiary: "#595c5e",
    tertiaryContainer: "#727577",
    tertiaryFixed: "#e0e3e5",
    tertiaryFixedDim: "#c4c7c9",
    onTertiary: "#ffffff",
    onTertiaryContainer: "#fbfdff",
    onTertiaryFixed: "#191c1e",
    onTertiaryFixedVariant: "#444749",

    background: "#f8f9ff",
    surface: "#f8f9ff",
    surfaceBright: "#f8f9ff",
    surfaceDim: "#cbdbf5",
    surfaceContainer: "#e5eeff",
    surfaceContainerLow: "#eff4ff",
    surfaceContainerLowest: "#ffffff",
    surfaceContainerHigh: "#dce9ff",
    surfaceContainerHighest: "#d3e4fe",
    surfaceVariant: "#d3e4fe",

    inverseSurface: "#213145",
    inversePrimary: "#a8c9f5",
    inverseOnSurface: "#eaf1ff",

    onSurface: "#0b1c30",
    onSurfaceVariant: "#43474e",
    onBackground: "#0b1c30",

    outline: "#73777f",
    outlineVariant: "#c3c6cf",

    error: "#ba1a1a",
    errorContainer: "#ffdad6",
    onError: "#ffffff",
    onErrorContainer: "#93000a",

    surfaceTint: "#3f6087",
} as const;

export const clayShadows = {
    card: {
        shadowColor: "#3d5e84",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
    },
    buttonPrimary: {
        shadowColor: "#3d5e84",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonSecondary: {
        shadowColor: "#3d5e84",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    input: {
        shadowColor: "#3d5e84",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
} as const;

export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    "2xl": 24,
    "3xl": 32,
    full: 9999,
} as const;

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
} as const;

export const typography = {
    headlineXl: {
        fontFamily: "Manrope_700Bold",
        fontSize: 48,
        lineHeight: 56,
        letterSpacing: -0.02 * 48,
    },
    headlineLg: {
        fontFamily: "Manrope_700Bold",
        fontSize: 32,
        lineHeight: 40,
        letterSpacing: -0.01 * 32,
    },
    headlineLgMobile: {
        fontFamily: "Manrope_700Bold",
        fontSize: 24,
        lineHeight: 32,
    },
    headlineMd: {
        fontFamily: "Manrope_600SemiBold",
        fontSize: 24,
        lineHeight: 32,
    },
    bodyLg: {
        fontFamily: "PlusJakartaSans_400Regular",
        fontSize: 18,
        lineHeight: 28,
    },
    bodyMd: {
        fontFamily: "PlusJakartaSans_400Regular",
        fontSize: 16,
        lineHeight: 24,
    },
    labelMd: {
        fontFamily: "PlusJakartaSans_600SemiBold",
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.01 * 14,
    },
    labelSm: {
        fontFamily: "PlusJakartaSans_500Medium",
        fontSize: 12,
        lineHeight: 16,
    },
} as const;