import type { MenuRequest, Recipe, CookingGear, HeatSource } from '../types';

/**
 * 現在の月から季節を自動判定
 */
export function getSeasonFromMonth(): MenuRequest['season'] {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

/**
 * APIキーの接続テスト
 */
export async function testApiConnection(apiKey: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hello' }] }],
        }),
      }
    );

    if (response.ok) {
      return { success: true, message: '接続成功！APIキーは有効です。' };
    } else {
      const error = await response.json();
      return { success: false, message: `エラー: ${error.error?.message || '不明なエラー'}` };
    }
  } catch (error) {
    return { success: false, message: `接続エラー: ${error instanceof Error ? error.message : '不明'}` };
  }
}

/**
 * プロンプトを構築
 */
function buildPrompt(
  request: MenuRequest,
  ownedGears: CookingGear[],
  ownedHeatSources: HeatSource[]
): string {
  const gearNames = ownedGears.filter(g => g.owned).map(g => `${g.name} (ID: ${g.id})`).join(', ');
  const heatNames = ownedHeatSources.filter(h => h.owned).map(h => `${h.name} (ID: ${h.id})`).join(', ');

  const participantsLabel = {
    solo: 'ソロ（1人）',
    pair: 'ペア（2人）',
    group: 'グループ（3人以上）',
  }[request.participants];

  const seasonLabel = {
    spring: '春',
    summer: '夏',
    autumn: '秋',
    winter: '冬',
  }[request.season];

  const effortLabel = {
    easy: '手抜き（簡単・時短）',
    normal: '普通',
    elaborate: 'こだわり（手間をかける）',
  }[request.effort];

  const focusLabel = {
    breakfast: '朝食',
    lunch: '昼食',
    dinner: '夕食',
  }[request.focus];

  const hasWoodStove = ownedHeatSources.some(h => h.id === 'wood-stove' && h.owned);
  const isWinter = request.season === 'winter';

  return `あなたはキャンプ料理の専門家です。以下の条件でキャンプ飯のメニューを3食分（朝・昼・晩）提案してください。

## 条件
- 参加人数: ${participantsLabel}
- 季節: ${seasonLabel}
- 手間レベル: ${effortLabel}
- 重点を置く食事: ${focusLabel}
${request.category ? `- 料理カテゴリ希望: ${request.category}` : ''}

## 使用可能な調理器具
${gearNames || '（未設定）'}

## 使用可能な熱源
${heatNames || '（未設定）'}

## 重要な制約（必ず守ってください）
1. **所持ギアと熱源のみ使用**: 上記リストにある調理器具と熱源のみを使ってください。
2. **器具の使い回し最優先**: ${focusLabel}で使うメイン調理器具を、他の食事でも積極的に再利用してください。持参する道具の総数を最小化することが最重要です。
3. **IDでの返却**: usedGearIds と usedHeatSourceIds は、上記で示したID（例: iron-plate, wood-stove）を使って返してください。
${isWinter && hasWoodStove ? '4. **薪ストーブ活用**: 冬で薪ストーブがあるため、天板での煮込みや保温、オーブン調理を積極的に活用してください。' : ''}

## 回答形式（JSON）
以下の形式で、正確なJSONを返してください。説明文や前置きは不要です。

{
  "recipes": [
    {
      "name": "料理名",
      "meal": "breakfast" | "lunch" | "dinner",
      "description": "一言説明",
      "ingredients": ["材料1", "材料2"],
      "requiredGear": ["必要な器具（表示名）"],
      "usedGearIds": ["gear-id-1"],
      "usedHeatSourceIds": ["heat-source-id-1"],
      "steps": ["手順1", "手順2"],
      "cookTime": "約15分",
      "tips": "ワンポイントアドバイス（任意）"
    }
  ]
}`;
}

/**
 * AIレスポンスをパース
 */
function parseRecipes(data: unknown): Recipe[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = (data as any)?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error('No content in response');

    // JSONブロックを抽出（```json ... ``` の場合も対応）
    let jsonStr = content;
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    const parsed = JSON.parse(jsonStr);
    return parsed.recipes || [];
  } catch (error) {
    console.error('Failed to parse recipes:', error);
    throw new Error('レシピのパースに失敗しました');
  }
}

/**
 * メニュー提案を生成
 */
export async function generateMenuSuggestion(
  apiKey: string,
  request: MenuRequest,
  ownedGears: CookingGear[],
  ownedHeatSources: HeatSource[]
): Promise<Recipe[]> {
  const prompt = buildPrompt(request, ownedGears, ownedHeatSources);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }

  const data = await response.json();
  return parseRecipes(data);
}
