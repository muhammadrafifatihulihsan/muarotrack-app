import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.secondary,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.outlineVariant,
                },
                headerStyle: {
                    backgroundColor: colors.surface,
                },
                headerTintColor: colors.onSurface,
                headerTitleStyle: {
                    fontFamily: "Manrope_600SemiBold",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Beranda",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="compass" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="laporan"
                options={{
                    title: "Laporan",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add-circle" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="riwayat"
                options={{
                    title: "Riwayat",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="time" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profil"
                options={{
                    title: "Profil",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}