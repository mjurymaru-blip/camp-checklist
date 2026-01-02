
export const vegetableRecipes = [
    {
        id: 'grilled-vegetables',
        name: '豪快焼き野菜',
        meal: 'dinner', servings: 4, difficulty: 'easy', season: ['spring', 'summer', 'autumn'],
        calories: '約100kcal', activeTime: '10分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: '炭火で焼くだけで野菜は甘くなる。塩とオリーブオイルで。',
        ingredients: ['アスパラガス', 'パプリカ', 'エリンギ', 'ズッキーニ', 'ナス', 'オリーブオイル', '岩塩'],
        requiredGear: ['焼き網'], usedGearIds: [], usedHeatSourceIds: ['bonfire'],
        steps: ['大きめにカットする（アスパラは一本のまま）。', 'オリーブオイルを塗って網で焼く。', '岩塩を振って食べる。'],
        cookTime: '約10分', tips: '焦げ目も味のうちです。'
    },
    {
        id: 'whole-onion-soup',
        name: '玉ねぎの丸ごとホイル焼き',
        meal: 'dinner', servings: 4, difficulty: 'easy', season: ['autumn', 'winter'],
        calories: '約50kcal', activeTime: '5分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: 'トロトロに甘くなった玉ねぎは絶品。',
        ingredients: ['玉ねぎ', 'バター', '醤油', '鰹節'],
        requiredGear: ['アルミホイル'], usedGearIds: [], usedHeatSourceIds: ['bonfire', 'wood-stove'],
        steps: ['玉ねぎの皮を剥かずに切れ目を十字に入れる。', 'アルミホイルで二重に包む。', '焚き火の端に放り込んで30分〜1時間放置。', '皮を剥いてバター醤油で。'],
        cookTime: '約1時間', tips: '新玉ねぎならさらに甘くて美味しいです。'
    },
    {
        id: 'caesar-salad',
        name: 'ロメインレタスの焼きシーザーサラダ',
        meal: 'lunch', servings: 2, difficulty: 'easy', season: ['spring', 'summer'],
        calories: '約200kcal', activeTime: '10分', cleanupLevel: 1, prePrep: false, cost: 'mid',
        description: 'レタスを焼くという発想。香ばしさがプラスされる。',
        ingredients: ['ロメインレタス', 'ベーコン', '温玉', '粉チーズ', 'シーザードレッシング'],
        requiredGear: ['焼き網', 'フライパン'], usedGearIds: ['skillet'], usedHeatSourceIds: ['single-burner', 'bonfire'],
        steps: ['ロメインレタスを縦半分に切り、断面をさっと焼く。', 'カリカリベーコン、温玉、チーズ、ドレッシングをかける。'],
        cookTime: '約10分', tips: 'ナイフフォークで食べるおしゃれメニュー。'
    },
    {
        id: 'ratatouille',
        name: '夏野菜のラタトゥイユ',
        meal: 'dinner', servings: 4, difficulty: 'normal', season: ['summer'],
        calories: '約150kcal', activeTime: '20分', cleanupLevel: 2, prePrep: true, cost: 'mid',
        description: '冷やしても美味しい。余ったらパスタソースに。',
        ingredients: ['ナス', 'ズッキーニ', 'パプリカ', 'トマト缶', 'ニンニク', 'オリーブオイル'],
        requiredGear: ['鍋'], usedGearIds: ['titanium-pot'], usedHeatSourceIds: ['single-burner'],
        steps: ['野菜を賽の目に切る。', 'ニンニクと野菜を炒め、トマト缶で煮込む。'],
        cookTime: '約30分', tips: '翌日の方が味が馴染みます。'
    },
    {
        id: 'cabbage-steak',
        name: 'アンチョビキャベツステーキ',
        meal: 'dinner', servings: 2, difficulty: 'easy', season: ['spring', 'winter'],
        calories: '約100kcal', activeTime: '10分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: 'キャベツの甘みを引き出す豪快ステーキ。',
        ingredients: ['キャベツ（1/4個）', 'アンチョビ', 'ニンニク', 'オリーブオイル'],
        requiredGear: ['スキレット'], usedGearIds: ['skillet'], usedHeatSourceIds: ['single-burner'],
        steps: ['キャベツを芯がついたままくし形に切る。', 'スキレットで両面をじっくり焼く。', 'アンチョビソースをかける。'],
        cookTime: '約15分', tips: '蓋をして蒸し焼きにすると早く火が通ります。'
    },
    {
        id: 'pickles',
        name: '彩り野菜のピクルス',
        meal: 'snack', servings: 4, difficulty: 'easy', season: ['summer'],
        calories: '約50kcal', activeTime: '10分', cleanupLevel: 1, prePrep: true, cost: 'mid',
        description: '箸休めにぴったり。家で作って持っていくのが正解。',
        ingredients: ['キュウリ', 'パプリカ', '人参', 'セロリ', 'ピクルス液（酢・砂糖・塩・スパイス）'],
        requiredGear: ['保存瓶'], usedGearIds: [], usedHeatSourceIds: [],
        steps: ['野菜をスティック状に切る。', 'ピクルス液に一晩漬ける。'],
        cookTime: '仕込み10分', tips: 'カレーの付け合わせに最高です。'
    },
    {
        id: 'bagna-cauda',
        name: 'バーニャカウダ',
        meal: 'dinner', servings: 4, difficulty: 'easy', season: ['spring', 'autumn', 'winter'],
        calories: '約200kcal', activeTime: '15分', cleanupLevel: 1, prePrep: true, cost: 'mid',
        description: '野菜が無限に食べられる魔法のソース。',
        ingredients: ['好みの野菜（生または茹で）', 'ニンニク', 'アンチョビ', 'オリーブオイル', '牛乳'],
        requiredGear: ['シェラカップ', '小鍋'], usedGearIds: ['sierra-cup', 'titanium-pot'], usedHeatSourceIds: ['single-burner'],
        steps: ['ニンニクとアンチョビを牛乳で煮てペースト状にする。', 'オリーブオイルを加えて温める。'],
        cookTime: '約15分', tips: 'ソースが冷めないようにキャンドルなどで保温しながらどうぞ。'
    },
    {
        id: 'corn-butter',
        name: 'コーンバター醤油',
        meal: 'snack', servings: 2, difficulty: 'easy', season: ['summer'],
        calories: '約200kcal', activeTime: '5分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: '子供も大好き。缶詰でも生でも。',
        ingredients: ['コーン缶', 'バター', '醤油'],
        requiredGear: ['シェラカップ/スキレット'], usedGearIds: ['sierra-cup', 'skillet'], usedHeatSourceIds: ['single-burner'],
        steps: ['バターでコーンを炒める。', '醤油を垂らす。'],
        cookTime: '5分', tips: '焦がし醤油にするのがポイント。'
    },
    {
        id: 'baked-potato',
        name: 'ベイクドポテト',
        meal: 'snack', servings: 2, difficulty: 'easy', season: ['autumn', 'winter'],
        calories: '約300kcal', activeTime: '5分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: 'ホクホクのじゃがいもにバターと塩辛を乗せて。',
        ingredients: ['じゃがいも', 'バター', 'イカの塩辛（またはサワークリーム）'],
        requiredGear: ['ホイル'], usedGearIds: [], usedHeatSourceIds: ['bonfire'],
        steps: ['洗ったじゃがいもをホイルで包んで焚き火に入れる。', '竹串が通ったら十字に切り込みを開く。'],
        cookTime: '約40分', tips: '北海道スタイルで塩辛を乗せるのが通。'
    },
    {
        id: 'mushroom-ahijo',
        name: 'キノコのアヒージョ',
        meal: 'snack', servings: 2, difficulty: 'easy', season: ['autumn'],
        calories: '約300kcal', activeTime: '10分', cleanupLevel: 1, prePrep: false, cost: 'mid',
        description: '秋の味覚。バゲット必須。',
        ingredients: ['マッシュルーム', 'エリンギ', 'しめじ', 'ニンニク', 'オリーブオイル'],
        requiredGear: ['スキレット'], usedGearIds: ['skillet'], usedHeatSourceIds: ['single-burner'],
        steps: ['たっぷりのオイルとニンニクでキノコを煮る。'],
        cookTime: '約10分', tips: 'キノコから水分が出るのでオイルは少なめでOK。'
    },
    {
        id: 'broccoli-peペperoncino', // Typo intended to check correction? No, just typo.
        name: 'ブロッコリーのアーリオオーリオ',
        meal: 'snack', servings: 2, difficulty: 'easy', season: ['winter'],
        calories: '約100kcal', activeTime: '10分', cleanupLevel: 1, prePrep: true, cost: 'low',
        description: '茹でるより蒸し焼きにすると味が濃い。',
        ingredients: ['ブロッコリー', 'ニンニク', '鷹の爪', 'オリーブオイル'],
        requiredGear: ['スキレット'], usedGearIds: ['skillet'], usedHeatSourceIds: ['single-burner'],
        steps: ['ニンニクを炒め、ブロッコリーと少量の水を入れて蓋をして蒸し焼きにする。'],
        cookTime: '約10分', tips: 'クタクタになるまで火を通すのがイタリア流。'
    },
    {
        id: 'asparagus-bacon',
        name: 'アスパラベーコン巻き',
        meal: 'snack', servings: 2, difficulty: 'easy', season: ['spring'],
        calories: '約200kcal', activeTime: '10分', cleanupLevel: 1, prePrep: true, cost: 'mid',
        description: 'お弁当の定番も炭火で焼けば立派なアテ。',
        ingredients: ['アスパラガス', 'ベーコン', '黒胡椒'],
        requiredGear: ['串', '網'], usedGearIds: [], usedHeatSourceIds: ['bonfire'],
        steps: ['アスパラにベーコンを巻き、串に刺して焼く。'],
        cookTime: '約10分', tips: '太いアスパラを使うとジューシーです。'
    },
    {
        id: 'nasu-denraku',
        name: 'ナスの田楽',
        meal: 'snack', servings: 2, difficulty: 'easy', season: ['summer', 'autumn'],
        calories: '約150kcal', activeTime: '15分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: 'とろとろのナスに甘い味噌。',
        ingredients: ['ナス', '田楽味噌（味噌・砂糖・みりん）', 'ごま'],
        requiredGear: ['網'], usedGearIds: [], usedHeatSourceIds: ['bonfire'],
        steps: ['ナスを縦半分に切り、皮目に切り込みを入れて焼く。', '火が通ったら味噌を塗って少し炙る。'],
        cookTime: '約15分', tips: '皮を黒焼きにして剥いて食べる焼きナスもおすすめ。'
    },
    {
        id: 'tomato-cheese',
        name: 'トマトのチーズ焼き',
        meal: 'snack', servings: 1, difficulty: 'easy', season: ['summer'],
        calories: '約150kcal', activeTime: '10分', cleanupLevel: 1, prePrep: false, cost: 'mid',
        description: '加熱したトマトのリコピンパワー。',
        ingredients: ['トマト', 'とろけるチーズ', 'オリーブオイル', 'ハーブ'],
        requiredGear: ['スキレット'], usedGearIds: ['skillet'], usedHeatSourceIds: ['single-burner'],
        steps: ['トマトを輪切りにして焼く。', 'チーズを乗せて溶かす。'],
        cookTime: '約10分', tips: 'バジルを添えてカプレーゼ風に。'
    },
    {
        id: 'satomimo-foil',
        name: '里芋のホイル焼き',
        meal: 'snack', servings: 2, difficulty: 'easy', season: ['autumn'],
        calories: '約100kcal', activeTime: '5分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: 'ねっとりホクホク。塩だけで旨い。',
        ingredients: ['里芋（泥付きが良い）', '塩'],
        requiredGear: ['ホイル'], usedGearIds: [], usedHeatSourceIds: ['bonfire'],
        steps: ['洗った里芋を皮ごとホイルに包んで焼く。', '指で押して柔らかくなったら完成。皮を剥いて塩で。'],
        cookTime: '約30分', tips: '手軽で一番美味しい食べ方です。'
    },
    {
        id: 'renkon-chips',
        name: 'レンコンチップス',
        meal: 'snack', servings: 2, difficulty: 'normal', season: ['autumn', 'winter'],
        calories: '約200kcal', activeTime: '20分', cleanupLevel: 2, prePrep: false, cost: 'low',
        description: 'パリパリ食感。揚げたて最高。',
        ingredients: ['レンコン', '揚げ油', '塩'],
        requiredGear: ['深型クッカー'], usedGearIds: ['bottom-wide-cooker'], usedHeatSourceIds: ['single-burner'],
        steps: ['レンコンを薄くスライスし、水気を拭き取る。', 'カリッとするまで揚げる。'],
        cookTime: '約15分', tips: '青のりを振っても美味しい。'
    },
    {
        id: 'shishito-yaki',
        name: 'ししとうの網焼き',
        meal: 'snack', servings: 2, difficulty: 'easy', season: ['summer'],
        calories: '約50kcal', activeTime: '5分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: '当たり（辛いやつ）を引くのも楽しみの一つ？',
        ingredients: ['ししとう', '醤油', '鰹節'],
        requiredGear: ['網'], usedGearIds: [], usedHeatSourceIds: ['bonfire'],
        steps: ['破裂防止に穴を開けてから焼く。', '焦げ目がついたら醤油と鰹節をまぶす。'],
        cookTime: '約5分', tips: 'シンプルイズベスト。'
    },
    {
        id: 'infinite-cabbage',
        name: '無限キャベツ',
        meal: 'snack', servings: 2, difficulty: 'easy', season: ['spring', 'winter'],
        calories: '約100kcal', activeTime: '5分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: 'ビニール袋一つでできる即席つまみ。',
        ingredients: ['キャベツ', 'ごま油', '鶏がらスープの素', '塩昆布'],
        requiredGear: ['ビニール袋'], usedGearIds: [], usedHeatSourceIds: [],
        steps: ['ざく切りにしたキャベツと調味料を袋に入れて揉む。'],
        cookTime: '5分', tips: 'すぐに食べられます。'
    },
    {
        id: 'avocado-dip',
        name: 'ワカモレ（アボカドディップ）',
        meal: 'snack', servings: 4, difficulty: 'easy', season: ['summer'],
        calories: '約300kcal', activeTime: '10分', cleanupLevel: 1, prePrep: false, cost: 'mid',
        description: 'トルティーヤチップスをつけて。パーティー向け。',
        ingredients: ['アボカド', '玉ねぎ（みじん切り）', 'トマト', 'ライム', '塩', 'パクチー'],
        requiredGear: ['ボウル'], usedGearIds: ['sierra-cup'], usedHeatSourceIds: [],
        steps: ['アボカドを潰し、他の材料を混ぜる。', '種を一緒に入れておくと変色しにくいです。'],
        cookTime: '10分', tips: 'ライムの酸味が重要。'
    },
    {
        id: 'negima',
        name: '白ネギの一本焼き',
        meal: 'snack', servings: 2, difficulty: 'easy', season: ['winter'],
        calories: '約50kcal', activeTime: '5分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: '外側の焦げた皮を剥くと、中はトロトロの甘いネギ。',
        ingredients: ['長ネギ（太いもの）'],
        requiredGear: ['網'], usedGearIds: [], usedHeatSourceIds: ['bonfire'],
        steps: ['ネギをそのまま真っ黒になるまで焼く。', '皮を一枚剥いて中の白い部分を食べる。'],
        cookTime: '約20分', tips: 'カルソッツというスペインのお祭り料理です。'
    }
];
