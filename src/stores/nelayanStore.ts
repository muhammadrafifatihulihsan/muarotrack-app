import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NelayanOut } from "@/types/api";

interface NelayanState {
    profile: NelayanOut | null;
    setProfile: (profile: NelayanOut) => void;
    clearProfile: () => void;
}

export const useNelayanStore = create<NelayanState>()(
    persist(
        (set) => ({
            profile: null,
            setProfile: (profile) => set({ profile }),
            clearProfile: () => set({ profile: null }),
        }),
        {
            name: "muarotrack-nelayan",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);