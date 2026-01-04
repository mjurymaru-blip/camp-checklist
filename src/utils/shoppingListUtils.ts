import type { Recipe, ChecklistItem } from '../types';

/**
 * 買い物リストアイテム（内部用）
 */
export interface ShoppingItem {
    name: string;
    amount?: string;
    recipeName: string; // どのレシピの食材か
    source: 'recipe';
}

/**
 * 材料の分量をスケーリング
 * @param ingredients 元の材料リスト
 * @param baseServings 元の人数（レシピのservings）
 * @param targetServings 目標人数
 */
export function scaleIngredients(
    ingredients: string[],
    baseServings: number,
    targetServings: number
): string[] {
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
}

/**
 * レシピ配列から買い物リストを生成
 * - レシピごとに食材をフラット化
 * - 同一名称の食材はマージせず、レシピ名を保持
 * @param recipes レシピ配列
 * @param targetServings 目標人数（指定時はスケーリング）
 */
export function buildShoppingList(recipes: Recipe[], targetServings?: number): ShoppingItem[] {
    const items: ShoppingItem[] = [];

    for (const recipe of recipes) {
        // スケーリング（targetServingsが指定されている場合）
        const ingredients = targetServings && recipe.servings
            ? scaleIngredients(recipe.ingredients, recipe.servings, targetServings)
            : recipe.ingredients;

        for (const ingredient of ingredients) {
            // "玉ねぎ 1個" や "玉ねぎ（1個）" のフォーマットを想定
            const match = ingredient.match(/^([^\s（(]+)[\s（(]*(.*)[\s）)]*$/);
            const name = match ? match[1].trim() : ingredient.trim();
            const amount = match && match[2] ? match[2].replace(/[）)]$/, '').trim() : undefined;

            items.push({
                name,
                amount,
                recipeName: recipe.name,
                source: 'recipe'
            });
        }
    }

    return items;
}

/**
 * ShoppingItem → ChecklistItem に変換
 * @param items 買い物リスト
 * @param categoryId カテゴリID（デフォルト: food）
 * @param includeRecipeName レシピ名をnoteに含めるか（デフォルト: true）
 */
export function toChecklistItems(
    items: ShoppingItem[],
    categoryId: string = 'food',
    includeRecipeName: boolean = true
): Omit<ChecklistItem, 'id'>[] {
    return items.map(item => ({
        name: item.amount ? `${item.name}（${item.amount}）` : item.name,
        categoryId,
        checked: false,
        note: includeRecipeName ? `${item.recipeName}用` : 'キャンプ飯用',
    }));
}
