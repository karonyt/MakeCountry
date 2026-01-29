export default {
    world: 'world',

    //チャンク制限
    chunkLimit: 3200,
    //スポーンエッグをスポナーに入れるのを制限するか
    spawnerSpawnEggBlock: true,

    //プレイヤーの初期の所持金
    initialMoney: 0,
    //所持金をスコアボードに代入できるようにするか(オンラインのプレイヤーのみ)
    getMoneyByScoreboard: false,
    //所持金を代入するスコアボードのオブジェクト名
    moneyScoreboardName: `mc_money`,
    //平和主義切り替えのクールタイム(徴税タイミングごとに-1)
    peaceChangeCooltime: 3,
    //チャットの際にプレイヤー名の左に所属国を表示するか
    showCountryChatLeftName: true,
    //チャットの際にプレイヤー名の左にロール(着いてる中で一番高いロール)を表示するか
    showRoleChatLeftName: false,
    //二つ名を有効にするか
    pennameEnable: true,
    //二つ名の初期のやつ(前)
    initialPennameBefore: "一般的な",
    //二つ名の初期のやつ(後)
    initialPennameAfter: "鯖民",

    //最大Home数
    maxHomeCount: 3,

    //名前の上に国名表記するかどうか
    countryNameDisplayOnPlayerNameTag: true,

    //時差(時間)
    timeDifference: 9,

    //デフォルトで平和主義にするか
    defaultPeace: true,
    //国を作るのに必要な金
    MakeCountryCost: 5000,
    //デフォルトのチャンクの値段
    defaultChunkPrice: 3000,
    //国際組織の設立にかかる金
    MakeInternationalOrganizationCost: 20000,
    //共通通貨の単位
    MoneyName: `$`,
    //初期の国庫の金
    initialCountryMoney: 0,
    //初期のリソースポイント
    initialCountryResourcePoint: 0,

    //徴税＆維持費回収を有効化
    taxValidity: true,
    //徴税＆維持費回収を時間指定制にするか(falseの場合 時間間隔制になる)
    //24時間サーバーの場合は時間指定制がおすすめです
    //ローカルワールドの場合は時間間隔制がおすすめです
    taxTypeIsTimeSet: true,
    //徴税時間(時間指定制の場合)
    taxTime: { hour: 21, min: 0 },
    //徴税間隔(分) (時間間隔制の場合)
    taxTimer: 2 * 60,
    //徴税の何分前にメッセージを表示するか
    taxMessageBeforeTime: 10,
    //初期設定で税金をパーセント式にするか(falseの場合,定額制)
    taxInstitutionIsPer: true,
    //初期の税率(税額)
    taxPer: 10,
    //建国後何回分の徴税をなしにするか
    NonMaintenanceCostAccrualPeriod: 3,
    //平和主義国の維持費(1チャンク)
    MaintenanceFeePacifistCountries: 60,
    //非平和主義国の維持費(1チャンク)
    MaintenanceFeeNonPeacefulCountries: 3,
    //国王の最終ログインから何日間(現実時間)経ってたら徴税時に国を自動で消すか
    autoDeleteAfterFinalLogined: 30,

    //建国時に国庫を非公開にするか
    hideCountryMoney: true,
    //特別区域で許可する権限
    specialAllowPermissions: [`entityUse`, `setHome`, `openContainer`],
    //荒野で許可する権限
    wildernessAllowPermissions: [`entityUse`, `blockUse`, `makeCountry`, `buyChunk`, `place`, `break`, `setHome`, `openContainer`],
    //1ヵ国におけるロールの最大数(デフォルトのロールも考慮) (3以上)
    maxRoleAmount: 15,

    //プレイヤーマーケットを有効にするかどうか
    playerMarketValidity: true,
    //プレイヤーマーケットの1人あたりの最大出品数
    maxMarketAmount: 15,

    //コンバットタグを有効にするか
    combatTagValidity: true,
    //コンバットタグが付くのはPvPのときだけにするか(falseにするとダメージを受けた際に付くようになる)
    combatTagValidityOnlyPvP: true,
    //コンバットタグが付いてる間、Homeコマンドなどのテレポート機能を使えなくするか
    combatTagNoTeleportValidity: true,
    //コンバットタグの持続時間
    combatTagSeconds: 30,

    //tpaを有効にするか
    tpaValidity: true,
    //tpaの有効秒数
    tpaValiditySeconds: 180,

    //cameraコマンド(視点を固定するコマンド)を有効にするか
    cameraValidity: true,

    //killコマンド(自滅するコマンド)を有効にするか
    killValidity: true,

    //shopを有効にするか
    shopValidity: true,

    //侵略(invade)を有効にするか
    invadeValidity: true,
    //侵略の制限時間(秒)
    invadeTimelimit: 60 * 10,
    //侵略のクールタイム(秒)
    invadeCooltime: 0,
    //侵略したあとの平和主義にできない期間
    invadePeaceChangeCooltime: 7,
    //建国後の侵略ができない、されない期間
    invadeProtectionDuration: 7,
    //隅からしか攻められないようにするか
    isAttackCorner: true,
    //指定した時間帯でないと戦争をできないようにするか
    isSettingCanInvadeDuration: true,
    //戦争が可能な時間帯
    canInvadeDuration: {
        //期間開始時刻(24時間制)
        startTime: { hour: 15, min: 0 },
        //期間終了時刻(24時間制)
        endTime: { hour: 0, min: 0 }
    },

    //侵略者が戦争中にHomeコマンドなどのテレポート機能を使えなくするか
    invaderNoTeleportValidity: true,

    //荒野でピストンを置けないようにするか
    isNoPiston: true,

    //プレイヤーマーケットの出品手数料
    playerMarketCommission: 100,

    //戦争時アイテムドロップオン
    invadeItemDrop: true,

    //戦争時アイテムドロップ最大距離
    maxDropDistance: 250,

    //負けた時の侵略のクールタイム(秒)
    invadeLostCoolTime: 60 * 25,

    //勝った時の侵略のクールタイム(秒)
    invadeWonCoolTime: 0,

    //何チャンク以上から侵略できるか
    minChunkCountCanInvade: 1,

    //建国後の併合ができない、されない期間
    mergeProtectionDuration: 12,
};