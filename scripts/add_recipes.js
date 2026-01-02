
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RECIPES_PATH = path.join(__dirname, '../public/recipes.json');

const newRecipes = [
    // Breakfast
    {
        id: 'overnight-oats',
        name: 'オーバーナイトオーツ',
        meal: 'breakfast',
        servings: 1,
        difficulty: 'easy',
        season: ['spring', 'summer'],
        calories: '約300kcal',
        activeTime: '5分',
        cleanupLevel: 1,
        prePrep: true,
        cost: 'low',
        description: '夜に仕込んで朝食べるだけ。火を使わないヘルシーな朝食。',
        ingredients: ['オートミール (50g)', '牛乳または豆乳 (100ml)', 'ヨーグルト (大さじ2)', '好みのフルーツ (適量)', '蜂蜜 (適量)'],
        requiredGear: ['シェラカップまたは密閉容器'],
        usedGearIds: ['sierra-cup'],
        usedHeatSourceIds: [],
        steps: ['容器にオートミール、牛乳、ヨーグルトを入れて混ぜる。', '一晩（または数時間）クーラーボックスで冷やす。', '食べる直前にフルーツと蜂蜜をトッピングする。'],
        cookTime: '仕込み5分+放置',
        tips: 'メイソンジャーで作るとおしゃれで持ち運びも便利。ドライフルーツなら前日から入れておくと柔らかくなります。'
    },
    {
        id: 'skillet-scrambled-eggs',
        name: 'スキレット・スクランブルエッグ',
        meal: 'breakfast',
        servings: 2,
        difficulty: 'easy',
        season: ['spring', 'summer', 'autumn', 'winter'],
        calories: '約250kcal',
        activeTime: '10分',
        cleanupLevel: 2,
        prePrep: false,
        cost: 'low',
        description: 'スキレットで作るふわふわのスクランブルエッグ。ベーコンを添えて。',
        ingredients: ['卵 (4個)', '牛乳 (大さじ2)', 'バター (10g)', '塩コショウ (少々)', 'ベーコン (4枚)'],
        requiredGear: ['スキレット'],
        usedGearIds: ['skillet'],
        usedHeatSourceIds: ['single-burner'],
        steps: ['スキレットでベーコンをカリカリに焼いて取り出す。', '同じスキレットにバターを溶かし、混ぜた卵液を一気に流し込む。', '大きく混ぜながら半熟状になったら火から下ろす。'],
        cookTime: '約10分',
        tips: '余熱で火が通るので、少し早いかな？くらいで火から下ろすととろとろになります。'
    },
    {
        id: 'hot-sandwich-ham-cheese',
        name: '定番ハムチーズホットサンド',
        meal: 'breakfast',
        servings: 1,
        difficulty: 'easy',
        season: ['spring', 'summer', 'autumn', 'winter'],
        calories: '約400kcal',
        activeTime: '10分',
        cleanupLevel: 1,
        prePrep: false,
        cost: 'low',
        description: 'キャンプ朝食の王道。外はカリカリ、中はトロトロのチーズが絶品。',
        ingredients: ['食パン (2枚)', 'ハム (2枚)', 'スライスチーズ (2枚)', 'バター (適量)', 'マヨネーズ (適量)'],
        requiredGear: ['ホットサンドメーカー（なければスキレットで押し焼き）'],
        usedGearIds: ['skillet'],
        usedHeatSourceIds: ['single-burner'],
        steps: ['パンの片面にバターを塗る（これが外側になる）。', '内側にマヨネーズを塗り、ハムとチーズを挟む。', 'ホットサンドメーカーで両面をきつね色になるまで焼く。'],
        cookTime: '約10分',
        tips: 'バターをしっかり塗るとカリッと仕上がります。'
    },

    // Lunch
    {
        id: 'camp-burger',
        name: 'ワイルド・キャンプバーガー',
        meal: 'lunch',
        servings: 2,
        difficulty: 'normal',
        season: ['spring', 'summer', 'autumn'],
        calories: '約700kcal',
        activeTime: '20分',
        cleanupLevel: 2,
        prePrep: true,
        cost: 'mid',
        description: '肉汁あふれるパティを炭火や鉄板で焼いて挟む、満足感たっぷりのランチ。',
        ingredients: ['バンズ (2個)', '牛ひき肉 (300g)', '玉ねぎ (1/4個)', 'レタス (2枚)', 'トマト (スライス2枚)', 'ケチャップ・マスタード (適量)'],
        requiredGear: ['マルチグリドルまたは鉄板', 'フライ返し'],
        usedGearIds: ['griddle'],
        usedHeatSourceIds: ['twin-burner', 'bonfire'],
        steps: ['ひき肉とみじん切り玉ねぎを混ぜてパティを作る（家で作って冷凍推奨）。', '鉄板でパティをじっくり焼く。空いたスペースでバンズも軽く焼く。', '具材を豪快に挟んで完成。'],
        cookTime: '約20分',
        tips: 'パティは焼くと縮むので、バンズよりひと回り大きく作るのがコツ。'
    },
    {
        id: 'hummus-veggie-wrap',
        name: 'ハムスと野菜のラップサンド',
        meal: 'lunch',
        servings: 2,
        difficulty: 'easy',
        season: ['summer'],
        calories: '約350kcal',
        activeTime: '10分',
        cleanupLevel: 1,
        prePrep: false,
        cost: 'mid',
        description: '火を使わずさっぱり食べられる、ヘルシーなラップサンド。',
        ingredients: ['トルティーヤ (2枚)', 'ハムス (適量)', 'キュウリ (スティック状)', 'パプリカ (スティック状)', 'レタス'],
        requiredGear: ['ナイフ'],
        usedGearIds: [],
        usedHeatSourceIds: [],
        steps: ['トルティーヤにハムスを塗る。', '野菜を乗せてしっかりと巻く。', '半分にカットして食べる。'],
        cookTime: '約10分',
        tips: 'ハムスは市販のものを使うと非常に手軽です。'
    },
    {
        id: 'one-pot-tomato-pasta',
        name: 'ワンポット・トマトパスタ',
        meal: 'lunch',
        servings: 2,
        difficulty: 'easy',
        season: ['spring', 'autumn'],
        calories: '約600kcal',
        activeTime: '15分',
        cleanupLevel: 2,
        prePrep: false,
        cost: 'low',
        description: 'パスタの湯切り不要！一つの鍋で煮込むだけで完成する魔法のレシピ。',
        ingredients: ['パスタ (200g)', 'トマト缶 (1缶)', '水 (400ml)', 'コンソメ (1個)', 'ツナ缶 (1缶)', '玉ねぎ (1/2個)'],
        requiredGear: ['深型鍋またはダッチオーブン'],
        usedGearIds: ['bottom-wide-cooker'],
        usedHeatSourceIds: ['single-burner'],
        steps: ['鍋に全ての材料（パスタは半分に折る）を入れる。', '沸騰したら弱火にし、パスタの袋の表示時間通り煮込む。', '時々混ぜて、水分が飛んでとろみがついたら完成。'],
        cookTime: '約15分',
        tips: '早ゆでパスタを使うとさらに時短になります。'
    },

    // Dinner
    {
        id: 'dutch-oven-chili',
        name: 'ダッチオーブン・スパイシーチリ',
        meal: 'dinner',
        servings: 4,
        difficulty: 'normal',
        season: ['autumn', 'winter'],
        calories: '約500kcal',
        activeTime: '20分',
        cleanupLevel: 2,
        prePrep: true,
        cost: 'mid',
        description: '焚き火でコトコト煮込む、体が温まるスパイシーなチリコンカン。',
        ingredients: ['牛ひき肉 (400g)', 'キドニービーンズ缶 (1缶)', 'カットトマト缶 (2缶)', '玉ねぎ (1個)', 'チリパウダー (大さじ2)', 'ニンニク (1片)'],
        requiredGear: ['ダッチオーブン'],
        usedGearIds: ['bottom-wide-cooker'],
        usedHeatSourceIds: ['bonfire', 'wood-stove'],
        steps: ['ダッチオーブンでニンニクと玉ねぎ、ひき肉を炒める。', '肉の色が変わったら、その他の全ての材料を入れる。', '蓋をして焚き火の上で30分〜1時間煮込む。'],
        cookTime: '約1時間',
        tips: '翌朝、ホットドッグにかけたり、ご飯にかけても美味しいです。'
    },
    {
        id: 'foil-shrimp-boil',
        name: '海老と野菜のホイル焼き（ケイジャン風）',
        meal: 'dinner',
        servings: 2,
        difficulty: 'easy',
        season: ['summer', 'autumn'],
        calories: '約400kcal',
        activeTime: '10分',
        cleanupLevel: 1,
        prePrep: false,
        cost: 'high',
        description: 'アルミホイルに包んで火に放り込むだけ。旨味が逃げずジューシーに。',
        ingredients: ['殻付き海老 (8尾)', 'ソーセージ (4本)', 'とうもろこし (1本)', 'じゃがいも (2個)', 'ケイジャンスパイス (適量)', 'バター (20g)'],
        requiredGear: ['アルミホイル'],
        usedGearIds: [],
        usedHeatSourceIds: ['bonfire', 'wood-stove'],
        steps: ['具材を一口大に切る。', 'アルミホイルを広げ、具材を乗せてスパイスとバターを散らす。', '隙間がないようにしっかり包み、焚き火の熾火（おきび）の中に15分ほど置く。'],
        cookTime: '約20分',
        tips: 'ホイルは破れないように2重にするのがポイントです。'
    },
    {
        id: 'skillet-steak-tacos',
        name: 'スキレットステーキタコス',
        meal: 'dinner',
        servings: 2,
        difficulty: 'normal',
        season: ['spring', 'summer', 'autumn'],
        calories: '約600kcal',
        activeTime: '20分',
        cleanupLevel: 2,
        prePrep: false,
        cost: 'high',
        description: 'ステーキ肉を使ったちょっと贅沢なタコス。',
        ingredients: ['ステーキ用牛肉 (200g)', 'トルティーヤ (4枚)', 'アボカド (1個)', 'ライム (1個)', 'パクチー (適量)', 'サルサソース'],
        requiredGear: ['スキレット'],
        usedGearIds: ['skillet'],
        usedHeatSourceIds: ['single-burner'],
        steps: ['牛肉に塩コショウしてスキレットで好みの焼き加減に焼き、一口大に切る。', 'トルティーヤを軽く炙る。', '肉、アボカド、サルサを乗せてライムを絞る。'],
        cookTime: '約20分',
        tips: 'ステーキは焼いた後、アルミホイルで包んで少し休ませると肉汁が落ち着きます。'
    },
    {
        id: 'veggie-curry',
        name: '彩り野菜のキャンプカレー',
        meal: 'dinner',
        servings: 4,
        difficulty: 'easy',
        season: ['summer'],
        calories: '約700kcal',
        activeTime: '20分',
        cleanupLevel: 2,
        prePrep: true,
        cost: 'mid',
        description: '夏野菜をたっぷり使った、彩り豊かなカレー。',
        ingredients: ['カレールー (半箱)', 'ナス (2本)', 'パプリカ (1個)', 'ズッキーニ (1本)', '豚こま肉 (200g)', '水 (表示通り)'],
        requiredGear: ['鍋'],
        usedGearIds: ['titanium-pot'],
        usedHeatSourceIds: ['twin-burner'],
        steps: ['野菜を一口大にカットする。', '鍋で肉と野菜を炒める。', '水を加えて煮込み、野菜に火が通ったらルーを溶かす。'],
        cookTime: '約30分',
        tips: '夏野菜は煮込みすぎず、食感を残すのがコツです。'
    },
    {
        id: 'red-wine-beef-stew',
        name: '牛スネ肉の赤ワイン煮込み',
        meal: 'dinner',
        servings: 2,
        difficulty: 'hard',
        season: ['winter'],
        calories: '約650kcal',
        activeTime: '30分',
        cleanupLevel: 3,
        prePrep: true,
        cost: 'high',
        description: '寒い冬の夜に、焚き火を見ながらじっくり育てたいご馳走メニュー。',
        ingredients: ['牛スネ肉 (400g)', '赤ワイン (300ml)', '玉ねぎ (1個)', '人参 (1本)', 'デミグラスソース缶 (1缶)', 'ローリエ (1枚)'],
        requiredGear: ['ダッチオーブン'],
        usedGearIds: ['bottom-wide-cooker'],
        usedHeatSourceIds: ['wood-stove', 'bonfire'],
        steps: ['牛肉は大きめに切り、塩コショウと小麦粉をまぶして表面を焼く。', '一旦取り出し、野菜を炒める。', '肉を戻し、赤ワインを入れてアルコールを飛ばす。', 'デミグラスソースとローリエを加え、弱火で2時間以上煮込む。'],
        cookTime: '約2時間半',
        tips: '前日に家で煮込んでおき、キャンプ場では温めるだけにするのも賢い手です。'
    },

    // Snacks / Dessert
    {
        id: 'smores',
        name: 'クラシック・スモア',
        meal: 'dessert',
        servings: 4,
        difficulty: 'easy',
        season: ['spring', 'summer', 'autumn', 'winter'],
        calories: '約200kcal',
        activeTime: '5分',
        cleanupLevel: 1,
        prePrep: false,
        cost: 'low',
        description: 'キャンプデザートの代名詞。焼きマシュマロとチョコのハーモニー。',
        ingredients: ['マシュマロ (1袋)', '板チョコ (2枚)', 'グラハムクラッカー (1箱)'],
        requiredGear: ['焼き串'],
        usedGearIds: [],
        usedHeatSourceIds: ['bonfire'],
        steps: ['マシュマロを串に刺し、焚き火で焦げ目がつくまで焼く。', 'クラッカーにチョコと焼いたマシュマロを挟む。', '少し待ってチョコが溶けた頃が食べごろ。'],
        cookTime: '約5分',
        tips: 'マシュマロは火に近づけすぎず、遠火でじっくり回しながら焼くと中までトロトロになります。'
    },
    {
        id: 'banana-boat',
        name: 'チョコバナナボート',
        meal: 'dessert',
        servings: 2,
        difficulty: 'easy',
        season: ['spring', 'summer', 'autumn', 'winter'],
        calories: '約300kcal',
        activeTime: '5分',
        cleanupLevel: 1,
        prePrep: false,
        cost: 'low',
        description: 'バナナを皮ごと焼くだけ。子供も喜ぶ簡単スイーツ。',
        ingredients: ['バナナ (2本)', '板チョコ (適量)', 'マシュマロ (適量)'],
        requiredGear: ['アルミホイル'],
        usedGearIds: [],
        usedHeatSourceIds: ['bonfire', 'wood-stove'],
        steps: ['バナナの皮のカーブの内側に縦に切り込みを入れる（皮は剥かない）。', '切り込みにチョコやマシュマロを詰め込む。', 'アルミホイルで包み、網の上や焚き火のそばで10分ほど焼く。'],
        cookTime: '約15分',
        tips: 'シナモンパウダーを振ると大人の味になります。'
    },
    {
        id: 'classic-trail-mix',
        name: '自家製トレイルミックス',
        meal: 'snack',
        servings: 4,
        difficulty: 'easy',
        season: ['spring', 'summer', 'autumn', 'winter'],
        calories: '約150kcal',
        activeTime: '5分',
        cleanupLevel: 1,
        prePrep: true,
        cost: 'mid',
        description: '行動食に最適。好きなものを詰め込んだエナジー食。',
        ingredients: ['ミックスナッツ (100g)', 'ドライフルーツ (50g)', 'チョコレート (50g)', 'プレッツェル (適量)'],
        requiredGear: ['ジップロック'],
        usedGearIds: [],
        usedHeatSourceIds: [],
        steps: ['全ての材料を袋に入れて混ぜるだけ。'],
        cookTime: '0分',
        tips: '湿気ないように密閉容器やジップロックで保存しましょう。'
    }
];

// 既存ファイルを読み込み
let recipes = [];
if (fs.existsSync(RECIPES_PATH)) {
    try {
        const data = fs.readFileSync(RECIPES_PATH, 'utf8');
        recipes = JSON.parse(data);
    } catch (e) {
        console.error('Failed to parse existing recipes.json', e);
        process.exit(1);
    }
}

// IDの重複をチェックして追加
let addedCount = 0;
newRecipes.forEach(newRecipe => {
    if (!recipes.find(r => r.id === newRecipe.id)) {
        recipes.push(newRecipe);
        addedCount++;
    } else {
        console.log(`Skipping duplicate recipe ID: ${newRecipe.id}`);
    }
});

// ファイル書き込み
try {
    fs.writeFileSync(RECIPES_PATH, JSON.stringify(recipes, null, 4), 'utf8');
    console.log(`Successfully added ${addedCount} new recipes!`);
} catch (e) {
    console.error('Failed to write recipes.json', e);
    process.exit(1);
}
