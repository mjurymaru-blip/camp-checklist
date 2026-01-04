import { z } from 'zod';

/**
 * Recipe JSON Validation Schema
 * 
 * Validates recipe data from JSON files to ensure data integrity.
 * Invalid recipes are logged and excluded from the result.
 */

// Meal type enum
const MealSchema = z.enum(['dinner', 'breakfast', 'lunch', 'snack', 'dessert']);

// Difficulty enum
const DifficultySchema = z.enum(['easy', 'normal', 'hard']);

// Cost enum  
const CostSchema = z.enum(['low', 'mid', 'high']);

// Cleanup level enum
const CleanupLevelSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);

// Main Recipe Schema
export const RecipeSchema = z.object({
    // Required fields
    id: z.string().min(1),
    name: z.string().min(1),
    meal: MealSchema,
    description: z.string(),
    ingredients: z.array(z.string()),
    requiredGear: z.array(z.string()),
    usedGearIds: z.array(z.string()),
    usedHeatSourceIds: z.array(z.string()),
    steps: z.array(z.string()),
    cookTime: z.string(),
    tips: z.string(),

    // Optional fields
    servings: z.number().positive().optional(),
    difficulty: DifficultySchema.optional(),
    season: z.array(z.string()).optional(),
    calories: z.string().optional(),
    activeTime: z.string().optional(),
    cleanupLevel: CleanupLevelSchema.optional(),
    prePrep: z.boolean().optional(),
    cost: CostSchema.optional(),
    isVegetarian: z.boolean().optional(),
    reason: z.string().optional(),
    // New fields for enhanced filtering
    kidFriendly: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
});

// Type inferred from schema
export type ValidatedRecipe = z.infer<typeof RecipeSchema>;

/**
 * Validates an array of recipe data and returns only valid recipes.
 * Invalid recipes are logged to console for debugging.
 * 
 * @param data - Unknown array of recipe data
 * @returns Array of validated recipes
 */
export const validateRecipes = (data: unknown[]): ValidatedRecipe[] => {
    const validRecipes: ValidatedRecipe[] = [];
    let invalidCount = 0;

    for (const item of data) {
        const result = RecipeSchema.safeParse(item);
        if (result.success) {
            validRecipes.push(result.data);
        } else {
            invalidCount++;
            // Log the first error for debugging
            const firstError = result.error.issues[0];
            console.warn(
                `[Recipe Validation] Invalid recipe:`,
                typeof item === 'object' && item !== null ? (item as { id?: string; name?: string }).name || (item as { id?: string }).id : 'unknown',
                `- ${firstError?.path.join('.')}: ${firstError?.message}`
            );
        }
    }

    if (invalidCount > 0) {
        console.warn(`[Recipe Validation] Excluded ${invalidCount} invalid recipe(s) out of ${data.length}`);
    }

    return validRecipes;
};

/**
 * Validates a single recipe and returns it if valid, null otherwise.
 */
export const validateSingleRecipe = (data: unknown): ValidatedRecipe | null => {
    const result = RecipeSchema.safeParse(data);
    if (result.success) {
        return result.data;
    }
    console.warn('[Recipe Validation] Invalid recipe:', result.error.issues[0]?.message);
    return null;
};
