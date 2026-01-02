
export const riceRecipes = [
    // Existing
    {
        id: 'mestin-rice',
        name: 'メスティン自動炊飯',
        meal: 'dinner', servings: 1, difficulty: 'easy', season: ['spring', 'summer', 'autumn', 'winter'],
        calories: '約300kcal', activeTime: '5分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: '固形燃料を使うことで火加減見守り不要のほったらかし炊飯。',
        ingredients: ['米 (1合)', '水 (200ml)'],
        requiredGear: ['メスティン', 'ポケットストーブ', '固形燃料'], usedGearIds: ['mestin', 'esbit'], usedHeatSourceIds: ['esbit'],
        steps: ['米を研ぎ、30分以上吸水させる（重要）。', '固形燃料（25g）に着火し、火が消えるまで放っておく。', '火が消えたらタオルで包んで15分蒸らす。'],
        cookTime: '約40分', tips: '吸水時間が短いと芯が残ります。'
    },
    {
        id: 'curry-rice',
        name: 'キャンプカレー',
        meal: 'dinner', servings: 4, difficulty: 'easy', season: ['spring', 'summer', 'autumn', 'winter'],
        calories: '約800kcal', activeTime: '30分', cleanupLevel: 2, prePrep: true, cost: 'low',
        description: 'やっぱりキャンプといえばこれ。外で食べると何故か美味しい。',
        ingredients: ['カレールー', '肉', 'じゃがいも', '人参', '玉ねぎ', '米'],
        requiredGear: ['鍋', '飯盒など'], usedGearIds: ['titanium-pot'], usedHeatSourceIds: ['bonfire', 'wood-stove'],
        steps: ['具材を炒め、水を入れて煮込む。', '野菜が柔らかくなったらルーを入れる。', 'ご飯にかけて完成。'],
        cookTime: '約45分', tips: '隠し味にインスタントコーヒーやチョコレートを入れるとコクが出ます。'
    },
    {
        id: 'taco-rice',
        name: 'ワンプレート・タコライス',
        meal: 'lunch', servings: 2, difficulty: 'easy', season: ['summer'],
        calories: '約600kcal', activeTime: '15分', cleanupLevel: 1, prePrep: true, cost: 'low',
        description: '野菜も肉もご飯も一皿で摂れる優秀メニュー。',
        ingredients: ['ご飯', 'タコスミート（ひき肉＋タコスシーズニング）', 'レタス', 'トマト', 'チーズ', 'サルサ'],
        requiredGear: ['フライパン'], usedGearIds: ['skillet'], usedHeatSourceIds: ['single-burner'],
        steps: ['ひき肉を炒めて味付けする（レトルトでも可）。', 'ご飯の上にレタス、肉、トマト、チーズを盛る。'],
        cookTime: '約15分', tips: 'ドンタコスなどチップスを砕いて乗せると食感が楽しいです。'
    },
    {
        id: 'fried-rice',
        name: '鉄板チャーハン',
        meal: 'lunch', servings: 2, difficulty: 'easy', season: ['spring', 'summer', 'autumn', 'winter'],
        calories: '約600kcal', activeTime: '10分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: '高火力でパラパラに仕上げる。余り物整理にも。',
        ingredients: ['ご飯 (冷や飯推奨)', '卵', 'ネギ', 'チャーシュー', '醤油', '胡椒'],
        requiredGear: ['鉄板または中華鍋'], usedGearIds: ['iron-plate'], usedHeatSourceIds: ['twin-burner'],
        steps: ['溶き卵を炒め、すぐにご飯を入れてコーティングするように炒める。', '具材を加え、最後に鍋肌から醤油を回し入れる。'],
        cookTime: '約10分', tips: 'パックご飯を使う場合は温めてから炒めるとほぐれやすいです。'
    },
    {
        id: 'risotto',
        name: 'キノコとチーズのリゾット',
        meal: 'dinner', servings: 2, difficulty: 'normal', season: ['autumn', 'winter'],
        calories: '約500kcal', activeTime: '20分', cleanupLevel: 1, prePrep: false, cost: 'mid',
        description: '生米から作る本格リゾット。ワインのお供に。',
        ingredients: ['米', 'きのこミックス', '玉ねぎ', 'コンソメ', '白ワイン', '粉チーズ', 'バター'],
        requiredGear: ['フライパン'], usedGearIds: ['skillet'], usedHeatSourceIds: ['single-burner'],
        steps: ['バターで玉ねぎと米（洗わない）を炒める。', '白ワインを入れ、温めたスープを数回に分けて加えながら煮る。', 'アルデンテになったらチーズを混ぜる。'],
        cookTime: '約25分', tips: '生米から作ると特有の食感が出ます。冷や飯で作ると雑炊になります。'
    },
    {
        id: 'bibimbap',
        name: 'スキレットビビンバ',
        meal: 'dinner', servings: 2, difficulty: 'easy', season: ['spring', 'summer', 'autumn'],
        calories: '約600kcal', activeTime: '15分', cleanupLevel: 1, prePrep: true, cost: 'mid',
        description: 'おこげが美味しい韓国風混ぜご飯。',
        ingredients: ['ご飯', 'ナムルセット（市販）', '牛薄切り肉', 'キムチ', '卵', 'コチュジャン'],
        requiredGear: ['スキレット'], usedGearIds: ['skillet'], usedHeatSourceIds: ['single-burner'],
        steps: ['ごま油を引いたスキレットにご飯を敷き詰める。', '上に具材を綺麗に並べ、真ん中に卵を落とす。', '火にかけ、パチパチ音がしておこげができたら混ぜて食べる。'],
        cookTime: '約15分', tips: '音が聞こえてから少し待つのがおこげ成功の鍵です。'
    },
    {
        id: 'gapao-rice',
        name: 'ガパオライス',
        meal: 'lunch', servings: 2, difficulty: 'easy', season: ['summer'],
        calories: '約600kcal', activeTime: '15分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: 'バジルの香りが食欲をそそるエスニック飯。',
        ingredients: ['鶏ひき肉', 'パプリカ', 'バジル', 'ナンプラー', 'オイスターソース', 'ご飯', '卵'],
        requiredGear: ['フライパン'], usedGearIds: ['skillet'], usedHeatSourceIds: ['single-burner'],
        steps: ['多めの油で目玉焼き（フライドエッグ）を作る。', 'ひき肉と野菜を炒め、調味料とバジルを加える。', 'ご飯に添える。'],
        cookTime: '約15分', tips: 'ナンプラーがなければ醤油で代用できますが、やはりナンプラー推奨。'
    },
    {
        id: 'onigiri',
        name: '焼きおにぎり',
        meal: 'breakfast', servings: 2, difficulty: 'easy', season: ['autumn', 'winter'],
        calories: '約200kcal', activeTime: '10分', cleanupLevel: 1, prePrep: true, cost: 'low',
        description: '炭火で香ばしく焼いた醤油味のおにぎり。',
        ingredients: ['おにぎり', '醤油', 'みりん', 'ごま油'],
        requiredGear: ['焼き網'], usedGearIds: [], usedHeatSourceIds: ['bonfire'],
        steps: ['おにぎりを網に乗せ、素焼きして表面を乾かす（崩れ防止）。', 'タレを塗りながら何度も返して焼く。'],
        cookTime: '約15分', tips: '網に油を塗っておくとくっつきにくいです。冷凍焼きおにぎりも優秀です。'
    },
    {
        id: 'ochazuke',
        name: 'だし茶漬け',
        meal: 'breakfast', servings: 1, difficulty: 'easy', season: ['winter'],
        calories: '約300kcal', activeTime: '5分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: '飲みすぎた翌朝に優しい、サラサラ入る朝食。',
        ingredients: ['ご飯', 'お茶漬けの素', '梅干し', 'お湯'],
        requiredGear: ['シェラカップ'], usedGearIds: ['sierra-cup'], usedHeatSourceIds: ['single-burner'],
        steps: ['ご飯にお茶漬けの素をかけ、お湯を注ぐ。'],
        cookTime: '5分', tips: '鯛の刺身の残りを乗せれば鯛茶漬けに。'
    },
    {
        id: 'kamameshi',
        name: '釜飯（峠の釜めし風）',
        meal: 'dinner', servings: 1, difficulty: 'normal', season: ['autumn'],
        calories: '約500kcal', activeTime: '15分', cleanupLevel: 2, prePrep: true, cost: 'mid',
        description: 'メスティンや専用釜で炊く具だくさんの炊き込みご飯。',
        ingredients: ['米', '鶏肉', 'うずらの卵', '筍', '椎茸', 'グリンピース', '醤油', '酒'],
        requiredGear: ['メスティン'], usedGearIds: ['mestin'], usedHeatSourceIds: ['esbit'],
        steps: ['米と調味料、水を入れ、具材を上に乗せて炊飯する。'],
        cookTime: '約40分', tips: '益子焼の空き釜を再利用して直火にかける猛者もいます。'
    },
    // New Additions
    {
        id: 'oyako-don',
        name: 'とろとろ親子丼',
        meal: 'lunch', servings: 1, difficulty: 'easy', season: ['spring', 'summer', 'autumn', 'winter'],
        calories: '約600kcal', activeTime: '15分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: 'シェラカップや小さいクッカーで作る一人前の幸せ。',
        ingredients: ['ご飯', '鶏もも肉', '玉ねぎ', '卵', 'めんつゆ'],
        requiredGear: ['クッカー（小）'], usedGearIds: ['titanium-pot'], usedHeatSourceIds: ['single-burner'],
        steps: ['薄めた麺つゆで肉と玉ねぎを煮る。', '溶き卵を回し入れ、半熟で火を止める。', 'ご飯に乗せる。'],
        cookTime: '約15分', tips: '卵は二回に分けて入れるとお店のような仕上がりになります。'
    },
    {
        id: 'paella-yaki-onigiri',
        name: 'パエリア風焼きおにぎり',
        meal: 'lunch', servings: 2, difficulty: 'easy', season: ['spring', 'summer'],
        calories: '約300kcal', activeTime: '15分', cleanupLevel: 1, prePrep: true, cost: 'mid',
        description: '残ったパエリアをおにぎりにして焼くリメイク。',
        ingredients: ['パエリアの残り', 'チーズ'],
        requiredGear: ['鉄板', '網'], usedGearIds: ['sierra-cup'], usedHeatSourceIds: ['bonfire'],
        steps: ['パエリアを握る（崩れやすいのでチーズを芯に入れると良い）。', 'カリッと焼く。'],
        cookTime: '約15分', tips: 'お茶漬けにしても美味しい。'
    },
    {
        id: 'corn-rice',
        name: 'とうもろこしご飯',
        meal: 'dinner', servings: 4, difficulty: 'easy', season: ['summer'],
        calories: '約400kcal', activeTime: '10分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: '夏の定番。芯も一緒に炊き込むと甘みがすごい。',
        ingredients: ['米', 'とうもろこし（生）', '塩', 'バター'],
        requiredGear: ['飯盒', 'メスティン'], usedGearIds: ['mestin'], usedHeatSourceIds: ['esbit', 'single-burner'],
        steps: ['とうもろこしの実を削ぎ、芯と一緒に米の上に乗せる。', '塩を入れて炊飯する。', '炊き上がったらバターを混ぜる。'],
        cookTime: '約40分', tips: '少し醤油を垂らすと香ばしい。'
    },
    {
        id: 'mixed-rice',
        name: '缶詰炊き込みご飯',
        meal: 'dinner', servings: 2, difficulty: 'easy', season: ['spring', 'autumn'],
        calories: '約500kcal', activeTime: '5分', cleanupLevel: 1, prePrep: false, cost: 'low',
        description: '焼き鳥缶などを入れて炊くだけの失敗知らずメニュー。',
        ingredients: ['米', '焼き鳥缶（タレ）', 'なめ茸'],
        requiredGear: ['メスティン'], usedGearIds: ['mestin'], usedHeatSourceIds: ['esbit'],
        steps: ['米と水、具材を全て入れて炊飯する。'],
        cookTime: '約40分', tips: '汁の分だけ水を減らすのがコツです。'
    },
    {
        id: 'loco-moco',
        name: 'ロコモコ丼',
        meal: 'lunch', servings: 2, difficulty: 'normal', season: ['summer'],
        calories: '約800kcal', activeTime: '20分', cleanupLevel: 2, prePrep: true, cost: 'mid',
        description: 'ハワイの風を感じるボリューミーなランチ。',
        ingredients: ['ご飯', 'ハンバーグ', '目玉焼き', 'グレイビーソース（またはデミグラス）', 'レタス'],
        requiredGear: ['フライパン'], usedGearIds: ['skillet'], usedHeatSourceIds: ['single-burner'],
        steps: ['ハンバーグと目玉焼きを焼く。', 'ご飯に全てのせ、ソースをたっぷりかける。'],
        cookTime: '約20分', tips: 'パイナップルを添えるとさらにハワイ感UP。'
    },
    {
        id: 'chuka-don',
        name: '具だくさん中華丼',
        meal: 'lunch', servings: 2, difficulty: 'easy', season: ['winter'],
        calories: '約500kcal', activeTime: '10分', cleanupLevel: 1, prePrep: false, cost: 'mid',
        description: '冷凍食品を活用すれば超簡単。',
        ingredients: ['ご飯', '冷凍中華丼の具（またはレトルト）', 'うずらの卵（追加）'],
        requiredGear: ['鍋'], usedGearIds: ['titanium-pot'], usedHeatSourceIds: ['single-burner'],
        steps: ['具を湯煎で温める。', 'ご飯にかける。'],
        cookTime: '10分', tips: 'お酢を持っていくのを忘れずに。'
    },
    {
        id: 'omurice',
        name: 'キャンプオムライス',
        meal: 'lunch', servings: 2, difficulty: 'normal', season: ['spring', 'summer', 'autumn'],
        calories: '約600kcal', activeTime: '20分', cleanupLevel: 2, prePrep: true, cost: 'low',
        description: 'スキレットで作る、卵を乗っけるスタイルのオムライス。',
        ingredients: ['ご飯', '鶏肉', '玉ねぎ', 'ケチャップ', '卵'],
        requiredGear: ['スキレット'], usedGearIds: ['skillet'], usedHeatSourceIds: ['single-burner'],
        steps: ['チキンライスを作る。', '溶き卵を流し入れ、半熟になったら火から下ろす（包まない）。'],
        cookTime: '約20分', tips: 'ケチャップで文字を書くのはお約束です。'
    },
    {
        id: 'doria',
        name: 'ミートドリア',
        meal: 'dinner', servings: 2, difficulty: 'easy', season: ['winter'],
        calories: '約700kcal', activeTime: '25分', cleanupLevel: 2, prePrep: true, cost: 'mid',
        description: '冷や飯救済メニュー。チーズたっぷりで。',
        ingredients: ['ご飯', 'ミートソース（レトルト可）', 'ホワイトソース', 'チーズ'],
        requiredGear: ['スキレット', 'ダッチオーブン'], usedGearIds: ['skillet'], usedHeatSourceIds: ['wood-stove'],
        steps: ['ご飯にバターを混ぜて敷く。', 'ソースとチーズをかけ、蓋をして上火で焼く。'],
        cookTime: '約25分', tips: 'バターライスにするのが鉄則。'
    },
    {
        id: 'spam-don',
        name: 'スパムエッグ丼',
        meal: 'breakfast', servings: 2, difficulty: 'easy', season: ['spring', 'summer', 'autumn', 'winter'],
        calories: '約600kcal', activeTime: '10分', cleanupLevel: 1, prePrep: false, cost: 'mid',
        description: '最強の朝食。醤油をたらり。',
        ingredients: ['ご飯', 'スパム', '卵', '醤油'],
        requiredGear: ['フライパン'], usedGearIds: ['skillet'], usedHeatSourceIds: ['single-burner'],
        steps: ['スパムをカリカリに焼き、卵を落とす。', 'ご飯に乗せる。'],
        cookTime: '約10分', tips: 'マヨネーズも合います。'
    },
    {
        id: 'hitsumabushi',
        name: 'うなぎ飯（ひつまぶし風）',
        meal: 'dinner', servings: 2, difficulty: 'easy', season: ['summer'],
        calories: '約600kcal', activeTime: '15分', cleanupLevel: 1, prePrep: false, cost: 'high',
        description: '土用の丑の日にキャンプで贅沢。',
        ingredients: ['うなぎ蒲焼', 'ご飯', '出汁', 'わさび', '刻み海苔'],
        requiredGear: ['メスティン', 'シェラカップ'], usedGearIds: ['mestin', 'sierra-cup'], usedHeatSourceIds: ['single-burner'],
        steps: ['ご飯の上にうなぎを乗せて温まるまで蒸らす。', '最初はそのまま、最後は出汁茶漬けで。'],
        cookTime: '約15分', tips: 'うなぎは酒を振ってアルミホイルで蒸し焼きにするとふっくらします。'
    }
];
