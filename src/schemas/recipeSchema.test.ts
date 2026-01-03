import { describe, it, expect, vi } from 'vitest';
import { validateRecipes, validateSingleRecipe, RecipeSchema } from '../schemas/recipeSchema';

describe('RecipeSchema', () => {
    describe('validateRecipes', () => {
        it('should return valid recipes', () => {
            const validRecipe = {
                id: 'test-recipe',
                name: 'テストレシピ',
                meal: 'dinner',
                description: 'テスト用レシピです',
                ingredients: ['材料1', '材料2'],
                requiredGear: ['鍋'],
                usedGearIds: ['pot'],
                usedHeatSourceIds: ['gas-stove'],
                steps: ['手順1', '手順2'],
                cookTime: '30分',
                tips: 'コツ',
            };

            const result = validateRecipes([validRecipe]);
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('test-recipe');
        });

        it('should filter out invalid recipes and log warnings', () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

            const validRecipe = {
                id: 'valid',
                name: 'Valid Recipe',
                meal: 'dinner',
                description: 'Valid',
                ingredients: ['a'],
                requiredGear: ['b'],
                usedGearIds: ['c'],
                usedHeatSourceIds: ['d'],
                steps: ['e'],
                cookTime: '10m',
                tips: 'f',
            };

            const invalidRecipe = {
                id: 'invalid',
                // missing name - should fail
                meal: 'dinner',
            };

            const result = validateRecipes([validRecipe, invalidRecipe]);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('valid');
            expect(consoleSpy).toHaveBeenCalled();

            consoleSpy.mockRestore();
        });

        it('should handle empty array', () => {
            const result = validateRecipes([]);
            expect(result).toHaveLength(0);
        });

        it('should validate optional fields', () => {
            const recipeWithOptional = {
                id: 'optional-test',
                name: 'Optional Test',
                meal: 'lunch',
                description: 'Test',
                ingredients: ['a'],
                requiredGear: ['b'],
                usedGearIds: ['c'],
                usedHeatSourceIds: ['d'],
                steps: ['e'],
                cookTime: '10m',
                tips: 'f',
                // Optional fields
                servings: 2,
                difficulty: 'easy',
                season: ['spring', 'summer'],
                calories: '500kcal',
                cost: 'low',
            };

            const result = validateRecipes([recipeWithOptional]);
            expect(result).toHaveLength(1);
            expect(result[0].servings).toBe(2);
            expect(result[0].difficulty).toBe('easy');
        });
    });

    describe('validateSingleRecipe', () => {
        it('should return recipe when valid', () => {
            const recipe = {
                id: 'single-test',
                name: 'Single Test',
                meal: 'breakfast',
                description: 'Test',
                ingredients: [],
                requiredGear: [],
                usedGearIds: [],
                usedHeatSourceIds: [],
                steps: [],
                cookTime: '5m',
                tips: '',
            };

            const result = validateSingleRecipe(recipe);
            expect(result).not.toBeNull();
            expect(result?.id).toBe('single-test');
        });

        it('should return null for invalid recipe', () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

            const invalidRecipe = { id: 'test' }; // Missing required fields

            const result = validateSingleRecipe(invalidRecipe);
            expect(result).toBeNull();

            consoleSpy.mockRestore();
        });
    });

    describe('RecipeSchema enum validations', () => {
        const baseRecipe = {
            id: 'enum-test',
            name: 'Enum Test',
            description: 'Test',
            ingredients: [],
            requiredGear: [],
            usedGearIds: [],
            usedHeatSourceIds: [],
            steps: [],
            cookTime: '10m',
            tips: '',
        };

        it('should accept valid meal types', () => {
            const meals = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert'];
            meals.forEach(meal => {
                const result = RecipeSchema.safeParse({ ...baseRecipe, meal });
                expect(result.success, `meal: ${meal}`).toBe(true);
            });
        });

        it('should reject invalid meal types', () => {
            const result = RecipeSchema.safeParse({ ...baseRecipe, meal: 'brunch' });
            expect(result.success).toBe(false);
        });

        it('should accept valid difficulty values', () => {
            const difficulties = ['easy', 'normal', 'hard'];
            difficulties.forEach(difficulty => {
                const result = RecipeSchema.safeParse({ ...baseRecipe, meal: 'dinner', difficulty });
                expect(result.success, `difficulty: ${difficulty}`).toBe(true);
            });
        });

        it('should accept valid cost values', () => {
            const costs = ['low', 'mid', 'high'];
            costs.forEach(cost => {
                const result = RecipeSchema.safeParse({ ...baseRecipe, meal: 'dinner', cost });
                expect(result.success, `cost: ${cost}`).toBe(true);
            });
        });
    });
});
