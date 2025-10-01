export default {
    //jobsを有効化するか
    validity: true,

    maxEmploymentNum: 4, //同時に就ける職業の最大数

    showRewardMessage: true, //メッセージをアクションバーに表示するか

    //1回あたりの報酬
    jobsXp: 0.98,

    //職業レベルの最大値
    jobsLevelMax: 300,

    //職業一覧
    jobsList: [
        //農家
        {
            id: `farmer`, //職業ID(就いてるときに mcjobs_ID のtagが付く)
            name: `farmer`, //formに表示する職業名(翻訳キー(lang)も可能)
        },
        //鉱夫
        {
            id: `miner`,
            name: `miner`,
        },
        //木こり
        {
            id: `woodcutter`,
            name: `woodcutter`,
        },
        //狩人
        {
            id: `hunter`,
            name: `hunter`,
        },
        //漁師
        {
            id: `fisherman`,
            name: `fisherman`,
        },
        //土掘り士
        {
            id: `dirtdigger`,
            name: `dirtdigger`,
        },
        //砂掘り士
        {
            id: `sanddigger`,
            name: `sanddigger`,
        },
        //ネザー掘り士
        {
            id: `netherdigger`,
            name: `netherdigger`,
        },
        //建築士
        {
            id: `builder`,
            name: `builder`,
        },
        //庭師
        {
            id: `gardener`,
            name: `gardener`,
        },
        //ここに追加可能
    ],

    //職業報酬の全体倍率
    jobRewardMagnification: 1,

    buildReward: { min: 0.04, max: 0.1, xp: 0.1 }, //ブロックを置いたときにもらえる報酬の変域

    gardeningReward: { min: 0.6, max: 1, xp: 0.15 }, //葉っぱブロックを素手で壊したときにもらえる報酬の変域

    fishingReward: { min: 10, max: 20, xp: 1.2 }, //釣りでアイテムを釣ったときにもらえる報酬の変域

    sanddiggerReward: { min: 0.2, max: 0.8, xp: 0.25 }, //砂を掘ったときにもらえる報酬の変域

    netherdiggerReward: { min: 0.07, max: 0.13, xp: 0.5 }, //ネザー系ブロックを掘ったときにもらえる報酬の変域

    dirtdiggerReward: { min: 0.2, max: 0.8, xp: 0.20 }, //土を掘ったときにもらえる報酬の変域

    woodCutReward: { min: 2, max: 5.5, xp: 0.98 }, //木を切ったときにもらえる報酬の変域

    cropHarvestReward: { min: 3.7, max: 15, xp: 0.1 }, //作物収穫時にもらえる報酬の変域
    cocoaHarvestReward: { min: 3.7, max: 10, xp: 0.11 }, //ココア収穫時にもらえる報酬の変域

    oreMiningReward: { min: 2, max: 8, xp: 1.2 }, //鉱石系ブロックを掘ったときにもらえる報酬の変域
    stoneMiningReward: { min: 1, max: 2, xp: 0.5 }, //石系ブロックを掘ったときにもらえる報酬の変域
    normalStoneMiningReward: { min: 1, max: 2, xp: 0.45 }, //minecraft:stoneを掘ったときにもらえる報酬の変域 

    skeletonKillReward: { min: 1, max: 2.5, xp: 1.2 }, //スケルトンを倒したときにもらえる報酬の変域
    strayKillReward: { min: 1, max: 2.5, xp: 0.5 }, //ストレイを倒したときにもらえる報酬の変域
    zombieKillReward: { min: 1, max: 2.5, xp: 0.98 }, //ゾンビを倒したときにもらえる報酬の変域
    huskKillReward: { min: 1, max: 3, xp: 0.98 }, //ハスクを倒したときにもらえる報酬の変域
    slimeKillReward: { min: 0.02, max: 0.2, xp: 0.2 }, //スライムを倒したときにもらえる報酬の変域
    spiderKillReward: { min: 1, max: 3, xp: 0.78 }, //クモを倒したときにもらえる報酬の変域
    cave_spiderKillReward: { min: 1, max: 3, xp: 0.98 }, //洞窟クモを倒したときにもらえる報酬の変域
    creeperKillReward: { min: 1, max: 3, xp: 0.98 }, //クリーパーを倒したときにもらえる報酬の変域
    endermanKillReward: { min: 1, max: 3, xp: 1.3 }, //エンダーマンを倒したときにもらえる報酬の変域
    endermiteKillReward: { min: 1, max: 3, xp: 0.4 }, //エンダーマイトを倒したときにもらえる報酬の変域
    evocation_illagerKillReward: { min: 1, max: 35, xp: 1.3 }, //エヴォーカーを倒したときにもらえる報酬の変域
    guardianKillReward: { min: 0.05, max: 0.2, xp: 0.2 }, //ガーディアンを倒したときにもらえる報酬の変域
    pillagerKillReward: { min: 1.5, max: 3, xp: 1.1 }, //ピリジャーを倒したときにもらえる報酬の変域
    shulkerKillReward: { min: 1.5, max: 3, xp: 2 }, //シュルカーを倒したときにもらえる報酬の変域
    silverfishKillReward: { min: 0.02, max: 0.2, xp: 0.01 }, //シルバーフィッシュを倒したときにもらえる報酬の変域
    phantomKillReward: { min: 1, max: 3, xp: 1.5 }, //ファントムを倒したときにもらえる報酬の変域
    ravagerKillReward: { min: 1, max: 4, xp: 2 }, //ラヴェジャーを倒したときにもらえる報酬の変域
    vexKillReward: { min: 1, max: 3, xp: 1.1 }, //ヴェックスを倒したときにもらえる報酬の変域
    vindicatorKillReward: { min: 1, max: 3, xp: 1.2 }, //ヴィンディケーターを倒したときにもらえる報酬の変域
    zombie_villagerKillReward: { min: 1, max: 3, xp: 0.98 }, //村人ゾンビを倒したときにもらえる報酬の変域
    witchKillReward: { min: 1, max: 3, xp: 0.98 }, //ウィッチを倒したときにもらえる報酬の変域

    skeleton_horseKillReward: { min: 1, max: 2, xp: 0.98 }, //スケルトンホースを倒したときにもらえる報酬の変域
    zombie_horseKillReward: { min: 1, max: 2, xp: 0.98 }, //ゾンビホースを倒したときにもらえる報酬の変域

    blazeKillReward: { min: 2, max: 3, xp: 0.98 }, //ブレイズを倒したときにもらえる報酬の変域
    ghastKillReward: { min: 2, max: 3, xp: 0.98 }, //ガストを倒したときにもらえる報酬の変域
    hoglinKillReward: { min: 1, max: 3, xp: 0.98 }, //ホグリンを倒したときにもらえる報酬の変域
    zoglinKillReward: { min: 1, max: 3, xp: 0.98 }, //ゾグリンを倒したときにもらえる報酬の変域
    magma_cubeKillReward: { min: 1, max: 5, xp: 0.98 }, //マグマキューブを倒したときにもらえる報酬の変域
    zombie_pigmanKillReward: { min: 1, max: 2, xp: 0.98 }, //ゾンビピッグマンを倒したときにもらえる報酬の変域
    piglinKillReward: { min: 1, max: 2, xp: 0.98 }, //ピグリンを倒したときにもらえる報酬の変域
    piglin_bruteKillReward: { min: 1.5, max: 3.5, xp: 0.98 }, //ピグリンブルートを倒したときにもらえる報酬の変域
    striderKillReward: { min: 2, max: 3, xp: 0.98 }, //ストライダーを倒したときにもらえる報酬の変域
    wither_skeletonKillReward: { min: 2, max: 4, xp: 0.98 }, //ウィザースケルトンを倒したときにもらえる報酬の変域

    allayKillReward: { min: 0.1, max: 4, xp: 0.98 }, //アレイを倒したときにもらえる報酬の変域
    beeKillReward: { min: 0.1, max: 2, xp: 0.98 }, //ハチを倒したときにもらえる報酬の変域
    batKillReward: { min: 0.1, max: 2, xp: 0.98 }, //コウモリを倒したときにもらえる報酬の変域
    axolotlKillReward: { min: 0.1, max: 3, xp: 0.98 }, //ウーパールーパーを倒したときにもらえる報酬の変域
    camelKillReward: { min: 0.1, max: 3.5, xp: 0.98 }, //ラクダを倒したときにもらえる報酬の変域
    catKillReward: { min: 0.1, max: 0.1, xp: 0.98 }, //猫を倒したときにもらえる報酬の変域
    ocelotKillReward: { min: 0.1, max: 0.1, xp: 0.98 }, //ヤマネコを倒したときにもらえる報酬の変域
    pandaKillReward: { min: 0.1, max: 3, xp: 0.98 }, //パンダを倒したときにもらえる報酬の変域
    parrotKillReward: { min: 0.1, max: 2, xp: 0.98 }, //オウムを倒したときにもらえる報酬の変域
    snifferKillReward: { min: 0.1, max: 4, xp: 0.98 }, //スニッファーを倒したときにもらえる報酬の変域
    wolfKillReward: { min: 0.1, max: 2, xp: 0.98 }, //オオカミを倒したときにもらえる報酬の変域

    dolphinKillReward: { min: 0.1, max: 1, xp: 0.98 }, //イルカを倒したときにもらえる報酬の変域
    codKillReward: { min: 0.1, max: 1, xp: 0.98 }, //タラを倒したときにもらえる報酬の変域
    pufferfishKillReward: { min: 0.1, max: 1, xp: 0.98 }, //フグを倒したときにもらえる報酬の変域
    salmonKillReward: { min: 0.1, max: 1, xp: 0.98 }, //鮭を倒したときにもらえる報酬の変域
    tropicalfishKillReward: { min: 0.1, max: 1, xp: 0.98 }, //熱帯魚を倒したときにもらえる報酬の変域
    turtleKillReward: { min: 0.1, max: 1.5, xp: 0.98 }, //カメを倒したときにもらえる報酬の変域

    pigKillReward: { min: 0.1, max: 2, xp: 0.98 }, //豚を倒したときにもらえる報酬の変域
    chickenKillReward: { min: 0.1, max: 2, xp: 0.98 }, //ニワトリを倒したときにもらえる報酬の変域
    cowKillReward: { min: 0.1, max: 2, xp: 0.98 }, //牛を倒したときにもらえる報酬の変域
    sheepKillReward: { min: 0.1, max: 2, xp: 0.98 }, //羊を倒したときにもらえる報酬の変域
    rabbitKillReward: { min: 0.1, max: 2, xp: 0.98 }, //ウサギを倒したときにもらえる報酬の変域
    donkeyKillReward: { min: 0.1, max: 2, xp: 0.98 }, //ロバを倒したときにもらえる報酬の変域
    horseKillReward: { min: 0.1, max: 2, xp: 0.98 }, //馬を倒したときにもらえる報酬の変域
    llamaKillReward: { min: 0.1, max: 2, xp: 0.98 }, //ラマを倒したときにもらえる報酬の変域
    muleKillReward: { min: 0.1, max: 2, xp: 0.98 }, //ラバを倒したときにもらえる報酬の変域
    foxKillReward: { min: 0.1, max: 2, xp: 0.98 }, //きつねを倒したときにもらえる報酬の変域
    frogKillReward: { min: 0.1, max: 2, xp: 0.98 }, //カエルを倒したときにもらえる報酬の変域
    tadpoleKillReward: { min: 0.1, max: 2, xp: 0.98 }, //オタマジャクシを倒したときにもらえる報酬の変域
    squidKillReward: { min: 0.1, max: 2, xp: 0.98 }, //イカを倒したときにもらえる報酬の変域
    glow_squidKillReward: { min: 0.1, max: 2, xp: 0.98 }, //光るイカを倒したときにもらえる報酬の変域
    goatKillReward: { min: 0.1, max: 2, xp: 0.98 }, //ヤギを倒したときにもらえる報酬の変域
    mooshroomKillReward: { min: 0.1, max: 2, xp: 0.98 }, //ムーシュルームを倒したときにもらえる報酬の変域
    polar_bearKillReward: { min: 0.1, max: 2.5, xp: 0.98 }, //ホッキョクグマを倒したときにもらえる報酬の変域

    villagerKillReward: { min: 2, max: 3, xp: 0.98 }, //村人を倒したときにもらえる報酬の変域
    wandering_traderKillReward: { min: 2, max: 3, xp: 0.98 }, //行商人を倒したときにもらえる報酬の変域
    trader_llamaKillReward: { min: 2, max: 3, xp: 0.98 }, //行商人のラマを倒したときにもらえる報酬の変域

    iron_golemKillReward: { min: 1, max: 1.5, xp: 1.2 }, //アイアンゴーレムを倒したときにもらえる報酬の変域
    snow_golemKillReward: { min: 0.2, max: 1.3, xp: 0.98 }, //スノーゴーレムを倒したときにもらえる報酬の変域

    elder_guardianKillReward: { min: 20, max: 60, xp: 5 }, //エルダーガーディアンを倒したときにもらえる報酬の変域
    wardenKillReward: { min: 10, max: 30, xp: 15 }, //ウォーデンを倒したときにもらえる報酬の変域
    witherKillReward: { min: 20, max: 60, xp: 20 }, //ウィザーを倒したときにもらえる報酬の変域
    ender_dragonKillReward: { min: 30, max: 70, xp: 100 }, //エンダードラゴンを倒したときにもらえる報酬の変域

    boatKillReward: { min: 0, max: 0, xp: 0 }, //ボートをこわしたときにもらえる報酬の変域
    chest_boatKillReward: { min: 0, max: 0, xp: 0 }, //チェスト付きボートをこわしたときにもらえる報酬の変域
    chest_minecartKillReward: { min: 0, max: 0, xp: 0 }, //チェスト付きトロッコをこわしたときにもらえる報酬の変域
    minecartKillReward: { min: 0, max: 0, xp: 0 }, //トロッコをこわしたときにもらえる報酬の変域
    command_block_minecartKillReward: { min: 0, max: 0, xp: 0 }, //コマンドブロック付きトロッコをこわしたときにもらえる報酬の変域
    hopper_minecartKillReward: { min: 0, max: 0, xp: 0 }, //ホッパー付きトロッコをこわしたときにもらえる報酬の変域
    tnt_minecartKillReward: { min: 0, max: 0, xp: 0 }, //TNT付きトロッコをこわしたときにもらえる報酬の変域
    armor_standKillReward: { min: 0, max: 0, xp: 0 }, //防具立てをこわしたときにもらえる報酬の変域

    otherMobkillReward: { min: 0, max: 0, xp: 0 }, //その他のエンティティを倒したときにもらえる報酬の変域
};
