import { create } from "zustand";
import { MapMode } from "@/constants/mapStyles";

interface PetaState {
    mapMode: MapMode;
    targetZonaId: string | null;
    targetZonaLat: number | null;
    targetZonaLng: number | null;
    measureMode: boolean;
    measurePoints: { lat: number; lng: number }[];
    layerVisibility: {
        zona: boolean;
        favorit: boolean;
        sos: boolean;
    };
    setMapMode: (mode: MapMode) => void;
    setTargetZona: (id: string | null, lat: number | null, lng: number | null) => void;
    setMeasureMode: (v: boolean) => void;
    addMeasurePoint: (p: { lat: number; lng: number }) => void;
    updateMeasurePoint: (index: number, lat: number, lng: number) => void;
    clearMeasurePoints: () => void;
    toggleLayer: (key: "zona" | "favorit" | "sos") => void;
}

export const usePetaStore = create<PetaState>()((set) => ({
    mapMode: "satellite",
    targetZonaId: null,
    targetZonaLat: null,
    targetZonaLng: null,
    measureMode: false,
    measurePoints: [],
    layerVisibility: { zona: true, favorit: true, sos: true },
    setMapMode: (mode) => set({ mapMode: mode }),
    setTargetZona: (id, lat, lng) =>
        set({ targetZonaId: id, targetZonaLat: lat, targetZonaLng: lng }),
    setMeasureMode: (v) => set({ measureMode: v }),
    addMeasurePoint: (p) =>
        set((s) => ({ measurePoints: [...s.measurePoints, p] })),
    updateMeasurePoint: (index: number, lat: number, lng: number) =>
        set((s) => {
            const updated = [...s.measurePoints];
            if (index >= 0 && index < updated.length) {
                updated[index] = { lat, lng };
            }
            return { measurePoints: updated };
        }),
    clearMeasurePoints: () => set({ measurePoints: [] }),
    toggleLayer: (key) =>
        set((s) => ({
            layerVisibility: {
                ...s.layerVisibility,
                [key]: !s.layerVisibility[key],
            },
        })),
}));