import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useChecklistStore } from '../../stores/checklistStore';
import { useGearStore } from '../../stores/gearStore';
import { buildShoppingList, toChecklistItems } from '../../utils/shoppingListUtils';
import type { SavedRecipe, UnifiedConditions } from '../../types';
import { useMenuSuggestion } from './hooks/useMenuSuggestion';
import { RecipeCard } from './components/RecipeCard';
import { ConditionSummary } from './components/ConditionSummary';
import { QuickPresets } from './components/QuickPresets';
import { MainFilters } from './components/MainFilters';
import { DetailFilters } from './components/DetailFilters';
import { getSeasonFromMonth } from '../../services/geminiService';
import type { FavoriteRecipe } from '../../stores/gearStore';

export const MenuSuggestion = () => {
    const { geminiApiKey, favoriteRecipes, recipeHistory, removeFavorite, clearHistory } = useGearStore();
    const { checklists, addItem, saveRecipes } = useChecklistStore();

    // Use the custom hook for all suggestion logic
    const {
        loading,
        error,
        recipes,
        conditions,
        mode,
        suggestionStep,
        dinnerCandidates,
        selectedDinner,
        loadingRecipeId,
        showCourseConfirm,
        pendingDinnerRecipe,
        setConditions,
        setMode,
        handleExecute,
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

    // Favorite detail modal
    const [selectedFavorite, setSelectedFavorite] = useState<FavoriteRecipe | null>(null);

    // Detail filters expand state
    const [detailFiltersExpanded, setDetailFiltersExpanded] = useState(false);

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

    // Handler for condition changes (used by new filter components)
    const handleConditionChange = (update: Partial<UnifiedConditions>) => {
        setConditions(prev => ({ ...prev, ...update }));
    };

    // Handler for reset conditions
    const handleResetConditions = () => {
        setConditions({
            participants: 'solo',
            season: getSeasonFromMonth(),
            mealType: 'dinner',
        });
        setDetailFiltersExpanded(false);
    };

    // Handler for apply preset
    const handleApplyPreset = (newConditions: UnifiedConditions) => {
        setConditions(newConditions);
    };

    // Handler for remove condition
    const handleRemoveCondition = (key: keyof UnifiedConditions) => {
        setConditions(prev => ({ ...prev, [key]: undefined }));
    };

    const targetServings = getTargetServings(conditions.participants);

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
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Condition Summary */}
                    <ConditionSummary
                        conditions={conditions}
                        onRemove={handleRemoveCondition}
                        onReset={handleResetConditions}
                        onExpandDetails={() => setDetailFiltersExpanded(true)}
                    />

                    {/* Quick Presets */}
                    <QuickPresets
                        conditions={conditions}
                        onApplyPreset={handleApplyPreset}
                    />

                    {/* Main Filters (人数・季節・タイプ) */}
                    <MainFilters
                        conditions={conditions}
                        onConditionChange={handleConditionChange}
                    />

                    {/* Detail Filters (折りたたみ) */}
                    <DetailFilters
                        conditions={conditions}
                        onConditionChange={handleConditionChange}
                        isExpanded={detailFiltersExpanded}
                        onToggle={() => setDetailFiltersExpanded(!detailFiltersExpanded)}
                    />
                </div>
            </div>

            {/* Sticky Action Buttons */}
            {suggestionStep === 'input' && (
                <div style={{
                    position: 'sticky',
                    bottom: '70px',
                    background: 'white',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    boxShadow: '0 -2px 12px rgba(0,0,0,0.1)',
                    marginTop: '16px',
                    zIndex: 100,
                }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => { setMode('ai'); handleExecute('ai'); }}
                            disabled={loading || !geminiApiKey}
                            className={`btn ${mode === 'ai' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1, padding: '14px 8px', fontSize: '0.9rem', fontWeight: 600, opacity: geminiApiKey ? 1 : 0.5 }}
                            title={!geminiApiKey ? 'APIキーが必要です' : ''}
                        >
                            {loading && mode === 'ai' ? '考え中...' : '✨ AIのおすすめ'}
                        </button>
                        <button
                            onClick={() => { setMode('manual'); handleExecute('manual'); }}
                            disabled={loading}
                            className={`btn ${mode === 'manual' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1, padding: '14px 8px', fontSize: '0.9rem', fontWeight: 600 }}
                        >
                            {loading && mode === 'manual' ? '検索中...' : '🔍 条件で探す'}
                        </button>
                    </div>
                </div>
            )}

            {/* Favorites Section */}
            {suggestionStep === 'input' && favoriteRecipes.length > 0 && (
                <div className="card card-static" style={{ marginTop: '16px' }}>
                    <div className="card-header" style={{ background: '#ffc107' }}>
                        <div className="card-title" style={{ color: '#333' }}>
                            ⭐ お気に入りレシピ（{favoriteRecipes.length}件）
                        </div>
                    </div>
                    <div style={{ padding: '12px' }}>
                        {favoriteRecipes.slice(0, 5).map(fav => (
                            <div key={fav.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px',
                                borderBottom: '1px solid #eee',
                                cursor: 'pointer',
                            }}
                                onClick={() => setSelectedFavorite(fav)}
                            >
                                <div>
                                    <span style={{ fontSize: '0.8rem', color: '#666' }}>
                                        {({ breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍪', dessert: '🍰' } as Record<string, string>)[fav.meal] || '🍽️'}
                                    </span>{' '}
                                    <strong style={{ fontSize: '0.9rem' }}>{fav.name}</strong>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#888' }}>
                                        {fav.description.slice(0, 40)}...
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFavorite(fav.id);
                                    }}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        color: '#999',
                                    }}
                                    title="お気に入りを解除"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        {favoriteRecipes.length > 5 && (
                            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666', marginTop: '8px' }}>
                                他 {favoriteRecipes.length - 5} 件...
                            </p>
                        )}
                    </div>
                </div>
            )
            }

            {/* History Section */}
            {
                suggestionStep === 'input' && recipeHistory.length > 0 && (
                    <div className="card card-static" style={{ marginTop: '16px' }}>
                        <div className="card-header" style={{ background: '#9e9e9e' }}>
                            <div className="card-title" style={{ color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>📜 最近の提案履歴（{recipeHistory.length}件）</span>
                                <button
                                    onClick={() => {
                                        if (window.confirm('履歴をすべて削除しますか？')) {
                                            clearHistory();
                                        }
                                    }}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#fff',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        padding: '4px 8px',
                                    }}
                                >
                                    🗑 クリア
                                </button>
                            </div>
                        </div>
                        <div style={{ padding: '12px' }}>
                            {recipeHistory.slice(0, 10).map(hist => (
                                <div key={`${hist.id}-${hist.suggestedAt}`} style={{
                                    padding: '6px 8px',
                                    borderBottom: '1px solid #eee',
                                    fontSize: '0.85rem',
                                }}>
                                    <span style={{ color: '#666' }}>
                                        {({ breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍪', dessert: '🍰' } as Record<string, string>)[hist.meal] || '🍽️'}
                                    </span>{' '}
                                    {hist.name}
                                    <span style={{ float: 'right', fontSize: '0.7rem', color: '#999' }}>
                                        {new Date(hist.suggestedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                            {recipeHistory.length > 10 && (
                                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666', marginTop: '8px' }}>
                                    他 {recipeHistory.length - 10} 件...
                                </p>
                            )}
                        </div>
                    </div>
                )
            }

            {/* Dinner Selection */}
            {
                suggestionStep === 'dinner-selection' && (
                    <div className="card card-static">
                        <div className="card-header" style={{ background: '#3f51b5' }}>
                            <div className="card-title" style={{ color: 'white' }}>
                                🍽️ {{ breakfast: '朝食', lunch: '昼食', dinner: '夕食', snack: 'おつまみ', dessert: 'デザート' }[conditions.mealType]}の候補（{dinnerCandidates.length}件）
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
                                    conditions={conditions}
                                    loadingRecipeId={loadingRecipeId}
                                    onSelect={handleSelectCandidate}
                                />
                            ))}
                        </div>
                    </div>
                )
            }

            {/* Error Display */}
            {
                error && (
                    <div style={{
                        background: '#ffebee', color: '#d32f2f', padding: '16px',
                        borderRadius: '12px', marginTop: '16px', fontSize: '0.875rem',
                        border: '1px solid #ef5350'
                    }}>
                        <b>エラーが発生しました:</b><br />{error}
                    </div>
                )
            }

            {/* No Results Message */}
            {
                suggestionStep === 'result' && recipes.length === 0 && !loading && !error && (
                    <div style={{ marginTop: '24px', textAlign: 'center' }}>
                        <div style={{
                            background: '#fff3e0',
                            color: '#e65100',
                            padding: '24px',
                            borderRadius: '12px',
                            border: '1px solid #ffcc80'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔍</div>
                            <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>
                                条件に合うレシピが見つかりませんでした
                            </p>
                            <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '16px' }}>
                                検索条件を変更して再度お試しください
                            </p>
                            <button
                                onClick={handleBackToInput}
                                className="btn btn-primary"
                                style={{ fontSize: '0.875rem' }}
                            >
                                ← 検索条件を変更する
                            </button>
                        </div>
                    </div>
                )
            }

            {/* Results */}
            {
                suggestionStep !== 'dinner-selection' && recipes.length > 0 && (
                    <div style={{ marginTop: '24px' }}>
                        {suggestionStep === 'result' ? (
                            <div style={{ marginBottom: '16px' }}>
                                <button onClick={handleBackToInput} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
                                    ← 初めからやり直す
                                </button>
                                <h3 style={{ marginTop: '16px', fontSize: '1.2rem' }}>
                                    🎉 {conditions.mealType === 'dinner' ? 'ご提案のキャンプフルコース' : '決定したレシピ'}
                                </h3>
                                {selectedDinner && <p style={{ fontSize: '0.9rem', color: '#666' }}>メイン：{selectedDinner.name}</p>}

                                {/* Add to checklist button */}
                                <button
                                    onClick={() => {
                                        setSelectedRecipesForShopping(new Set()); // 空で開始（必要なものだけ選択）
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
                                    conditions={conditions}
                                    targetServings={targetServings}
                                    scaleIngredients={scaleIngredients}
                                    onToggleExpand={toggleExpand}
                                    isExpanded={expandedRecipeIds.has(recipe.id)}
                                />
                            ))}
                        </div>
                    </div>
                )
            }

            <div style={{ height: '80px' }} />

            {/* Shopping List Modal */}
            {
                showShoppingModal && (
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
                                        追加される食材（{buildShoppingList(recipes.filter(r => selectedRecipesForShopping.has(r.id)), targetServings).length}件）
                                    </label>
                                    <div style={{ maxHeight: '150px', overflow: 'auto', background: '#f9f9f9', borderRadius: '8px', padding: '8px' }}>
                                        {buildShoppingList(recipes.filter(r => selectedRecipesForShopping.has(r.id)), targetServings).map((item, i) => (
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
                                            const items = buildShoppingList(selectedRecipes, targetServings);
                                            const itemsToAdd = toChecklistItems(items, 'food', true);
                                            itemsToAdd.forEach(item => {
                                                addItem(targetChecklistId, item);
                                            });

                                            // Save recipe snapshots with scaled ingredients
                                            const savedRecipes: SavedRecipe[] = selectedRecipes.map(r => ({
                                                id: r.id,
                                                name: r.name,
                                                meal: r.meal,
                                                ingredients: r.servings
                                                    ? scaleIngredients(r.ingredients, r.servings, targetServings)
                                                    : r.ingredients,
                                                steps: r.steps,
                                                cookTime: r.cookTime,
                                                tips: r.tips,
                                                servings: targetServings, // スケーリング後の人数を保存
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
                )
            }

            {/* Course Confirm Modal */}
            {
                showCourseConfirm && pendingDinnerRecipe && (
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
                )
            }

            {/* Favorite Detail Modal */}
            {
                selectedFavorite && (
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
                        <div className="card" style={{ maxWidth: '500px', width: '100%', maxHeight: '85vh', overflow: 'auto' }}>
                            <div className="card-header" style={{ background: '#ffc107' }}>
                                <div className="card-title" style={{ color: '#333' }}>
                                    ⭐ {selectedFavorite.name}
                                </div>
                            </div>
                            <div style={{ padding: '16px' }}>
                                <p style={{ margin: '0 0 12px', fontWeight: 'bold', color: '#e65100' }}>
                                    {selectedFavorite.description}
                                </p>

                                <div style={{ marginBottom: '12px' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#666' }}>
                                        ⏱️ {selectedFavorite.cookTime}
                                    </span>
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <strong>📦 材料 ({targetServings}人分):</strong>
                                    <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                                        {scaleIngredients(selectedFavorite.ingredients, selectedFavorite.servings || 4, targetServings).map((ing, i) => (
                                            <li key={i} style={{ fontSize: '0.9rem' }}>{ing}</li>
                                        ))}
                                    </ul>
                                </div>

                                {selectedFavorite.steps && selectedFavorite.steps.length > 0 && (
                                    <div style={{ marginBottom: '16px' }}>
                                        <strong>👨‍🍳 作り方:</strong>
                                        <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
                                            {selectedFavorite.steps.map((step, i) => (
                                                <li key={i} style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{step}</li>
                                            ))}
                                        </ol>
                                    </div>
                                )}

                                {selectedFavorite.tips && (
                                    <div style={{
                                        background: '#fff8e1',
                                        padding: '8px',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        marginBottom: '16px'
                                    }}>
                                        <strong>💡Tips:</strong> {selectedFavorite.tips}
                                    </div>
                                )}

                                <button
                                    onClick={() => setSelectedFavorite(null)}
                                    className="btn btn-primary btn-full"
                                    style={{ marginTop: '8px' }}
                                >
                                    閉じる
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
