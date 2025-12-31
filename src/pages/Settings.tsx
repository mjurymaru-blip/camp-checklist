import { useRef } from 'react';
import { useChecklistStore } from '../stores/checklistStore';

export const Settings = () => {
    const { checklists, templates, categories, importData } = useChecklistStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // データをエクスポート（JSONファイルとしてダウンロード）
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

    // データをインポート
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
                alert('ファイルの読み込みに失敗しました。正しいバックアップファイルを選択してください。');
            }
            // 同じファイルを再度選択できるようにリセット
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    const handleClearAll = () => {
        if (window.confirm('本当にすべてのデータを削除しますか？この操作は取り消せません。')) {
            if (window.confirm('念のためもう一度確認します。すべてのデータを完全に削除してリセットしますか？')) {
                localStorage.clear();
                window.location.reload();
            }
        }
    };

    return (
        <div className="container fade-in">
            <header className="page-header">
                <button
                    onClick={() => window.history.back()}
                    className="back-button"
                    aria-label="戻る"
                >
                    ←
                </button>
                <h1>設定</h1>
            </header>

            <div className="card">
                <h2>📦 データのバックアップと復元</h2>
                <div className="card-content">
                    <p className="setting-description">
                        作成したチェックリストやテンプレートをファイルに保存したり、保存したファイルからデータを復元したりできます。
                    </p>

                    <div className="button-group">
                        <button onClick={handleExport} className="button primary">
                            📥 バックアップを作成 (保存)
                        </button>

                        <button onClick={() => fileInputRef.current?.click()} className="button outline">
                            📤 バックアップから復元
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
            </div>

            <div className="card danger-zone">
                <h2>⚠️ 危険な操作</h2>
                <div className="card-content">
                    <p className="setting-description">
                        アプリのすべてのデータを削除して初期状態に戻します。この操作は元に戻せません。
                    </p>
                    <button onClick={handleClearAll} className="button danger">
                        🗑️ 全てのデータを削除
                    </button>
                </div>
            </div>

            <div className="card">
                <h2>ℹ️ アプリについて</h2>
                <div className="card-content">
                    <p>バージョン: 1.0.0</p>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                        データはブラウザ内に保存されます。ブラウザのキャッシュをクリアするとデータが消える可能性があるため、こまめなバックアップをおすすめします。
                    </p>
                </div>
            </div>
        </div>
    );
};
