export const Config = {
    // サーバーのエンドポイント
    SERVER_URL: "http://192.168.100.51:4400",

    // APIキー (server.jsの.envと同じ値を設定)
    API_KEY: "7f7ea861d7e5a96a01b5a914204e068fca7bebaf50ec568f705495aabce97e32",

    // ログ設定
    DEBUG_MODE: true,
    LOG_TO_CHAT: true,

    // MakeCountry連携設定
    STANDALONE_MODE: false,

    // 自動再開設定
    AUTO_RESUME: true,

    // レンダリング用の一時的なTickingArea名
    RENDER_AREA_TAG: "map_render_area",

    // 1回のHTTPリクエストで送信するチャンク数
    SEND_BATCH_SIZE: 8,

    // チャンク読み込み待機の最大時間(Tick)
    CHUNK_LOAD_TIMEOUT: 300,

    // プレイヤー位置の同期頻度(Tick)
    PLAYER_SYNC_INTERVAL: 100,

    // 国データの同期頻度 (Tick)
    COUNTRY_SYNC_INTERVAL: 12000,

    // コマンド権限タグ
    ADMIN_TAG: "map_admin",

    // チャンク読み込み関連
    CHUNK_LOAD_TIMEOUT_SECONDS: 30,
    MAX_LOAD_RETRIES: 2,
    CHUNK_LOAD_CHECK_INTERVAL_TICKS: 20,
    
    // チャンク読み込みがスタックした際、TickingAreaを再設定するリトライ回数の間隔
    FORCE_RELOAD_INTERVAL_RETRIES: 25,
};

// --- 以下、ブロック判定用セット定義 ---

export const IgnoredBlocks = new Set([
    "minecraft:air", "minecraft:void_air", "minecraft:cave_air", "minecraft:light_block", 
    "minecraft:barrier", "minecraft:structure_void"
]);

export const IgnoreFloatingBlocks = new Set([
    "minecraft:glass", "minecraft:glass_pane", "minecraft:stained_glass", "minecraft:stained_glass_pane", 
    "minecraft:tinted_glass",
    "minecraft:scaffolding"
]);

export const TransparentDecorationBlocks = new Set([
    // 草・シダ・枯れ木
    "minecraft:grass", "minecraft:short_grass", "minecraft:tall_grass", "minecraft:fern", "minecraft:large_fern", "minecraft:deadbush",
    "minecraft:seagrass", "minecraft:tall_seagrass", // 海草（水面下だが一応）
    
    // 花 (新旧)
    "minecraft:dandelion", "minecraft:poppy", "minecraft:blue_orchid", "minecraft:allium", 
    "minecraft:azure_bluet", "minecraft:red_tulip", "minecraft:orange_tulip", "minecraft:white_tulip", 
    "minecraft:pink_tulip", "minecraft:oxeye_daisy", "minecraft:cornflower", "minecraft:lily_of_the_valley", 
    "minecraft:wither_rose", "minecraft:sunflower", "minecraft:lilac", "minecraft:rose_bush", "minecraft:peony",
    "minecraft:torchflower", "minecraft:pitcher_plant", "minecraft:pink_petals",
    
    // キノコ・菌類・ネザー植物
    "minecraft:brown_mushroom", "minecraft:red_mushroom", "minecraft:crimson_fungus", "minecraft:warped_fungus",
    "minecraft:crimson_roots", "minecraft:warped_roots", "minecraft:nether_sprouts",
    "minecraft:twisting_vines", "minecraft:weeping_vines", "minecraft:cave_vines", "minecraft:cave_vines_body", "minecraft:cave_vines_head",
    "minecraft:glow_lichen", "minecraft:sculk_vein", "minecraft:hanging_roots", "minecraft:spore_blossom",
    
    // 作物・苗木
    "minecraft:wheat", "minecraft:potatoes", "minecraft:carrots", "minecraft:beetroot", 
    "minecraft:melon_stem", "minecraft:pumpkin_stem", "minecraft:bamboo_sapling", 
    "minecraft:sapling", "minecraft:oak_sapling", "minecraft:spruce_sapling", "minecraft:birch_sapling", 
    "minecraft:jungle_sapling", "minecraft:acacia_sapling", "minecraft:dark_oak_sapling", 
    "minecraft:mangrove_propagule", "minecraft:cherry_sapling", "minecraft:azalea", "minecraft:flowering_azalea",
    "minecraft:torchflower_crop", "minecraft:pitcher_crop", "minecraft:sweet_berry_bush",
    "minecraft:big_dripleaf", "minecraft:small_dripleaf", "minecraft:big_dripleaf_stem",
    
    // レール・レッドストーン・薄い装置
    "minecraft:redstone_wire", "minecraft:tripwire", "minecraft:tripwire_hook",
    "minecraft:rail", "minecraft:activator_rail", "minecraft:detector_rail", "minecraft:powered_rail",
    "minecraft:lever", "minecraft:stone_button", "minecraft:wooden_button", "minecraft:polished_blackstone_button",
    "minecraft:light_weighted_pressure_plate", "minecraft:heavy_weighted_pressure_plate", "minecraft:stone_pressure_plate", "minecraft:wooden_pressure_plate",
    "minecraft:repeater", "minecraft:comparator", "minecraft:daylight_detector",
    "minecraft:amethyst_cluster", "minecraft:large_amethyst_bud", "minecraft:medium_amethyst_bud", "minecraft:small_amethyst_bud",
    "minecraft:frogspawn", "minecraft:turtle_egg", "minecraft:sniffer_egg",
    "minecraft:flower_pot", "minecraft:skull", // 植木鉢や頭なども地面ではない
    "minecraft:end_rod", "minecraft:chain", "minecraft:lantern", "minecraft:soul_lantern"
]);

export const AquaticBlocks = new Set([
    "minecraft:kelp", "minecraft:kelp_plant", "minecraft:seagrass", "minecraft:tall_seagrass", 
    "minecraft:sea_pickle", "minecraft:lily_pad" // スイレンも水扱い
]);

export const SurfaceFeatureBlocks = new Set([
    "minecraft:water", "minecraft:flowing_water", "minecraft:lava", "minecraft:flowing_lava",
    "minecraft:ice", "minecraft:packed_ice", "minecraft:blue_ice", "minecraft:frosted_ice",
    "minecraft:oak_leaves", "minecraft:spruce_leaves", "minecraft:birch_leaves", "minecraft:jungle_leaves",
    "minecraft:acacia_leaves", "minecraft:dark_oak_leaves", "minecraft:mangrove_leaves", "minecraft:cherry_leaves",
    "minecraft:azalea_leaves", "minecraft:flowering_azalea_leaves" , "minecraft:snow_layer",
    "minecraft:leaves", "minecraft:leaves2"
]);


export default Config;
