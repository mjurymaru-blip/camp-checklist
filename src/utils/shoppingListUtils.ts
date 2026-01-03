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
 * レシピ配列から買い物リストを生成
 * - レシピごとに食材をフラット化
 * - 同一名称の食材はマージせず、レシピ名を保持
 */
export function buildShoppingList(recipes: Recipe[]): ShoppingItem[] {
    const items: ShoppingItem[] = [];

    for (const recipe of recipes) {
        for (const ingredient of recipe.ingredients) {
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

