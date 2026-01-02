import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useGearStore } from '../stores/gearStore';
import { generateMenuSuggestion, getSeasonFromMonth } from '../services/geminiService';
import type { MenuRequest, Recipe } from '../types';

export const MenuSuggestion = () => {
    const { geminiApiKey, cookingGears, heatSources } = useGearStore();
    const [loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [request, setRequest] = useState<MenuRequest>({
        participants: 'pair',
        season: getSeasonFromMonth(),
        effort: 'normal',
        focus: 'dinner',
        category: ''
    });

    const handleGenerate = async () => {
        if (!geminiApiKey) return;

        setLoading(true);
        setError(null);
        setRecipes([]);

        try {
            const result = await generateMenuSuggestion(
                geminiApiKey,
                request,
                cookingGears,
                heatSources
            );
            setRecipes(result);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    if (!geminiApiKey) {
        return (
            <div className="main-content watercolor-bg">
                <div className="section-title">メニュー提案</div>
                <div className="card card-static" style={{ textAlign: 'center', padding: '32px 16px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔑</div>
                    <h3>APIキーが必要です</h3>
                    <p style={{ color: 'var(--color-text-light)', margin: '16px 0' }}>
                        メニュー提案機能を利用するには、<br />
                        設定画面でGemini APIキーを登録してください。
                    </p>
                    <NavLink to="/recipes/settings" className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                        設定画面へ進む
                    </NavLink>
                </div>
            </div>
        );
    }

    return (
        <div className="main-content watercolor-bg">
            <div className="section-title">メニュー提案</div>

            <div className="card card-static">
                <div className="card-header">
                    <div className="card-title">🍲 条件を設定</div>
                </div>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* 人数 */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>参加人数</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {(['solo', 'pair', 'group'] as const).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setRequest({ ...request, participants: p })}
                                    className={`btn ${request.participants === p ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ flex: 1, fontSize: '0.875rem', padding: '8px' }}
                                >
                                    {{ solo: 'ソロ', pair: 'ペア', group: 'グループ' }[p]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 季節 */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>季節</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {(['spring', 'summer', 'autumn', 'winter'] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => setRequest({ ...request, season: s })}
                                    className={`btn ${request.season === s ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ flex: 1, fontSize: '0.875rem', padding: '8px' }}
                                >
                                    {{ spring: '春', summer: '夏', autumn: '秋', winter: '冬' }[s]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 手間 */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>手間レベル</label>
                        <select
                            value={request.effort}
                            onChange={(e) => setRequest({ ...request, effort: e.target.value as MenuRequest['effort'] })}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                        >
                            <option value="easy">手抜き（簡単・時短）</option>
                            <option value="normal">普通</option>
                            <option value="elaborate">こだわり（手間をかける）</option>
                        </select>
                    </div>

                    {/* 重点 */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>メインの食事</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {(['breakfast', 'lunch', 'dinner'] as const).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setRequest({ ...request, focus: f })}
                                    className={`btn ${request.focus === f ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ flex: 1, fontSize: '0.875rem', padding: '8px' }}
                                >
                                    {{ breakfast: '朝食', lunch: '昼食', dinner: '夕食' }[f]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* カテゴリ */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>食べたいもの（任意）</label>
                        <input
                            type="text"
                            value={request.category || ''}
                            onChange={(e) => setRequest({ ...request, category: e.target.value })}
                            placeholder="例: パスタ、肉料理、和食..."
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="btn btn-primary btn-full"
                        style={{ marginTop: '8px', height: '48px', fontSize: '1rem', fontWeight: 600 }}
                    >
                        {loading ? 'AIが考え中...🍳' : '✨ メニューを提案してもらう'}
                    </button>
                </div>
            </div>

            {/* エラー表示 */}
            {error && (
                <div style={{
                    background: '#ffebee', color: '#d32f2f', padding: '16px',
                    borderRadius: '12px', marginTop: '16px', fontSize: '0.875rem',
                    border: '1px solid #ef5350'
                }}>
                    <b>エラーが発生しました:</b><br />{error}
                </div>
            )}

            {/* 結果表示 */}
            {recipes.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
                    <h3 style={{ marginLeft: '8px', fontSize: '1.1rem' }}>🤖 提案レシピ</h3>
                    {recipes.map((recipe, index) => (
                        <div key={index} className="card">
                            <div className="card-header" style={{ background: '#f5f5f5', borderBottom: '1px solid var(--color-border)' }}>
                                <div className="card-title">
                                    <span style={{ marginRight: '8px' }}>
                                        {{ breakfast: '🌅 朝食', lunch: '☀️ 昼食', dinner: '🌙 夕食', snack: '🍪 おやつ', dessert: '🍰 デザート' }[recipe.meal] || recipe.meal}
                                    </span>
                                    {recipe.name}
                                </div>
                            </div>
                            <div style={{ padding: '16px' }}>
                                <p style={{ margin: '0 0 16px', lineHeight: 1.6 }}>{recipe.description}</p>

                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.875rem', color: 'var(--color-primary)' }}>🥕 材料</div>
                                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.875rem' }}>
                                        {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                                    </ul>
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.875rem', color: '#FF9800' }}>🍳 使う道具</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {recipe.requiredGear.map((gear, i) => (
                                            <span key={i} style={{
                                                background: '#fff3e0', color: '#e65100',
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem'
                                            }}>
                                                {gear}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.875rem' }}>🔥 手順 ({recipe.cookTime})</div>
                                    <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                                        {recipe.steps.map((step, i) => <li key={i} style={{ marginBottom: '4px' }}>{step}</li>)}
                                    </ol>
                                </div>

                                {recipe.tips && (
                                    <div style={{ marginTop: '16px', padding: '12px', background: '#e3f2fd', borderRadius: '8px', fontSize: '0.875rem', color: '#0d47a1' }}>
                                        💡 <b>Tips:</b> {recipe.tips}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ height: '80px' }} />
        </div>
    );
};
