import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChecklistStore } from '../stores/checklistStore';
import { ListCard } from '../components/ListCard';

export function Home() {
    const navigate = useNavigate();
    const { checklists, templates, addChecklist } = useChecklistStore();
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newCampsite, setNewCampsite] = useState('');
    const [newDate, setNewDate] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(templates[0]?.id);

    const activeChecklists = checklists.filter(c => !c.isArchived);

    const handleCreate = () => {
        if (!newTitle.trim()) return;

        const id = addChecklist(newTitle, newCampsite || undefined, newDate || undefined, selectedTemplate);
        setShowModal(false);
        setNewTitle('');
        setNewCampsite('');
        setNewDate('');
        navigate(`/checklist/${id}`);
    };

    return (
        <div className="main-content watercolor-bg">
            <div className="section-title">アクティブなリスト</div>

            {activeChecklists.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🏕️</div>
                    <div className="empty-title">リストがありません</div>
                    <div className="empty-text">
                        右下の「＋」ボタンから<br />
                        新しいチェックリストを作成しましょう
                    </div>
                </div>
            ) : (
                activeChecklists.map(checklist => (
                    <ListCard
                        key={checklist.id}
                        checklist={checklist}
                        onClick={() => navigate(`/checklist/${checklist.id}`)}
                    />
                ))
            )}

            <button className="fab" onClick={() => setShowModal(true)}>
                ＋
            </button>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">新しいチェックリスト</div>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">タイトル *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="例：2024年GW 富士山キャンプ"
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">キャンプ場</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="例：ふもとっぱらキャンプ場"
                                    value={newCampsite}
                                    onChange={e => setNewCampsite(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">日程</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={newDate}
                                    onChange={e => setNewDate(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">テンプレート</label>
                                {templates.map(template => (
                                    <div
                                        key={template.id}
                                        className={`template-option ${selectedTemplate === template.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedTemplate(template.id)}
                                    >
                                        <div className="template-icon">📋</div>
                                        <div className="template-info">
                                            <div className="template-name">{template.name}</div>
                                            <div className="template-count">{template.items.length}個のアイテム</div>
                                        </div>
                                    </div>
                                ))}
                                <div
                                    className={`template-option ${selectedTemplate === undefined ? 'selected' : ''}`}
                                    onClick={() => setSelectedTemplate(undefined)}
                                >
                                    <div className="template-icon">📝</div>
                                    <div className="template-info">
                                        <div className="template-name">空のリスト</div>
                                        <div className="template-count">0から始める</div>
                                    </div>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary btn-full mt-16"
                                onClick={handleCreate}
                                disabled={!newTitle.trim()}
                            >
                                作成する
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
