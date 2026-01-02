import { useState } from 'react';
import { useGearStore } from '../stores/gearStore';
import { testApiConnection } from '../services/geminiService';

export const GearSettings = () => {
    const {
        cookingGears,
        heatSources,
        geminiApiKey,
        toggleGear,
        toggleHeatSource,
        setApiKey,
        validateApiKey
    } = useGearStore();

    const [showApiKey, setShowApiKey] = useState(false);
    const [testStatus, setTestStatus] = useState<{ success?: boolean; message: string } | null>(null);
    const [isTesting, setIsTesting] = useState(false);

    const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApiKey(e.target.value);
        setTestStatus(null);
    };

    const handleTestConnection = async () => {
        const validation = validateApiKey(geminiApiKey);
        if (!validation.valid) {
            setTestStatus({ success: false, message: validation.message });
            return;
        }

        setIsTesting(true);
        setTestStatus(null);

        const result = await testApiConnection(geminiApiKey);
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
