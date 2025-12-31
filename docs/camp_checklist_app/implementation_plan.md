# キャンプ持ち物チェックリスト PWA - 実装計画

キャンプや買い物などで使える、楽しい雰囲気の持ち物チェックリストアプリを作成します。

## 概要

- **プラットフォーム**: PWA（Progressive Web App）
- **データ保存**: ローカルストレージ（IndexedDB）
- **デザイン**: 水彩風イラストを使った楽しい雰囲気
- **技術スタック**: Vite + React + TypeScript

## 主要機能

| 機能 | 説明 |
|------|------|
| テンプレート管理 | 基本的な持ち物をテンプレートとして事前登録 |
| 複数リスト管理 | 複数のキャンプ予定を別々のリストで管理 |
| 履歴・再利用 | 過去のリストを閲覧・コピーして再利用 |
| カテゴリ分け | テント類、寝具、調理器具などカテゴリで整理 |

## Proposed Changes

### プロジェクト構造

```
/home/gemini1/workspace2/camp-checklist/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── public/
│   ├── manifest.json          # PWA マニフェスト
│   ├── sw.js                  # Service Worker
│   └── icons/                 # アプリアイコン（水彩風）
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── components/
    │   ├── Header.tsx
    │   ├── ChecklistItem.tsx
    │   ├── CategorySection.tsx
    │   ├── ListCard.tsx
    │   └── TemplateSelector.tsx
    ├── pages/
    │   ├── Home.tsx           # リスト一覧
    │   ├── Checklist.tsx      # チェックリスト詳細
    │   ├── Templates.tsx      # テンプレート管理
    │   └── History.tsx        # 履歴
    ├── hooks/
    │   └── useLocalStorage.ts
    ├── stores/
    │   └── checklistStore.ts  # 状態管理
    └── types/
        └── index.ts           # 型定義
```

---

### [NEW] Core Setup Files

#### [NEW] [package.json](file:///home/gemini1/workspace2/camp-checklist/package.json)
- Vite + React + TypeScript のセットアップ
- react-router-dom（ルーティング）
- zustand（軽量状態管理）

#### [NEW] [vite.config.ts](file:///home/gemini1/workspace2/camp-checklist/vite.config.ts)
- PWA対応のビルド設定

---

### [NEW] Types & Data Model

#### [NEW] [src/types/index.ts](file:///home/gemini1/workspace2/camp-checklist/src/types/index.ts)

```typescript
// カテゴリ
type Category = {
  id: string;
  name: string;
  icon: string;  // 水彩風アイコン
  color: string;
};

// 持ち物アイテム
type ChecklistItem = {
  id: string;
  name: string;
  categoryId: string;
  checked: boolean;
  quantity?: number;
  note?: string;
};

// チェックリスト
type Checklist = {
  id: string;
  title: string;           // 例：「2024年GW 富士山キャンプ」
  campsite?: string;       // キャンプ場名
  date?: string;           // 日程
  items: ChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;     // 履歴用
};

// テンプレート
type Template = {
  id: string;
  name: string;            // 例：「基本セット」「夏キャンプ」
  items: Omit<ChecklistItem, 'checked'>[];
};
```

---

### [NEW] UI Components

#### [NEW] [src/components/Header.tsx](file:///home/gemini1/workspace2/camp-checklist/src/components/Header.tsx)
- アプリタイトルとナビゲーション
- 水彩風のヘッダーデザイン

#### [NEW] [src/components/ChecklistItem.tsx](file:///home/gemini1/workspace2/camp-checklist/src/components/ChecklistItem.tsx)
- チェックボックス付きアイテム表示
- スワイプで削除・編集

#### [NEW] [src/components/CategorySection.tsx](file:///home/gemini1/workspace2/camp-checklist/src/components/CategorySection.tsx)
- カテゴリ別に折りたたみ可能なセクション
- 水彩風カテゴリアイコン

---

### [NEW] Pages

#### [NEW] [src/pages/Home.tsx](file:///home/gemini1/workspace2/camp-checklist/src/pages/Home.tsx)
- アクティブなチェックリスト一覧
- 新規作成ボタン（FAB）
- テンプレートからの作成

#### [NEW] [src/pages/Checklist.tsx](file:///home/gemini1/workspace2/camp-checklist/src/pages/Checklist.tsx)
- チェックリスト詳細・編集
- カテゴリ別表示
- 進捗表示（◯/△ 個完了）

#### [NEW] [src/pages/History.tsx](file:///home/gemini1/workspace2/camp-checklist/src/pages/History.tsx)
- 過去のチェックリスト一覧
- フィルタ（キャンプ場、時期）
- 再利用ボタン

---

### [NEW] PWA Configuration

#### [NEW] [public/manifest.json](file:///home/gemini1/workspace2/camp-checklist/public/manifest.json)
- アプリ名、アイコン、テーマカラー
- `display: standalone` でアプリ風表示

#### [NEW] [public/sw.js](file:///home/gemini1/workspace2/camp-checklist/public/sw.js)
- オフライン対応のService Worker

---

## デフォルトカテゴリ

| カテゴリ | アイコン | 含まれるアイテム例 |
|---------|----------|-------------------|
| 🏕️ テント・タープ | 水彩テント | テント、タープ、ペグ、ハンマー |
| 🛏️ 寝具 | 水彩寝袋 | 寝袋、マット、枕 |
| 🍳 調理器具 | 水彩フライパン | バーナー、クッカー、食器 |
| 🪑 家具 | 水彩チェア | チェア、テーブル、ランタン |
| 👕 衣類 | 水彩Tシャツ | 着替え、防寒着、レインウェア |
| 🧴 日用品 | 水彩ポーチ | タオル、歯ブラシ、薬 |
| 🔧 その他 | 水彩工具 | ナイフ、ロープ、救急セット |

---

## 水彩風イラスト生成計画

`generate_image` ツールを使用して以下を生成：

1. **アプリアイコン**: テントと山の水彩イラスト
2. **カテゴリアイコン**: 各カテゴリ用の水彩風アイコン（7種類）
3. **背景・装飾**: ヘッダー用の水彩テクスチャ

---

## Verification Plan

### 開発サーバーでの確認
```bash
cd /home/gemini1/workspace2/camp-checklist
npm run dev
```

### 確認項目
- [ ] チェックリストの作成・編集・削除
- [ ] テンプレートからの新規作成
- [ ] カテゴリ別表示
- [ ] 履歴からの再利用
- [ ] ローカルストレージへの保存・読み込み
- [ ] PWAとしてのインストール
- [ ] オフライン動作
