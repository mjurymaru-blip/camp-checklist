import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_TEMPLATES, DEFAULT_CATEGORIES } from '../types';
import type { Checklist, ChecklistItem, Template, Category } from '../types';

interface ChecklistStore {
    checklists: Checklist[];
    templates: Template[];
    categories: Category[];

    // チェックリスト操作
    addChecklist: (title: string, campsite?: string, date?: string, templateId?: string) => string;
    updateChecklist: (id: string, updates: Partial<Checklist>) => void;
    deleteChecklist: (id: string) => void;
    archiveChecklist: (id: string) => void;
    unarchiveChecklist: (id: string) => void;
    duplicateChecklist: (id: string) => string;

    // アイテム操作
    addItem: (checklistId: string, item: Omit<ChecklistItem, 'id' | 'checked'>) => void;
    updateItem: (checklistId: string, itemId: string, updates: Partial<ChecklistItem>) => void;
    deleteItem: (checklistId: string, itemId: string) => void;
    toggleItem: (checklistId: string, itemId: string) => void;
    toggleAllItems: (checklistId: string, checked: boolean) => void;

    // テンプレート操作
    addTemplate: (template: Template) => void;
    updateTemplate: (id: string, updates: Partial<Template>) => void;
    deleteTemplate: (id: string) => void;
    addTemplateItem: (templateId: string, item: Omit<ChecklistItem, 'id' | 'checked'>) => void;
    updateTemplateItem: (templateId: string, itemId: string, updates: Partial<Omit<ChecklistItem, 'checked'>>) => void;
    deleteTemplateItem: (templateId: string, itemId: string) => void;
    createTemplateFromChecklist: (checklistId: string, templateName: string) => string;
    // データ管理
    importData: (data: Partial<ChecklistStore>) => void;
    // テンプレート複製
    duplicateTemplate: (sourceId: string, newName: string) => string;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useChecklistStore = create<ChecklistStore>()(
    persist(
        (set, get) => ({
            checklists: [],
            templates: DEFAULT_TEMPLATES,
            categories: DEFAULT_CATEGORIES,

            addChecklist: (title, campsite, date, templateId) => {
                const id = generateId();
                const now = new Date().toISOString();

                let items: ChecklistItem[] = [];
                if (templateId) {
                    const template = get().templates.find(t => t.id === templateId);
                    if (template) {
                        items = template.items.map(item => ({
                            ...item,
                            id: generateId(),
                            checked: false,
                        }));
                    }
                }

                const newChecklist: Checklist = {
                    id,
                    title,
                    campsite,
                    date,
                    items,
                    createdAt: now,
                    updatedAt: now,
                    isArchived: false,
                };

                set(state => ({
                    checklists: [...state.checklists, newChecklist],
                }));

                return id;
            },

            updateChecklist: (id, updates) => {
                set(state => ({
                    checklists: state.checklists.map(c =>
                        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
                    ),
                }));
            },

            deleteChecklist: (id) => {
                set(state => ({
                    checklists: state.checklists.filter(c => c.id !== id),
                }));
            },

            archiveChecklist: (id) => {
                set(state => ({
                    checklists: state.checklists.map(c =>
                        c.id === id ? { ...c, isArchived: true, updatedAt: new Date().toISOString() } : c
                    ),
                }));
            },

            unarchiveChecklist: (id) => {
                set(state => ({
                    checklists: state.checklists.map(c =>
                        c.id === id ? { ...c, isArchived: false, updatedAt: new Date().toISOString() } : c
                    ),
                }));
            },

            duplicateChecklist: (sourceId) => {
                const id = generateId();
                const now = new Date().toISOString();
                const source = get().checklists.find(c => c.id === sourceId);

                if (source) {
                    const newChecklist: Checklist = {
                        ...source,
                        id,
                        title: `${source.title} (コピー)`,
                        items: source.items.map(item => ({
                            ...item,
                            id: generateId(),
                            checked: false,
                        })),
                        createdAt: now,
                        updatedAt: now,
                        isArchived: false,
                    };

                    set(state => ({
                        checklists: [...state.checklists, newChecklist],
                    }));
                }

                return id;
            },

            addItem: (checklistId, item) => {
                set(state => ({
                    checklists: state.checklists.map(c =>
                        c.id === checklistId
                            ? {
                                ...c,
                                items: [...c.items, { ...item, id: generateId(), checked: false }],
                                updatedAt: new Date().toISOString(),
                            }
                            : c
                    ),
                }));
            },

            updateItem: (checklistId, itemId, updates) => {
                set(state => ({
                    checklists: state.checklists.map(c =>
                        c.id === checklistId
                            ? {
                                ...c,
                                items: c.items.map(item =>
                                    item.id === itemId ? { ...item, ...updates } : item
                                ),
                                updatedAt: new Date().toISOString(),
                            }
                            : c
                    ),
                }));
            },

            deleteItem: (checklistId, itemId) => {
                set(state => ({
                    checklists: state.checklists.map(c =>
                        c.id === checklistId
                            ? {
                                ...c,
                                items: c.items.filter(item => item.id !== itemId),
                                updatedAt: new Date().toISOString(),
                            }
                            : c
                    ),
                }));
            },

            toggleItem: (checklistId, itemId) => {
                set(state => ({
                    checklists: state.checklists.map(c =>
                        c.id === checklistId
                            ? {
                                ...c,
                                items: c.items.map(item =>
                                    item.id === itemId ? { ...item, checked: !item.checked } : item
                                ),
                                updatedAt: new Date().toISOString(),
                            }
                            : c
                    ),
                }));
            },

            toggleAllItems: (checklistId, checked) => {
                set(state => ({
                    checklists: state.checklists.map(c =>
                        c.id === checklistId
                            ? {
                                ...c,
                                items: c.items.map(item => ({ ...item, checked })),
                                updatedAt: new Date().toISOString(),
                            }
                            : c
                    ),
                }));
            },

            addTemplate: (template) => {
                set(state => ({
                    templates: [...state.templates, template],
                }));
            },

            updateTemplate: (id, updates) => {
                set(state => ({
                    templates: state.templates.map(t =>
                        t.id === id ? { ...t, ...updates } : t
                    ),
                }));
            },

            deleteTemplate: (id) => {
                set(state => ({
                    templates: state.templates.filter(t => t.id !== id),
                }));
            },

            addTemplateItem: (templateId, item) => {
                set(state => ({
                    templates: state.templates.map(t =>
                        t.id === templateId
                            ? { ...t, items: [...t.items, { ...item, id: generateId() }] }
                            : t
                    ),
                }));
            },

            updateTemplateItem: (templateId, itemId, updates) => {
                set(state => ({
                    templates: state.templates.map(t =>
                        t.id === templateId
                            ? {
                                ...t,
                                items: t.items.map(item =>
                                    item.id === itemId ? { ...item, ...updates } : item
                                ),
                            }
                            : t
                    ),
                }));
            },

            deleteTemplateItem: (templateId, itemId) => {
                set(state => ({
                    templates: state.templates.map(t =>
                        t.id === templateId
                            ? { ...t, items: t.items.filter(item => item.id !== itemId) }
                            : t
                    ),
                }));
            },

            createTemplateFromChecklist: (checklistId, templateName) => {
                const id = generateId();
                const checklist = get().checklists.find(c => c.id === checklistId);

                if (checklist) {
                    const newTemplate: Template = {
                        id,
                        name: templateName,
                        items: checklist.items.map(item => ({
                            id: generateId(),
                            name: item.name,
                            categoryId: item.categoryId,
                            quantity: item.quantity,
                            note: item.note,
                        })),
                    };

                    set(state => ({
                        templates: [...state.templates, newTemplate],
                    }));
                }

                return id;
            },
            importData: (data) => {
                set((state) => ({
                    checklists: data.checklists || state.checklists,
                    templates: data.templates || state.templates,
                    categories: data.categories || state.categories,
                }));
            },

            duplicateTemplate: (sourceId, newName) => {
                const id = generateId();
                const source = get().templates.find(t => t.id === sourceId);

                if (source) {
                    const newTemplate: Template = {
                        ...source,
                        id,
                        name: newName,
                        items: source.items.map(item => ({
                            ...item,
                            id: generateId(),
                        })),
                    };

                    set(state => ({
                        templates: [...state.templates, newTemplate],
                    }));
                }

                return id;
            },
        }),
        {
            name: 'camp-checklist-storage',
        }
    )
);
