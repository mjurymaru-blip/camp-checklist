import { useState, useEffect } from 'react';
import { useGearStore } from '../stores/gearStore';
import { testApiConnection, fetchAvailableModels } from '../services/geminiService';

export const GearSettings = () => {
    const {
        cookingGears,
        heatSources,
        geminiApiKey,
        apiModel,
        availableModels,
        toggleGear,
        toggleHeatSource,
        setApiKey,
        setApiModel,
        setAvailableModels,
        validateApiKey
    } = useGearStore();

    const [showApiKey, setShowApiKey] = useState(false);
    const [testStatus, setTestStatus] = useState<{ success?: boolean; message: string } | null>(null);
    const [isTesting, setIsTesting] = useState(false);
    const [fetchingModels, setFetchingModels] = useState(false);
    const [isManualInput, setIsManualInput] = useState(false);

    // Auto-fetch models on mount if empty and API key exists
    useEffect(() => {
        const autoFetch = async () => {
            const validation = validateApiKey(geminiApiKey);
            if (geminiApiKey && validation.valid && availableModels.length === 0) {
                await handleFetchModels();
            }
        };
        autoFetch();
    }, [geminiApiKey]);

    const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApiKey(e.target.value);
        setTestStatus(null);
    };

    const handleFetchModels = async () => {
        if (!geminiApiKey) return;
        setFetchingModels(true);
        const models = await fetchAvailableModels(geminiApiKey);
        if (models.length > 0) {
            setAvailableModels(models);
        }
        setFetchingModels(false);
    };

    const handleTestConnection = async () => {
        const validation = validateApiKey(geminiApiKey);
        if (!validation.valid) {
            setTestStatus({ success: false, message: validation.message });
            return;
        }

        setIsTesting(true);
        setTestStatus(null);

        const result = await testApiConnection(geminiApiKey, apiModel);
        setTestStatus(result);
        setIsTesting(false);
    };

    return (
        <div className="main-content watercolor-bg">
            <div className="section-title">レシピ設定</div>

            {/* APIキー設定 */}
            <div className="card card-static">
                <div className="card-header" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div className="card-title">🔑 Gemini API キー</div>
                    <div className="card-subtitle" style={{ marginTop: 8 }}>
                        AI提案機能を利用するには、Google AI Studioで取得したAPIキーが必要です。
                        （端末内にのみ保存されます）
                    </div>
                </div>
                <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showApiKey ? "text" : "password"}
                            value={geminiApiKey}
                            onChange={handleApiKeyChange}
                            placeholder="AIza..."
                            style={{
                                width: '100%',
                                padding: '12px',
                                paddingRight: '40px',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border)',
                                fontSize: '0.875rem'
                            }}
                        />
                        <button
                            onClick={() => setShowApiKey(!showApiKey)}
                            style={{
                                position: 'absolute',
                                right: '8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                padding: '4px'
                            }}
                        >
                            {showApiKey ? '🙈' : '👁️'}
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center' }}>
                        <a
                            href="https://aistudio.google.com/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.75rem', color: 'var(--color-primary)', textDecoration: 'none' }}
                        >
                            🔗 APIキーを取得 (Google AI Studio)
                        </a>
                        <button
                            onClick={handleTestConnection}
                            disabled={isTesting || !geminiApiKey}
                            className={`btn ${testStatus?.success ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                        >
                            {isTesting ? '接続中...' : 'テスト接続 📡'}
                        </button>
                    </div>

                    {testStatus && (
                        <div style={{
                            fontSize: '0.75rem',
                            color: testStatus.success ? '#2e7d32' : '#d32f2f',
                            background: testStatus.success ? '#e8f5e9' : '#ffebee',
                            padding: '8px',
                            borderRadius: '4px'
                        }}>
                            {testStatus.message}
                        </div>
                    )}
                </div>
            </div>





            {/* モデル設定 */}
            <div className="card card-static" style={{ marginTop: '16px' }}>
                <div className="card-header">
                    <div className="card-title">🤖 AIモデル設定</div>
                </div>
                <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        使用するGeminiモデルを指定できます。<br />
                        デフォルト: <code>gemini-1.5-flash</code>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {isManualInput ? (
                            <input
                                type="text"
                                value={apiModel}
                                onChange={(e) => setApiModel(e.target.value)}
                                placeholder="gemini-1.5-flash"
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--color-border)',
                                    fontSize: '0.875rem'
                                }}
                            />
                        ) : (
                            <select
                                value={apiModel}
                                onChange={(e) => setApiModel(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--color-border)',
                                    fontSize: '0.875rem',
                                    background: 'white'
                                }}
                            >
                                {/* 現在の設定値がリストにない場合、選択肢として追加表示 */}
                                {!availableModels.includes(apiModel) && apiModel && (
                                    <option value={apiModel}>{apiModel} (現在の設定)</option>
                                )}
                                {availableModels.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                                {/* リストが空の場合のフォールバック */}
                                {availableModels.length === 0 && (
                                    <>
                                        <option value="gemini-1.5-flash">gemini-1.5-flash (標準)</option>
                                        <option value="gemini-1.5-pro">gemini-1.5-pro (高精度)</option>
                                    </>
                                )}
                            </select>
                        )}

                        <button
                            onClick={handleFetchModels}
                            disabled={fetchingModels || !geminiApiKey}
                            className="btn btn-secondary"
                            style={{ fontSize: '1.2rem', padding: '0 12px' }}
                            title="利用可能なモデルリストを更新"
                        >
                            {fetchingModels ? '...' : '🔄'}
                        </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            onClick={() => setIsManualInput(!isManualInput)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--color-primary)',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            {isManualInput ? 'リストから選択' : '手動で入力する'}
                        </button>
                    </div>

                    {fetchingModels && <span style={{ fontSize: '0.75rem' }}>モデルリスト取得中...</span>}
                </div>
            </div>

            {/* 調理器具設定 */}
            <div className="category-section">
                <h3 className="category-header" style={{ color: '#FF9800' }}>
                    🍳 所持している調理器具
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', padding: '0 8px' }}>
                    {cookingGears.map(gear => (
                        <div
                            key={gear.id}
                            onClick={() => toggleGear(gear.id)}
                            style={{
                                background: gear.owned ? '#fff3e0' : 'var(--color-background)',
                                border: `2px solid ${gear.owned ? '#FF9800' : 'var(--color-border)'}`,
                                borderRadius: '12px',
                                padding: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>{gear.owned ? '✅' : '⬜'}</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: gear.owned ? 600 : 400 }}>{gear.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 熱源設定 */}
            <div className="category-section" style={{ marginTop: '24px' }}>
                <h3 className="category-header" style={{ color: '#f44336' }}>
                    🔥 所持している熱源
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', padding: '0 8px' }}>
                    {heatSources.map(heat => (
                        <div
                            key={heat.id}
                            onClick={() => toggleHeatSource(heat.id)}
                            style={{
                                background: heat.owned ? '#ffebee' : 'var(--color-background)',
                                border: `2px solid ${heat.owned ? '#f44336' : 'var(--color-border)'}`,
                                borderRadius: '12px',
                                padding: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>{heat.owned ? '✅' : '⬜'}</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: heat.owned ? 600 : 400 }}>{heat.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ height: '80px' }} /> {/* ボトムナビ用スペース */}
        </div>
    );
};
