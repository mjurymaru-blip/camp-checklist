import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useGearStore } from '../stores/gearStore';
import { useChecklistStore } from '../stores/checklistStore';
import { generateMainSuggestions, generateCourseBasedOnDinner, getSeasonFromMonth } from '../services/geminiService';
import { buildShoppingList, toChecklistItems } from '../utils/shoppingListUtils';
import type { MenuRequest, Recipe, SavedRecipe } from '../types';
import { useRateLimiter } from '../hooks/useRateLimiter';

export const MenuSuggestion = () => {
    const { geminiApiKey, cookingGears, heatSources, apiModel } = useGearStore();
    const [loading, setLoading] = useState(false);
    const [allRecipes, setAllRecipes] = useState<Recipe[]>([]); // 全データ保持用
    const [recipes, setRecipes] = useState<Recipe[]>([]); // 表示用（フィルタ反映後 or AI結果）

    // 2段階フロー用ステート
    const [suggestionStep, setSuggestionStep] = useState<'input' | 'dinner-selection' | 'result'>('input');
    const [dinnerCandidates, setDinnerCandidates] = useState<Recipe[]>([]);
    const [selectedDinner, setSelectedDinner] = useState<Recipe | null>(null);
    const [loadingRecipeId, setLoadingRecipeId] = useState<string | null>(null); // 特定ボタンのみloading

    // 買い物リストモーダル用ステート
    const [showShoppingModal, setShowShoppingModal] = useState(false);
    const [targetChecklistId, setTargetChecklistId] = useState<string | null>(null);
    const [selectedRecipesForShopping, setSelectedRecipesForShopping] = useState<Set<string>>(new Set()); // チェックリストに追加するレシピを選択
    const { checklists, addItem, saveRecipes } = useChecklistStore();

    // 初回ロード時にレシピデータをフェッチ
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                // インデックスファイルを読み込み
                // GitHub Pagesのサブディレクトリ対策: BASE_URLを利用
                const baseUrl = import.meta.env.BASE_URL;
                const indexUrl = `${baseUrl}recipes/index.json`.replace('//', '/');

                const indexResponse = await fetch(indexUrl);
                if (!indexResponse.ok) throw new Error('レシピインデックスの取得に失敗しました');
                const indexData = await indexResponse.json();
                const files: string[] = indexData.files;

                // 各レシピファイルを並列で取得
                const promises = files.map(file => {
                    const fileUrl = `${baseUrl}recipes/${file}`.replace('//', '/');
                    return fetch(fileUrl).then(res => {
                        if (!res.ok) return []; // 失敗しても他のファイルは読み込む
                        return res.json();
                    });
                });

                const results = await Promise.all(promises);
                const combinedRecipes = results.flat(); // 配列を平坦化

                setAllRecipes(combinedRecipes);
                // 初期表示は空にするため、setRecipes(combinedRecipes) はしない
            } catch (err) {
                console.error('Failed to load recipes:', err);
                setError('レシピデータの読み込みに失敗しました。');
            }
        };

        fetchRecipes();
    }, []);



    const [error, setError] = useState<string | null>(null);

    const [request, setRequest] = useState<MenuRequest>({
        participants: 'pair',
        season: getSeasonFromMonth(),
        effort: 'normal',
        focus: 'dinner',
        category: ''
    });

    // フィルタリング用のState

    const [activeFilters, setActiveFilters] = useState<{
        season?: string;
        difficulty?: string;
        cost?: string;
    }>({});

    // フィルタ条件変更時に表示用レシピを更新
    useEffect(() => {
        // 全データ未ロードなら何もしない
        if (allRecipes.length === 0) return;

        // フィルタが全て未設定なら、表示を空にする（初期状態のまま）
        // という要望だが、「フィルタする前」＝「何も選んでいない状態」。
        // しかし「検索」ボタンなどはないので、フィルタボタンを押した瞬間に表示されるべき。
        // かつ、ユーザーが「何も選んでいない」状態に戻したらどうするか？
        // 「初期表示で大量に出るのはやめたい」 -> 「検索意図がないのに表示されるのが嫌」
        // なので、一つでもフィルタがあれば表示、でよいか？
        // あるいはAPIキー設定済みのAI生成結果が表示された後は、フィルタ解除しても残るべき。

        const hasActiveFilter = Object.values(activeFilters).some(v => v !== undefined);

        // AI生成結果（recipesにあってallRecipesにないもの、も区別が難しいので）
        // シンプルに:
        // 1. フィルタがある -> allRecipesから抽出して表示
        // 2. フィルタがない -> 
        //    a. まだAI生成していない -> 非表示 (empty)
        //    b. AI生成後 -> そのまま表示維持？
        // 
        // ここで「AI生成結果」と「Githubレシピ」が混ざるのがややこしい。
        // AI結果は `recipes` に直に入れられる。
        // フィルタ操作をすると、GitHubデータから再検索されて上書きされてしまう。
        // これは仕様として「フィルタ＝Githubデータの検索」と割り切るのがシンプル。
        // 
        // なので、「フィルタが一つでもあれば表示、なければ非表示」とする。

        if (!hasActiveFilter) {
            // フィルタ全解除時は表示をクリアする（要望通り）
            // ただし、AI生成直後かもしれないので、そこをどうするか。
            // ユーザーが意図的に「クリア」ボタンを押したわけではなく、トグルで消した場合。
            // 一旦、フィルタ解除＝クリアとする。
            // setRecipes([]);
            // いや、AI生成した結果を見ている最中にフィルタを触ると消えてしまうのは最悪だ。
            // AI生成中かどうかのフラグ、あるいは「AI結果モード」が必要か。
            // 
            // 妥協案: 初期ロード直後だけ隠す。
            // `hasInteracted` stateを持つ。
            return;
        }

        const filtered = allRecipes.filter(recipe => {
            if (activeFilters.season && !recipe.season?.includes(activeFilters.season)) return false;
            if (activeFilters.difficulty && recipe.difficulty !== activeFilters.difficulty) return false;
            if (activeFilters.cost && recipe.cost !== activeFilters.cost) return false;
            return true;
        });
        setRecipes(filtered);

    }, [activeFilters, allRecipes]);

    // 分量計算ロジック
    const getTargetServings = (participants: MenuRequest['participants']): number => {
        switch (participants) {
            case 'solo': return 1;
            case 'pair': return 2;
            case 'group': return 4;
            default: return 2;
        }
    };

    const scaleIngredients = (ingredients: string[], baseServings: number, targetServings: number): string[] => {
        if (baseServings === targetServings) return ingredients;
        const ratio = targetServings / baseServings;

        return ingredients.map(line => {
            // 数値 + 単位 のパターンを検出して置換 (例: 200g, 1/2個, 3.5cm)
            // 分数(1/2)や少数(1.5)にも対応
            return line.replace(/(\d+(?:\.\d+)?|\d+\/\d+)([a-zA-Z]+|個|枚|本|g|ml|cc|cm|束|パック|かけ|片|大さじ|小さじ|合)/g, (_, num, unit) => {
                let value = 0;
                if (num.includes('/')) {
                    const [a, b] = num.split('/').map(Number);
                    value = a / b;
                } else {
                    value = parseFloat(num);
                }

                let scaled = value * ratio;
                // 小数点以下の処理: 整数に近い場合は整数に、そうでなければ小1まで
                if (Math.abs(scaled - Math.round(scaled)) < 0.05) {
                    scaled = Math.round(scaled);
                } else {
                    scaled = Math.round(scaled * 10) / 10;
                }

                return `${scaled}${unit}`;
            });
        });
    };

    // フィルタリング適用
    // filteredRecipes変数は不要になるため削除（recipesStateが常に表示用）
    // const filteredRecipes = recipes.filter(...) -> 削除

    const toggleFilter = (type: 'season' | 'difficulty' | 'cost', value: string) => {
        // UI操作でフィルタを変更したら、入力モードに戻る（AI結果をクリアして検索モードへ）
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
    };

    const { checkLimit, incrementUsage, remaining, limit } = useRateLimiter();

    const handleGenerate = async () => {
        if (!geminiApiKey) return;

        // 1. レート制限チェック
        if (!checkLimit()) {
            alert(`本日のAI利用上限（${limit}回）に達しました。\nまた明日ご利用ください。`);
            return;
        }

        // 2. ユーザー確認（誤操作防止）
        if (!window.confirm(`AIを呼び出して「夕食の候補」を生成しますか？\n（消費: 1回 / 本日の残り: ${remaining}回）`)) {
            return;
        }

        // 3. 回数消費
        incrementUsage();

        // フィルタリング処理（既存ロジック）- 候補選定のコンテキスト用
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
        // 検索時はフィルタをリセットしない方が親切かもしれないが、AIモードに入るので一旦クリア
        setActiveFilters({});

        try {
            // Step 1: 候補の生成 (夕食以外も対応)
            const result = await generateMainSuggestions(
                geminiApiKey,
                request,
                cookingGears,
                heatSources,
                candidates,
                apiModel,
                request.focus // mealType
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
    };

    const handleSelectCandidate = async (recipe: Recipe) => {
        if (!geminiApiKey) return;

        // 夕食の場合: フルコース生成へ (Step 2)
        if (request.focus === 'dinner') {
            // レート制限チェック
            if (!checkLimit()) {
                alert(`本日のAI利用上限に達しました。\n候補までは表示できましたが、フルコース生成はできませんでした。`);
                return;
            }
            incrementUsage(); // Step 2 cost

            setLoadingRecipeId(recipe.id);
            setError(null);
            setSelectedDinner(recipe);

            try {
                const candidates = allRecipes;
                const courseRecipes = await generateCourseBasedOnDinner(
                    geminiApiKey,
                    recipe,
                    request,
                    cookingGears,
                    heatSources,
                    candidates,
                    apiModel
                );

                const fullCourse = [recipe, ...courseRecipes];
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
            }
        }
        // 昼食・朝食の場合: そのまま完了
        else {
            setRecipes([recipe]);
            setSelectedDinner(recipe); // 名前表示用（便宜上セット）
            setSuggestionStep('result');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBackToInput = () => {
        setSuggestionStep('input');
        setDinnerCandidates([]);
        setRecipes([]);
    };



    return (
        <div className="main-content watercolor-bg">
            <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>メニュー提案</span>
                <NavLink to="/recipes/settings" style={{ fontSize: '1.5rem', textDecoration: 'none', lineHeight: 1 }}>
                    ⚙️
                </NavLink>
            </div>

            <div className="card card-static" style={{ display: suggestionStep === 'input' ? 'block' : 'none' }}>
                <div className="card-header">
                    <div className="card-title">🍲 条件を設定</div>
                </div>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* 人数 */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>参加人数</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {(['solo', 'pair', 'group'] as const).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setRequest({ ...request, participants: p })}
                                    className={`btn ${request.participants === p ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ flex: 1, fontSize: '0.875rem', padding: '8px' }}
                                >
                                    {{ solo: 'ソロ', pair: 'ペア', group: 'グループ' }[p]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 季節 */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>季節</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {(['spring', 'summer', 'autumn', 'winter'] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => setRequest({ ...request, season: s })}
                                    className={`btn ${request.season === s ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ flex: 1, fontSize: '0.875rem', padding: '8px' }}
                                >
                                    {{ spring: '春', summer: '夏', autumn: '秋', winter: '冬' }[s]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 手間 */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>手間レベル</label>
                        <select
                            value={request.effort}
                            onChange={(e) => setRequest({ ...request, effort: e.target.value as MenuRequest['effort'] })}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                        >
                            <option value="easy">手抜き（簡単・時短）</option>
                            <option value="normal">普通</option>
                            <option value="elaborate">こだわり（手間をかける）</option>
                        </select>
                    </div>

                    {/* 重点 */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>メインの食事</label>
                        <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>
                            {request.focus === 'dinner'
                                ? '※夕食は「フルコース提案」になります（AI消費: 2回）'
                                : '※朝食・昼食は「単品提案」になります（AI消費: 1回）'}
                        </p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {(['breakfast', 'lunch', 'dinner'] as const).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setRequest({ ...request, focus: f })}
                                    className={`btn ${request.focus === f ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ flex: 1, fontSize: '0.875rem', padding: '8px' }}
                                >
                                    {{ breakfast: '朝食', lunch: '昼食', dinner: '夕食' }[f]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* カテゴリ */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>食べたいもの（任意）</label>
                        <input
                            type="text"
                            value={request.category || ''}
                            onChange={(e) => setRequest({ ...request, category: e.target.value })}
                            placeholder="例: パスタ、肉料理、和食..."
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                        />
                    </div>

                    {geminiApiKey ? (
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="btn btn-primary btn-full"
                            style={{ marginTop: '8px', height: '48px', fontSize: '1rem', fontWeight: 600 }}
                        >
                            {loading ? 'AIが考え中...🍳' : `✨ 条件決定：${{ breakfast: '朝食', lunch: '昼食', dinner: '夕食' }[request.focus]}の候補を見る`}
                        </button>
                    ) : (
                        <div style={{ marginTop: '8px' }}>
                            <button
                                disabled
                                className="btn btn-secondary btn-full"
                                style={{ height: '48px', fontSize: '0.9rem', cursor: 'not-allowed', opacity: 0.7 }}
                            >
                                🔒 AI提案にはAPIキー設定が必要です
                            </button>
                            <NavLink to="/recipes/settings" style={{ display: 'block', textAlign: 'center', marginTop: '8px', fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                                ⚙️ 設定画面へ進む
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>

            {/* Step 2: 夕食選択画面 */}
            {suggestionStep === 'dinner-selection' && (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <button onClick={handleBackToInput} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
                            ← 条件に戻る
                        </button>
                    </div>

                    <h3 style={{ marginLeft: '8px', fontSize: '1.2rem', marginBottom: '16px' }}>
                        🍽️ {{ breakfast: '朝食', lunch: '昼食', dinner: '夕食' }[request.focus]}の候補を選んでください
                    </h3>
                    {request.focus === 'dinner' ? (
                        <p style={{ marginLeft: '8px', fontSize: '0.9rem', color: '#666', marginBottom: '24px' }}>
                            選んだ料理に合わせて、明日の朝食やランチも提案します。
                        </p>
                    ) : (
                        <p style={{ marginLeft: '8px', fontSize: '0.9rem', color: '#666', marginBottom: '24px' }}>
                            気に入ったものを選んでください。
                        </p>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {dinnerCandidates.map((recipe, index) => (
                            <div key={recipe.id || index} className="card" style={{ border: '2px solid transparent', transition: 'all 0.2s' }}>
                                <div className="card-header" style={{ background: '#fff8e1', borderBottom: '1px solid #ffe0b2' }}>
                                    <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                        <div>🌙 案{index + 1}: {recipe.name}</div>
                                        <span style={{ fontSize: '0.75rem', background: '#fff', padding: '2px 8px', borderRadius: '12px', border: '1px solid #ddd' }}>
                                            {recipe.cookTime}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ padding: '16px' }}>
                                    <p style={{ margin: '0 0 12px', fontWeight: 'bold', color: '#e65100' }}>{recipe.description}</p>
                                    {recipe.reason && <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '12px' }}>💡 {recipe.reason}</p>}

                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                        {recipe.ingredients.slice(0, 5).map((ing, i) => (
                                            <span key={i} style={{ fontSize: '0.75rem', background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px', color: '#555' }}>
                                                {ing}
                                            </span>
                                        ))}
                                        {recipe.ingredients.length > 5 && <span style={{ fontSize: '0.75rem', color: '#999' }}>...</span>}
                                    </div>

                                    <button
                                        onClick={() => handleSelectCandidate(recipe)}
                                        disabled={loadingRecipeId !== null}
                                        className="btn btn-primary btn-full"
                                        style={{ height: '40px' }}
                                    >
                                        {loadingRecipeId === recipe.id
                                            ? '生成中...'
                                            : (request.focus === 'dinner' ? 'これにする！👉 他の食事も決める' : 'これにする！(決定)')
                                        }
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* エラー表示 */}
            {error && (
                <div style={{
                    background: '#ffebee', color: '#d32f2f', padding: '16px',
                    borderRadius: '12px', marginTop: '16px', fontSize: '0.875rem',
                    border: '1px solid #ef5350'
                }}>
                    <b>エラーが発生しました:</b><br />{error}
                </div>
            )}

            {/* 結果表示 (Step 3 or フィルタ検索結果) */}
            {/* suggestionStep === 'dinner-selection' の時は非表示にする */}
            {suggestionStep !== 'dinner-selection' && recipes.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                    {suggestionStep === 'result' ? (
                        <div style={{ marginBottom: '16px' }}>
                            <button onClick={handleBackToInput} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
                                ← 初めからやり直す
                            </button>
                            <h3 style={{ marginTop: '16px', fontSize: '1.2rem' }}>
                                🎉 {request.focus === 'dinner' ? 'ご提案のキャンプフルコース' : '決定したレシピ'}
                            </h3>
                            {selectedDinner && <p style={{ fontSize: '0.9rem', color: '#666' }}>メイン：{selectedDinner.name}</p>}

                            {/* チェックリストに追加ボタン */}
                            <button
                                onClick={() => {
                                    // 全レシピを選択した状態でモーダルを開く
                                    setSelectedRecipesForShopping(new Set(recipes.map(r => r.id)));
                                    // アクティブなチェックリストがあればそれをデフォルトに
                                    const activeChecklists = checklists.filter(c => !c.isArchived);
                                    if (activeChecklists.length > 0) {
                                        setTargetChecklistId(activeChecklists[0].id);
                                    }
                                    setShowShoppingModal(true);
                                }}
                                className="btn btn-secondary"
                                style={{ marginTop: '12px', fontSize: '0.875rem' }}
                            >
                                📋 チェックリストに追加
                            </button>
                        </div>
                    ) : (
                        <h3 style={{ marginLeft: '8px', fontSize: '1.1rem', marginBottom: '16px' }}>🔍 レシピ検索結果</h3>
                    )}

                    {/* 絞り込みチップス */}
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px', paddingLeft: '8px' }}>
                        {/* 難易度フィルタ */}
                        {(['easy', 'normal', 'hard'] as const).map(d => (
                            <button key={d}
                                onClick={() => toggleFilter('difficulty', d)}
                                className="btn"
                                style={{
                                    padding: '4px 12px', fontSize: '0.75rem', borderRadius: '20px',
                                    background: activeFilters.difficulty === d ? 'var(--color-primary)' : '#f0f0f0',
                                    color: activeFilters.difficulty === d ? '#fff' : '#333',
                                    border: 'none', whiteSpace: 'nowrap'
                                }}>
                                {{ easy: '★ 簡単', normal: '★★ 普通', hard: '★★★ 本格' }[d]}
                            </button>
                        ))}
                        {/* コストフィルタ */}
                        {(['low', 'mid', 'high'] as const).map(c => (
                            <button key={c}
                                onClick={() => toggleFilter('cost', c)}
                                className="btn"
                                style={{
                                    padding: '4px 12px', fontSize: '0.75rem', borderRadius: '20px',
                                    background: activeFilters.cost === c ? 'var(--color-secondary)' : '#f0f0f0',
                                    color: activeFilters.cost === c ? '#fff' : '#333',
                                    border: 'none', whiteSpace: 'nowrap'
                                }}>
                                {{ low: '💰 安い', mid: '💰💰 普通', high: '💰💰💰 贅沢' }[c]}
                            </button>
                        ))}
                        {/* 季節フィルタ */}
                        {(['winter', 'summer', 'autumn', 'spring'] as const).map(s => (
                            <button key={s}
                                onClick={() => toggleFilter('season', s)}
                                className="btn"
                                style={{
                                    padding: '4px 12px', fontSize: '0.75rem', borderRadius: '20px',
                                    background: activeFilters.season === s ? '#2196F3' : '#f0f0f0',
                                    color: activeFilters.season === s ? '#fff' : '#333',
                                    border: 'none', whiteSpace: 'nowrap'
                                }}>
                                {{ winter: '⛄️ 冬', summer: '🌻 夏', autumn: '🍁 秋', spring: '🌸 春' }[s]}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {recipes.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '32px', color: '#666' }}>
                                {Object.values(activeFilters).some(v => v) ? (
                                    <>条件に合うレシピが見つかりませんでした 😿<br />フィルタを変更してみてください。</>
                                ) : (
                                    <>条件を選択するとレシピが表示されます 📝<br />またはAIに提案を依頼してください ✨</>
                                )}
                            </div>
                        ) : (
                            recipes.map((recipe, index) => {
                                // ターゲット人数
                                const targetServings = getTargetServings(request.participants);
                                // 分量計算後の材料リスト
                                const scaledIngredients = recipe.servings
                                    ? scaleIngredients(recipe.ingredients, recipe.servings, targetServings)
                                    : recipe.ingredients;

                                return (
                                    <div key={index} className="card">
                                        <div className="card-header" style={{ background: '#f5f5f5', borderBottom: '1px solid var(--color-border)' }}>
                                            <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                <div>
                                                    <span style={{ marginRight: '8px' }}>
                                                        {{ breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍪', dessert: '🍰' }[recipe.meal] || ''}
                                                    </span>
                                                    {recipe.name}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 'normal', background: '#fff', padding: '2px 8px', borderRadius: '12px', border: '1px solid #ddd' }}>
                                                    {targetServings}人分
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                                {recipe.activeTime && <span style={{ fontSize: '0.7rem', background: '#e0f2f1', color: '#00695c', padding: '2px 6px', borderRadius: '4px' }}>⏱ {recipe.activeTime}</span>}
                                                {recipe.calories && <span style={{ fontSize: '0.7rem', background: '#fff3e0', color: '#ef6c00', padding: '2px 6px', borderRadius: '4px' }}>🔥 {recipe.calories}</span>}
                                                {recipe.cost && <span style={{ fontSize: '0.7rem', background: '#f3e5f5', color: '#7b1fa2', padding: '2px 6px', borderRadius: '4px' }}>💰 {{ low: '安', mid: '普', high: '高' }[recipe.cost]}</span>}
                                            </div>

                                            <p style={{ margin: '0 0 16px', lineHeight: 1.6 }}>{recipe.description}</p>
                                            {recipe.reason && <p style={{ fontSize: '0.9rem', color: '#666', background: '#f9f9f9', padding: '8px', borderRadius: '4px', marginBottom: '16px' }}>💡 {recipe.reason}</p>}

                                            <div style={{ marginBottom: '16px' }}>
                                                <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.875rem', color: 'var(--color-primary)' }}>
                                                    🥕 材料 <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#666' }}>(自動計算)</span>
                                                </div>
                                                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.875rem' }}>
                                                    {scaledIngredients.map((ing, i) => <li key={i}>{ing}</li>)}
                                                </ul>
                                            </div>

                                            <div style={{ marginBottom: '16px' }}>
                                                <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.875rem', color: '#FF9800' }}>🍳 使う道具</div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                    {recipe.requiredGear.map((gear, i) => (
                                                        <span key={i} style={{
                                                            background: '#fff3e0', color: '#e65100',
                                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem'
                                                        }}>
                                                            {gear}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.875rem' }}>🔥 手順 ({recipe.cookTime})</div>
                                                <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                                                    {recipe.steps.map((step, i) => <li key={i} style={{ marginBottom: '4px' }}>{step}</li>)}
                                                </ol>
                                            </div>

                                            {recipe.tips && (
                                                <div style={{ marginTop: '16px', padding: '12px', background: '#e3f2fd', borderRadius: '8px', fontSize: '0.875rem', color: '#0d47a1' }}>
                                                    💡 <b>Tips:</b> {recipe.tips}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            <div style={{ height: '80px' }} />

            {/* 買い物リスト確認モーダル */}
            {showShoppingModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, padding: '16px'
                }}>
                    <div style={{
                        background: '#fff', borderRadius: '16px', maxWidth: '450px', width: '100%',
                        maxHeight: '85vh', overflow: 'auto', boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>🛒 食材をチェックリストに追加</h3>
                        </div>
                        <div style={{ padding: '16px' }}>
                            {/* 追加先リスト選択 */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>追加先リスト</label>
                                <select
                                    value={targetChecklistId || ''}
                                    onChange={(e) => setTargetChecklistId(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                                >
                                    {checklists.filter(c => !c.isArchived).map(c => (
                                        <option key={c.id} value={c.id}>{c.title}</option>
                                    ))}
                                </select>
                                {checklists.filter(c => !c.isArchived).length === 0 && (
                                    <p style={{ color: '#d32f2f', fontSize: '0.8rem', marginTop: '8px' }}>
                                        ❗ アクティブなチェックリストがありません。先にリストを作成してください。
                                    </p>
                                )}
                            </div>

                            {/* レシピ選択チェックボックス */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
                                    追加するレシピを選択
                                </label>
                                <div style={{ background: '#f5f5f5', borderRadius: '8px', padding: '8px' }}>
                                    {recipes.map(recipe => (
                                        <label
                                            key={recipe.id}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                padding: '8px', cursor: 'pointer',
                                                borderRadius: '6px', marginBottom: '4px',
                                                background: selectedRecipesForShopping.has(recipe.id) ? '#e3f2fd' : 'transparent'
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedRecipesForShopping.has(recipe.id)}
                                                onChange={(e) => {
                                                    const newSet = new Set(selectedRecipesForShopping);
                                                    if (e.target.checked) {
                                                        newSet.add(recipe.id);
                                                    } else {
                                                        newSet.delete(recipe.id);
                                                    }
                                                    setSelectedRecipesForShopping(newSet);
                                                }}
                                                style={{ width: '18px', height: '18px' }}
                                            />
                                            <span style={{ fontSize: '0.9rem' }}>
                                                {({ breakfast: '🍳', lunch: '🍞', dinner: '🍖', snack: '🍿', dessert: '🍰' } as Record<string, string>)[recipe.meal] || '🍽️'} {recipe.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* 食材プレビュー */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
                                    追加される食材（{buildShoppingList(recipes.filter(r => selectedRecipesForShopping.has(r.id))).length}件）
                                </label>
                                <div style={{ maxHeight: '150px', overflow: 'auto', background: '#f9f9f9', borderRadius: '8px', padding: '8px' }}>
                                    {buildShoppingList(recipes.filter(r => selectedRecipesForShopping.has(r.id))).map((item, i) => (
                                        <div key={i} style={{ padding: '4px 8px', fontSize: '0.8rem', color: '#555' }}>
                                            {item.name}{item.amount ? `（${item.amount}）` : ''}
                                            <span style={{ color: '#999', marginLeft: '4px' }}>- {item.recipeName}</span>
                                        </div>
                                    ))}
                                    {selectedRecipesForShopping.size === 0 && (
                                        <p style={{ color: '#999', fontSize: '0.8rem', textAlign: 'center', padding: '16px' }}>
                                            レシピを選択してください
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '16px', borderTop: '1px solid #eee', display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => setShowShoppingModal(false)}
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={() => {
                                    if (!targetChecklistId) {
                                        alert('追加先のチェックリストを選択してください。');
                                        return;
                                    }
                                    const selectedRecipes = recipes.filter(r => selectedRecipesForShopping.has(r.id));
                                    const items = buildShoppingList(selectedRecipes);
                                    const itemsToAdd = toChecklistItems(items, 'food', true);
                                    itemsToAdd.forEach(item => {
                                        addItem(targetChecklistId, item);
                                    });

                                    // レシピスナップショットを保存
                                    const savedRecipes: SavedRecipe[] = selectedRecipes.map(r => ({
                                        id: r.id,
                                        name: r.name,
                                        meal: r.meal,
                                        ingredients: r.ingredients,
                                        steps: r.steps,
                                        cookTime: r.cookTime,
                                        tips: r.tips,
                                        savedAt: new Date().toISOString(),
                                    }));
                                    saveRecipes(targetChecklistId, savedRecipes);

                                    setShowShoppingModal(false);
                                    alert(`${itemsToAdd.length}件の食材と${savedRecipes.length}件のレシピを追加しました！`);
                                }}
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                                disabled={checklists.filter(c => !c.isArchived).length === 0 || selectedRecipesForShopping.size === 0}
                            >
                                追加する
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

