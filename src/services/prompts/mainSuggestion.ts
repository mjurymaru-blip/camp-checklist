import type { MenuRequest } from '../../types';

/**
 * ラベル変換ヘルパー（共通）
 */
export function getLabels(request: MenuRequest) {
    return {
        participants: { solo: 'ソロ（1人）', pair: 'ペア（2人）', group: 'グループ（3人以上）' }[request.participants],
        season: { spring: '春', summer: '夏', autumn: '秋', winter: '冬' }[request.season],
        effort: { easy: '手抜き（簡単・時短）', normal: '普通', elaborate: 'こだわり（手間をかける）' }[request.effort],
        focus: { breakfast: '朝食', lunch: '昼食', dinner: '夕食' }[request.focus],
    };
}

/**
 * Step 1: メイン候補のプロンプト作成 (汎用)
 */
export function buildMainSuggestionPrompt(
    request: MenuRequest,
    gearNames: string,
    heatNames: string,
    recipeContext: string,
    isWinter: boolean,
    hasWoodStove: boolean,
    mealType: string
): string {
    const labels = getLabels(request);
    const contextInstruction = mealType === 'dinner'
        ? ''
        : 'If standard recipes for this meal type are available in the context, use them. Otherwise, generate robust camping recipes.';

    return `あなたはキャンプ料理の専門家です。以下の条件に基づき、**${mealType.toUpperCase()}のメインディッシュ候補を5つ**提案してください。

## ユーザーの希望
- 参加人数: ${labels.participants}
- 季節: ${labels.season}
- 手間レベル: ${labels.effort}
- 食事タイプ: ${mealType}
${request.category ? `- **カテゴリ指定（絶対条件）**: ユーザーは「${request.category}」を強く希望しています。必ずこのカテゴリに合致する料理を提案してください。` : ''}

## 使用可能な調理器具
${gearNames || '（未設定）'}

## 使用可能な熱源
${heatNames || '（未設定）'}

## 制約事項
1. **所持ギアと熱源のみ使用**: これ以外の道具は絶対に使わないでください。
2. **IDの正確性**: usedGearIds / usedHeatSourceIds は提供されたIDを正確に使用してください。
${isWinter && hasWoodStove ? '3. **薪ストーブ活用**: 冬で薪ストーブがあるため、煮込みやオーブン料理を優先してください。' : ''}
4. **知識ベースの活用**: 以下のリストにあるレシピを参考にしつつ、カテゴリ指定があればそれを最優先してください。${contextInstruction}

## 知識ベース
${recipeContext}

## 回答形式（JSON）
配列で5つのレシピを返してください。
{
  "recipes": [
    {
      "name": "料理名",
      "meal": "${mealType}",
      "description": "魅力的な説明（なぜこれがおすすめか）",
      "reason": "このレシピを選んだ理由（例：旬の食材、薪ストーブ活用など）",
      "ingredients": ["材料1", "材料2"],
      "requiredGear": ["必要な器具"],
      "usedGearIds": ["id1"],
      "usedHeatSourceIds": ["id2"],
      "steps": ["手順1"],
      "cookTime": "約30分",
      "tips": "コツ"
    }
  ]
}`;
}
