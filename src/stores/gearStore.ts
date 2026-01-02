import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_COOKING_GEARS, DEFAULT_HEAT_SOURCES } from '../types';
import type { CookingGear, HeatSource } from '../types';

interface GearStore {
    cookingGears: CookingGear[];
    heatSources: HeatSource[];
    geminiApiKey: string;
    apiModel: string;
    availableModels: string[];

    toggleGear: (id: string) => void;
    toggleHeatSource: (id: string) => void;
    setApiKey: (key: string) => void;
    setApiModel: (model: string) => void;
    setAvailableModels: (models: string[]) => void;
    validateApiKey: (key: string) => { valid: boolean; message: string };
}

export const useGearStore = create<GearStore>()(
    persist(
        (set) => ({
            cookingGears: DEFAULT_COOKING_GEARS,
            heatSources: DEFAULT_HEAT_SOURCES,
            geminiApiKey: '',
            apiModel: 'gemini-1.5-flash',
            availableModels: [], // 初期値は空、自動取得で埋まる

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
            setApiModel: (model) => set({ apiModel: model }),
            setAvailableModels: (models) => set({ availableModels: models }),

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
