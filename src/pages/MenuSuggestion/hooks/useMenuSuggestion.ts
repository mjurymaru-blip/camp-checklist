import { useState, useEffect, useCallback } from 'react';
import { useGearStore } from '../../../stores/gearStore';
import { generateMainSuggestions, generateCourseBasedOnDinner, getSeasonFromMonth } from '../../../services/geminiService';
import { useRateLimiter } from '../../../hooks/useRateLimiter';
import { validateRecipes } from '../../../schemas/recipeSchema';
import type { MenuRequest, Recipe } from '../../../types';

export type SuggestionStep = 'input' | 'dinner-selection' | 'result';

interface FilterState {
    season?: string;
    difficulty?: string;
    cost?: string;
}

export interface UseMenuSuggestionReturn {
    // State
    loading: boolean;
    error: string | null;
    allRecipes: Recipe[];
    recipes: Recipe[];
    request: MenuRequest;
    activeFilters: FilterState;
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
    setRequest: React.Dispatch<React.SetStateAction<MenuRequest>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;

    // Handlers
    toggleFilter: (type: 'season' | 'difficulty' | 'cost', value: string) => void;
    handleGenerate: () => Promise<void>;
    handleSelectCandidate: (recipe: Recipe) => void;
    handleGenerateFullCourse: () => Promise<void>;
    handleDinnerOnly: () => void;
    handleBackToInput: () => void;
    cancelCourseConfirm: () => void;

    // Utils
    getTargetServings: (participants: MenuRequest['participants']) => number;
    scaleIngredients: (ingredients: string[], baseServings: number, targetServings: number) => string[];
}

export const useMenuSuggestion = (): UseMenuSuggestionReturn => {
    const { geminiApiKey, cookingGears, heatSources, apiModel } = useGearStore();

    // Core state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    // Request state
    const [request, setRequest] = useState<MenuRequest>({
        participants: 'solo',
        season: getSeasonFromMonth(),
        effort: 'normal',
        focus: 'dinner',
        category: ''
    });

    // Filter state
    const [activeFilters, setActiveFilters] = useState<FilterState>({});

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

    // Filter effect
    useEffect(() => {
        if (allRecipes.length === 0) return;

        const hasActiveFilter = Object.values(activeFilters).some(v => v !== undefined);
        if (!hasActiveFilter) return;

        const filtered = allRecipes.filter(recipe => {
            if (activeFilters.season && !recipe.season?.includes(activeFilters.season)) return false;
            if (activeFilters.difficulty && recipe.difficulty !== activeFilters.difficulty) return false;
            if (activeFilters.cost && recipe.cost !== activeFilters.cost) return false;
            return true;
        });
        setRecipes(filtered);
    }, [activeFilters, allRecipes]);

    // Utility functions
    const getTargetServings = useCallback((participants: MenuRequest['participants']): number => {
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
    const toggleFilter = useCallback((type: 'season' | 'difficulty' | 'cost', value: string) => {
        if (suggestionStep !== 'input') {
            if (window.confirm('現在のAI提案結果を破棄して検索モードに戻りますか？')) {
                setSuggestionStep('input');
                setRecipes([]);
            } else {
                return;
            }
        }

        setActiveFilters(prev => ({
            ...prev,
            [type]: prev[type] === value ? undefined : value
        }));
    }, [suggestionStep]);

    const handleGenerate = useCallback(async () => {
        if (!geminiApiKey) return;

        if (!checkLimit()) {
            alert(`本日のAI利用上限（${limit}回）に達しました。\nまた明日ご利用ください。`);
            return;
        }

        if (!window.confirm(`AIを呼び出して「夕食の候補」を生成しますか？\n（消費: 1回 / 本日の残り: ${remaining}回）`)) {
            return;
        }

        incrementUsage();

        let candidates = recipes;
        if (candidates.length === 0 && allRecipes.length > 0) {
            candidates = allRecipes.filter(recipe => {
                if (activeFilters.season && !recipe.season?.includes(activeFilters.season)) return false;
                if (activeFilters.difficulty && recipe.difficulty !== activeFilters.difficulty) return false;
                if (activeFilters.cost && recipe.cost !== activeFilters.cost) return false;
                return true;
            });
        }
        if (candidates.length === 0) {
            candidates = allRecipes;
        }

        setLoading(true);
        setError(null);
        setDinnerCandidates([]);
        setActiveFilters({});

        try {
            const result = await generateMainSuggestions(
                geminiApiKey,
                request,
                cookingGears,
                heatSources,
                candidates,
                apiModel,
                request.focus
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
    }, [geminiApiKey, checkLimit, limit, remaining, incrementUsage, recipes, allRecipes, activeFilters, request, cookingGears, heatSources, apiModel]);

    const handleSelectCandidate = useCallback((recipe: Recipe) => {
        if (!geminiApiKey) return;

        if (request.focus === 'dinner') {
            setPendingDinnerRecipe(recipe);
            setShowCourseConfirm(true);
        } else {
            setRecipes([recipe]);
            setSelectedDinner(recipe);
            setSuggestionStep('result');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [geminiApiKey, request.focus]);

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
            const courseRecipes = await generateCourseBasedOnDinner(
                geminiApiKey,
                pendingDinnerRecipe,
                request,
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
        } finally {
            setLoadingRecipeId(null);
            setPendingDinnerRecipe(null);
        }
    }, [pendingDinnerRecipe, geminiApiKey, checkLimit, incrementUsage, allRecipes, request, cookingGears, heatSources, apiModel]);

    const handleDinnerOnly = useCallback(() => {
        if (!pendingDinnerRecipe) return;
        setRecipes([pendingDinnerRecipe]);
        setSelectedDinner(pendingDinnerRecipe);
        setSuggestionStep('result');
        setShowCourseConfirm(false);
        setPendingDinnerRecipe(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pendingDinnerRecipe]);

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
        request,
        activeFilters,
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
        setRequest,
        setError,

        // Handlers
        toggleFilter,
        handleGenerate,
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
