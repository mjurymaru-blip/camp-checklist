import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { ChecklistItem } from './ChecklistItem';
import type { Category, ChecklistItem as ChecklistItemType } from '../types';

interface Props {
    category: Category;
    items: ChecklistItemType[];
    allItems: ChecklistItemType[]; // 全アイテム（インデックス計算用）
    onToggleItem: (itemId: string) => void;
    onUpdateItem?: (itemId: string, updates: Partial<ChecklistItemType>) => void;
    onDeleteItem?: (itemId: string) => void;
    onReorderItem?: (oldIndex: number, newIndex: number) => void;
    isTemplate?: boolean;
}

export function CategorySection({
    category,
    items,
    allItems,
    onToggleItem,
    onUpdateItem,
    onDeleteItem,
    onReorderItem,
    isTemplate = false
}: Props) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px動かさないとドラッグ開始しない
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    if (items.length === 0) return null;

    const checkedCount = items.filter(item => item.checked).length;
    const progress = Math.round((checkedCount / items.length) * 100);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id && onReorderItem) {
            // 全アイテム内でのインデックスを計算
            const oldIndex = allItems.findIndex(item => item.id === active.id);
            const newIndex = allItems.findIndex(item => item.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                onReorderItem(oldIndex, newIndex);
            }
        }
    };

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
                    {onReorderItem ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={items.map(item => item.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {items.map(item => (
                                    <SortableItem key={item.id} id={item.id}>
                                        <ChecklistItem
                                            item={item}
                                            category={category}
                                            onToggle={() => onToggleItem(item.id)}
                                            onUpdate={onUpdateItem ? (updates) => onUpdateItem(item.id, updates) : undefined}
                                            onDelete={onDeleteItem ? () => onDeleteItem(item.id) : undefined}
                                            isTemplate={isTemplate}
                                        />
                                    </SortableItem>
                                ))}
                            </SortableContext>
                        </DndContext>
                    ) : (
                        items.map(item => (
                            <ChecklistItem
                                key={item.id}
                                item={item}
                                category={category}
                                onToggle={() => onToggleItem(item.id)}
                                onUpdate={onUpdateItem ? (updates) => onUpdateItem(item.id, updates) : undefined}
                                onDelete={onDeleteItem ? () => onDeleteItem(item.id) : undefined}
                                isTemplate={isTemplate}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
