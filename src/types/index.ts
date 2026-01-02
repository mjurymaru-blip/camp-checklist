// カテゴリ
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// 持ち物アイテム
export interface ChecklistItem {
  id: string;
  name: string;
  categoryId: string;
  checked: boolean;
  quantity?: number;
  note?: string;
}

// チェックリスト
export interface Checklist {
  id: string;
  title: string;
  campsite?: string;
  date?: string;
  items: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

// テンプレート
export interface Template {
  id: string;
  name: string;
  items: Omit<ChecklistItem, 'checked'>[];
}

// ====== キャンプメニュー提案機能 ======

// 調理器具
export interface CookingGear {
  id: string;
  name: string;
  owned: boolean;
}

// 熱源
export interface HeatSource {
  id: string;
  name: string;
  owned: boolean;
}

// メニュー提案リクエスト
export interface MenuRequest {
  participants: 'solo' | 'pair' | 'group';
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  effort: 'easy' | 'normal' | 'elaborate';
  focus: 'breakfast' | 'lunch' | 'dinner';
  category?: string;
}

// レシピ（AI応答）
export interface Recipe {
  id: string;
  name: string;
  meal: 'dinner' | 'breakfast' | 'lunch' | 'snack' | 'dessert';
  servings?: number; // 何人前
  difficulty?: 'easy' | 'normal' | 'hard';
  season?: string[]; // 'spring', 'summer', 'autumn', 'winter', 'all'
  calories?: string; // "約500kcal"
  activeTime?: string; // 実作業時間 "10分"
  cleanupLevel?: 1 | 2 | 3; // 1:楽 〜 3:大変
  prePrep?: boolean; // 下準備推奨
  cost?: 'low' | 'mid' | 'high';
  isVegetarian?: boolean;

  description: string;
  ingredients: string[];
  requiredGear: string[];
  usedGearIds: string[];       // Phase 2用: ['iron-plate', 'wood-stove'] のようにIDで返す
  usedHeatSourceIds: string[]; // Phase 2用
  steps: string[];
  cookTime: string; // 全体の調理時間
  tips: string;
  reason?: string; // 提案理由
}

// デフォルト調理器具リスト
export const DEFAULT_COOKING_GEARS: CookingGear[] = [
  { id: 'titanium-pot', name: 'チタンポット', owned: false },
  { id: 'iron-plate', name: '鉄鍋・鉄皿', owned: false },
  { id: 'griddle', name: 'マルチグリドル', owned: false },
  { id: 'mestin', name: 'メスティン', owned: false },
  { id: 'bottom-wide-cooker', name: '底広クッカー', owned: false },
  { id: 'steamer', name: '蒸し器', owned: false },
  { id: 'sierra-cup', name: 'シェラカップ', owned: false },
  { id: 'skillet', name: 'スキレット/鉄フライパン', owned: false },
];

// デフォルト熱源リスト
export const DEFAULT_HEAT_SOURCES: HeatSource[] = [
  { id: 'single-burner', name: 'シングルバーナー', owned: false },
  { id: 'twin-burner', name: 'ツーバーナー', owned: false },
  { id: 'cassette-stove', name: 'カセットコンロ', owned: false },
  { id: 'wood-stove', name: '薪ストーブ', owned: false },
  { id: 'bonfire', name: '焚き火台', owned: false },
  { id: 'esbit', name: 'エスビット', owned: false },
];

// デフォルトカテゴリ
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'tent', name: 'テント・タープ', icon: '🏕️', color: '#4CAF50' },
  { id: 'sleeping', name: '寝具', icon: '🛏️', color: '#2196F3' },
  { id: 'cooking', name: '調理器具', icon: '🍳', color: '#FF9800' },
  { id: 'furniture', name: '家具・照明', icon: '🪑', color: '#795548' },
  { id: 'clothing', name: '衣類', icon: '👕', color: '#9C27B0' },
  { id: 'daily', name: '日用品', icon: '🧴', color: '#E91E63' },
  { id: 'food', name: '食材', icon: '🥬', color: '#8BC34A' },
  { id: 'tools', name: 'その他', icon: '🔧', color: '#607D8B' },
];

// デフォルトテンプレート（プリセット）
export const DEFAULT_TEMPLATES: Template[] = [
  // ソロキャンプ用
  {
    id: 'solo',
    name: 'ソロキャンプ',
    items: [
      // テント・タープ
      { id: 'solo-t1', name: 'テント（ソロ用）', categoryId: 'tent', quantity: 1 },
      { id: 'solo-t2', name: 'タープ', categoryId: 'tent', quantity: 1 },
      { id: 'solo-t3', name: 'ポール', categoryId: 'tent', quantity: 2 },
      { id: 'solo-t4', name: 'グランドシート', categoryId: 'tent', quantity: 1 },
      { id: 'solo-t5', name: 'ペグ', categoryId: 'tent', quantity: 15 },
      { id: 'solo-t6', name: 'ハンマー', categoryId: 'tent', quantity: 1 },
      { id: 'solo-t7', name: 'ガイロープ', categoryId: 'tent', quantity: 6 },
      { id: 'solo-t8', name: '防水シート', categoryId: 'tent', quantity: 1 },
      // 寝具
      { id: 'solo-s1', name: '寝袋', categoryId: 'sleeping', quantity: 1 },
      { id: 'solo-s2', name: 'マット', categoryId: 'sleeping', quantity: 1 },
      { id: 'solo-s3', name: 'コット', categoryId: 'sleeping', quantity: 1 },
      { id: 'solo-s4', name: '枕', categoryId: 'sleeping', quantity: 1 },
      // 調理器具
      { id: 'solo-c1', name: 'シングルバーナー', categoryId: 'cooking', quantity: 1 },
      { id: 'solo-c2', name: 'カセットガス', categoryId: 'cooking', quantity: 1 },
      { id: 'solo-c3', name: 'クッカーセット', categoryId: 'cooking', quantity: 1 },
      { id: 'solo-c4', name: 'シェラカップ', categoryId: 'cooking', quantity: 1 },
      { id: 'solo-c5', name: 'カトラリー', categoryId: 'cooking', quantity: 1 },
      { id: 'solo-c6', name: 'クーラーバッグ', categoryId: 'cooking', quantity: 1 },
      { id: 'solo-c7', name: 'ジャグ', categoryId: 'cooking', quantity: 1 },
      { id: 'solo-c8', name: 'バケツ', categoryId: 'cooking', quantity: 1 },
      // 家具・照明
      { id: 'solo-f1', name: 'チェア・チェアカバー', categoryId: 'furniture', quantity: 1 },
      { id: 'solo-f2', name: 'ミニテーブル', categoryId: 'furniture', quantity: 1 },
      { id: 'solo-f3', name: 'ラック', categoryId: 'furniture', quantity: 1 },
      { id: 'solo-f4', name: 'ランタンハンガー', categoryId: 'furniture', quantity: 1 },
      { id: 'solo-f5', name: 'ランタン', categoryId: 'furniture', quantity: 2 },
      { id: 'solo-f6', name: 'ライトスタンド', categoryId: 'furniture', quantity: 1 },
      // 衣類
      { id: 'solo-cl1', name: '着替え', categoryId: 'clothing', quantity: 1 },
      { id: 'solo-cl2', name: '防寒着', categoryId: 'clothing', quantity: 1 },
      { id: 'solo-cl3', name: 'レインウェア', categoryId: 'clothing', quantity: 1 },
      { id: 'solo-cl4', name: 'タオル', categoryId: 'clothing', quantity: 1 },
      // 日用品
      { id: 'solo-d1', name: 'ティッシュペーパー', categoryId: 'daily', quantity: 1 },
      { id: 'solo-d2', name: '歯ブラシセット', categoryId: 'daily', quantity: 1 },
      { id: 'solo-d3', name: '常備薬', categoryId: 'daily', quantity: 1 },
      { id: 'solo-d4', name: '日焼け止め', categoryId: 'daily', quantity: 1 },
      { id: 'solo-d5', name: '虫除け', categoryId: 'daily', quantity: 1 },
      { id: 'solo-d6', name: '救急セット', categoryId: 'daily', quantity: 1 },
      // 食材
      { id: 'solo-fo1', name: '調味料', categoryId: 'food', quantity: 1 },
      { id: 'solo-fo2', name: '水', categoryId: 'food', quantity: 1 },
      { id: 'solo-fo3', name: '飲料', categoryId: 'food', quantity: 1 },
      // その他
      { id: 'solo-o1', name: 'アルミホイル・クッキングシート', categoryId: 'tools', quantity: 1 },
      { id: 'solo-o2', name: 'キッチンタオル', categoryId: 'tools', quantity: 1 },
      { id: 'solo-o3', name: 'トラッシュボックス', categoryId: 'tools', quantity: 1 },
      { id: 'solo-o4', name: 'ゴミ袋', categoryId: 'tools', quantity: 2 },
      { id: 'solo-o5', name: 'ナイフ', categoryId: 'tools', quantity: 1 },
      { id: 'solo-o6', name: '着火剤', categoryId: 'tools', quantity: 1 },
      { id: 'solo-o7', name: 'スライドトーチ', categoryId: 'tools', quantity: 1 },
      { id: 'solo-o8', name: '焚き火台', categoryId: 'tools', quantity: 1 },
      { id: 'solo-o9', name: '焚火シート', categoryId: 'tools', quantity: 1 },
      { id: 'solo-o10', name: '薪ストーブ', categoryId: 'tools', quantity: 1 },
      { id: 'solo-o11', name: 'オーブン', categoryId: 'tools', quantity: 1 },
      { id: 'solo-o12', name: '革手袋', categoryId: 'tools', quantity: 1 },
      { id: 'solo-o13', name: '軍手', categoryId: 'tools', quantity: 1 },
      { id: 'solo-o14', name: '薪バサミ', categoryId: 'tools', quantity: 1 },
      { id: 'solo-o15', name: '扇風機', categoryId: 'tools', quantity: 1 },
    ],
  },
  // デュオキャンプ用（2人）
  {
    id: 'duo',
    name: 'デュオキャンプ（2人）',
    items: [
      // テント・タープ
      { id: 'duo-t1', name: 'テント（2人用）', categoryId: 'tent', quantity: 1 },
      { id: 'duo-t2', name: 'タープ', categoryId: 'tent', quantity: 1 },
      { id: 'duo-t3', name: 'ポール', categoryId: 'tent', quantity: 2 },
      { id: 'duo-t4', name: 'グランドシート', categoryId: 'tent', quantity: 1 },
      { id: 'duo-t5', name: 'ペグ', categoryId: 'tent', quantity: 20 },
      { id: 'duo-t6', name: 'ハンマー', categoryId: 'tent', quantity: 1 },
      { id: 'duo-t7', name: 'ガイロープ', categoryId: 'tent', quantity: 8 },
      { id: 'duo-t8', name: '防水シート', categoryId: 'tent', quantity: 1 },
      // 寝具
      { id: 'duo-s1', name: '寝袋', categoryId: 'sleeping', quantity: 2 },
      { id: 'duo-s2', name: 'マット', categoryId: 'sleeping', quantity: 2 },
      { id: 'duo-s3', name: 'コット', categoryId: 'sleeping', quantity: 2 },
      { id: 'duo-s4', name: '枕', categoryId: 'sleeping', quantity: 2 },
      // 調理器具
      { id: 'duo-c1', name: 'ツーバーナー', categoryId: 'cooking', quantity: 1 },
      { id: 'duo-c2', name: 'カセットガス', categoryId: 'cooking', quantity: 2 },
      { id: 'duo-c3', name: 'クッカーセット', categoryId: 'cooking', quantity: 1 },
      { id: 'duo-c4', name: 'シェラカップ', categoryId: 'cooking', quantity: 2 },
      { id: 'duo-c5', name: 'カトラリー', categoryId: 'cooking', quantity: 2 },
      { id: 'duo-c6', name: 'クーラーボックス', categoryId: 'cooking', quantity: 1 },
      { id: 'duo-c7', name: 'ジャグ', categoryId: 'cooking', quantity: 1 },
      { id: 'duo-c8', name: 'バケツ', categoryId: 'cooking', quantity: 1 },
      // 家具・照明
      { id: 'duo-f1', name: 'チェア・チェアカバー', categoryId: 'furniture', quantity: 2 },
      { id: 'duo-f2', name: 'テーブル', categoryId: 'furniture', quantity: 1 },
      { id: 'duo-f3', name: 'ラック', categoryId: 'furniture', quantity: 1 },
      { id: 'duo-f4', name: 'ランタンハンガー', categoryId: 'furniture', quantity: 1 },
      { id: 'duo-f5', name: 'ランタン', categoryId: 'furniture', quantity: 2 },
      { id: 'duo-f6', name: 'ライトスタンド', categoryId: 'furniture', quantity: 1 },
      // 衣類
      { id: 'duo-cl1', name: '着替え', categoryId: 'clothing', quantity: 2 },
      { id: 'duo-cl2', name: '防寒着', categoryId: 'clothing', quantity: 2 },
      { id: 'duo-cl3', name: 'レインウェア', categoryId: 'clothing', quantity: 2 },
      { id: 'duo-cl4', name: 'タオル', categoryId: 'clothing', quantity: 2 },
      // 日用品
      { id: 'duo-d1', name: 'ティッシュペーパー', categoryId: 'daily', quantity: 1 },
      { id: 'duo-d2', name: '歯ブラシセット', categoryId: 'daily', quantity: 2 },
      { id: 'duo-d3', name: '常備薬', categoryId: 'daily', quantity: 1 },
      { id: 'duo-d4', name: '日焼け止め', categoryId: 'daily', quantity: 1 },
      { id: 'duo-d5', name: '虫除け', categoryId: 'daily', quantity: 1 },
      { id: 'duo-d6', name: '救急セット', categoryId: 'daily', quantity: 1 },
      // 食材
      { id: 'duo-fo1', name: '調味料', categoryId: 'food', quantity: 1 },
      { id: 'duo-fo2', name: '水', categoryId: 'food', quantity: 2 },
      { id: 'duo-fo3', name: '飲料', categoryId: 'food', quantity: 2 },
      // その他
      { id: 'duo-o1', name: 'アルミホイル・クッキングシート', categoryId: 'tools', quantity: 1 },
      { id: 'duo-o2', name: 'キッチンタオル', categoryId: 'tools', quantity: 1 },
      { id: 'duo-o3', name: 'トラッシュボックス', categoryId: 'tools', quantity: 1 },
      { id: 'duo-o4', name: 'ゴミ袋', categoryId: 'tools', quantity: 3 },
      { id: 'duo-o5', name: 'ナイフ', categoryId: 'tools', quantity: 1 },
      { id: 'duo-o6', name: '着火剤', categoryId: 'tools', quantity: 1 },
      { id: 'duo-o7', name: 'スライドトーチ', categoryId: 'tools', quantity: 1 },
      { id: 'duo-o8', name: '焚き火台', categoryId: 'tools', quantity: 1 },
      { id: 'duo-o9', name: '焚火シート', categoryId: 'tools', quantity: 1 },
      { id: 'duo-o10', name: '薪ストーブ', categoryId: 'tools', quantity: 1 },
      { id: 'duo-o11', name: 'オーブン', categoryId: 'tools', quantity: 1 },
      { id: 'duo-o12', name: '革手袋', categoryId: 'tools', quantity: 2 },
      { id: 'duo-o13', name: '軍手', categoryId: 'tools', quantity: 2 },
      { id: 'duo-o14', name: '薪バサミ', categoryId: 'tools', quantity: 1 },
      { id: 'duo-o15', name: '扇風機', categoryId: 'tools', quantity: 1 },
    ],
  },
  // ファミリーキャンプ用（4人家族想定）
  {
    id: 'family',
    name: 'ファミリーキャンプ（4人）',
    items: [
      // テント・タープ
      { id: 'fam-t1', name: 'ファミリーテント', categoryId: 'tent', quantity: 1 },
      { id: 'fam-t2', name: 'タープ', categoryId: 'tent', quantity: 1 },
      { id: 'fam-t3', name: 'ポール', categoryId: 'tent', quantity: 4 },
      { id: 'fam-t4', name: 'グランドシート', categoryId: 'tent', quantity: 1 },
      { id: 'fam-t5', name: 'ペグ', categoryId: 'tent', quantity: 30 },
      { id: 'fam-t6', name: 'ハンマー', categoryId: 'tent', quantity: 1 },
      { id: 'fam-t7', name: 'ガイロープ', categoryId: 'tent', quantity: 10 },
      { id: 'fam-t8', name: '防水シート', categoryId: 'tent', quantity: 2 },
      { id: 'fam-t9', name: 'インナーマット', categoryId: 'tent', quantity: 1 },
      // 寝具
      { id: 'fam-s1', name: '寝袋（大人用）', categoryId: 'sleeping', quantity: 2 },
      { id: 'fam-s2', name: '寝袋（子供用）', categoryId: 'sleeping', quantity: 2 },
      { id: 'fam-s3', name: 'マット', categoryId: 'sleeping', quantity: 4 },
      { id: 'fam-s4', name: 'コット', categoryId: 'sleeping', quantity: 2 },
      { id: 'fam-s5', name: '枕', categoryId: 'sleeping', quantity: 4 },
      // 調理器具
      { id: 'fam-c1', name: 'ツーバーナー', categoryId: 'cooking', quantity: 1 },
      { id: 'fam-c2', name: 'カセットガス', categoryId: 'cooking', quantity: 3 },
      { id: 'fam-c3', name: 'クッカーセット', categoryId: 'cooking', quantity: 1 },
      { id: 'fam-c4', name: 'フライパン', categoryId: 'cooking', quantity: 1 },
      { id: 'fam-c5', name: 'シェラカップ', categoryId: 'cooking', quantity: 4 },
      { id: 'fam-c6', name: 'カトラリー', categoryId: 'cooking', quantity: 4 },
      { id: 'fam-c7', name: 'クーラーボックス（大）', categoryId: 'cooking', quantity: 1 },
      { id: 'fam-c8', name: 'ジャグ', categoryId: 'cooking', quantity: 1 },
      { id: 'fam-c9', name: 'バケツ', categoryId: 'cooking', quantity: 1 },
      // 家具・照明
      { id: 'fam-f1', name: 'チェア（大人用）', categoryId: 'furniture', quantity: 2 },
      { id: 'fam-f2', name: 'チェア（子供用）', categoryId: 'furniture', quantity: 2 },
      { id: 'fam-f3', name: 'テーブル', categoryId: 'furniture', quantity: 1 },
      { id: 'fam-f4', name: 'ラック', categoryId: 'furniture', quantity: 1 },
      { id: 'fam-f5', name: 'ランタンハンガー', categoryId: 'furniture', quantity: 1 },
      { id: 'fam-f6', name: 'ランタン', categoryId: 'furniture', quantity: 3 },
      { id: 'fam-f7', name: 'ライトスタンド', categoryId: 'furniture', quantity: 1 },
      // 衣類
      { id: 'fam-cl1', name: '着替え（大人）', categoryId: 'clothing', quantity: 2 },
      { id: 'fam-cl2', name: '着替え（子供）', categoryId: 'clothing', quantity: 2 },
      { id: 'fam-cl3', name: '防寒着', categoryId: 'clothing', quantity: 4 },
      { id: 'fam-cl4', name: 'レインウェア', categoryId: 'clothing', quantity: 4 },
      { id: 'fam-cl5', name: 'タオル', categoryId: 'clothing', quantity: 4 },
      // 日用品
      { id: 'fam-d1', name: 'ティッシュペーパー', categoryId: 'daily', quantity: 2 },
      { id: 'fam-d2', name: '歯ブラシセット', categoryId: 'daily', quantity: 4 },
      { id: 'fam-d3', name: '常備薬', categoryId: 'daily', quantity: 1 },
      { id: 'fam-d4', name: '日焼け止め', categoryId: 'daily', quantity: 1 },
      { id: 'fam-d5', name: '虫除け', categoryId: 'daily', quantity: 2 },
      { id: 'fam-d6', name: '救急セット', categoryId: 'daily', quantity: 1 },
      { id: 'fam-d7', name: 'ウェットティッシュ', categoryId: 'daily', quantity: 2 },
      // 食材
      { id: 'fam-fo1', name: '調味料', categoryId: 'food', quantity: 1 },
      { id: 'fam-fo2', name: '水', categoryId: 'food', quantity: 4 },
      { id: 'fam-fo3', name: '飲料', categoryId: 'food', quantity: 4 },
      // その他
      { id: 'fam-o1', name: 'アルミホイル・クッキングシート', categoryId: 'tools', quantity: 1 },
      { id: 'fam-o2', name: 'キッチンタオル', categoryId: 'tools', quantity: 2 },
      { id: 'fam-o3', name: 'トラッシュボックス', categoryId: 'tools', quantity: 1 },
      { id: 'fam-o4', name: 'ゴミ袋', categoryId: 'tools', quantity: 5 },
      { id: 'fam-o5', name: 'ナイフ', categoryId: 'tools', quantity: 1 },
      { id: 'fam-o6', name: '着火剤', categoryId: 'tools', quantity: 1 },
      { id: 'fam-o7', name: 'スライドトーチ', categoryId: 'tools', quantity: 1 },
      { id: 'fam-o8', name: '焚き火台', categoryId: 'tools', quantity: 1 },
      { id: 'fam-o9', name: '焚火シート', categoryId: 'tools', quantity: 1 },
      { id: 'fam-o10', name: '薪ストーブ', categoryId: 'tools', quantity: 1 },
      { id: 'fam-o11', name: 'オーブン', categoryId: 'tools', quantity: 1 },
      { id: 'fam-o12', name: '革手袋', categoryId: 'tools', quantity: 2 },
      { id: 'fam-o13', name: '軍手', categoryId: 'tools', quantity: 4 },
      { id: 'fam-o14', name: '薪バサミ', categoryId: 'tools', quantity: 1 },
      { id: 'fam-o15', name: '扇風機', categoryId: 'tools', quantity: 2 },
      { id: 'fam-o16', name: '遊び道具', categoryId: 'tools', quantity: 1 },
    ],
  },
];

