import { useState } from 'react';
import { useChecklistStore } from '../stores/checklistStore';
import { ChecklistItem } from '../components/ChecklistItem';
import type { Template } from '../types';

export function Templates() {
    const {
        templates,
        categories,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        addTemplateItem,
        updateTemplateItem,
        deleteTemplateItem,
        duplicateTemplate
    } = useChecklistStore();

    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [showNewModal, setShowNewModal] = useState(false);
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState('');
    const [baseTemplateId, setBaseTemplateId] = useState<string>('');
    const [editingName, setEditingName] = useState<string | null>(null);
    const [editNameValue, setEditNameValue] = useState('');

    // 新規アイテム用
    const [newItemName, setNewItemName] = useState('');
    const [newItemCategory, setNewItemCategory] = useState(categories[0]?.id || '');
    const [newItemQuantity, setNewItemQuantity] = useState(1);

    const currentTemplate = templates.find(t => t.id === selectedTemplate);

    const handleCreateTemplate = () => {
        if (!newTemplateName.trim()) return;

        let newId: string;

        if (baseTemplateId) {
            // 選択したプリセットテンプレートを複製
            newId = duplicateTemplate(baseTemplateId, newTemplateName);
        } else {
            const newTemplate: Template = {
                id: Math.random().toString(36).substring(2, 9),
                name: newTemplateName,
                items: [],
            };
            addTemplate(newTemplate);
            newId = newTemplate.id;
        }

        setSelectedTemplate(newId);
        setNewTemplateName('');
        setBaseTemplateId('');
        setShowNewModal(false);
    };

    const handleDeleteTemplate = (id: string) => {
        if (window.confirm('このテンプレートを削除しますか？')) {
            deleteTemplate(id);
            if (selectedTemplate === id) {
                setSelectedTemplate(null);
            }
        }
    };

    const handleAddItem = () => {
        if (!selectedTemplate || !newItemName.trim()) return;

        addTemplateItem(selectedTemplate, {
            name: newItemName,
            categoryId: newItemCategory,
            quantity: newItemQuantity,
        });

        setNewItemName('');
        setNewItemQuantity(1);
        setShowAddItemModal(false);
    };



    const handleStartEditName = (template: Template) => {
        setEditingName(template.id);
        setEditNameValue(template.name);
    };

    const handleSaveEditName = () => {
        if (editingName && editNameValue.trim()) {
            updateTemplate(editingName, { name: editNameValue });
        }
        setEditingName(null);
        setEditNameValue('');
    };

    // カテゴリ別にアイテムをグループ化
    const groupedItems = currentTemplate?.items.reduce((acc, item) => {
        if (!acc[item.categoryId]) {
            acc[item.categoryId] = [];
        }
        acc[item.categoryId].push(item);
        return acc;
    }, {} as Record<string, typeof currentTemplate.items>) || {};

    return (
        <div className="main-content watercolor-bg">
            {!selectedTemplate ? (
                <>
                    <div className="section-title">テンプレート管理</div>

                    {templates.map(template => (
                        <div key={template.id} className="card">
                            <div className="card-header">
                                <div
                                    style={{ flex: 1, cursor: 'pointer' }}
                                    onClick={() => setSelectedTemplate(template.id)}
                                >
                                    {editingName === template.id ? (
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={editNameValue}
                                            onChange={e => setEditNameValue(e.target.value)}
                                            onBlur={handleSaveEditName}
                                            onKeyDown={e => e.key === 'Enter' && handleSaveEditName()}
                                            autoFocus
                                            onClick={e => e.stopPropagation()}
                                        />
                                    ) : (
                                        <>
                                            <div className="card-title">{template.name}</div>
                                            <div className="card-subtitle">
                                                {template.items.length}個のアイテム
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStartEditName(template);
                                        }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '1.25rem',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        ✏️
                                    </button>
                                    {template.id !== 'basic' && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTemplate(template.id);
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                fontSize: '1.25rem',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    <button className="fab" onClick={() => setShowNewModal(true)}>
                        ＋
                    </button>
                </>
            ) : (
                <>
                    {/* テンプレート詳細 */}
                    <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button
                            onClick={() => setSelectedTemplate(null)}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                            }}
                        >
                            ←
                        </button>
                        <div>
                            <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                                {currentTemplate?.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                                {currentTemplate?.items.length}個のアイテム
                            </div>
                        </div>
                    </div>

                    {/* カテゴリ別アイテム */}
                    {categories.map(category => {
                        const items = groupedItems[category.id] || [];
                        if (items.length === 0) return null;

                        return (
                            <div key={category.id} className="category-section">
                                <div
                                    className="category-header"
                                    style={{ cursor: 'default' }}
                                >
                                    <div
                                        className="category-icon"
                                        style={{ backgroundColor: `${category.color}20` }}
                                    >
                                        {category.icon}
                                    </div>
                                    <div className="category-info">
                                        <div className="category-name">{category.name}</div>
                                        <div className="category-count">{items.length}個</div>
                                    </div>
                                </div>
                                <div className="category-items">
                                    {items.map(item => (
                                        <ChecklistItem
                                            key={item.id}
                                            item={{ ...item, checked: false }}
                                            category={category}
                                            onToggle={() => { }}
                                            onUpdate={selectedTemplate ? (updates) => updateTemplateItem(selectedTemplate, item.id, updates) : undefined}
                                            onDelete={selectedTemplate ? () => deleteTemplateItem(selectedTemplate, item.id) : undefined}
                                            isTemplate={true}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {currentTemplate?.items.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">📝</div>
                            <div className="empty-title">アイテムがありません</div>
                            <div className="empty-text">
                                右下の「＋」ボタンから<br />
                                アイテムを追加しましょう
                            </div>
                        </div>
                    )}

                    <button className="fab" onClick={() => setShowAddItemModal(true)}>
                        ＋
                    </button>
                </>
            )}

            {/* 新規テンプレート作成モーダル */}
            {showNewModal && (
                <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">新しいテンプレート</div>
                            <button className="modal-close" onClick={() => setShowNewModal(false)}>
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">テンプレート名 *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="例：夏キャンプ用"
                                    value={newTemplateName}
                                    onChange={e => setNewTemplateName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">ベーステンプレート</label>
                                <select
                                    className="form-input"
                                    value={baseTemplateId}
                                    onChange={e => setBaseTemplateId(e.target.value)}
                                >
                                    <option value="">空のテンプレートを作成</option>
                                    {templates.filter(t => ['solo', 'duo', 'family'].includes(t.id)).map(t => (
                                        <option key={t.id} value={t.id}>
                                            {t.name} をコピー
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                className="btn btn-primary btn-full mt-16"
                                onClick={handleCreateTemplate}
                                disabled={!newTemplateName.trim()}
                            >
                                作成する
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* アイテム追加モーダル */}
            {showAddItemModal && (
                <div className="modal-overlay" onClick={() => setShowAddItemModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">アイテムを追加</div>
                            <button className="modal-close" onClick={() => setShowAddItemModal(false)}>
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">アイテム名 *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="例：焚き火台"
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
        </div>
    );
}
