import type { Checklist } from '../types';

interface Props {
    checklist: Checklist;
    onClick: () => void;
}

export function ListCard({ checklist, onClick }: Props) {
    const checkedCount = checklist.items.filter(item => item.checked).length;
    const totalCount = checklist.items.length;
    const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('ja-JP', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="card" onClick={onClick}>
            <div className="card-header">
                <div>
                    <div className="card-title">{checklist.title}</div>
                    <div className="card-subtitle">
                        {checklist.campsite && <span>📍 {checklist.campsite}</span>}
                        {checklist.date && <span>📅 {formatDate(checklist.date)}</span>}
                    </div>
                </div>
                <div className="card-progress">
                    <div className="progress-text">
                        {checkedCount}/{totalCount}
                    </div>
                    <div className="progress-label">アイテム</div>
                </div>
            </div>
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
