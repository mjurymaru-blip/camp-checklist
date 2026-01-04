import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_COOKING_GEARS, DEFAULT_HEAT_SOURCES } from '../types';
import type { CookingGear, HeatSource, Recipe } from '../types';

// お気に入りレシピ（詳細保存）
export interface FavoriteRecipe {
    id: string;
    name: string;
    meal: string;
    description: string;
    ingredients: string[];
    steps: string[];
    cookTime: string;
    tips: string;
    servings?: number; // 元のレシピの人数（スケーリング用）
    addedAt: string;
}

// 履歴レシピ
export interface HistoryRecipe {
    id: string;
    name: string;
    meal: string;
    description: string;
    suggestedAt: string;
}

interface GearStore {
    cookingGears: CookingGear[];
    heatSources: HeatSource[];
    geminiApiKey: string;
    apiModel: string;
    availableModels: string[];

    // お気に入り・履歴
    favoriteRecipes: FavoriteRecipe[];
    recipeHistory: HistoryRecipe[];

    // テーマ設定
    theme: 'auto' | 'light' | 'dark';

    toggleGear: (id: string) => void;
    toggleHeatSource: (id: string) => void;
    setApiKey: (key: string) => void;
    setApiModel: (model: string) => void;
    setAvailableModels: (models: string[]) => void;
    validateApiKey: (key: string) => { valid: boolean; message: string };

    // お気に入り・履歴アクション
    addFavorite: (recipe: Recipe) => void;
    removeFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
    addToHistory: (recipes: Recipe[]) => void;
    clearHistory: () => void;

    // テーマアクション
    setTheme: (theme: 'auto' | 'light' | 'dark') => void;
}

export const useGearStore = create<GearStore>()(
    persist(
        (set, get) => ({
            cookingGears: DEFAULT_COOKING_GEARS,
            heatSources: DEFAULT_HEAT_SOURCES,
            geminiApiKey: '',
            apiModel: 'gemini-1.5-flash',
            availableModels: [],
            favoriteRecipes: [],
            recipeHistory: [],
            theme: 'auto',

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

            // お気に入りアクション
            addFavorite: (recipe) => {
                const favorite: FavoriteRecipe = {
                    id: recipe.id,
                    name: recipe.name,
                    meal: recipe.meal,
                    description: recipe.description,
                    ingredients: recipe.ingredients,
                    steps: recipe.steps,
                    cookTime: recipe.cookTime,
                    tips: recipe.tips,
                    servings: recipe.servings, // スケーリング用に保存
                    addedAt: new Date().toISOString(),
                };
                set((state) => ({
                    favoriteRecipes: state.favoriteRecipes.some(f => f.id === recipe.id)
                        ? state.favoriteRecipes
                        : [favorite, ...state.favoriteRecipes],
                }));
            },

            removeFavorite: (id) => set((state) => ({
                favoriteRecipes: state.favoriteRecipes.filter(f => f.id !== id),
            })),

            isFavorite: (id) => get().favoriteRecipes.some(f => f.id === id),

            // 履歴アクション
            addToHistory: (recipes) => {
                const now = new Date().toISOString();
                const historyItems: HistoryRecipe[] = recipes.map(r => ({
                    id: r.id,
                    name: r.name,
                    meal: r.meal,
                    description: r.description,
                    suggestedAt: now,
                }));
                set((state) => {
                    // 重複を除外して先頭に追加、最大50件
                    const existingIds = new Set(historyItems.map(h => h.id));
                    const filtered = state.recipeHistory.filter(h => !existingIds.has(h.id));
                    return {
                        recipeHistory: [...historyItems, ...filtered].slice(0, 50),
                    };
                });
            },

            clearHistory: () => set({ recipeHistory: [] }),

            setTheme: (theme) => {
                // DOMにテーマを適用
                if (theme === 'auto') {
                    document.documentElement.removeAttribute('data-theme');
                } else {
                    document.documentElement.setAttribute('data-theme', theme);
                }
                set({ theme });
            },
        }),
        { name: 'camp-gear-storage' }
    )
);
