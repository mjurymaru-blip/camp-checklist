
export const noodleRecipes = [
    // Existing
    {
        id: 'yakisoba',
        name: '鉄板焼きそば',
        meal: 'lunch', servings: 4, difficulty: 'easy', season: ['summer'],
        calories: '約500kcal', activeTime: '15分', cleanupLevel: 2, prePrep: true, cost: 'low',
        description: 'キャンプランチの絶対王者。外で食べると何倍も美味しい。',
        ingredients: ['焼きそば麺 (4玉)', '豚バラ肉', 'キャベツ', 'もやし', '人参', '付属の粉ソース'],
        requiredGear: ['鉄板またはマルチグリドル'], usedGearIds: ['iron-plate', 'griddle'], usedHeatSourceIds: ['twin-burner', 'bonfire'],
        steps: ['肉と野菜を炒める。', '麺を入れ、水を少し加えて蒸し焼きにしてほぐす。', 'ソースを加えて水分を飛ばしながら炒め合わせる。'],
        cookTime: '約15分', tips: '最後に目玉焼きを乗せると豪華になります。'
    },
    {
        id: 'meat-sauce-pasta',
        name: 'ゴロゴロお肉のミートソース',
        meal: 'lunch', servings: 2, difficulty: 'normal', season: ['spring', 'autumn'],
        calories: '約600kcal', activeTime: '20分', cleanupLevel: 2, prePrep: true, cost: 'low',
        description: '手作りミートソースは格別の味。一度作れば冷凍して持っていける。',
        ingredients: ['パスタ', '合い挽き肉', '玉ねぎ', 'トマト缶', 'ケチャップ', 'ソース'],
        requiredGear: ['鍋', 'フライパン'], usedGearIds: ['titanium-pot', 'skillet'], usedHeatSourceIds: ['twin-burner'],
        steps: ['ソースを作る（玉ねぎ、肉炒め、トマト缶と調味料で煮込む）。', 'パスタを茹でてソースをかける。'],
        cookTime: '約20分（ソース持参なら10分）', tips: 'フェットチーネなど太めの麺が合います。'
    },
    {
        id: 'camp-ramen',
        name: '朝ラーメン（朝ラー）',
        meal: 'breakfast', servings: 1, difficulty: 'easy', season: ['autumn', 'winter'],
        calories: '約450kcal', activeTime: '5分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: '寒い朝、冷えた体に染み渡る至福の一杯。',
        ingredients: ['インスタントラーメン（袋麺）', '卵', '刻みネギ', '焼き豚（市販）'],
        requiredGear: ['クッカー（小）'], usedGearIds: ['titanium-pot', 'mestin'], usedHeatSourceIds: ['single-burner'],
        steps: ['お湯を沸かし、麺を茹でる。', '卵を落として少し煮る。', 'スープを溶かし、具を乗せる。'],
        cookTime: '約5分', tips: 'カット野菜を入れると罪悪感が薄れます。'
    },
    {
        id: 'penne-gratin',
        name: 'ペンネグラタン',
        meal: 'dinner', servings: 2, difficulty: 'normal', season: ['winter'],
        calories: '約600kcal', activeTime: '20分', cleanupLevel: 2, prePrep: true, cost: 'mid',
        description: 'ダッチオーブンやスキレットで焼く熱々のグラタン。',
        ingredients: ['ペンネ', 'ホワイトソース缶', '鶏肉', 'ブロッコリー', 'チーズ', 'パン粉'],
        requiredGear: ['スキレット'], usedGearIds: ['skillet'], usedHeatSourceIds: ['wood-stove', 'bonfire'],
        steps: ['ペンネを茹でる（または早ゆでタイプ）。', '具材を炒め、ホワイトソースとペンネを和える。', 'チーズとパン粉を乗せ、蓋をして上火で焦げ目がつくまで焼く。'],
        cookTime: '約30分', tips: 'マカロニでもOK。'
    },
    {
        id: 'udon-suki',
        name: '具だくさんうどんすき',
        meal: 'dinner', servings: 4, difficulty: 'easy', season: ['winter'],
        calories: '約400kcal', activeTime: '15分', cleanupLevel: 2, prePrep: true, cost: 'mid',
        description: 'いろいろな具材から出る出汁を吸ったうどんが最高。',
        ingredients: ['うどん玉', '鶏肉', '白菜', '椎茸', 'カマボコ', '油揚げ', 'うどんスープ'],
        requiredGear: ['土鍋またはダッチオーブン'], usedGearIds: ['bottom-wide-cooker'], usedHeatSourceIds: ['cassette-stove'],
        steps: ['つゆを沸かし、具材を煮る。', '最後にうどんを入れて温める。'],
        cookTime: '約20分', tips: '冷凍うどんがコシがあっておすすめです。'
    },
    {
        id: 'cold-somen',
        name: '流水素麺',
        meal: 'lunch', servings: 2, difficulty: 'easy', season: ['summer'],
        calories: '約300kcal', activeTime: '10分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: '暑い夏にさっぱりと。川の水（※要確認）で冷やすのも乙。',
        ingredients: ['素麺', 'めんつゆ', '薬味（ネギ、生姜、ミョウガ）', '氷'],
        requiredGear: ['鍋', 'ザル', 'ボウル'], usedGearIds: ['titanium-pot'], usedHeatSourceIds: ['single-burner'],
        steps: ['素麺を規定時間茹でる。', '水でしっかりとぬめりを取りながら冷やす。', '氷水に浮かべて食べる。'],
        cookTime: '約10分', tips: '缶詰のミカンやサクランボを入れると昭和感が出ます。'
    },
    {
        id: 'yakisoba-salt',
        name: '海鮮塩焼きそば',
        meal: 'lunch', servings: 2, difficulty: 'easy', season: ['summer'],
        calories: '約450kcal', activeTime: '15分', cleanupLevel: 2, prePrep: false, cost: 'mid',
        description: 'ソースとは違ったあっさり味。レモンを絞って。',
        ingredients: ['焼きそば麺', 'シーフードミックス', 'ニラ', 'もやし', '鶏ガラスープの素', '塩ダレ'],
        requiredGear: ['鉄板'], usedGearIds: ['iron-plate'], usedHeatSourceIds: ['twin-burner'],
        steps: ['シーフードと野菜を炒める。', '麺を入れ、酒少々でほぐす。', '塩ダレで調味する。'],
        cookTime: '約15分', tips: '黒胡椒を多めに振ると味が締まります。'
    },
    {
        id: 'carbonara',
        name: '失敗しないワンパンカルボナーラ',
        meal: 'lunch', servings: 2, difficulty: 'normal', season: ['spring', 'autumn', 'winter'],
        calories: '約700kcal', activeTime: '15分', cleanupLevel: 2, prePrep: false, cost: 'low',
        description: 'ダマになりにくいレシピ。濃厚なソースがたまらない。',
        ingredients: ['パスタ', 'ベーコン', '卵', '粉チーズ', '牛乳', 'コンソメ'],
        requiredGear: ['フライパン'], usedGearIds: ['skillet'], usedHeatSourceIds: ['single-burner'],
        steps: ['少なめの水でパスタを茹で、水分を飛ばす。', '火を止めてから、混ぜておいた卵液（卵・チーズ・牛乳）を入れて予熱で和える。'],
        cookTime: '約15分', tips: '火にかけたまま卵液を入れるとスクランブルエッグになるので注意。'
    },
    {
        id: 'curry-udon',
        name: '昨日のカレーでカレーうどん',
        meal: 'breakfast', servings: 2, difficulty: 'easy', season: ['spring', 'autumn', 'winter'],
        calories: '約500kcal', activeTime: '10分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: 'キャンプ2日目の定番リメイク料理。',
        ingredients: ['残ったカレー', 'うどん玉', 'だし醤油（またはめんつゆ）', 'ネギ'],
        requiredGear: ['鍋'], usedGearIds: ['titanium-pot'], usedHeatSourceIds: ['single-burner'],
        steps: ['残ったカレーに水とめんつゆを加えて伸ばす。', 'うどんを入れて煮込む。'],
        cookTime: '約10分', tips: '餅を入れると力うどんになります。'
    },
    {
        id: 'pepperoncino',
        name: 'キャベツとアンチョビのペペロンチーノ',
        meal: 'lunch', servings: 2, difficulty: 'normal', season: ['spring', 'summer'],
        calories: '約500kcal', activeTime: '15分', cleanupLevel: 1, prePrep: false, cost: 'mid',
        description: 'シンプルながら奥深い味。白ワインに合う。',
        ingredients: ['パスタ', 'キャベツ', 'アンチョビフィレ', 'ニンニク', '鷹の爪', 'オリーブオイル'],
        requiredGear: ['フライパン', '鍋'], usedGearIds: ['skillet'], usedHeatSourceIds: ['single-burner'],
        steps: ['パスタを茹でる。', 'フライパンでニンニク、鷹の爪、アンチョビを炒め、キャベツを加える。', 'あがり際にパスタと茹で汁を加えて乳化させる。'],
        cookTime: '約15分', tips: 'アンチョビの塩気が強いので塩は控えめに。'
    },
    // New Additions
    {
        id: 'napolitan',
        name: '喫茶店のナポリタン',
        meal: 'lunch', servings: 2, difficulty: 'easy', season: ['spring', 'summer', 'autumn', 'winter'],
        calories: '約600kcal', activeTime: '15分', cleanupLevel: 2, prePrep: false, cost: 'low',
        description: 'ケチャップをしっかり炒めるのがコツ。ピーマンの苦味がアクセント。',
        ingredients: ['太めのパスタ', 'ウインナー', '玉ねぎ', 'ピーマン', 'ケチャップ', '牛乳'],
        requiredGear: ['フライパン'], usedGearIds: ['skillet'], usedHeatSourceIds: ['single-burner'],
        steps: ['具材を炒める。', 'ケチャップを入れて煮詰め、酸味を飛ばす。', '茹でたパスタと牛乳少々を加えて混ぜる。'],
        cookTime: '約20分', tips: 'タバスコと粉チーズをたっぷりと。'
    },
    {
        id: 'houtou',
        name: 'かぼちゃたっぷりの山梨ほうとう',
        meal: 'dinner', servings: 4, difficulty: 'normal', season: ['winter'],
        calories: '約500kcal', activeTime: '30分', cleanupLevel: 2, prePrep: true, cost: 'low',
        description: '麺にとろみがついて体が温まる。冬キャンプの定番。',
        ingredients: ['ほうとう麺（またはきしめん）', 'かぼちゃ', '豚肉', '油揚げ', '味噌'],
        requiredGear: ['鍋'], usedGearIds: ['bottom-wide-cooker'], usedHeatSourceIds: ['wood-stove'],
        steps: ['かぼちゃが溶けるくらいまで具材を煮込む。', '麺を入れてさらに煮込む。'],
        cookTime: '約30分', tips: '翌朝、ドロドロになったスープにご飯を入れると飛びます。'
    },
    {
        id: 'cold-pasta',
        name: 'トマトとバジルの冷製パスタ',
        meal: 'lunch', servings: 2, difficulty: 'easy', season: ['summer'],
        calories: '約400kcal', activeTime: '15分', cleanupLevel: 2, prePrep: false, cost: 'mid',
        description: 'カッペリーニなどの細麺で。氷水で締めるのが重要。',
        ingredients: ['細いパスタ', 'トマト', 'モッツァレラチーズ', 'バジル', 'オリーブオイル', 'レモン汁'],
        requiredGear: ['鍋', 'ボウル', 'ザル'], usedGearIds: ['titanium-pot'], usedHeatSourceIds: ['single-burner'],
        steps: ['パスタを表示より長く茹で、氷水で急冷する。', 'ボウルで具材とソースを乳化させ、パスタを絡める。'],
        cookTime: '約15分', tips: 'ソースも冷やしておくとより美味しいです。'
    },
    {
        id: 'yaki-udon',
        name: '醤油香る焼きうどん',
        meal: 'lunch', servings: 2, difficulty: 'easy', season: ['spring', 'summer', 'autumn'],
        calories: '約500kcal', activeTime: '10分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: '鰹節が踊る。お手軽ランチ。',
        ingredients: ['うどん玉', '豚肉', 'キャベツ', '醤油', '鰹節'],
        requiredGear: ['鉄板', 'フライパン'], usedGearIds: ['iron-plate', 'skillet'], usedHeatSourceIds: ['twin-burner'],
        steps: ['具材を炒め、うどんを入れる。', '鍋肌から醤油を回し入れる。'],
        cookTime: '約10分', tips: '冷凍うどんを使うとコシが出ます。'
    },
    {
        id: 'soup-pasta',
        name: 'スープパスタ',
        meal: 'breakfast', servings: 1, difficulty: 'easy', season: ['spring', 'autumn'],
        calories: '約400kcal', activeTime: '10分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: 'お湯を沸かして素を入れるだけ。',
        ingredients: ['スープパスタの素（カップ）', 'お湯'],
        requiredGear: ['シェラカップ'], usedGearIds: ['sierra-cup'], usedHeatSourceIds: ['single-burner'],
        steps: ['お湯を注ぐ。'],
        cookTime: '3分', tips: '朝はこれくらいでいいんです。'
    },
    {
        id: 'okinawa-soba',
        name: '沖縄そば',
        meal: 'lunch', servings: 2, difficulty: 'easy', season: ['summer'],
        calories: '約500kcal', activeTime: '15分', cleanupLevel: 1, prePrep: false, cost: 'mid',
        description: 'ラフテー（角煮）を乗せて。コーレーグースを忘れずに。',
        ingredients: ['沖縄そば麺', 'そばだし', 'ラフテー（レトルト）', '紅生姜', 'ネギ'],
        requiredGear: ['鍋'], usedGearIds: ['titanium-pot'], usedHeatSourceIds: ['single-burner'],
        steps: ['麺を湯通しする。', '温めたつゆをかけ、具を乗せる。'],
        cookTime: '約10分', tips: 'スパムを乗せても美味しいです。'
    },
    {
        id: 'short-pasta-salad',
        name: 'フジッリのパスタサラダ',
        meal: 'lunch', servings: 4, difficulty: 'easy', season: ['spring', 'summer'],
        calories: '約300kcal', activeTime: '15分', cleanupLevel: 2, prePrep: true, cost: 'low',
        description: '作り置きできるので初日のランチに最適。',
        ingredients: ['フジッリ（ねじりパスタ）', 'ハム', 'きゅうり', 'コーン', 'マヨネーズ', '塩コショウ'],
        requiredGear: ['鍋'], usedGearIds: ['titanium-pot'], usedHeatSourceIds: ['single-burner'],
        steps: ['パスタを茹でて冷水で冷やす。', '具材とマヨネーズで和える。'],
        cookTime: '約15分', tips: '隠し味に砂糖を少し入れるとデパ地下の味になります。'
    },
    {
        id: 'tantan-men',
        name: '豆乳担々麺',
        meal: 'lunch', servings: 1, difficulty: 'normal', season: ['winter'],
        calories: '約600kcal', activeTime: '15分', cleanupLevel: 2, prePrep: true, cost: 'mid',
        description: '豆乳でまろやかに仕上げたピリ辛麺。',
        ingredients: ['中華麺', '豆乳', '鶏ガラスープ', '肉味噌', 'ラー油', 'チンゲン菜'],
        requiredGear: ['鍋'], usedGearIds: ['titanium-pot'], usedHeatSourceIds: ['single-burner'],
        steps: ['スープを沸かし豆乳を入れる（沸騰させない）。', '茹でた麺にかけ、肉味噌を乗せる。'],
        cookTime: '約15分', tips: 'すりごまをたっぷり入れるとコクが出ます。'
    },
    {
        id: 'ankake-yakisoba',
        name: '五目あんかけ焼きそば',
        meal: 'lunch', servings: 2, difficulty: 'normal', season: ['spring', 'autumn'],
        calories: '約600kcal', activeTime: '20分', cleanupLevel: 2, prePrep: true, cost: 'low',
        description: '麺をカリカリに焼くのがポイント。',
        ingredients: ['焼きそば麺', '豚肉', '白菜', '海老', 'うずらの卵', 'とろみの素（中華丼の素）'],
        requiredGear: ['フライパン'], usedGearIds: ['skillet'], usedHeatSourceIds: ['single-burner'],
        steps: ['多めの油で麺を揚げ焼きにする。', 'レトルトの中華丼の素を温めてかける（手抜き）。'],
        cookTime: '約15分', tips: 'お酢と辛子を添えて。'
    },
    {
        id: 'nyumen',
        name: '温かいにゅうめん',
        meal: 'breakfast', servings: 1, difficulty: 'easy', season: ['spring', 'autumn'],
        calories: '約300kcal', activeTime: '5分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: '余った素麺で作る温かい汁物。',
        ingredients: ['素麺', 'めんつゆ', '卵', 'ネギ'],
        requiredGear: ['クッカー'], usedGearIds: ['titanium-pot'], usedHeatSourceIds: ['single-burner'],
        steps: ['つゆで素麺をそのまま煮る（塩分注意）。'],
        cookTime: '5分', tips: 'とろみがついて温まります。'
    },
    {
        id: 'tai-noodle',
        name: 'パッタイ（タイ風焼きそば）',
        meal: 'lunch', servings: 2, difficulty: 'hard', season: ['summer'],
        calories: '約500kcal', activeTime: '20分', cleanupLevel: 2, prePrep: true, cost: 'mid',
        description: '甘酸っぱいタマリンドソースが癖になる。',
        ingredients: ['米麺（センレック）', 'エビ', '厚揚げ', 'もやし', 'ニラ', 'ピーナッツ', 'パッタイペースト'],
        requiredGear: ['フライパン'], usedGearIds: ['skillet'], usedHeatSourceIds: ['single-burner'],
        steps: ['麺をぬるま湯で戻しておく。', '具材を炒め、麺とソースを入れて絡める。', '卵を割り入れ炒め合わせる。'],
        cookTime: '約20分', tips: 'レモンと砂糖、唐辛子で味変を楽しんで。'
    },
    {
        id: 'curry-ramen',
        name: '室蘭カレーラーメン風',
        meal: 'lunch', servings: 1, difficulty: 'easy', season: ['winter'],
        calories: '約600kcal', activeTime: '10分', cleanupLevel: 2, prePrep: false, cost: 'low',
        description: 'カレースープとちぢれ麺の相性。',
        ingredients: ['生ラーメン（味噌）', 'カレー粉', 'チャーシュー', 'わかめ'],
        requiredGear: ['鍋'], usedGearIds: ['titanium-pot'], usedHeatSourceIds: ['single-burner'],
        steps: ['味噌ラーメンを作り、カレー粉をドバッと入れる。'],
        cookTime: '約10分', tips: 'とろけるチーズトッピングが合います。'
    },
    {
        id: 'genovese',
        name: 'ジャガイモとインゲンのジェノベーゼ',
        meal: 'lunch', servings: 2, difficulty: 'normal', season: ['spring', 'summer'],
        calories: '約600kcal', activeTime: '20分', cleanupLevel: 2, prePrep: false, cost: 'high',
        description: 'バジルソースの鮮やかな緑。',
        ingredients: ['パスタ', 'ジェノベーゼソース（瓶）', 'ジャガイモ', 'インゲン'],
        requiredGear: ['鍋'], usedGearIds: ['titanium-pot'], usedHeatSourceIds: ['single-burner'],
        steps: ['パスタと一緒に野菜も茹でる。', '湯切りしてソースを和える。'],
        cookTime: '約20分', tips: '茹で汁を少し残すと混ざりやすいです。'
    },
    {
        id: 'mac-n-cheese',
        name: 'マカロニ＆チーズ',
        meal: 'snack', servings: 2, difficulty: 'easy', season: ['spring', 'summer', 'autumn', 'winter'],
        calories: '約500kcal', activeTime: '15分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: 'アメリカの国民食。ジャンクだけどやめられない。',
        ingredients: ['マカロニ', 'チェダーチーズ', '牛乳', 'バター'],
        requiredGear: ['スキレット'], usedGearIds: ['skillet'], usedHeatSourceIds: ['single-burner'],
        steps: ['マカロニを茹でる。', '湯を捨て、チーズ、牛乳、バターを入れて混ぜる。'],
        cookTime: '約15分', tips: '箱入りの「KRAFT」を持っていけば最高に簡単。'
    },
    {
        id: 'dish-sara-udon',
        name: 'あんかけ皿うどん',
        meal: 'lunch', servings: 2, difficulty: 'easy', season: ['spring', 'autumn'],
        calories: '約500kcal', activeTime: '10分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: '揚げ麺にかけるだけ。湿気った麺も復活。',
        ingredients: ['皿うどん（揚げ麺）', '中華丼の具（レトルト）', 'お酢'],
        requiredGear: ['シェラカップ', '鍋（湯煎用）'], usedGearIds: ['sierra-cup', 'titanium-pot'], usedHeatSourceIds: ['single-burner'],
        steps: ['レトルトを温めて麺にかける。'],
        cookTime: '5分', tips: '金蝶ソースを持参する通もいます。'
    }
];
