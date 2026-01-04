import type { UnifiedConditions } from '../../types';

export interface QuickPreset {
    id: string;
    label: string;
    conditions: Partial<UnifiedConditions>;
}

/**
 * Quick preset definitions for menu suggestion filters
 * These provide one-tap access to common filter combinations
 */
export const QUICK_PRESETS: QuickPreset[] = [
    {
        id: 'kids',
        label: '👨‍👩‍👧 子連れ',
        conditions: {
            participants: 'group',
            kidFriendly: true,
            difficulty: 'easy',
        },
    },
    {
        id: 'solo-easy',
        label: '🏕️ ソロ簡単',
        conditions: {
            participants: 'solo',
            difficulty: 'easy',
            cleanupLevel: 1,
        },
    },
    {
        id: 'winter-warm',
        label: '❄️ 冬あったか',
        conditions: {
            season: 'winter',
            mealType: 'dinner',
        },
    },
    {
        id: 'drinks',
        label: '🍻 おつまみ',
        conditions: {
            mealType: 'snack',
        },
    },
    {
        id: 'quick',
        label: '⏱️ 時短',
        conditions: {
            difficulty: 'easy',
            cleanupLevel: 1,
            prePrep: false,
        },
    },
];

/**
 * Check if a preset matches the current conditions
 */
export const isPresetActive = (
    preset: QuickPreset,
    conditions: UnifiedConditions
): boolean => {
    return Object.entries(preset.conditions).every(
        ([key, value]) => conditions[key as keyof UnifiedConditions] === value
    );
};

/**
 * Apply a preset to conditions (merges with existing)
 */
export const applyPreset = (
    preset: QuickPreset,
    currentConditions: UnifiedConditions
): UnifiedConditions => {
    return {
        ...currentConditions,
        ...preset.conditions,
    };
};
