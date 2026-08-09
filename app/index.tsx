import { Redirect } from "expo-router";
import { useNelayanStore } from "@/stores/nelayanStore";

export default function Index() {
    const profile = useNelayanStore((s) => s.profile);
    if (!profile) return <Redirect href="/onboarding" />;
    return <Redirect href="/(tabs)" />;
}