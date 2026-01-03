import type { Recipe, MenuRequest } from '../../../types';

interface RecipeCardProps {
    recipe: Recipe;
    variant: 'candidate' | 'result';
    request: MenuRequest;
    loadingRecipeId?: string | null;
    targetServings?: number;
    scaleIngredients?: (ingredients: string[], base: number, target: number) => string[];
    onSelect?: (recipe: Recipe) => void;
    onToggleExpand?: (id: string) => void;
    isExpanded?: boolean;
}

const mealLabels: Record<string, { label: string; color: string }> = {
    breakfast: { label: '🌅 朝食', color: '#ff9800' },
    lunch: { label: '☀️ 昼食', color: '#4caf50' },
    snack: { label: '🍪 おやつ', color: '#9c27b0' },
    dinner: { label: '🌙 夕食', color: '#3f51b5' },
    dessert: { label: '🍰 デザート', color: '#e91e63' },
};

export const RecipeCard = ({
    recipe,
    variant,
    request,
    loadingRecipeId,
    targetServings,
    scaleIngredients,
    onSelect,
    onToggleExpand,
    isExpanded,
}: RecipeCardProps) => {
    const mealInfo = mealLabels[recipe.meal] || { label: recipe.meal, color: '#666' };

    // 候補選択画面用カード
    if (variant === 'candidate') {
        return (
            <div className="card card-static">
                <div className="card-header" style={{ background: mealInfo.color }}>
                    <div className="card-title" style={{ color: 'white' }}>
                        {mealInfo.label}: {recipe.name}
                    </div>
                </div>
                <div style={{ padding: '16px' }}>
                    <p style={{ margin: '0 0 12px', fontWeight: 'bold', color: '#e65100' }}>
                        {recipe.description}
                    </p>
                    {recipe.reason && (
                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '12px' }}>
                            💡 {recipe.reason}
                        </p>
                    )}

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                        {recipe.ingredients.slice(0, 5).map((ing, i) => (
                            <span
                                key={i}
                                style={{
                                    fontSize: '0.75rem',
                                    background: '#f5f5f5',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    color: '#555',
                                }}
                            >
                                {ing}
                            </span>
                        ))}
                        {recipe.ingredients.length > 5 && (
                            <span style={{ fontSize: '0.75rem', color: '#999' }}>...</span>
                        )}
                    </div>

                    {onSelect && (
                        <button
                            onClick={() => onSelect(recipe)}
                            disabled={loadingRecipeId !== null}
                            className="btn btn-primary btn-full"
                            style={{ height: '40px' }}
                        >
                            {loadingRecipeId === recipe.id
                                ? '生成中...'
                                : request.focus === 'dinner'
                                    ? 'これにする！👉 他の食事も決める'
                                    : 'これにする！(決定)'}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // 結果表示画面用カード
    const scaledIngredients =
        scaleIngredients && targetServings
            ? scaleIngredients(recipe.ingredients, recipe.servings || 2, targetServings)
            : recipe.ingredients;

    return (
        <div className="card card-interactive" style={{ marginBottom: '16px' }}>
            <div
                className="card-header"
                style={{ background: mealInfo.color, cursor: 'pointer' }}
                onClick={() => onToggleExpand?.(recipe.id)}
            >
                <div className="card-title" style={{ color: 'white' }}>
                    {mealInfo.label}: {recipe.name}
                </div>
            </div>
            <div style={{ padding: '12px 16px' }}>
                <p style={{ margin: '0 0 8px', fontWeight: 'bold', color: '#e65100' }}>
                    {recipe.description}
                </p>
                {recipe.reason && (
                    <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '8px' }}>
                        💡 {recipe.reason}
                    </p>
                )}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {recipe.cookTime && (
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>⏱️ {recipe.cookTime}</span>
                    )}
                    {recipe.difficulty && (
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>
                            🔥{' '}
                            {{ easy: '簡単', normal: '普通', hard: '本格' }[recipe.difficulty] ||
                                recipe.difficulty}
                        </span>
                    )}
                </div>

                {isExpanded && (
                    <div
                        style={{
                            marginTop: '12px',
                            borderTop: '1px solid #eee',
                            paddingTop: '12px',
                        }}
                    >
                        <div style={{ marginBottom: '12px' }}>
                            <strong>📦 材料 ({targetServings}人分):</strong>
                            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                                {scaledIngredients.map((ing, i) => (
                                    <li key={i} style={{ fontSize: '0.9rem' }}>
                                        {ing}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {recipe.steps && recipe.steps.length > 0 && (
                            <div style={{ marginBottom: '12px' }}>
                                <strong>👨‍🍳 作り方:</strong>
                                <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
                                    {recipe.steps.map((step, i) => (
                                        <li key={i} style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                            {step}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                        {recipe.tips && (
                            <div
                                style={{
                                    background: '#fff8e1',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                }}
                            >
                                <strong>💡Tips:</strong> {recipe.tips}
                            </div>
                        )}
                    </div>
                )}

                <button
                    onClick={() => onToggleExpand?.(recipe.id)}
                    className="btn"
                    style={{
                        marginTop: '8px',
                        fontSize: '0.8rem',
                        padding: '4px 8px',
                        width: '100%',
                    }}
                >
                    {isExpanded ? '▲ 閉じる' : '▼ 詳細を見る'}
                </button>
            </div>
        </div>
    );
};
