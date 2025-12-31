import { useState } from 'react';
import { ChecklistItem } from './ChecklistItem';
import type { Category, ChecklistItem as ChecklistItemType } from '../types';

interface Props {
    category: Category;
    items: ChecklistItemType[];
    onToggleItem: (itemId: string) => void;
    onUpdateItem?: (itemId: string, updates: Partial<ChecklistItemType>) => void;
    onDeleteItem?: (itemId: string) => void;
    isTemplate?: boolean;
}

export function CategorySection({
    category,
    items,
    onToggleItem,
    onUpdateItem,
    onDeleteItem,
    isTemplate = false
}: Props) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (items.length === 0) return null;

    const checkedCount = items.filter(item => item.checked).length;
    const progress = Math.round((checkedCount / items.length) * 100);

    return (
        <div className="category-section">
            <div
                className="category-header"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div
                    className="category-icon"
                    style={{ backgroundColor: `${category.color}20` }}
                >
                    {category.icon}
                </div>
                <div className="category-info">
                    <div className="category-name">{category.name}</div>
                    <div className="category-count">
                        {checkedCount}/{items.length}
                    </div>
                </div>
                <div className="category-progress">
                    <div
                        className="progress-circle"
                        style={{
                            background: `conic-gradient(${category.color} ${progress}%, #eee ${progress}%)`
                        }}
                    >
                        <div className="progress-inner">
                            {isCollapsed ? '▼' : '▲'}
                        </div>
                    </div>
                </div>
            </div>

            {!isCollapsed && (
                <div className="category-items">
                    {items.map(item => (
                        <ChecklistItem
                            key={item.id}
                            item={item}
                            category={category}
                            onToggle={() => onToggleItem(item.id)}
                            onUpdate={onUpdateItem ? (updates) => onUpdateItem(item.id, updates) : undefined}
                            onDelete={onDeleteItem ? () => onDeleteItem(item.id) : undefined}
                            isTemplate={isTemplate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
