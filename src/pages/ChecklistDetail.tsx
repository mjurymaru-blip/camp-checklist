import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChecklistStore } from '../stores/checklistStore';
import { CategorySection } from '../components/CategorySection';
import type { SavedRecipe } from '../types';

export function ChecklistDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        checklists,
        categories,
        toggleItem,
        toggleAllItems,
        archiveChecklist,
        unarchiveChecklist,
        addItem,
        deleteChecklist,
        createTemplateFromChecklist,
        updateItem,
        deleteItem,
        reorderItems,
        getSavedRecipes,
    } = useChecklistStore();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState('');
    const [newItemName, setNewItemName] = useState('');
    const [newItemCategory, setNewItemCategory] = useState(categories[0]?.id || '');
    const [newItemQuantity, setNewItemQuantity] = useState(1);
    const [showRecipeModal, setShowRecipeModal] = useState(false);
    const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);

    const checklist = checklists.find(c => c.id === id);

    if (!checklist) {
        return (
            <div className="main-content">
                <div className="empty-state">
                    <div className="empty-icon">❌</div>
                    <div className="empty-title">リストが見つかりません</div>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        ホームに戻る
                    </button>
                </div>
            </div>
        );
    }

    const savedRecipes: SavedRecipe[] = getSavedRecipes(checklist.id);

    const checkedCount = checklist.items.filter(item => item.checked).length;
    const totalCount = checklist.items.length;
    const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

    const handleAddItem = () => {
        if (!newItemName.trim()) return;

        addItem(checklist.id, {
            name: newItemName,
            categoryId: newItemCategory,
            quantity: newItemQuantity,
        });

        setNewItemName('');
        setNewItemQuantity(1);
        setShowAddModal(false);
    };

    const handleArchive = () => {
        archiveChecklist(checklist.id);
        navigate('/');
    };

    const handleUnarchive = () => {
        unarchiveChecklist(checklist.id);
        navigate('/');
        alert('リストに戻しました');
    };

    const handleDelete = () => {
        if (window.confirm('本当に削除しますか？')) {
            deleteChecklist(checklist.id);
            navigate('/');
        }
    };

    const handleSaveAsTemplate = () => {
        if (!newTemplateName.trim()) return;
        createTemplateFromChecklist(checklist.id, newTemplateName);
        setShowSaveTemplateModal(false);
        setNewTemplateName('');
        setShowMenuModal(false);
        alert('テンプレートとして保存しました');
    };

    return (
        <div className="main-content watercolor-bg">
            {/* ヘッダー情報 */}
            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title" style={{ fontSize: '1.125rem' }}>
                            {checklist.title}
                        </div>
                        <div className="card-subtitle">
                            {checklist.campsite && <span>📍 {checklist.campsite}</span>}
                            {checklist.date && (
                                <span style={{ marginLeft: checklist.campsite ? 12 : 0 }}>
                                    📅 {new Date(checklist.date).toLocaleDateString('ja-JP')}
                                </span>
                            )}
                        </div>
                    </div>
                    <div
                        style={{ cursor: 'pointer', fontSize: '1.5rem', padding: 8 }}
                        onClick={() => setShowMenuModal(true)}
                    >
                        ⋮
                    </div>
                </div>

                <div style={{ padding: '0 16px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                            進捗
                        </span>
                        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                            {progress}% ({checkedCount}/{totalCount})
                        </span>
                    </div>
                    <div className="progress-bar" style={{ height: 8 }}>
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>

                    {/* レシピ表示ボタン（保存レシピがある場合のみ） */}
                    {savedRecipes.length > 0 && (
                        <button
                            onClick={() => setShowRecipeModal(true)}
                            className="btn btn-secondary btn-full"
                            style={{ marginTop: '12px', fontSize: '0.875rem' }}
                        >
                            🍳 レシピを見る（{savedRecipes.length}件）
                        </button>
                    )}
                </div>
            </div>

            {/* カテゴリ別アイテム */}
            {categories.map(category => {
                const categoryItems = checklist.items.filter(item => item.categoryId === category.id);
                return (
                    <CategorySection
                        key={category.id}
                        category={category}
                        items={categoryItems}
                        allItems={checklist.items}
                        onToggleItem={(itemId) => toggleItem(checklist.id, itemId)}
                        onUpdateItem={(itemId, updates) => updateItem(checklist.id, itemId, updates)}
                        onDeleteItem={(itemId) => deleteItem(checklist.id, itemId)}
                        onReorderItem={(oldIndex, newIndex) => reorderItems(checklist.id, oldIndex, newIndex)}
                    />
                );
            })}

            {checklist.items.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <div className="empty-title">アイテムがありません</div>
                    <div className="empty-text">
                        右下の「＋」ボタンから<br />
                        アイテムを追加しましょう
                    </div>
                </div>
            )}

            {/* FAB */}
            <button className="fab" onClick={() => setShowAddModal(true)}>
                ＋
            </button>

            {/* アイテム追加モーダル */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">アイテムを追加</div>
                            <button className="modal-close" onClick={() => setShowAddModal(false)}>
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">アイテム名 *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="例：ランタン"
                                    value={newItemName}
                                    onChange={e => setNewItemName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">カテゴリ</label>
                                <select
                                    className="form-input"
                                    value={newItemCategory}
                                    onChange={e => setNewItemCategory(e.target.value)}
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">数量</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    min={1}
                                    value={newItemQuantity}
                                    onChange={e => setNewItemQuantity(Number(e.target.value))}
                                />
                            </div>

                            <button
                                className="btn btn-primary btn-full mt-16"
                                onClick={handleAddItem}
                                disabled={!newItemName.trim()}
                            >
                                追加する
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* メニューモーダル */}
            {showMenuModal && (
                <div className="modal-overlay" onClick={() => setShowMenuModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">メニュー</div>
                            <button className="modal-close" onClick={() => setShowMenuModal(false)}>
                                ✕
                            </button>
                        </div>
                        <div className="modal-body flex flex-col gap-12">
                            <button
                                className="btn btn-secondary btn-full"
                                onClick={() => {
                                    toggleAllItems(checklist.id, true);
                                    setShowMenuModal(false);
                                }}
                            >
                                ✅ 全てチェック
                            </button>
                            <button
                                className="btn btn-secondary btn-full"
                                onClick={() => {
                                    toggleAllItems(checklist.id, false);
                                    setShowMenuModal(false);
                                }}
                            >
                                ⬜ 全てのチェックを外す
                            </button>
                            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '4px 0' }} />
                            <button className="btn btn-primary btn-full" onClick={() => {
                                setNewTemplateName(`${checklist.title}のコピー`);
                                setShowSaveTemplateModal(true);
                            }}>
                                📋 テンプレートとして保存
                            </button>
                            {checklist.isArchived ? (
                                <button className="btn btn-secondary btn-full" onClick={handleUnarchive}>
                                    🔄 再利用（リストに戻す）
                                </button>
                            ) : (
                                <button className="btn btn-secondary btn-full" onClick={handleArchive}>
                                    📁 履歴に移動
                                </button>
                            )}
                            <button className="btn btn-danger btn-full" onClick={handleDelete}>
                                🗑️ 削除
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* テンプレート保存モーダル */}
            {showSaveTemplateModal && (
                <div className="modal-overlay" onClick={() => setShowSaveTemplateModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">テンプレートとして保存</div>
                            <button className="modal-close" onClick={() => setShowSaveTemplateModal(false)}>
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">テンプレート名 *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="例：基本セット詳細版"
                                    value={newTemplateName}
                                    onChange={e => setNewTemplateName(e.target.value)}
                                />
                            </div>
                            <button
                                className="btn btn-primary btn-full mt-16"
                                onClick={handleSaveAsTemplate}
                                disabled={!newTemplateName.trim()}
                            >
                                保存する
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* レシピ一覧モーダル */}
            {showRecipeModal && (
                <div className="modal-overlay" onClick={() => setShowRecipeModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxHeight: '85vh', overflow: 'auto' }}>
                        <div className="modal-header">
                            <div className="modal-title">🍳 保存済みレシピ</div>
                            <button className="modal-close" onClick={() => setShowRecipeModal(false)}>
                                ✕
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '0' }}>
                            {savedRecipes.map(recipe => (
                                <div key={recipe.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <div
                                        onClick={() => setExpandedRecipeId(expandedRecipeId === recipe.id ? null : recipe.id)}
                                        style={{
                                            padding: '16px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: expandedRecipeId === recipe.id ? '#f5f5f5' : 'transparent'
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '1rem' }}>
                                                {({ breakfast: '🍳', lunch: '🍞', dinner: '🍖', snack: '🍿', dessert: '🍰' } as Record<string, string>)[recipe.meal] || '🍽️'} {recipe.name}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '4px' }}>
                                                ⏱ {recipe.cookTime}
                                            </div>
                                        </div>
                                        <span style={{ fontSize: '1.2rem' }}>
                                            {expandedRecipeId === recipe.id ? '▲' : '▼'}
                                        </span>
                                    </div>
                                    {expandedRecipeId === recipe.id && (
                                        <div style={{ padding: '0 16px 16px', background: '#fafafa' }}>
                                            <div style={{ marginBottom: '12px' }}>
                                                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '6px' }}>
                                                    🥕 材料{recipe.servings ? ` (${recipe.servings}人分)` : ''}
                                                </div>
                                                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#555' }}>
                                                    {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                                                </ul>
                                            </div>
                                            <div style={{ marginBottom: '12px' }}>
                                                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '6px' }}>📝 手順</div>
                                                <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#555' }}>
                                                    {recipe.steps.map((step, i) => <li key={i} style={{ marginBottom: '4px' }}>{step}</li>)}
                                                </ol>
                                            </div>
                                            {recipe.tips && (
                                                <div style={{ padding: '10px', background: '#e3f2fd', borderRadius: '8px', fontSize: '0.85rem', color: '#0d47a1' }}>
                                                    💡 {recipe.tips}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {savedRecipes.length === 0 && (
                                <div style={{ padding: '32px', textAlign: 'center', color: '#999' }}>
                                    保存されたレシピはありません
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
