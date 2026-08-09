import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts, Manrope_600SemiBold, Manrope_700Bold } from "@expo-google-fonts/manrope";
import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold } from "@expo-google-fonts/plus-jakarta-sans";
import { Text, View } from "react-native";
import { connectivity } from "@/lib/connectivity";
import { runSync } from "@/lib/sync";
import { useSyncStore } from "@/stores/syncStore";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 5 * 60 * 1000,
        },
    },
});

function SyncEffect() {
    const setOnline = useSyncStore((s) => s.setOnline);
    const setSyncing = useSyncStore((s) => s.setSyncing);
    const setLastSync = useSyncStore((s) => s.setLastSync);
    const setPending = useSyncStore((s) => s.setPending);

    useEffect(() => {
        try {
            connectivity.start();
            const unsubscribe = connectivity.subscribe(async (online: boolean) => {
                setOnline(online);
                if (online) {
                    setSyncing(true);
                    try {
                        await runSync();
                        setLastSync(new Date().toISOString());
                        setPending(0);
                    } catch {
                        // sync will retry on next online event
                    } finally {
                        setSyncing(false);
                    }
                }
            });
            return unsubscribe;
        } catch {
            // connectivity failed to start
        }
    }, []);

    return null;
}

class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; errorMsg: string }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, errorMsg: "" };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, errorMsg: error.message };
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
                        Ada masalah saat memuat aplikasi
                    </Text>
                    <Text style={{ fontSize: 12, color: "#888", textAlign: "center" }}>
                        {this.state.errorMsg}
                    </Text>
                </View>
            );
        }
        return this.props.children;
    }
}

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Manrope_600SemiBold,
        Manrope_700Bold,
        PlusJakartaSans_400Regular,
        PlusJakartaSans_500Medium,
        PlusJakartaSans_600SemiBold,
    });

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Memuat font...</Text>
            </View>
        );
    }

    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <SafeAreaProvider>
                        <SyncEffect />
                        <StatusBar style="dark" />
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="index" />
                            <Stack.Screen name="onboarding" />
                            <Stack.Screen name="(tabs)" />
                        </Stack>
                    </SafeAreaProvider>
                </GestureHandlerRootView>
            </QueryClientProvider>
        </ErrorBoundary>
    );
}