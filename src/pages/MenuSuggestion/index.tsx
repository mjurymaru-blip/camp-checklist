import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useChecklistStore } from '../../stores/checklistStore';
import { useGearStore } from '../../stores/gearStore';
import { buildShoppingList, toChecklistItems } from '../../utils/shoppingListUtils';
import type { MenuRequest, SavedRecipe } from '../../types';
import { useMenuSuggestion } from './hooks/useMenuSuggestion';
import { RecipeCard } from './components/RecipeCard';

export const MenuSuggestion = () => {
    const { geminiApiKey } = useGearStore();
    const { checklists, addItem, saveRecipes } = useChecklistStore();

    // Use the custom hook for all suggestion logic
    const {
        loading,
        error,
        recipes,
        request,
        activeFilters,
        suggestionStep,
        dinnerCandidates,
        selectedDinner,
        loadingRecipeId,
        showCourseConfirm,
        pendingDinnerRecipe,
        setRequest,
        toggleFilter,
        handleGenerate,
        handleSelectCandidate,
        handleGenerateFullCourse,
        handleDinnerOnly,
        handleBackToInput,
        cancelCourseConfirm,
        getTargetServings,
        scaleIngredients,
    } = useMenuSuggestion();

    // Shopping modal state (local to this component)
    const [showShoppingModal, setShowShoppingModal] = useState(false);
    const [targetChecklistId, setTargetChecklistId] = useState<string | null>(null);
    const [selectedRecipesForShopping, setSelectedRecipesForShopping] = useState<Set<string>>(new Set());

    // Recipe expand state
    const [expandedRecipeIds, setExpandedRecipeIds] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        setExpandedRecipeIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const targetServings = getTargetServings(request.participants);

    return (
        <div className="main-content watercolor-bg">
            <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>メニュー提案</span>
                <NavLink to="/recipes/settings" style={{ fontSize: '1.5rem', textDecoration: 'none', lineHeight: 1 }}>
                    ⚙️
                </NavLink>
            </div>

            {/* Input Form */}
            <div className="card card-static" style={{ display: suggestionStep === 'input' ? 'block' : 'none' }}>
                <div className="card-header">
                    <div className="card-title">🍲 条件を設定</div>
                </div>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Participants */}
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

                    {/* Season */}
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

                    {/* Effort */}
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

                    {/* Focus */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>メインの食事</label>
                        <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>
                            {request.focus === 'dinner'
                                ? '※夕食のみ or フルコース提案を選択可（AI消費: 1〜2回）'
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

                    {/* Category */}
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
                        <div style={{ textAlign: 'center', padding: '16px', background: '#fff8e1', borderRadius: '12px' }}>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#f57f17' }}>
                                APIキーを設定するとAI提案が利用できます
                            </p>
                            <NavLink to="/recipes/settings" className="btn btn-secondary" style={{ marginTop: '12px', display: 'inline-block' }}>
                                ⚙️ 設定へ
                            </NavLink>
                        </div>
                    )}

                    {/* Filter chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#666', width: '100%' }}>📚 レシピ検索フィルタ:</span>
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
                                {{ easy: '🟢 簡単', normal: '🟡 普通', hard: '🔴 本格' }[d]}
                            </button>
                        ))}
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
                </div>
            </div>

            {/* Dinner Selection */}
            {suggestionStep === 'dinner-selection' && (
                <div className="card card-static">
                    <div className="card-header" style={{ background: '#3f51b5' }}>
                        <div className="card-title" style={{ color: 'white' }}>
                            🍽️ {{ breakfast: '朝食', lunch: '昼食', dinner: '夕食' }[request.focus]}の候補（{dinnerCandidates.length}件）
                        </div>
                    </div>
                    <div style={{ padding: '16px' }}>
                        <button onClick={handleBackToInput} className="btn btn-secondary" style={{ marginBottom: '16px', fontSize: '0.8rem' }}>
                            ← 条件設定に戻る
                        </button>
                        {dinnerCandidates.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                variant="candidate"
                                request={request}
                                loadingRecipeId={loadingRecipeId}
                                onSelect={handleSelectCandidate}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div style={{
                    background: '#ffebee', color: '#d32f2f', padding: '16px',
                    borderRadius: '12px', marginTop: '16px', fontSize: '0.875rem',
                    border: '1px solid #ef5350'
                }}>
                    <b>エラーが発生しました:</b><br />{error}
                </div>
            )}

            {/* Results */}
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

                            {/* Add to checklist button */}
                            <button
                                onClick={() => {
                                    setSelectedRecipesForShopping(new Set(recipes.map(r => r.id)));
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
                        <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>
                            🔍 検索結果（{recipes.length}件）
                        </h3>
                    )}

                    {/* Recipe list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {recipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                variant="result"
                                request={request}
                                targetServings={targetServings}
                                scaleIngredients={scaleIngredients}
                                onToggleExpand={toggleExpand}
                                isExpanded={expandedRecipeIds.has(recipe.id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div style={{ height: '80px' }} />

            {/* Shopping List Modal */}
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
                            {/* Checklist selection */}
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

                            {/* Recipe selection */}
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

                            {/* Ingredient preview */}
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

                            {/* Action buttons */}
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setShowShoppingModal(false)}
                                    className="btn btn-secondary"
                                    style={{ flex: 1 }}
                                >
                                    キャンセル
                                </button>
                                <button
                                    onClick={() => {
                                        if (!targetChecklistId) return;
                                        const selectedRecipes = recipes.filter(r => selectedRecipesForShopping.has(r.id));
                                        const items = buildShoppingList(selectedRecipes);
                                        const itemsToAdd = toChecklistItems(items, 'food', true);
                                        itemsToAdd.forEach(item => {
                                            addItem(targetChecklistId, item);
                                        });

                                        // Save recipe snapshots
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
                </div>
            )}

            {/* Course Confirm Modal */}
            {showCourseConfirm && pendingDinnerRecipe && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '16px'
                }}>
                    <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
                        <div className="card-header">
                            <div className="card-title">🍽️ メニュー構成を選択</div>
                        </div>
                        <div style={{ padding: '16px' }}>
                            <p style={{ marginBottom: '16px', textAlign: 'center' }}>
                                <strong>「{pendingDinnerRecipe.name}」</strong>を選択しました
                            </p>
                            <p style={{ marginBottom: '24px', textAlign: 'center', fontSize: '0.875rem', color: '#666' }}>
                                朝食・昼食・おやつも一緒に提案しますか？
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button
                                    onClick={handleGenerateFullCourse}
                                    className="btn btn-primary"
                                    style={{ padding: '12px', fontSize: '1rem' }}
                                >
                                    🍳 フルコースを生成する
                                    <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.8 }}>
                                        （AI追加リクエスト）
                                    </span>
                                </button>
                                <button
                                    onClick={handleDinnerOnly}
                                    className="btn btn-secondary"
                                    style={{ padding: '12px', fontSize: '1rem' }}
                                >
                                    🍲 夕食だけでOK
                                </button>
                                <button
                                    onClick={cancelCourseConfirm}
                                    className="btn"
                                    style={{ padding: '8px', fontSize: '0.875rem', opacity: 0.7 }}
                                >
                                    キャンセル
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
