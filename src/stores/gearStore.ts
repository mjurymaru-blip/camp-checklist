import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_COOKING_GEARS, DEFAULT_HEAT_SOURCES } from '../types';
import type { CookingGear, HeatSource } from '../types';

interface GearStore {
    cookingGears: CookingGear[];
    heatSources: HeatSource[];
    geminiApiKey: string;

    toggleGear: (id: string) => void;
    toggleHeatSource: (id: string) => void;
    setApiKey: (key: string) => void;
    validateApiKey: (key: string) => { valid: boolean; message: string };
}

export const useGearStore = create<GearStore>()(
    persist(
        (set) => ({
            cookingGears: DEFAULT_COOKING_GEARS,
            heatSources: DEFAULT_HEAT_SOURCES,
            geminiApiKey: '',

            toggleGear: (id) =>
                set((state) => ({
                    cookingGears: state.cookingGears.map((g) =>
                        g.id === id ? { ...g, owned: !g.owned } : g
                    ),
                })),

            toggleHeatSource: (id) =>
                set((state) => ({
                    heatSources: state.heatSources.map((h) =>
                        h.id === id ? { ...h, owned: !h.owned } : h
                    ),
                })),

            setApiKey: (key) => set({ geminiApiKey: key.trim() }),

            validateApiKey: (key) => {
                const trimmed = key.trim();
                if (!trimmed) {
                    return { valid: false, message: 'APIキーを入力してください' };
                }
                if (!trimmed.startsWith('AIza')) {
                    return { valid: false, message: 'APIキーの形式が正しくありません（AIza...で始まる必要があります）' };
                }
                if (trimmed.length < 30) {
                    return { valid: false, message: 'APIキーが短すぎます' };
                }
                return { valid: true, message: '' };
            },
        }),
        { name: 'camp-gear-storage' }
    )
);
