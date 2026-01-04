import { useState } from 'react';
import type { UnifiedConditions } from '../../../types';

interface DetailFiltersProps {
    conditions: UnifiedConditions;
    onConditionChange: (update: Partial<UnifiedConditions>) => void;
    isExpanded?: boolean;
    onToggle?: () => void;
}

export const DetailFilters: React.FC<DetailFiltersProps> = ({
    conditions,
    onConditionChange,
    isExpanded: controlledExpanded,
    onToggle,
}) => {
    const [internalExpanded, setInternalExpanded] = useState(false);
    const isExpanded = controlledExpanded ?? internalExpanded;
    const toggleExpand = onToggle ?? (() => setInternalExpanded(!internalExpanded));

    // Count active detail conditions
    const activeCount = [
        conditions.difficulty,
        conditions.cost,
        conditions.cleanupLevel,
        conditions.prePrep,
        conditions.kidFriendly,
        conditions.searchText,
    ].filter(v => v !== undefined && v !== '').length;

    const buttonStyle = (isActive: boolean) => ({
        fontSize: '0.75rem',
        padding: '6px 8px',
        border: isActive ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
        background: isActive ? 'var(--color-primary)' : 'white',
        color: isActive ? 'white' : 'var(--color-text)',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: isActive ? 600 : 400,
        transition: 'all 0.15s ease',
        flex: 1,
        minWidth: 0,
    });

    const rowStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px',
    };

    const labelStyle = {
        fontSize: '0.75rem',
        fontWeight: 600,
        color: 'var(--color-text-light)',
        minWidth: '65px',
        flexShrink: 0,
    };

    const buttonsContainerStyle = {
        display: 'flex',
        gap: '4px',
        flex: 1,
    };

    return (
        <div style={{ marginTop: '8px' }}>
            {/* Header / Toggle */}
            <button
                onClick={toggleExpand}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: 'var(--color-bg-subtle)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                }}
            >
                <span>
                    {isExpanded ? '▼' : '▶'} 詳細フィルター
                    {activeCount > 0 && (
                        <span style={{
                            marginLeft: '8px',
                            padding: '2px 8px',
                            background: 'var(--color-primary)',
                            color: 'white',
                            borderRadius: '10px',
                            fontSize: '0.7rem',
                        }}>
                            {activeCount}件選択中
                        </span>
                    )}
                </span>
            </button>

            {/* Collapsible Content */}
            {isExpanded && (
                <div style={{
                    padding: '14px 12px',
                    borderLeft: '1px solid var(--color-border)',
                    borderRight: '1px solid var(--color-border)',
                    borderBottom: '1px solid var(--color-border)',
                    borderRadius: '0 0 8px 8px',
                }}>
                    {/* Difficulty */}
                    <div style={rowStyle}>
                        <span style={labelStyle}>📊 難易度</span>
                        <div style={buttonsContainerStyle}>
                            {([undefined, 'easy', 'normal', 'hard'] as const).map((d, i) => (
                                <button
                                    key={i}
                                    onClick={() => onConditionChange({ difficulty: d })}
                                    style={buttonStyle(conditions.difficulty === d)}
                                >
                                    {{ undefined: '−', easy: '簡単', normal: '普通', hard: '本格' }[String(d) as 'undefined' | 'easy' | 'normal' | 'hard']}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cost */}
                    <div style={rowStyle}>
                        <span style={labelStyle}>💰 コスト</span>
                        <div style={buttonsContainerStyle}>
                            {([undefined, 'low', 'mid', 'high'] as const).map((c, i) => (
                                <button
                                    key={i}
                                    onClick={() => onConditionChange({ cost: c })}
                                    style={buttonStyle(conditions.cost === c)}
                                >
                                    {{ undefined: '−', low: '安', mid: '普通', high: '贅沢' }[String(c) as 'undefined' | 'low' | 'mid' | 'high']}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cleanup Level */}
                    <div style={rowStyle}>
                        <span style={labelStyle}>🧹 洗い物</span>
                        <div style={buttonsContainerStyle}>
                            {([undefined, 1, 2, 3] as const).map((level, i) => (
                                <button
                                    key={i}
                                    onClick={() => onConditionChange({ cleanupLevel: level })}
                                    style={buttonStyle(conditions.cleanupLevel === level)}
                                >
                                    {{ undefined: '−', 1: '楽', 2: '普通', 3: '多め' }[String(level) as 'undefined' | '1' | '2' | '3']}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* PrePrep */}
                    <div style={rowStyle}>
                        <span style={labelStyle}>🏠 下準備</span>
                        <div style={buttonsContainerStyle}>
                            {([undefined, false, true] as const).map((v, i) => (
                                <button
                                    key={i}
                                    onClick={() => onConditionChange({ prePrep: v })}
                                    style={buttonStyle(conditions.prePrep === v)}
                                >
                                    {{ undefined: '−', false: '現地のみ', true: '下準備' }[String(v) as 'undefined' | 'false' | 'true']}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Kid Friendly */}
                    <div style={rowStyle}>
                        <span style={labelStyle}>👶 子供</span>
                        <div style={buttonsContainerStyle}>
                            {([undefined, true] as const).map((v, i) => (
                                <button
                                    key={i}
                                    onClick={() => onConditionChange({ kidFriendly: v })}
                                    style={buttonStyle(conditions.kidFriendly === v)}
                                >
                                    {{ undefined: '−', true: '子供OKのみ' }[String(v) as 'undefined' | 'true']}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search Text */}
                    <div style={{ ...rowStyle, marginBottom: 0 }}>
                        <span style={labelStyle}>🔍 検索</span>
                        <input
                            type="text"
                            value={conditions.searchText || ''}
                            onChange={(e) => onConditionChange({ searchText: e.target.value })}
                            placeholder="カレー、パスタ..."
                            style={{
                                flex: 1,
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: '1px solid var(--color-border)',
                                fontSize: '0.8rem',
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
