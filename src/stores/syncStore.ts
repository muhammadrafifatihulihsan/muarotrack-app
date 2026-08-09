import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SyncState {
    isOnline: boolean;
    lastSyncAt: string | null;
    pendingCount: number;
    isSyncing: boolean;
    setOnline: (v: boolean) => void;
    setLastSync: (t: string) => void;
    setPending: (n: number) => void;
    setSyncing: (v: boolean) => void;
}

export const useSyncStore = create<SyncState>()(
    persist(
        (set) => ({
            isOnline: false,
            lastSyncAt: null,
            pendingCount: 0,
            isSyncing: false,
            setOnline: (v) => set({ isOnline: v }),
            setLastSync: (t) => set({ lastSyncAt: t }),
            setPending: (n) => set({ pendingCount: n }),
            setSyncing: (v) => set({ isSyncing: v }),
        }),
        {
            name: "muarotrack-sync",
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                lastSyncAt: state.lastSyncAt,
            }),
        }
    )
);