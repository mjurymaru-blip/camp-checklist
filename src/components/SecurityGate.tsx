import { useState, useEffect } from 'react';

const SECRET_PHRASE = "camp2025"; // 簡易的な合言葉
const STORAGE_KEY = "camp-app-unlocked";

export const SecurityGate = ({ children }: { children: React.ReactNode }) => {
    const [unlocked, setUnlocked] = useState(false);
    const [inputPhrase, setInputPhrase] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        const isUnlocked = localStorage.getItem(STORAGE_KEY) === "true";
        setUnlocked(isUnlocked);
    }, []);

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputPhrase === SECRET_PHRASE) {
            localStorage.setItem(STORAGE_KEY, "true");
            setUnlocked(true);
            setError(false);
        } else {
            setError(true);
            setInputPhrase("");
        }
    };

    if (unlocked) {
        return <>{children}</>;
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            padding: '20px',
            background: 'var(--color-background)',
            color: 'var(--color-text)'
        }}>
            <div className="card card-static" style={{ width: '100%', maxWidth: '320px', padding: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔒</div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>アクセス制限</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginTop: '8px' }}>
                        合言葉を入力してください
                    </p>
                </div>

                <form onSubmit={handleUnlock}>
                    <input
                        type="password"
                        value={inputPhrase}
                        onChange={(e) => {
                            setInputPhrase(e.target.value);
                            setError(false);
                        }}
                        placeholder="合言葉"
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: `1px solid ${error ? '#ef4444' : 'var(--color-border)'}`,
                            fontSize: '1rem',
                            marginBottom: '16px',
                            outline: 'none'
                        }}
                        autoFocus
                    />

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '12px' }}
                    >
                        解除する
                    </button>
                </form>

                {error && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '12px', textAlign: 'center' }}>
                        合言葉が違います
                    </p>
                )}
            </div>
        </div>
    );
};
