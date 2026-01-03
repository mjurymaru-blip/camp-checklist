import type { MenuRequest, Recipe } from '../../types';
import { getLabels } from './mainSuggestion';

/**
 * Step 2: フルコース（夕食以外）のプロンプト作成
 */
export function buildCoursePrompt(
    dinnerRecipe: Recipe,
    request: MenuRequest,
    gearNames: string,
    heatNames: string,
    _recipeContext: string
): string {
    const labels = getLabels(request);

    return `ユーザーは夕食を「**${dinnerRecipe.name}**」に決定しました。
この夕食に合わせて、**翌日の朝食、当日の昼食、おつまみ、デザート**を提案し、完璧なキャンプの献立を完成させてください。

## コンセプト
- **食材と道具の使い回し**: 夕食「${dinnerRecipe.name}」で使う食材（${dinnerRecipe.ingredients.join(', ')}）や、使用した調理器具（${dinnerRecipe.requiredGear.join(', ')}）を、他の食事でも積極的に活用し、荷物を減らせるように工夫してください。
- 季節感: ${labels.season}

## 提案する食事
1. 朝食 (Breakfast)
2. 昼食 (Lunch)
3. おつまみ (Snack)
4. デザート (Dessert) -> もしなければおつまみ2品目でも可

## 制約
- 参加人数: ${labels.participants}
- 手間レベル: ${labels.effort}
- 使用可能ギア: ${gearNames}
- 使用可能熱源: ${heatNames}

## 回答形式（JSON）
配列で4つのレシピ（朝・昼・つまみ・デザート）を返してください。
**各レシピには必ず ingredients, steps, cookTime, tips を含めてください。**
{
  "recipes": [
    {
      "name": "料理名",
      "meal": "breakfast" | "lunch" | "snack" | "dessert",
      "reason": "夕食の〇〇を使い回せるため、など",
      "description": "簡単な説明",
      "ingredients": ["食材1 分量", "食材2 分量"],
      "steps": ["手順1", "手順2", "手順3"],
      "cookTime": "約15分",
      "tips": "ポイントやコツ"
    }
  ]
}`;
}
