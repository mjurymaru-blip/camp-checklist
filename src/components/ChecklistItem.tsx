import { useState, useRef, useEffect } from 'react';
import type { ChecklistItem as ChecklistItemType, Category } from '../types';

interface Props {
    item: ChecklistItemType;
    category?: Category;
    onToggle?: () => void;
    onUpdate?: (updates: Partial<ChecklistItemType>) => void;
    onDelete?: () => void;
    isTemplate?: boolean;
}

export function ChecklistItem({ item, category, onToggle, onUpdate, onDelete, isTemplate = false }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(item.name);
    const [editQuantity, setEditQuantity] = useState(item.quantity || 1);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleSave = () => {
        if (editName.trim() && onUpdate) {
            onUpdate({
                name: editName,
                quantity: editQuantity
            });
        } else {
            setEditName(item.name);
            setEditQuantity(item.quantity || 1);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setEditName(item.name);
            setEditQuantity(item.quantity || 1);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <div className="checklist-item editing">
                <input
                    ref={inputRef}
                    type="text"
                    className="form-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    style={{ flex: 1, marginRight: 8 }}
                />
                <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(parseInt(e.target.value) || 1)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    style={{ width: 60, marginRight: 8 }}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        );
    }

    return (
        <div className={`checklist-item ${item.checked ? 'checked' : ''}`}>
            <div
                className={`checkbox ${item.checked ? 'checked' : ''}`}
                onClick={onToggle}
                style={{ visibility: isTemplate ? 'hidden' : 'visible' }}
            >
                {item.checked && '✓'}
            </div>
            <div
                className="item-content"
                onClick={() => onUpdate && setIsEditing(true)}
                style={{ cursor: onUpdate ? 'pointer' : 'default' }}
            >
                <div className="item-name">{item.name}</div>
                {item.note && <div className="item-meta">{item.note}</div>}
            </div>
            {item.quantity && item.quantity > 1 && (
                <span
                    className="item-quantity"
                    style={{ backgroundColor: category?.color }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onUpdate) setIsEditing(true);
                    }}
                >
                    ×{item.quantity}
                </span>
            )}
            {onDelete && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('このアイテムを削除しますか？')) {
                            onDelete();
                        }
                    }}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        marginLeft: 8,
                        color: '#EF5350',
                        opacity: 0.6,
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '0.6'}
                >
                    ✕
                </button>
            )}
        </div>
    );
}
