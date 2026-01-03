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
export async function testApiConnection(apiKey: string, model: string = 'gemini-1.5-flash'): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
 * 利用可能なモデル一覧を取得
 */
export async function fetchAvailableModels(apiKey: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('モデルリストの取得に失敗しました');
    }

    const data = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.models || [])
      .filter((m: any) => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((m: any) => m.name.replace('models/', ''));

  } catch (error) {
    console.error('Failed to fetch models:', error);
    return [];
  }
}

// ------ Private Helpers ------

function formatContext(ownedGears: CookingGear[], ownedHeatSources: HeatSource[], availableRecipes: Recipe[]) {
  const gearNames = ownedGears.filter(g => g.owned).map(g => `${g.name} (ID: ${g.id})`).join(', ');
  const heatNames = ownedHeatSources.filter(h => h.owned).map(h => `${h.name} (ID: ${h.id})`).join(', ');

  const recipeContext = availableRecipes.length > 0
    ? availableRecipes.map(r => `
      - 名前: ${r.name}
      - 特徴: ${r.description}
      - 季節: ${r.season ? r.season.join('/') : '指定なし'}
      - 難易度: ${r.difficulty}
      - メイン具材: ${r.ingredients.slice(0, 5).join(', ')}
    `).join('\n')
    : '（外部レシピ情報なし。一般的なキャンプ知識に基づいて回答してください）';

  return { gearNames, heatNames, recipeContext };
}

function getLabels(request: MenuRequest) {
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
function buildMainSuggestionPrompt(
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

/**
 * Step 2: フルコース（夕食以外）のプロンプト作成
 */
function buildCoursePrompt(
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

/**
 * AIレスポンスをパース
 */
function parseRecipes(data: unknown): Recipe[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = (data as any)?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      console.error('parseRecipes: No content in response. Raw data:', JSON.stringify(data).slice(0, 500));
      throw new Error('No content in response');
    }

    let jsonStr = content;
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (jsonError) {
      console.error('parseRecipes: JSON parse failed. Raw content:', jsonStr.slice(0, 500));
      throw jsonError;
    }

    const recipes = parsed.recipes || parsed || [];
    console.log('parseRecipes: Parsed recipes count:', Array.isArray(recipes) ? recipes.length : 'not-array');

    if (!Array.isArray(recipes)) {
      console.warn('parseRecipes: recipes is not an array, returning empty');
      return [];
    }

    // UUID生成 (簡易版) とバリデーション
    const generateId = () => {
      try {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
          return crypto.randomUUID();
        }
      } catch (e) {
        console.warn('crypto.randomUUID failed, using fallback');
      }
      return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return recipes.map((r: any, index: number) => {
      if (!r || typeof r !== 'object') {
        console.warn(`parseRecipes: Invalid recipe at index ${index}:`, r);
        return null;
      }
      return {
        id: generateId(),
        name: r.name || '名称不明',
        meal: r.meal || 'dinner',
        description: r.description || '',
        reason: r.reason || '',
        ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
        requiredGear: Array.isArray(r.requiredGear) ? r.requiredGear : [],
        usedGearIds: Array.isArray(r.usedGearIds) ? r.usedGearIds : [],
        usedHeatSourceIds: Array.isArray(r.usedHeatSourceIds) ? r.usedHeatSourceIds : [],
        steps: Array.isArray(r.steps) ? r.steps : [],
        cookTime: r.cookTime || '',
        tips: r.tips || ''
      };
    }).filter(Boolean) as Recipe[];

  } catch (error) {
    console.error('parseRecipes: Failed to parse recipes:', error);
    throw new Error(`AIからの応答を正常に読み取れませんでした。もう一度お試しください。(${error instanceof Error ? error.message : 'Unknown'})`);
  }
}

async function callGeminiApi(apiKey: string, prompt: string, model: string): Promise<Recipe[]> {
  const MAX_RETRIES = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
        const errorData = await response.json().catch(() => ({}));
        const status = response.status;
        const errorMessage = errorData.error?.message || `Status ${status}`;

        // 503 (Overloaded) or 429 (Rate Limit) の場合はリトライ
        if (status === 503 || status === 429 || errorMessage.includes('overloaded')) {
          console.warn(`API Overloaded (Attempt ${attempt + 1}/${MAX_RETRIES}): ${errorMessage}`);
          if (attempt < MAX_RETRIES - 1) {
            const waitTime = 2000 * (attempt + 1); // 2s, 4s...
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          } else {
            throw new Error('現在APIサーバーが大変混み合っています。しばらく時間を置いてから再度お試しください。(503 Overloaded)');
          }
        }

        throw new Error(errorMessage || 'API request failed');
      }

      const data = await response.json();
      return parseRecipes(data);

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      // ネットワークエラー等の場合も、最後の試行でなければリトライする？ 
      // いや、fetch自体の失敗(オフライン等)は即エラーで良いか。今回はOverloaded対策なので、ループ継続はstatus判定内で行う。
      // ただし、上記 throw new Error で投げたものはここでキャッチされるので、リトライしたい場合はループ構造に注意。

      // シンプルにするため、上記 if ブロック内で continue している。
      // ここに来るのは「リトライ対象外のエラー」か「リトライ上限後のエラー」。
      throw lastError;
    }
  }
  throw lastError || new Error('Unknown error');
}

// ------ Public API ------

/**
 * Step 1: メインの提案 (5品) - 指定された食事タイプで生成
 */
export async function generateMainSuggestions(
  apiKey: string,
  request: MenuRequest,
  ownedGears: CookingGear[],
  ownedHeatSources: HeatSource[],
  availableRecipes: Recipe[] = [],
  model: string = 'gemini-1.5-flash',
  mealType: 'breakfast' | 'lunch' | 'dinner' = 'dinner'
): Promise<Recipe[]> {
  const { gearNames, heatNames, recipeContext } = formatContext(ownedGears, ownedHeatSources, availableRecipes);
  const isWinter = request.season === 'winter';
  const hasWoodStove = ownedHeatSources.some(h => h.id === 'wood-stove' && h.owned);

  const prompt = buildMainSuggestionPrompt(request, gearNames, heatNames, recipeContext, isWinter, hasWoodStove, mealType);
  return callGeminiApi(apiKey, prompt, model);
}

/**
 * Step 2: 夕食以外のコース提案 (4品)
 */
export async function generateCourseBasedOnDinner(
  apiKey: string,
  dinnerRecipe: Recipe,
  request: MenuRequest,
  ownedGears: CookingGear[],
  ownedHeatSources: HeatSource[],
  availableRecipes: Recipe[] = [],
  model: string = 'gemini-1.5-flash'
): Promise<Recipe[]> {
  const { gearNames, heatNames, recipeContext } = formatContext(ownedGears, ownedHeatSources, availableRecipes);

  const prompt = buildCoursePrompt(dinnerRecipe, request, gearNames, heatNames, recipeContext);
  return callGeminiApi(apiKey, prompt, model);
}

/**
 * Legacy: 一括提案 (互換性のため残すまたは削除。今回はUI側で使い分けるため残さないか、あるいは上記2つに置換)
 * -> コンパイルエラー対策のため、generateMenuSuggestion は generateDinnerSuggestions のラッパーとして残すか、削除して呼び出し元を修正する。
 * 今回は呼び出し元(MenuSuggestion.tsx)も修正予定なので、削除してOKだが、安全のため一旦残す。
 */
export async function generateMenuSuggestion(
  apiKey: string,
  request: MenuRequest,
  ownedGears: CookingGear[],
  ownedHeatSources: HeatSource[],
  availableRecipes: Recipe[] = [],
  model: string = 'gemini-1.5-flash'
): Promise<Recipe[]> {
  // Legacy support: Just return dinners
  return generateMainSuggestions(apiKey, request, ownedGears, ownedHeatSources, availableRecipes, model, 'dinner');
}
