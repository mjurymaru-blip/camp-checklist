import { describe, it, expect } from 'vitest';
import { buildShoppingList, toChecklistItems } from './shoppingListUtils';
import type { Recipe } from '../types';

describe('shoppingListUtils', () => {
    describe('buildShoppingList', () => {
        it('should extract ingredients from recipes', () => {
            const recipes: Recipe[] = [
                {
                    id: 'test-1',
                    name: 'カレー',
                    meal: 'dinner',
                    description: 'test',
                    ingredients: ['玉ねぎ 1個', 'にんじん 1本'],
                    requiredGear: [],
                    usedGearIds: [],
                    usedHeatSourceIds: [],
                    steps: [],
                    cookTime: '30m',
                    tips: '',
                },
            ];

            const result = buildShoppingList(recipes);

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe('玉ねぎ');
            expect(result[0].amount).toBe('1個');
            expect(result[0].recipeName).toBe('カレー');
            expect(result[0].source).toBe('recipe');
        });

        it('should handle ingredients without amounts', () => {
            const recipes: Recipe[] = [
                {
                    id: 'test-2',
                    name: 'サラダ',
                    meal: 'dinner',
                    description: 'test',
                    ingredients: ['レタス', 'トマト'],
                    requiredGear: [],
                    usedGearIds: [],
                    usedHeatSourceIds: [],
                    steps: [],
                    cookTime: '10m',
                    tips: '',
                },
            ];

            const result = buildShoppingList(recipes);

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe('レタス');
            expect(result[0].amount).toBeFalsy();
        });

        it('should handle parenthesized amounts', () => {
            const recipes: Recipe[] = [
                {
                    id: 'test-3',
                    name: '味噌汁',
                    meal: 'breakfast',
                    description: 'test',
                    ingredients: ['豆腐（1/2丁）'],
                    requiredGear: [],
                    usedGearIds: [],
                    usedHeatSourceIds: [],
                    steps: [],
                    cookTime: '10m',
                    tips: '',
                },
            ];

            const result = buildShoppingList(recipes);

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('豆腐');
            expect(result[0].amount).toBe('1/2丁');
        });

        it('should return empty array for empty recipes', () => {
            const result = buildShoppingList([]);
            expect(result).toHaveLength(0);
        });

        it('should combine items from multiple recipes', () => {
            const recipes: Recipe[] = [
                {
                    id: 'test-4',
                    name: 'レシピ1',
                    meal: 'dinner',
                    description: 'test',
                    ingredients: ['材料A'],
                    requiredGear: [],
                    usedGearIds: [],
                    usedHeatSourceIds: [],
                    steps: [],
                    cookTime: '10m',
                    tips: '',
                },
                {
                    id: 'test-5',
                    name: 'レシピ2',
                    meal: 'lunch',
                    description: 'test',
                    ingredients: ['材料B', '材料C'],
                    requiredGear: [],
                    usedGearIds: [],
                    usedHeatSourceIds: [],
                    steps: [],
                    cookTime: '15m',
                    tips: '',
                },
            ];

            const result = buildShoppingList(recipes);
            expect(result).toHaveLength(3);
        });
    });

    describe('toChecklistItems', () => {
        it('should convert shopping items to checklist items', () => {
            const shoppingItems = [
                { name: '玉ねぎ', amount: '1個', recipeName: 'カレー', source: 'recipe' as const },
            ];

            const result = toChecklistItems(shoppingItems);

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('玉ねぎ（1個）');
            expect(result[0].categoryId).toBe('food');
            expect(result[0].checked).toBe(false);
            expect(result[0].note).toBe('カレー用');
        });

        it('should handle items without amounts', () => {
            const shoppingItems = [
                { name: 'レタス', recipeName: 'サラダ', source: 'recipe' as const },
            ];

            const result = toChecklistItems(shoppingItems);

            expect(result[0].name).toBe('レタス');
        });

        it('should use custom categoryId', () => {
            const shoppingItems = [
                { name: 'ビール', recipeName: '乾杯', source: 'recipe' as const },
            ];

            const result = toChecklistItems(shoppingItems, 'drinks');

            expect(result[0].categoryId).toBe('drinks');
        });

        it('should omit recipe name when specified', () => {
            const shoppingItems = [
                { name: '塩', recipeName: 'カレー', source: 'recipe' as const },
            ];

            const result = toChecklistItems(shoppingItems, 'food', false);

            expect(result[0].note).toBe('キャンプ飯用');
        });
    });
});
