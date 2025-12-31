import { useNavigate } from 'react-router-dom';
import { useChecklistStore } from '../stores/checklistStore';
import { ListCard } from '../components/ListCard';

export function History() {
    const navigate = useNavigate();
    const { checklists, duplicateChecklist } = useChecklistStore();

    const archivedChecklists = checklists.filter(c => c.isArchived);

    const handleDuplicate = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newId = duplicateChecklist(id);
        navigate(`/checklist/${newId}`);
    };

    return (
        <div className="main-content watercolor-bg">
            <div className="section-title">履歴</div>

            {archivedChecklists.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📚</div>
                    <div className="empty-title">履歴がありません</div>
                    <div className="empty-text">
                        完了したチェックリストは<br />
                        ここに保存されます
                    </div>
                </div>
            ) : (
                archivedChecklists.map(checklist => (
                    <div key={checklist.id} style={{ position: 'relative' }}>
                        <ListCard
                            checklist={checklist}
                            onClick={() => navigate(`/checklist/${checklist.id}`)}
                        />
                        <button
                            onClick={(e) => handleDuplicate(checklist.id, e)}
                            style={{
                                position: 'absolute',
                                top: 16,
                                right: 80,
                                background: 'var(--color-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 20,
                                padding: '6px 12px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            📋 再利用
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}
