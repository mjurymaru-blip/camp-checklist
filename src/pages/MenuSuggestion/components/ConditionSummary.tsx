import type { UnifiedConditions } from '../../../types';

interface ConditionSummaryProps {
    conditions: UnifiedConditions;
    onRemove: (key: keyof UnifiedConditions) => void;
    onReset: () => void;
    onExpandDetails?: () => void;
}

const LABELS: Record<string, Record<string, string>> = {
    participants: { solo: '👤ソロ', pair: '👥ペア', group: '👨‍👩‍👧グループ' },
    season: { spring: '🌸春', summer: '🌻夏', autumn: '🍂秋', winter: '❄️冬' },
    mealType: { breakfast: '🌅朝食', lunch: '☀️昼食', dinner: '🌙夕食', snack: '🍿おつまみ', dessert: '🍰甘味' },
    difficulty: { easy: '簡単', normal: '普通', hard: '本格' },
    cost: { low: '💰安', mid: '💰普通', high: '💰贅沢' },
    cleanupLevel: { 1: '🧹楽', 2: '🧹普通', 3: '🧹多め' },
    prePrep: { true: '🏠下準備あり', false: '🏠現地完結' },
    kidFriendly: { true: '👶子供OK' },
};

// Keys that are always shown (primary filters)
const PRIMARY_KEYS: (keyof UnifiedConditions)[] = ['participants', 'season', 'mealType'];

// Keys that are shown as "+N件" (detail filters)
const DETAIL_KEYS: (keyof UnifiedConditions)[] = ['difficulty', 'cost', 'cleanupLevel', 'prePrep', 'kidFriendly'];

export const ConditionSummary: React.FC<ConditionSummaryProps> = ({
    conditions,
    onRemove,
    onReset,
    onExpandDetails,
}) => {
    // Count active detail conditions
    const activeDetailCount = DETAIL_KEYS.filter(key => conditions[key] !== undefined).length;
    const hasSearchText = !!conditions.searchText;
    const totalDetailCount = activeDetailCount + (hasSearchText ? 1 : 0);

    const renderChip = (key: keyof UnifiedConditions, value: unknown, removable = true) => {
        const labelMap = LABELS[key];
        const label = labelMap?.[String(value)] || String(value);

        return (
            <span
                key={key}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    background: 'var(--color-primary)',
                    color: 'white',
                    borderRadius: '16px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                }}
            >
                {label}
                {removable && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(key);
                        }}
                        style={{
                            background: 'rgba(255,255,255,0.3)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '16px',
                            height: '16px',
                            fontSize: '10px',
                            cursor: 'pointer',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0,
                        }}
                        title="条件を解除"
                    >
                        ×
                    </button>
                )}
            </span>
        );
    };

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: 'var(--color-bg-subtle)',
                borderRadius: '8px',
                marginBottom: '12px',
                flexWrap: 'wrap',
            }}
        >
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', fontWeight: 600 }}>
                🔎 条件:
            </span>

            {/* Primary conditions */}
            {PRIMARY_KEYS.map(key => {
                const value = conditions[key];
                if (value === undefined) return null;
                return renderChip(key, value, false); // Primary conditions not removable from summary
            })}

            {/* Detail count badge */}
            {totalDetailCount > 0 && (
                <button
                    onClick={onExpandDetails}
                    style={{
                        padding: '4px 8px',
                        background: '#e3f2fd',
                        color: '#1976d2',
                        borderRadius: '16px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    +{totalDetailCount}件
                </button>
            )}

            {/* Reset button */}
            <button
                onClick={onReset}
                style={{
                    marginLeft: 'auto',
                    padding: '4px 8px',
                    background: 'transparent',
                    border: '1px solid var(--color-border)',
                    borderRadius: '16px',
                    fontSize: '0.7rem',
                    color: 'var(--color-text-light)',
                    cursor: 'pointer',
                }}
            >
                ↺ リセット
            </button>
        </div>
    );
};
