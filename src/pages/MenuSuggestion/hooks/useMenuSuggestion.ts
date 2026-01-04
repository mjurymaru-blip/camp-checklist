import { useState, useEffect, useCallback } from 'react';
import { useGearStore } from '../../../stores/gearStore';
import { generateMainSuggestions, generateCourseBasedOnDinner, getSeasonFromMonth } from '../../../services/geminiService';
import { useRateLimiter } from '../../../hooks/useRateLimiter';
import { validateRecipes } from '../../../schemas/recipeSchema';
import type { Recipe, UnifiedConditions, ExecutionMode } from '../../../types';
import { toMenuRequest } from '../../../types';

export type SuggestionStep = 'input' | 'dinner-selection' | 'result';

export interface UseMenuSuggestionReturn {
    // State
    loading: boolean;
    error: string | null;
    allRecipes: Recipe[];
    recipes: Recipe[];
    conditions: UnifiedConditions;
    mode: ExecutionMode;
    suggestionStep: SuggestionStep;
    dinnerCandidates: Recipe[];
    selectedDinner: Recipe | null;
    loadingRecipeId: string | null;
    showCourseConfirm: boolean;
    pendingDinnerRecipe: Recipe | null;

    // Rate limiter
    remaining: number;
    limit: number;

    // Setters
    setConditions: React.Dispatch<React.SetStateAction<UnifiedConditions>>;
    setMode: React.Dispatch<React.SetStateAction<ExecutionMode>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;

    // Handlers
    handleExecute: (overrideMode?: ExecutionMode) => Promise<void>;
    handleSelectCandidate: (recipe: Recipe) => void;
    handleGenerateFullCourse: () => Promise<void>;
    handleDinnerOnly: () => void;
    handleBackToInput: () => void;
    cancelCourseConfirm: () => void;

    // Utils
    getTargetServings: (participants: UnifiedConditions['participants']) => number;
    scaleIngredients: (ingredients: string[], baseServings: number, targetServings: number) => string[];
}

export const useMenuSuggestion = (): UseMenuSuggestionReturn => {
    const { geminiApiKey, cookingGears, heatSources, apiModel, addToHistory } = useGearStore();

    // Core state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    // Unified conditions state (SSOT)
    const [conditions, setConditions] = useState<UnifiedConditions>({
        participants: 'solo',
        season: getSeasonFromMonth(),
        // difficulty: undefined (指定なし)
        mealType: 'dinner',
    });

    // Execution mode
    const [mode, setMode] = useState<ExecutionMode>('ai');

    // Suggestion flow state
    const [suggestionStep, setSuggestionStep] = useState<SuggestionStep>('input');
    const [dinnerCandidates, setDinnerCandidates] = useState<Recipe[]>([]);
    const [selectedDinner, setSelectedDinner] = useState<Recipe | null>(null);
    const [loadingRecipeId, setLoadingRecipeId] = useState<string | null>(null);

    // Course confirm modal state
    const [showCourseConfirm, setShowCourseConfirm] = useState(false);
    const [pendingDinnerRecipe, setPendingDinnerRecipe] = useState<Recipe | null>(null);

    // Rate limiter
    const { checkLimit, incrementUsage, remaining, limit } = useRateLimiter();

    // Fetch recipes on mount
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const baseUrl = import.meta.env.BASE_URL;
                const indexUrl = `${baseUrl}recipes/index.json`.replace('//', '/');

                const indexResponse = await fetch(indexUrl);
                if (!indexResponse.ok) throw new Error('レシピインデックスの取得に失敗しました');
                const indexData = await indexResponse.json();
                const files: string[] = indexData.files;

                const promises = files.map(file => {
                    const fileUrl = `${baseUrl}recipes/${file}`.replace('//', '/');
                    return fetch(fileUrl).then(res => {
                        if (!res.ok) return [];
                        return res.json();
                    });
                });

                const results = await Promise.all(promises);
                const combinedRecipes = results.flat();

                // Validate recipes - invalid ones are logged and excluded
                const validRecipes = validateRecipes(combinedRecipes) as Recipe[];
                console.log(`[Recipe Loader] Loaded ${validRecipes.length} valid recipes out of ${combinedRecipes.length}`);

                setAllRecipes(validRecipes);
            } catch (err) {
                console.error('Failed to load recipes:', err);
                setError('レシピデータの読み込みに失敗しました。');
            }
        };

        fetchRecipes();
    }, []);

    // Manual filter function (for 'manual' mode)
    const applyManualFilter = useCallback(() => {
        if (allRecipes.length === 0) return;

        const filtered = allRecipes.filter(recipe => {
            // Season filter
            if (conditions.season && !recipe.season?.includes(conditions.season)) return false;
            // Difficulty filter
            if (conditions.difficulty && recipe.difficulty !== conditions.difficulty) return false;
            // Cost filter
            if (conditions.cost && recipe.cost !== conditions.cost) return false;
            // MealType filter
            if (conditions.mealType && recipe.meal !== conditions.mealType) return false;
            // CleanupLevel filter
            if (conditions.cleanupLevel && recipe.cleanupLevel !== conditions.cleanupLevel) return false;
            // PrePrep filter
            if (conditions.prePrep !== undefined && recipe.prePrep !== conditions.prePrep) return false;
            // KidFriendly filter
            if (conditions.kidFriendly && !recipe.kidFriendly) return false;
            // Text search
            if (conditions.searchText) {
                const searchLower = conditions.searchText.toLowerCase();
                const nameMatch = recipe.name.toLowerCase().includes(searchLower);
                const ingredientMatch = recipe.ingredients.some(i => i.toLowerCase().includes(searchLower));
                // Also search in tags
                const tagMatch = recipe.tags?.some(t => t.toLowerCase().includes(searchLower));
                if (!nameMatch && !ingredientMatch && !tagMatch) return false;
            }
            return true;
        });
        setRecipes(filtered);
        setSuggestionStep('result');
    }, [allRecipes, conditions]);

    // Utility functions
    const getTargetServings = useCallback((participants: UnifiedConditions['participants']): number => {
        switch (participants) {
            case 'solo': return 1;
            case 'pair': return 2;
            case 'group': return 4;
            default: return 2;
        }
    }, []);

    const scaleIngredients = useCallback((ingredients: string[], baseServings: number, targetServings: number): string[] => {
        if (baseServings === targetServings) return ingredients;
        const ratio = targetServings / baseServings;

        return ingredients.map(line => {
            return line.replace(/(\d+(?:\.\d+)?|\d+\/\d+)([a-zA-Z]+|個|枚|本|g|ml|cc|cm|束|パック|かけ|片|大さじ|小さじ|合)/g, (_, num, unit) => {
                let value = 0;
                if (num.includes('/')) {
                    const [a, b] = num.split('/').map(Number);
                    value = a / b;
                } else {
                    value = parseFloat(num);
                }

                let scaled = value * ratio;
                if (Math.abs(scaled - Math.round(scaled)) < 0.05) {
                    scaled = Math.round(scaled);
                } else {
                    scaled = Math.round(scaled * 10) / 10;
                }

                return `${scaled}${unit}`;
            });
        });
    }, []);

    // Handler functions

    // Unified execution handler (for both AI and manual modes)
    const handleExecute = useCallback(async (overrideMode?: ExecutionMode) => {
        const effectiveMode = overrideMode ?? mode;

        if (effectiveMode === 'manual') {
            // Manual filter mode
            applyManualFilter();
            return;
        }

        // AI mode
        if (!geminiApiKey) {
            alert('AIモードを使用するにはAPIキーを設定してください。\n設定 → レシピ設定からAPIキーを入力できます。');
            return;
        }

        if (!checkLimit()) {
            alert(`本日のAI利用上限（${limit}回）に達しました。\nまた明日ご利用ください。`);
            return;
        }

        const mealLabel = { breakfast: '朝食', lunch: '昼食', dinner: '夕食', snack: 'おつまみ', dessert: 'デザート' }[conditions.mealType];
        if (!window.confirm(`AIを呼び出して「${mealLabel}の候補」を生成しますか？\n（消費: 1回 / 本日の残り: ${remaining}回）`)) {
            return;
        }

        incrementUsage();

        // Filter candidates based on conditions
        let candidates = allRecipes.filter(recipe => {
            if (conditions.season && !recipe.season?.includes(conditions.season)) return false;
            if (conditions.difficulty && recipe.difficulty !== conditions.difficulty) return false;
            if (conditions.cost && recipe.cost !== conditions.cost) return false;
            return true;
        });
        if (candidates.length === 0) {
            candidates = allRecipes;
        }

        setLoading(true);
        setError(null);
        setDinnerCandidates([]);

        try {
            const menuRequest = toMenuRequest(conditions);
            const result = await generateMainSuggestions(
                geminiApiKey,
                menuRequest,
                cookingGears,
                heatSources,
                candidates,
                apiModel,
                menuRequest.focus
            );
            setDinnerCandidates(result);
            setSuggestionStep('dinner-selection');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
        } finally {
            setLoading(false);
        }
    }, [mode, geminiApiKey, checkLimit, limit, remaining, incrementUsage, allRecipes, conditions, cookingGears, heatSources, apiModel, applyManualFilter]);

    const handleSelectCandidate = useCallback((recipe: Recipe) => {
        if (!geminiApiKey) return;

        const menuRequest = toMenuRequest(conditions);
        if (menuRequest.focus === 'dinner') {
            setPendingDinnerRecipe(recipe);
            setShowCourseConfirm(true);
        } else {
            setRecipes([recipe]);
            setSelectedDinner(recipe);
            setSuggestionStep('result');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [geminiApiKey, conditions]);

    const handleGenerateFullCourse = useCallback(async () => {
        if (!pendingDinnerRecipe || !geminiApiKey) return;

        if (!checkLimit()) {
            alert(`本日のAI利用上限に達しました。\n候補までは表示できましたが、フルコース生成はできませんでした。`);
            setShowCourseConfirm(false);
            return;
        }
        incrementUsage();

        setShowCourseConfirm(false);
        setLoadingRecipeId(pendingDinnerRecipe.id);
        setError(null);
        setSelectedDinner(pendingDinnerRecipe);

        try {
            const candidates = allRecipes;
            const menuRequest = toMenuRequest(conditions);
            const courseRecipes = await generateCourseBasedOnDinner(
                geminiApiKey,
                pendingDinnerRecipe,
                menuRequest,
                cookingGears,
                heatSources,
                candidates,
                apiModel
            );

            const fullCourse = [pendingDinnerRecipe, ...courseRecipes];
            const order = { breakfast: 1, lunch: 2, snack: 3, dinner: 4, dessert: 5 };
            fullCourse.sort((a, b) => (order[a.meal] || 99) - (order[b.meal] || 99));

            setRecipes(fullCourse);
            setSuggestionStep('result');
            addToHistory(fullCourse); // 履歴に保存
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
        } finally {
            setLoadingRecipeId(null);
            setPendingDinnerRecipe(null);
        }
    }, [pendingDinnerRecipe, geminiApiKey, checkLimit, incrementUsage, allRecipes, conditions, cookingGears, heatSources, apiModel, addToHistory]);

    const handleDinnerOnly = useCallback(() => {
        if (!pendingDinnerRecipe) return;
        setRecipes([pendingDinnerRecipe]);
        setSelectedDinner(pendingDinnerRecipe);
        setSuggestionStep('result');
        setShowCourseConfirm(false);
        setPendingDinnerRecipe(null);
        addToHistory([pendingDinnerRecipe]); // 履歴に保存
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pendingDinnerRecipe, addToHistory]);

    const handleBackToInput = useCallback(() => {
        setSuggestionStep('input');
        setDinnerCandidates([]);
        setRecipes([]);
    }, []);

    const cancelCourseConfirm = useCallback(() => {
        setShowCourseConfirm(false);
        setPendingDinnerRecipe(null);
    }, []);

    return {
        // State
        loading,
        error,
        allRecipes,
        recipes,
        conditions,
        mode,
        suggestionStep,
        dinnerCandidates,
        selectedDinner,
        loadingRecipeId,
        showCourseConfirm,
        pendingDinnerRecipe,

        // Rate limiter
        remaining,
        limit,

        // Setters
        setConditions,
        setMode,
        setError,

        // Handlers
        handleExecute,
        handleSelectCandidate,
        handleGenerateFullCourse,
        handleDinnerOnly,
        handleBackToInput,
        cancelCourseConfirm,

        // Utils
        getTargetServings,
        scaleIngredients,
    };
};
