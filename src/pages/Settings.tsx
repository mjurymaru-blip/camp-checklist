import { useState, useRef, useEffect } from 'react';
import { useChecklistStore } from '../stores/checklistStore';
import { useGearStore } from '../stores/gearStore';

interface BackupEntry {
    id: string;
    date: string;
    checklistCount: number;
    templateCount: number;
    data: string;
}

const BACKUP_STORAGE_KEY = 'camp-checklist-backup-history';
const MAX_BACKUPS = 5;

export const Settings = () => {
    const { checklists, templates, categories, importData } = useChecklistStore();
    const { theme, setTheme } = useGearStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [backupHistory, setBackupHistory] = useState<BackupEntry[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(BACKUP_STORAGE_KEY);
        if (stored) {
            try {
                setBackupHistory(JSON.parse(stored));
            } catch {
                setBackupHistory([]);
            }
        }
    }, []);

    const saveBackupHistory = (history: BackupEntry[]) => {
        localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(history));
        setBackupHistory(history);
    };

    const handleExport = () => {
        const data = {
            checklists,
            templates,
            categories,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `camp-checklist-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleAutoBackup = () => {
        const data = {
            checklists,
            templates,
            categories,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const newBackup: BackupEntry = {
            id: Math.random().toString(36).substring(2, 9),
            date: new Date().toISOString(),
            checklistCount: checklists.length,
            templateCount: templates.length,
            data: JSON.stringify(data)
        };

        const newHistory = [newBackup, ...backupHistory].slice(0, MAX_BACKUPS);
        saveBackupHistory(newHistory);
        alert('スナップショットを保存しました！');
    };

    const handleRestoreFromHistory = (backup: BackupEntry) => {
        if (window.confirm(`${formatDate(backup.date)} のスナップショットを復元しますか？\n現在のデータは上書きされます。`)) {
            try {
                const data = JSON.parse(backup.data);
                importData(data);
                alert('データを復元しました！');
            } catch {
                alert('復元に失敗しました');
            }
        }
    };

    const handleDeleteBackup = (id: string) => {
        if (window.confirm('このスナップショットを削除しますか？')) {
            const newHistory = backupHistory.filter(b => b.id !== id);
            saveBackupHistory(newHistory);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);

                if (window.confirm('現在のデータはすべて上書きされます。本当によろしいですか？')) {
                    importData(data);
                    alert('データを復元しました！');
                }
            } catch (error) {
                console.error('Import failed:', error);
                alert('ファイルの読み込みに失敗しました。');
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    const handleClearAll = () => {
        if (window.confirm('アプリを初期状態にリセットしますか？\n作成したリストは削除され、テンプレートはデフォルトに戻ります。')) {
            if (window.confirm('念のためもう一度確認します。本当にリセットしますか？')) {
                localStorage.clear();
                window.location.reload();
            }
        }
    };

    return (
        <div className="main-content watercolor-bg">
            <div className="section-title">設定</div>

            {/* テーマ設定 */}
            <div className="card card-static">
                <div className="card-header">
                    <div className="card-title">🎨 テーマ設定</div>
                </div>
                <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {(['auto', 'light', 'dark'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setTheme(t)}
                            className={theme === t ? 'btn btn-primary' : 'btn btn-secondary'}
                            style={{ flex: 1, minWidth: 80, padding: '10px 8px' }}
                        >
                            {{ auto: '🌗 自動', light: '☀️ ライト', dark: '🌙 ダーク' }[t]}
                        </button>
                    ))}
                </div>
            </div>

            {/* ファイルバックアップ */}
            <div className="card card-static">
                <div className="card-header" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div className="card-title">📦 データのバックアップと復元</div>
                    <div className="card-subtitle" style={{ marginTop: 8 }}>
                        ファイルに保存したデータは、ブラウザのキャッシュをクリアしても消えません。
                    </div>
                </div>
                <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button className="btn btn-primary btn-full" onClick={handleExport}>
                        💾 ファイルに保存
                    </button>
                    <button className="btn btn-secondary btn-full" onClick={() => fileInputRef.current?.click()}>
                        📂 ファイルから復元
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImport}
                        accept=".json"
                        style={{ display: 'none' }}
                    />
                </div>
            </div>

            {/* スナップショット */}
            <div className="card card-static">
                <div className="card-header" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div className="card-title">📸 簡易スナップショット</div>
                    <div className="card-subtitle" style={{ marginTop: 8 }}>
                        ブラウザ内に一時保存します。誤操作時などに素早く戻れます。
                    </div>
                    <div style={{ color: 'var(--color-accent)', fontSize: '0.75rem', marginTop: 4 }}>
                        ※ブラウザのキャッシュをクリアすると消えます
                    </div>
                </div>
                <div style={{ padding: '0 16px 16px' }}>
                    <button className="btn btn-secondary btn-full" onClick={handleAutoBackup}>
                        📸 スナップショットを保存
                    </button>

                    <div style={{ marginTop: 16, fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                        保存済み（最大{MAX_BACKUPS}件）
                    </div>

                    {backupHistory.length === 0 ? (
                        <p style={{ color: 'var(--color-text-light)', textAlign: 'center', padding: '16px 0', fontSize: '0.875rem' }}>
                            スナップショットがありません
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                            {backupHistory.map(backup => (
                                <div
                                    key={backup.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '10px 12px',
                                        background: 'var(--color-background)',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--color-border)'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{formatDate(backup.date)}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                                            リスト{backup.checklistCount}件 / テンプレート{backup.templateCount}件
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button
                                            onClick={() => handleRestoreFromHistory(backup)}
                                            style={{
                                                background: 'var(--color-primary)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: 6,
                                                padding: '6px 12px',
                                                fontSize: '0.75rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            復元
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBackup(backup.id)}
                                            style={{
                                                background: 'var(--color-border)',
                                                color: 'var(--color-text)',
                                                border: 'none',
                                                borderRadius: 6,
                                                padding: '6px 12px',
                                                fontSize: '0.75rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 初期化 */}
            <div className="card card-static" style={{ border: '1px solid #ffcccb', background: '#fff5f5' }}>
                <div className="card-header" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div className="card-title" style={{ color: '#d32f2f' }}>⚠️ 危険な操作</div>
                    <div className="card-subtitle" style={{ marginTop: 8 }}>
                        アプリを初期状態にリセットします。作成したリストは削除され、テンプレートはデフォルトに戻ります。
                    </div>
                </div>
                <div style={{ padding: '0 16px 16px' }}>
                    <button className="btn btn-danger btn-full" onClick={handleClearAll}>
                        🔄 アプリを初期状態にリセット
                    </button>
                </div>
            </div>

            {/* アプリについて */}
            <div className="card card-static">
                <div className="card-header" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div className="card-title">ℹ️ アプリについて</div>
                </div>
                <div style={{ padding: '0 16px 16px', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                    <div>バージョン: 1.0.0</div>
                    <div style={{ marginTop: 8 }}>
                        データはブラウザ内に保存されます。こまめなバックアップをおすすめします。
                    </div>
                </div>
            </div>
        </div>
    );
};
