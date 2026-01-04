import type { UnifiedConditions } from '../../../types';
import { QUICK_PRESETS, isPresetActive, applyPreset } from '../presets';

interface QuickPresetsProps {
    conditions: UnifiedConditions;
    onApplyPreset: (conditions: UnifiedConditions) => void;
}

export const QuickPresets: React.FC<QuickPresetsProps> = ({
    conditions,
    onApplyPreset,
}) => {
    return (
        <div style={{ marginBottom: '16px' }}>
            <label
                style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                }}
            >
                ⚡ クイック選択
            </label>
            <div
                style={{
                    display: 'flex',
                    gap: '8px',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    paddingBottom: '4px',
                    marginRight: '-16px',
                    paddingRight: '16px',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {QUICK_PRESETS.map((preset) => {
                    const isActive = isPresetActive(preset, conditions);
                    return (
                        <button
                            key={preset.id}
                            onClick={() => {
                                if (isActive) {
                                    // Reset to default when clicking active preset
                                    onApplyPreset({
                                        participants: 'solo',
                                        season: conditions.season,
                                        mealType: 'dinner',
                                    });
                                } else {
                                    onApplyPreset(applyPreset(preset, conditions));
                                }
                            }}
                            style={{
                                padding: '8px 14px',
                                borderRadius: '20px',
                                border: isActive ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                background: isActive ? 'var(--color-primary)' : 'white',
                                color: isActive ? 'white' : 'var(--color-text)',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease',
                                boxShadow: isActive ? '0 2px 8px rgba(var(--color-primary-rgb), 0.3)' : 'none',
                            }}
                        >
                            {preset.label}
                            {isActive && ' ✓'}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
