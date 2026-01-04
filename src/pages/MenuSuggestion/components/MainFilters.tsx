import type { UnifiedConditions } from '../../../types';

interface MainFiltersProps {
    conditions: UnifiedConditions;
    onConditionChange: (update: Partial<UnifiedConditions>) => void;
}

export const MainFilters: React.FC<MainFiltersProps> = ({
    conditions,
    onConditionChange,
}) => {
    const buttonStyle = (isActive: boolean) => ({
        fontSize: '0.8rem',
        padding: '8px 10px',
        border: isActive ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
        background: isActive ? 'var(--color-primary)' : 'white',
        color: isActive ? 'white' : 'var(--color-text)',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: isActive ? 600 : 400,
        transition: 'all 0.15s ease',
        minWidth: 0,
        flex: 1,
    });

    const rowStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px',
    };

    const labelStyle = {
        fontSize: '0.8rem',
        fontWeight: 600,
        color: 'var(--color-text-light)',
        minWidth: '70px',
        flexShrink: 0,
    };

    const buttonsContainerStyle = {
        display: 'flex',
        gap: '6px',
        flex: 1,
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {/* Participants */}
            <div style={rowStyle}>
                <span style={labelStyle}>👤 人数</span>
                <div style={buttonsContainerStyle}>
                    {(['solo', 'pair', 'group'] as const).map(p => (
                        <button
                            key={p}
                            onClick={() => onConditionChange({ participants: p })}
                            style={buttonStyle(conditions.participants === p)}
                        >
                            {{ solo: 'ソロ', pair: 'ペア', group: 'グループ' }[p]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Season */}
            <div style={rowStyle}>
                <span style={labelStyle}>🗓️ 季節</span>
                <div style={buttonsContainerStyle}>
                    {(['spring', 'summer', 'autumn', 'winter'] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => onConditionChange({ season: s })}
                            style={buttonStyle(conditions.season === s)}
                        >
                            {{ spring: '🌸', summer: '🌻', autumn: '🍂', winter: '❄️' }[s]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Meal Type */}
            <div style={rowStyle}>
                <span style={labelStyle}>🍽️ タイプ</span>
                <div style={buttonsContainerStyle}>
                    {(['breakfast', 'lunch', 'dinner', 'snack', 'dessert'] as const).map(m => (
                        <button
                            key={m}
                            onClick={() => onConditionChange({ mealType: m })}
                            style={{
                                ...buttonStyle(conditions.mealType === m),
                                fontSize: '0.75rem',
                                padding: '8px 4px',
                            }}
                        >
                            {{ breakfast: '🌅朝', lunch: '☀️昼', dinner: '🌙夕', snack: '🍿', dessert: '🍰' }[m]}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
