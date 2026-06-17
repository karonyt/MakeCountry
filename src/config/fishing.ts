type Season = "spring" | "summer" | "autumn" | "winter";
type Period = "morning" | "afternoon" | "evening" | "night";

type SizeRange = {
    min: number;
    max: number;
};

type FishDefinition = {
    typeId: string;
    name: string;
    size: SizeRange;
};

type FishEntry = FishDefinition & {
    weight: number;
};

type FishingTable = Record<Season, Record<Period, FishEntry[]>>;

type Availability = {
    key: FishKey;
    weight: number;
    seasons?: readonly Season[];
    periods?: readonly Period[];
    seasonWeights?: Partial<Record<Season, number>>;
    periodWeights?: Partial<Record<Period, number>>;
    sizeBias?: number;
};

const seasons = ["spring", "summer", "autumn", "winter"] as const;
const periods = ["morning", "afternoon", "evening", "night"] as const;

const allSeasons = seasons;
const allPeriods = periods;
const warmSeasons = ["spring", "summer", "autumn"] as const;
const coldSeasons = ["winter", "spring", "autumn"] as const;
const springSummer = ["spring", "summer"] as const;
const springSummerAutumn = ["spring", "summer", "autumn"] as const;
const summerAutumn = ["summer", "autumn"] as const;
const autumnWinter = ["autumn", "winter"] as const;
const winterSpring = ["winter", "spring"] as const;

const daylight = ["morning", "afternoon", "evening"] as const;
const lowLight = ["morning", "evening", "night"] as const;
const eveningNight = ["evening", "night"] as const;
const nightOnly = ["night"] as const;

const fishCatalog = {
    cod: {
        typeId: "minecraft:cod",
        name: "item.minecraft:cod.name",
        size: { min: 30, max: 150 },
    },
    salmon: {
        typeId: "minecraft:salmon",
        name: "item.minecraft:salmon.name",
        size: { min: 40, max: 120 },
    },
    tropical_fish: {
        typeId: "minecraft:tropical_fish",
        name: "item.minecraft:tropical_fish.name",
        size: { min: 3, max: 12 },
    },
    pufferfish: {
        typeId: "minecraft:pufferfish",
        name: "item.minecraft:pufferfish.name",
        size: { min: 8, max: 35 },
    },
    black_bass: {
        typeId: "mc:black_bass",
        name: "item.mc:black_bass",
        size: { min: 20, max: 75 },
    },
    bluefin_tuna: {
        typeId: "mc:bluefin_tuna",
        name: "item.mc:bluefin_tuna",
        size: { min: 100, max: 300 },
    },
    bluegill: {
        typeId: "mc:bluegill",
        name: "item.mc:bluegill",
        size: { min: 8, max: 30 },
    },
    carp: {
        typeId: "mc:carp",
        name: "item.mc:carp",
        size: { min: 25, max: 100 },
    },
    catfish: {
        typeId: "mc:catfish",
        name: "item.mc:catfish",
        size: { min: 30, max: 150 },
    },
    charr: {
        typeId: "mc:charr",
        name: "item.mc:iwana",
        size: { min: 15, max: 60 },
    },
    clam: {
        typeId: "mc:clam",
        name: "item.mc:clam",
        size: { min: 2, max: 6 },
    },
    coelacanth: {
        typeId: "mc:coelacanth",
        name: "item.mc:siirakansu",
        size: { min: 120, max: 200 },
    },
    crab: {
        typeId: "mc:crab",
        name: "item.mc:crab",
        size: { min: 8, max: 25 },
    },
    crayfish: {
        typeId: "mc:crayfish",
        name: "item.mc:crayfish",
        size: { min: 5, max: 15 },
    },
    crucian_carp: {
        typeId: "mc:crucian_carp",
        name: "item.mc:crucian_carp",
        size: { min: 10, max: 40 },
    },
    eel: {
        typeId: "mc:eel",
        name: "item.mc:unagi",
        size: { min: 40, max: 120 },
    },
    flounder: {
        typeId: "mc:flounder",
        name: "item.mc:flounder",
        size: { min: 25, max: 90 },
    },
    herring: {
        typeId: "mc:herring",
        name: "item.mc:herring",
        size: { min: 15, max: 45 },
    },
    jellyfish: {
        typeId: "mc:jellyfish",
        name: "item.mc:jellyfish",
        size: { min: 5, max: 50 },
    },
    medaka: {
        typeId: "mc:medaka",
        name: "item.mc:medaka",
        size: { min: 2, max: 4 },
    },
    octopus: {
        typeId: "mc:octopus",
        name: "item.mc:octopus",
        size: { min: 30, max: 120 },
    },
    sea_cucumber: {
        typeId: "mc:sea_cucumber",
        name: "item.mc:sea_cucumber",
        size: { min: 10, max: 40 },
    },
    shrimp: {
        typeId: "mc:shrimp",
        name: "item.mc:shrimp",
        size: { min: 5, max: 25 },
    },
    squid: {
        typeId: "mc:squid",
        name: "item.mc:squid",
        size: { min: 15, max: 60 },
    },
    starfish: {
        typeId: "mc:starfish",
        name: "item.mc:starfish",
        size: { min: 5, max: 35 },
    },
    stingray: {
        typeId: "mc:stingray",
        name: "item.mc:stingray",
        size: { min: 40, max: 200 },
    },
    sturgeon: {
        typeId: "mc:sturgeon",
        name: "item.mc:sturgeon",
        size: { min: 80, max: 300 },
    },
    sweetfish: {
        typeId: "mc:sweetfish",
        name: "item.mc:sweetfish",
        size: { min: 10, max: 30 },
    },
    tai: {
        typeId: "mc:tai",
        name: "item.mc:tai",
        size: { min: 20, max: 90 },
    },
    tuna: {
        typeId: "mc:tuna",
        name: "item.mc:tuna",
        size: { min: 40, max: 200 },
    },
    yamame_trout: {
        typeId: "mc:yamame_trout",
        name: "item.mc:yamame_trout",
        size: { min: 10, max: 35 },
    },
    rainbow_trout: {
        typeId: "mc:rainbow_trout",
        name: "item.mc:rainbow_trout",
        size: { min: 25, max: 80 },
    },
    brown_trout: {
        typeId: "mc:brown_trout",
        name: "item.mc:brown_trout",
        size: { min: 25, max: 90 },
    },
    brook_trout: {
        typeId: "mc:brook_trout",
        name: "item.mc:brook_trout",
        size: { min: 15, max: 55 },
    },
    smallmouth_bass: {
        typeId: "mc:smallmouth_bass",
        name: "item.mc:smallmouth_bass",
        size: { min: 20, max: 70 },
    },
    pike: {
        typeId: "mc:pike",
        name: "item.mc:pike",
        size: { min: 40, max: 130 },
    },
    muskie: {
        typeId: "mc:muskie",
        name: "item.mc:muskie",
        size: { min: 70, max: 180 },
    },
    walleye: {
        typeId: "mc:walleye",
        name: "item.mc:walleye",
        size: { min: 30, max: 90 },
    },
    perch: {
        typeId: "mc:perch",
        name: "item.mc:perch",
        size: { min: 10, max: 45 },
    },
    roach: {
        typeId: "mc:roach",
        name: "item.mc:roach",
        size: { min: 10, max: 45 },
    },
    rudd: {
        typeId: "mc:rudd",
        name: "item.mc:rudd",
        size: { min: 12, max: 45 },
    },
    tench: {
        typeId: "mc:tench",
        name: "item.mc:tench",
        size: { min: 20, max: 70 },
    },
    dace: {
        typeId: "mc:dace",
        name: "item.mc:dace",
        size: { min: 8, max: 30 },
    },
    chub: {
        typeId: "mc:chub",
        name: "item.mc:chub",
        size: { min: 15, max: 60 },
    },
    barbel: {
        typeId: "mc:barbel",
        name: "item.mc:barbel",
        size: { min: 25, max: 100 },
    },
    loach: {
        typeId: "mc:loach",
        name: "item.mc:loach",
        size: { min: 5, max: 25 },
    },
    bitterling: {
        typeId: "mc:bitterling",
        name: "item.mc:bitterling",
        size: { min: 3, max: 10 },
    },
    freshwater_goby: {
        typeId: "mc:freshwater_goby",
        name: "item.mc:freshwater_goby",
        size: { min: 4, max: 18 },
    },
    snakehead: {
        typeId: "mc:snakehead",
        name: "item.mc:snakehead",
        size: { min: 30, max: 100 },
    },
    arapaima: {
        typeId: "mc:arapaima",
        name: "item.mc:arapaima",
        size: { min: 120, max: 300 },
    },
    piranha: {
        typeId: "mc:piranha",
        name: "item.mc:piranha",
        size: { min: 15, max: 45 },
    },
    arowana: {
        typeId: "mc:arowana",
        name: "item.mc:arowana",
        size: { min: 50, max: 120 },
    },
    tilapia: {
        typeId: "mc:tilapia",
        name: "item.mc:tilapia",
        size: { min: 15, max: 60 },
    },
    koi: {
        typeId: "mc:koi",
        name: "item.mc:koi",
        size: { min: 25, max: 90 },
    },
    goldfish: {
        typeId: "mc:goldfish",
        name: "item.mc:goldfish",
        size: { min: 5, max: 25 },
    },
    gar: {
        typeId: "mc:gar",
        name: "item.mc:gar",
        size: { min: 60, max: 200 },
    },
    pollock: {
        typeId: "mc:pollock",
        name: "item.mc:pollock",
        size: { min: 30, max: 90 },
    },
    haddock: {
        typeId: "mc:haddock",
        name: "item.mc:haddock",
        size: { min: 30, max: 100 },
    },
    halibut: {
        typeId: "mc:halibut",
        name: "item.mc:halibut",
        size: { min: 60, max: 250 },
    },
    mackerel: {
        typeId: "mc:mackerel",
        name: "item.mc:mackerel",
        size: { min: 20, max: 60 },
    },
    horse_mackerel: {
        typeId: "mc:horse_mackerel",
        name: "item.mc:horse_mackerel",
        size: { min: 12, max: 40 },
    },
    sardine: {
        typeId: "mc:sardine",
        name: "item.mc:sardine",
        size: { min: 10, max: 30 },
    },
    anchovy: {
        typeId: "mc:anchovy",
        name: "item.mc:anchovy",
        size: { min: 5, max: 18 },
    },
    saury: {
        typeId: "mc:saury",
        name: "item.mc:saury",
        size: { min: 20, max: 40 },
    },
    bonito: {
        typeId: "mc:bonito",
        name: "item.mc:bonito",
        size: { min: 30, max: 90 },
    },
    skipjack_tuna: {
        typeId: "mc:skipjack_tuna",
        name: "item.mc:skipjack_tuna",
        size: { min: 40, max: 110 },
    },
    albacore: {
        typeId: "mc:albacore",
        name: "item.mc:albacore",
        size: { min: 60, max: 140 },
    },
    yellowfin_tuna: {
        typeId: "mc:yellowfin_tuna",
        name: "item.mc:yellowfin_tuna",
        size: { min: 80, max: 240 },
    },
    bigeye_tuna: {
        typeId: "mc:bigeye_tuna",
        name: "item.mc:bigeye_tuna",
        size: { min: 80, max: 250 },
    },
    mahi_mahi: {
        typeId: "mc:mahi_mahi",
        name: "item.mc:mahi_mahi",
        size: { min: 50, max: 180 },
    },
    marlin: {
        typeId: "mc:marlin",
        name: "item.mc:marlin",
        size: { min: 150, max: 450 },
    },
    swordfish: {
        typeId: "mc:swordfish",
        name: "item.mc:swordfish",
        size: { min: 120, max: 400 },
    },
    sailfish: {
        typeId: "mc:sailfish",
        name: "item.mc:sailfish",
        size: { min: 120, max: 350 },
    },
    barracuda: {
        typeId: "mc:barracuda",
        name: "item.mc:barracuda",
        size: { min: 40, max: 180 },
    },
    grouper: {
        typeId: "mc:grouper",
        name: "item.mc:grouper",
        size: { min: 40, max: 180 },
    },
    snapper: {
        typeId: "mc:snapper",
        name: "item.mc:snapper",
        size: { min: 25, max: 100 },
    },
    amberjack: {
        typeId: "mc:amberjack",
        name: "item.mc:amberjack",
        size: { min: 50, max: 180 },
    },
    yellowtail: {
        typeId: "mc:yellowtail",
        name: "item.mc:yellowtail",
        size: { min: 40, max: 150 },
    },
    sea_bass: {
        typeId: "mc:sea_bass",
        name: "item.mc:sea_bass",
        size: { min: 30, max: 120 },
    },
    rockfish: {
        typeId: "mc:rockfish",
        name: "item.mc:rockfish",
        size: { min: 15, max: 60 },
    },
    scorpionfish: {
        typeId: "mc:scorpionfish",
        name: "item.mc:scorpionfish",
        size: { min: 15, max: 50 },
    },
    parrotfish: {
        typeId: "mc:parrotfish",
        name: "item.mc:parrotfish",
        size: { min: 20, max: 90 },
    },
    butterflyfish: {
        typeId: "mc:butterflyfish",
        name: "item.mc:butterflyfish",
        size: { min: 8, max: 25 },
    },
    angelfish: {
        typeId: "mc:angelfish",
        name: "item.mc:angelfish",
        size: { min: 8, max: 30 },
    },
    surgeonfish: {
        typeId: "mc:surgeonfish",
        name: "item.mc:surgeonfish",
        size: { min: 10, max: 40 },
    },
    lionfish: {
        typeId: "mc:lionfish",
        name: "item.mc:lionfish",
        size: { min: 15, max: 45 },
    },
    triggerfish: {
        typeId: "mc:triggerfish",
        name: "item.mc:triggerfish",
        size: { min: 15, max: 60 },
    },
    wrasse: {
        typeId: "mc:wrasse",
        name: "item.mc:wrasse",
        size: { min: 10, max: 45 },
    },
    damselfish: {
        typeId: "mc:damselfish",
        name: "item.mc:damselfish",
        size: { min: 5, max: 18 },
    },
    clownfish: {
        typeId: "mc:clownfish",
        name: "item.mc:clownfish",
        size: { min: 5, max: 15 },
    },
    moorish_idol: {
        typeId: "mc:moorish_idol",
        name: "item.mc:moorish_idol",
        size: { min: 10, max: 25 },
    },
    moray_eel: {
        typeId: "mc:moray_eel",
        name: "item.mc:moray_eel",
        size: { min: 40, max: 180 },
    },
    anglerfish: {
        typeId: "mc:anglerfish",
        name: "item.mc:anglerfish",
        size: { min: 30, max: 150 },
    },
    lanternfish: {
        typeId: "mc:lanternfish",
        name: "item.mc:lanternfish",
        size: { min: 5, max: 20 },
    },
    oarfish: {
        typeId: "mc:oarfish",
        name: "item.mc:oarfish",
        size: { min: 150, max: 800 },
    },
    giant_squid: {
        typeId: "mc:giant_squid",
        name: "item.mc:giant_squid",
        size: { min: 200, max: 1000 },
    },
    nautilus: {
        typeId: "mc:nautilus",
        name: "item.mc:nautilus",
        size: { min: 10, max: 25 },
    },
    hagfish: {
        typeId: "mc:hagfish",
        name: "item.mc:hagfish",
        size: { min: 20, max: 80 },
    },
    grenadier: {
        typeId: "mc:grenadier",
        name: "item.mc:grenadier",
        size: { min: 30, max: 120 },
    },
    alfonsino: {
        typeId: "mc:alfonsino",
        name: "item.mc:alfonsino",
        size: { min: 25, max: 70 },
    },
    opah: {
        typeId: "mc:opah",
        name: "item.mc:opah",
        size: { min: 50, max: 200 },
    },
    chimaera: {
        typeId: "mc:chimaera",
        name: "item.mc:chimaera",
        size: { min: 40, max: 150 },
    },
    oyster: {
        typeId: "mc:oyster",
        name: "item.mc:oyster",
        size: { min: 5, max: 18 },
    },
    scallop: {
        typeId: "mc:scallop",
        name: "item.mc:scallop",
        size: { min: 5, max: 20 },
    },
    mussel: {
        typeId: "mc:mussel",
        name: "item.mc:mussel",
        size: { min: 4, max: 12 },
    },
    abalone: {
        typeId: "mc:abalone",
        name: "item.mc:abalone",
        size: { min: 8, max: 25 },
    },
    sea_urchin: {
        typeId: "mc:sea_urchin",
        name: "item.mc:sea_urchin",
        size: { min: 4, max: 12 },
    },
    lobster: {
        typeId: "mc:lobster",
        name: "item.mc:lobster",
        size: { min: 20, max: 70 },
    },
    mantis_shrimp: {
        typeId: "mc:mantis_shrimp",
        name: "item.mc:mantis_shrimp",
        size: { min: 8, max: 25 },
    },
    horseshoe_crab: {
        typeId: "mc:horseshoe_crab",
        name: "item.mc:horseshoe_crab",
        size: { min: 20, max: 60 },
    },
    hermit_crab: {
        typeId: "mc:hermit_crab",
        name: "item.mc:hermit_crab",
        size: { min: 3, max: 12 },
    },
    hammerhead_shark: {
        typeId: "mc:hammerhead_shark",
        name: "item.mc:hammerhead_shark",
        size: { min: 200, max: 600 },
    },
    great_white_shark: {
        typeId: "mc:great_white_shark",
        name: "item.mc:great_white_shark",
        size: { min: 250, max: 700 },
    },
    whale_shark: {
        typeId: "mc:whale_shark",
        name: "item.mc:whale_shark",
        size: { min: 500, max: 1200 },
    },
    tiger_shark: {
        typeId: "mc:tiger_shark",
        name: "item.mc:tiger_shark",
        size: { min: 250, max: 600 },
    },
    sunfish: {
        typeId: "mc:sunfish",
        name: "item.mc:sunfish",
        size: { min: 100, max: 300 },
    },
    manta_ray: {
        typeId: "mc:manta_ray",
        name: "item.mc:manta_ray",
        size: { min: 200, max: 700 },
    },
    sawfish: {
        typeId: "mc:sawfish",
        name: "item.mc:sawfish",
        size: { min: 150, max: 600 },
    },
    milkfish: {
        typeId: "mc:milkfish",
        name: "item.mc:milkfish",
        size: { min: 30, max: 120 },
    },
    flying_fish: {
        typeId: "mc:flying_fish",
        name: "item.mc:flying_fish",
        size: { min: 15, max: 45 },
    },
    tarpon: {
        typeId: "mc:tarpon",
        name: "item.mc:tarpon",
        size: { min: 80, max: 250 },
    },
    mullet: {
        typeId: "mc:mullet",
        name: "item.mc:mullet",
        size: { min: 20, max: 80 },
    },
    needlefish: {
        typeId: "mc:needlefish",
        name: "item.mc:needlefish",
        size: { min: 20, max: 80 },
    },
    flathead: {
        typeId: "mc:flathead",
        name: "item.mc:flathead",
        size: { min: 25, max: 100 },
    },
    cutlassfish: {
        typeId: "mc:cutlassfish",
        name: "item.mc:cutlassfish",
        size: { min: 50, max: 200 },
    },
    tilefish: {
        typeId: "mc:tilefish",
        name: "item.mc:tilefish",
        size: { min: 25, max: 80 },
    },
    conger_eel: {
        typeId: "mc:conger_eel",
        name: "item.mc:conger_eel",
        size: { min: 40, max: 120 },
    },
    sand_lance: {
        typeId: "mc:sand_lance",
        name: "item.mc:sand_lance",
        size: { min: 5, max: 25 },
    },
    icefish: {
        typeId: "mc:icefish",
        name: "item.mc:icefish",
        size: { min: 5, max: 20 },
    },
    king_salmon: {
        typeId: "mc:king_salmon",
        name: "item.mc:king_salmon",
        size: { min: 70, max: 180 },
    },
    sockeye_salmon: {
        typeId: "mc:sockeye_salmon",
        name: "item.mc:sockeye_salmon",
        size: { min: 45, max: 90 },
    },
    arctic_char: {
        typeId: "mc:arctic_char",
        name: "item.mc:arctic_char",
        size: { min: 12, max: 90 },
    },
    atlantic_salmon: {
        typeId: "mc:atlantic_salmon",
        name: "item.mc:atlantic_salmon",
        size: { min: 12, max: 90 },
    },
    australasian_salmon: {
        typeId: "mc:australasian_salmon",
        name: "item.mc:australasian_salmon",
        size: { min: 12, max: 90 },
    },
    beachsalmon: {
        typeId: "mc:beachsalmon",
        name: "item.mc:beachsalmon",
        size: { min: 12, max: 90 },
    },
    beaked_salmon: {
        typeId: "mc:beaked_salmon",
        name: "item.mc:beaked_salmon",
        size: { min: 12, max: 90 },
    },
    bull_trout: {
        typeId: "mc:bull_trout",
        name: "item.mc:bull_trout",
        size: { min: 12, max: 90 },
    },
    char: {
        typeId: "mc:char",
        name: "item.mc:char",
        size: { min: 12, max: 90 },
    },
    cherry_salmon: {
        typeId: "mc:cherry_salmon",
        name: "item.mc:cherry_salmon",
        size: { min: 12, max: 90 },
    },
    chinook_salmon: {
        typeId: "mc:chinook_salmon",
        name: "item.mc:chinook_salmon",
        size: { min: 12, max: 90 },
    },
    chum_salmon: {
        typeId: "mc:chum_salmon",
        name: "item.mc:chum_salmon",
        size: { min: 12, max: 90 },
    },
    cisco: {
        typeId: "mc:cisco",
        name: "item.mc:cisco",
        size: { min: 12, max: 90 },
    },
    coho_salmon: {
        typeId: "mc:coho_salmon",
        name: "item.mc:coho_salmon",
        size: { min: 12, max: 90 },
    },
    cutthroat_trout: {
        typeId: "mc:cutthroat_trout",
        name: "item.mc:cutthroat_trout",
        size: { min: 12, max: 90 },
    },
    dolly_varden_trout: {
        typeId: "mc:dolly_varden_trout",
        name: "item.mc:dolly_varden_trout",
        size: { min: 12, max: 90 },
    },
    gila_trout: {
        typeId: "mc:gila_trout",
        name: "item.mc:gila_trout",
        size: { min: 12, max: 90 },
    },
    golden_trout: {
        typeId: "mc:golden_trout",
        name: "item.mc:golden_trout",
        size: { min: 12, max: 90 },
    },
    king_of_the_salmon: {
        typeId: "mc:king_of_the_salmon",
        name: "item.mc:king_of_the_salmon",
        size: { min: 12, max: 90 },
    },
    lake_trout: {
        typeId: "mc:lake_trout",
        name: "item.mc:lake_trout",
        size: { min: 12, max: 90 },
    },
    lake_whitefish: {
        typeId: "mc:lake_whitefish",
        name: "item.mc:lake_whitefish",
        size: { min: 12, max: 90 },
    },
    long_finned_char: {
        typeId: "mc:long_finned_char",
        name: "item.mc:long_finned_char",
        size: { min: 12, max: 90 },
    },
    masu_salmon: {
        typeId: "mc:masu_salmon",
        name: "item.mc:masu_salmon",
        size: { min: 12, max: 90 },
    },
    mexican_golden_trout: {
        typeId: "mc:mexican_golden_trout",
        name: "item.mc:mexican_golden_trout",
        size: { min: 12, max: 90 },
    },
    pacific_salmon: {
        typeId: "mc:pacific_salmon",
        name: "item.mc:pacific_salmon",
        size: { min: 12, max: 90 },
    },
    pacific_trout: {
        typeId: "mc:pacific_trout",
        name: "item.mc:pacific_trout",
        size: { min: 12, max: 90 },
    },
    pilchard: {
        typeId: "mc:pilchard",
        name: "item.mc:pilchard",
        size: { min: 12, max: 90 },
    },
    alewife: {
        typeId: "mc:alewife",
        name: "item.mc:alewife",
        size: { min: 5, max: 85 },
    },
    amur_pike: {
        typeId: "mc:amur_pike",
        name: "item.mc:amur_pike",
        size: { min: 5, max: 90 },
    },
    armored_gurnard: {
        typeId: "mc:armored_gurnard",
        name: "item.mc:armored_gurnard",
        size: { min: 5, max: 85 },
    },
    armorhead: {
        typeId: "mc:armorhead",
        name: "item.mc:armorhead",
        size: { min: 5, max: 85 },
    },
    asian_carp: {
        typeId: "mc:asian_carp",
        name: "item.mc:asian_carp",
        size: { min: 5, max: 90 },
    },
    asiatic_glassfish: {
        typeId: "mc:asiatic_glassfish",
        name: "item.mc:asiatic_glassfish",
        size: { min: 5, max: 85 },
    },
    australian_prowfish: {
        typeId: "mc:australian_prowfish",
        name: "item.mc:australian_prowfish",
        size: { min: 5, max: 85 },
    },
    banjo: {
        typeId: "mc:banjo",
        name: "item.mc:banjo",
        size: { min: 5, max: 85 },
    },
    bass: {
        typeId: "mc:bass",
        name: "item.mc:bass",
        size: { min: 5, max: 90 },
    },
    basslet: {
        typeId: "mc:basslet",
        name: "item.mc:basslet",
        size: { min: 5, max: 90 },
    },
    bicolor_goat_fish: {
        typeId: "mc:bicolor_goat_fish",
        name: "item.mc:bicolor_goat_fish",
        size: { min: 5, max: 85 },
    },
    bighead_carp: {
        typeId: "mc:bighead_carp",
        name: "item.mc:bighead_carp",
        size: { min: 5, max: 90 },
    },
    black_sea_bass: {
        typeId: "mc:black_sea_bass",
        name: "item.mc:black_sea_bass",
        size: { min: 5, max: 90 },
    },
    blue_eye_trevalla: {
        typeId: "mc:blue_eye_trevalla",
        name: "item.mc:blue_eye_trevalla",
        size: { min: 5, max: 85 },
    },
    bluntnose_minnow: {
        typeId: "mc:bluntnose_minnow",
        name: "item.mc:bluntnose_minnow",
        size: { min: 2, max: 18 },
    },
    bonytongue: {
        typeId: "mc:bonytongue",
        name: "item.mc:bonytongue",
        size: { min: 5, max: 85 },
    },
    bream: {
        typeId: "mc:bream",
        name: "item.mc:bream",
        size: { min: 5, max: 85 },
    },
    brook_stickleback: {
        typeId: "mc:brook_stickleback",
        name: "item.mc:brook_stickleback",
        size: { min: 2, max: 18 },
    },
    candiru: {
        typeId: "mc:candiru",
        name: "item.mc:candiru",
        size: { min: 5, max: 85 },
    },
    candlefish: {
        typeId: "mc:candlefish",
        name: "item.mc:candlefish",
        size: { min: 5, max: 85 },
    },
    carpsucker: {
        typeId: "mc:carpsucker",
        name: "item.mc:carpsucker",
        size: { min: 5, max: 90 },
    },
    central_mudminnow: {
        typeId: "mc:central_mudminnow",
        name: "item.mc:central_mudminnow",
        size: { min: 2, max: 18 },
    },
    chain_pickerel: {
        typeId: "mc:chain_pickerel",
        name: "item.mc:chain_pickerel",
        size: { min: 5, max: 90 },
    },
    channel_bass: {
        typeId: "mc:channel_bass",
        name: "item.mc:channel_bass",
        size: { min: 5, max: 90 },
    },
    chubsucker: {
        typeId: "mc:chubsucker",
        name: "item.mc:chubsucker",
        size: { min: 5, max: 85 },
    },
    climbing_perch: {
        typeId: "mc:climbing_perch",
        name: "item.mc:climbing_perch",
        size: { min: 5, max: 85 },
    },
    colorado_squawfish: {
        typeId: "mc:colorado_squawfish",
        name: "item.mc:colorado_squawfish",
        size: { min: 5, max: 85 },
    },
    common_carp: {
        typeId: "mc:common_carp",
        name: "item.mc:common_carp",
        size: { min: 5, max: 90 },
    },
    creek_chub: {
        typeId: "mc:creek_chub",
        name: "item.mc:creek_chub",
        size: { min: 5, max: 85 },
    },
    daggertooth_pike_conger: {
        typeId: "mc:daggertooth_pike_conger",
        name: "item.mc:daggertooth_pike_conger",
        size: { min: 5, max: 90 },
    },
    dealfish: {
        typeId: "mc:dealfish",
        name: "item.mc:dealfish",
        size: { min: 5, max: 85 },
    },
    death_valley_pupfish: {
        typeId: "mc:death_valley_pupfish",
        name: "item.mc:death_valley_pupfish",
        size: { min: 5, max: 85 },
    },
    desert_pupfish: {
        typeId: "mc:desert_pupfish",
        name: "item.mc:desert_pupfish",
        size: { min: 5, max: 85 },
    },
    devario: {
        typeId: "mc:devario",
        name: "item.mc:devario",
        size: { min: 5, max: 85 },
    },
    dorado: {
        typeId: "mc:dorado",
        name: "item.mc:dorado",
        size: { min: 5, max: 85 },
    },
    dory: {
        typeId: "mc:dory",
        name: "item.mc:dory",
        size: { min: 5, max: 85 },
    },
    drum: {
        typeId: "mc:drum",
        name: "item.mc:drum",
        size: { min: 5, max: 90 },
    },
    elephantnose_fish: {
        typeId: "mc:elephantnose_fish",
        name: "item.mc:elephantnose_fish",
        size: { min: 5, max: 85 },
    },
    emperor_bream: {
        typeId: "mc:emperor_bream",
        name: "item.mc:emperor_bream",
        size: { min: 5, max: 85 },
    },
    european_chub: {
        typeId: "mc:european_chub",
        name: "item.mc:european_chub",
        size: { min: 5, max: 85 },
    },
    european_eel: {
        typeId: "mc:european_eel",
        name: "item.mc:european_eel",
        size: { min: 5, max: 100 },
    },
    european_minnow: {
        typeId: "mc:european_minnow",
        name: "item.mc:european_minnow",
        size: { min: 2, max: 18 },
    },
    european_perch: {
        typeId: "mc:european_perch",
        name: "item.mc:european_perch",
        size: { min: 5, max: 85 },
    },
    featherback: {
        typeId: "mc:featherback",
        name: "item.mc:featherback",
        size: { min: 5, max: 85 },
    },
    fingerfish: {
        typeId: "mc:fingerfish",
        name: "item.mc:fingerfish",
        size: { min: 5, max: 85 },
    },
    banded_killifish: {
        typeId: "mc:banded_killifish",
        name: "item.mc:banded_killifish",
        size: { min: 2, max: 40 },
    },
    barb: {
        typeId: "mc:barb",
        name: "item.mc:barb",
        size: { min: 2, max: 40 },
    },
    barred_danio: {
        typeId: "mc:barred_danio",
        name: "item.mc:barred_danio",
        size: { min: 2, max: 18 },
    },
    bengal_danio: {
        typeId: "mc:bengal_danio",
        name: "item.mc:bengal_danio",
        size: { min: 2, max: 18 },
    },
    black_neon_tetra: {
        typeId: "mc:black_neon_tetra",
        name: "item.mc:black_neon_tetra",
        size: { min: 2, max: 18 },
    },
    black_tetra: {
        typeId: "mc:black_tetra",
        name: "item.mc:black_tetra",
        size: { min: 2, max: 18 },
    },
    blue_danio: {
        typeId: "mc:blue_danio",
        name: "item.mc:blue_danio",
        size: { min: 2, max: 18 },
    },
    blue_redstripe_danio: {
        typeId: "mc:blue_redstripe_danio",
        name: "item.mc:blue_redstripe_danio",
        size: { min: 2, max: 18 },
    },
    blue_gourami: {
        typeId: "mc:blue_gourami",
        name: "item.mc:blue_gourami",
        size: { min: 2, max: 40 },
    },
    burma_danio: {
        typeId: "mc:burma_danio",
        name: "item.mc:burma_danio",
        size: { min: 2, max: 18 },
    },
    cardinal_tetra: {
        typeId: "mc:cardinal_tetra",
        name: "item.mc:cardinal_tetra",
        size: { min: 2, max: 18 },
    },
    climbing_gourami: {
        typeId: "mc:climbing_gourami",
        name: "item.mc:climbing_gourami",
        size: { min: 2, max: 40 },
    },
    clown_loach: {
        typeId: "mc:clown_loach",
        name: "item.mc:clown_loach",
        size: { min: 2, max: 40 },
    },
    combtail_gourami: {
        typeId: "mc:combtail_gourami",
        name: "item.mc:combtail_gourami",
        size: { min: 2, max: 40 },
    },
    coolie_loach: {
        typeId: "mc:coolie_loach",
        name: "item.mc:coolie_loach",
        size: { min: 2, max: 40 },
    },
    danio: {
        typeId: "mc:danio",
        name: "item.mc:danio",
        size: { min: 2, max: 18 },
    },
    dogteeth_tetra: {
        typeId: "mc:dogteeth_tetra",
        name: "item.mc:dogteeth_tetra",
        size: { min: 2, max: 18 },
    },
    dojo_loach: {
        typeId: "mc:dojo_loach",
        name: "item.mc:dojo_loach",
        size: { min: 2, max: 40 },
    },
    dwarf_gourami: {
        typeId: "mc:dwarf_gourami",
        name: "item.mc:dwarf_gourami",
        size: { min: 2, max: 40 },
    },
    dwarf_loach: {
        typeId: "mc:dwarf_loach",
        name: "item.mc:dwarf_loach",
        size: { min: 2, max: 40 },
    },
    fire_bar_danio: {
        typeId: "mc:fire_bar_danio",
        name: "item.mc:fire_bar_danio",
        size: { min: 2, max: 18 },
    },
    giant_danio: {
        typeId: "mc:giant_danio",
        name: "item.mc:giant_danio",
        size: { min: 100, max: 700 },
    },
    giant_gourami: {
        typeId: "mc:giant_gourami",
        name: "item.mc:giant_gourami",
        size: { min: 100, max: 700 },
    },
    glowlight_danio: {
        typeId: "mc:glowlight_danio",
        name: "item.mc:glowlight_danio",
        size: { min: 2, max: 18 },
    },
    golden_loach: {
        typeId: "mc:golden_loach",
        name: "item.mc:golden_loach",
        size: { min: 2, max: 40 },
    },
    bluntnose_knifefish: {
        typeId: "mc:bluntnose_knifefish",
        name: "item.mc:bluntnose_knifefish",
        size: { min: 35, max: 220 },
    },
    cichlid: {
        typeId: "mc:cichlid",
        name: "item.mc:cichlid",
        size: { min: 4, max: 140 },
    },
    convict_cichlid: {
        typeId: "mc:convict_cichlid",
        name: "item.mc:convict_cichlid",
        size: { min: 4, max: 140 },
    },
    discus: {
        typeId: "mc:discus",
        name: "item.mc:discus",
        size: { min: 4, max: 140 },
    },
    electric_knifefish: {
        typeId: "mc:electric_knifefish",
        name: "item.mc:electric_knifefish",
        size: { min: 35, max: 220 },
    },
    ghost_knifefish: {
        typeId: "mc:ghost_knifefish",
        name: "item.mc:ghost_knifefish",
        size: { min: 35, max: 220 },
    },
    glass_knifefish: {
        typeId: "mc:glass_knifefish",
        name: "item.mc:glass_knifefish",
        size: { min: 35, max: 220 },
    },
    knifefish: {
        typeId: "mc:knifefish",
        name: "item.mc:knifefish",
        size: { min: 35, max: 220 },
    },
    mozambique_tilapia: {
        typeId: "mc:mozambique_tilapia",
        name: "item.mc:mozambique_tilapia",
        size: { min: 4, max: 140 },
    },
    naked_back_knifefish: {
        typeId: "mc:naked_back_knifefish",
        name: "item.mc:naked_back_knifefish",
        size: { min: 35, max: 220 },
    },
    old_world_knifefish: {
        typeId: "mc:old_world_knifefish",
        name: "item.mc:old_world_knifefish",
        size: { min: 35, max: 220 },
    },
    oscar: {
        typeId: "mc:oscar",
        name: "item.mc:oscar",
        size: { min: 4, max: 140 },
    },
    sand_knifefish: {
        typeId: "mc:sand_knifefish",
        name: "item.mc:sand_knifefish",
        size: { min: 35, max: 220 },
    },
    tigerfish: {
        typeId: "mc:tigerfish",
        name: "item.mc:tigerfish",
        size: { min: 4, max: 140 },
    },
    zebra_tilapia: {
        typeId: "mc:zebra_tilapia",
        name: "item.mc:zebra_tilapia",
        size: { min: 4, max: 140 },
    },
    airbreathing_catfish: {
        typeId: "mc:airbreathing_catfish",
        name: "item.mc:airbreathing_catfish",
        size: { min: 8, max: 160 },
    },
    airsac_catfish: {
        typeId: "mc:airsac_catfish",
        name: "item.mc:airsac_catfish",
        size: { min: 8, max: 160 },
    },
    angler_catfish: {
        typeId: "mc:angler_catfish",
        name: "item.mc:angler_catfish",
        size: { min: 8, max: 160 },
    },
    armorhead_catfish: {
        typeId: "mc:armorhead_catfish",
        name: "item.mc:armorhead_catfish",
        size: { min: 8, max: 160 },
    },
    armoured_catfish: {
        typeId: "mc:armoured_catfish",
        name: "item.mc:armoured_catfish",
        size: { min: 8, max: 160 },
    },
    banjo_catfish: {
        typeId: "mc:banjo_catfish",
        name: "item.mc:banjo_catfish",
        size: { min: 8, max: 160 },
    },
    barbel_less_catfish: {
        typeId: "mc:barbel_less_catfish",
        name: "item.mc:barbel_less_catfish",
        size: { min: 8, max: 160 },
    },
    blue_catfish: {
        typeId: "mc:blue_catfish",
        name: "item.mc:blue_catfish",
        size: { min: 8, max: 160 },
    },
    bristlenose_catfish: {
        typeId: "mc:bristlenose_catfish",
        name: "item.mc:bristlenose_catfish",
        size: { min: 8, max: 160 },
    },
    bronze_corydoras: {
        typeId: "mc:bronze_corydoras",
        name: "item.mc:bronze_corydoras",
        size: { min: 8, max: 160 },
    },
    bullhead: {
        typeId: "mc:bullhead",
        name: "item.mc:bullhead",
        size: { min: 8, max: 160 },
    },
    bullhead_shark: {
        typeId: "mc:bullhead_shark",
        name: "item.mc:bullhead_shark",
        size: { min: 45, max: 300 },
    },
    channel_catfish: {
        typeId: "mc:channel_catfish",
        name: "item.mc:channel_catfish",
        size: { min: 8, max: 160 },
    },
    climbing_catfish: {
        typeId: "mc:climbing_catfish",
        name: "item.mc:climbing_catfish",
        size: { min: 8, max: 160 },
    },
    driftwood_catfish: {
        typeId: "mc:driftwood_catfish",
        name: "item.mc:driftwood_catfish",
        size: { min: 8, max: 160 },
    },
    eeltail_catfish: {
        typeId: "mc:eeltail_catfish",
        name: "item.mc:eeltail_catfish",
        size: { min: 8, max: 160 },
    },
    electric_catfish: {
        typeId: "mc:electric_catfish",
        name: "item.mc:electric_catfish",
        size: { min: 8, max: 160 },
    },
    emerald_catfish: {
        typeId: "mc:emerald_catfish",
        name: "item.mc:emerald_catfish",
        size: { min: 8, max: 160 },
    },
    flathead_catfish: {
        typeId: "mc:flathead_catfish",
        name: "item.mc:flathead_catfish",
        size: { min: 8, max: 160 },
    },
    frogmouth_catfish: {
        typeId: "mc:frogmouth_catfish",
        name: "item.mc:frogmouth_catfish",
        size: { min: 8, max: 160 },
    },
    glass_catfish: {
        typeId: "mc:glass_catfish",
        name: "item.mc:glass_catfish",
        size: { min: 8, max: 160 },
    },
    hardhead_catfish: {
        typeId: "mc:hardhead_catfish",
        name: "item.mc:hardhead_catfish",
        size: { min: 8, max: 160 },
    },
    loach_catfish: {
        typeId: "mc:loach_catfish",
        name: "item.mc:loach_catfish",
        size: { min: 8, max: 160 },
    },
    longnose_whiptail_catfish: {
        typeId: "mc:longnose_whiptail_catfish",
        name: "item.mc:longnose_whiptail_catfish",
        size: { min: 8, max: 160 },
    },
    long_whiskered_catfish: {
        typeId: "mc:long_whiskered_catfish",
        name: "item.mc:long_whiskered_catfish",
        size: { min: 8, max: 160 },
    },
    loweye_catfish: {
        typeId: "mc:loweye_catfish",
        name: "item.mc:loweye_catfish",
        size: { min: 8, max: 160 },
    },
    madtom: {
        typeId: "mc:madtom",
        name: "item.mc:madtom",
        size: { min: 8, max: 160 },
    },
    mud_catfish: {
        typeId: "mc:mud_catfish",
        name: "item.mc:mud_catfish",
        size: { min: 8, max: 160 },
    },
    north_american_freshwater_catfish: {
        typeId: "mc:north_american_freshwater_catfish",
        name: "item.mc:north_american_freshwater_catfish",
        size: { min: 8, max: 160 },
    },
    parasitic_catfish: {
        typeId: "mc:parasitic_catfish",
        name: "item.mc:parasitic_catfish",
        size: { min: 8, max: 160 },
    },
    pencil_catfish: {
        typeId: "mc:pencil_catfish",
        name: "item.mc:pencil_catfish",
        size: { min: 8, max: 160 },
    },
    peppered_corydoras: {
        typeId: "mc:peppered_corydoras",
        name: "item.mc:peppered_corydoras",
        size: { min: 8, max: 160 },
    },
    pleco: {
        typeId: "mc:pleco",
        name: "item.mc:pleco",
        size: { min: 8, max: 160 },
    },
    sea_catfish: {
        typeId: "mc:sea_catfish",
        name: "item.mc:sea_catfish",
        size: { min: 8, max: 160 },
    },
    spiny_dwarf_catfish: {
        typeId: "mc:spiny_dwarf_catfish",
        name: "item.mc:spiny_dwarf_catfish",
        size: { min: 8, max: 160 },
    },
    african_lungfish: {
        typeId: "mc:african_lungfish",
        name: "item.mc:african_lungfish",
        size: { min: 35, max: 280 },
    },
    alligator_gar: {
        typeId: "mc:alligator_gar",
        name: "item.mc:alligator_gar",
        size: { min: 35, max: 280 },
    },
    australian_lungfish: {
        typeId: "mc:australian_lungfish",
        name: "item.mc:australian_lungfish",
        size: { min: 35, max: 280 },
    },
    beluga_sturgeon: {
        typeId: "mc:beluga_sturgeon",
        name: "item.mc:beluga_sturgeon",
        size: { min: 35, max: 280 },
    },
    bichir: {
        typeId: "mc:bichir",
        name: "item.mc:bichir",
        size: { min: 35, max: 280 },
    },
    bowfin: {
        typeId: "mc:bowfin",
        name: "item.mc:bowfin",
        size: { min: 40, max: 280 },
    },
    garden_eel: {
        typeId: "mc:garden_eel",
        name: "item.mc:garden_eel",
        size: { min: 10, max: 280 },
    },
    garibaldi: {
        typeId: "mc:garibaldi",
        name: "item.mc:garibaldi",
        size: { min: 35, max: 280 },
    },
    garpike: {
        typeId: "mc:garpike",
        name: "item.mc:garpike",
        size: { min: 35, max: 280 },
    },
    lungfish: {
        typeId: "mc:lungfish",
        name: "item.mc:lungfish",
        size: { min: 35, max: 280 },
    },
    paddlefish: {
        typeId: "mc:paddlefish",
        name: "item.mc:paddlefish",
        size: { min: 35, max: 280 },
    },
    ropefish: {
        typeId: "mc:ropefish",
        name: "item.mc:ropefish",
        size: { min: 10, max: 280 },
    },
    russian_sturgeon: {
        typeId: "mc:russian_sturgeon",
        name: "item.mc:russian_sturgeon",
        size: { min: 35, max: 280 },
    },
    shovelnose_sturgeon: {
        typeId: "mc:shovelnose_sturgeon",
        name: "item.mc:shovelnose_sturgeon",
        size: { min: 35, max: 280 },
    },
    south_american_lungfish: {
        typeId: "mc:south_american_lungfish",
        name: "item.mc:south_american_lungfish",
        size: { min: 35, max: 280 },
    },
    alligatorfish: {
        typeId: "mc:alligatorfish",
        name: "item.mc:alligatorfish",
        size: { min: 15, max: 130 },
    },
    baikal_oilfish: {
        typeId: "mc:baikal_oilfish",
        name: "item.mc:baikal_oilfish",
        size: { min: 15, max: 130 },
    },
    bigeye: {
        typeId: "mc:bigeye",
        name: "item.mc:bigeye",
        size: { min: 15, max: 130 },
    },
    bigeye_squaretail: {
        typeId: "mc:bigeye_squaretail",
        name: "item.mc:bigeye_squaretail",
        size: { min: 15, max: 130 },
    },
    black_swallower: {
        typeId: "mc:black_swallower",
        name: "item.mc:black_swallower",
        size: { min: 15, max: 130 },
    },
    bonefish: {
        typeId: "mc:bonefish",
        name: "item.mc:bonefish",
        size: { min: 15, max: 130 },
    },
    bonytail: {
        typeId: "mc:bonytail",
        name: "item.mc:bonytail",
        size: { min: 15, max: 130 },
    },
    catla: {
        typeId: "mc:catla",
        name: "item.mc:catla",
        size: { min: 15, max: 130 },
    },
    cavefish: {
        typeId: "mc:cavefish",
        name: "item.mc:cavefish",
        size: { min: 15, max: 130 },
    },
    cherubfish: {
        typeId: "mc:cherubfish",
        name: "item.mc:cherubfish",
        size: { min: 15, max: 130 },
    },
    cobbler: {
        typeId: "mc:cobbler",
        name: "item.mc:cobbler",
        size: { min: 15, max: 130 },
    },
    coffinfish: {
        typeId: "mc:coffinfish",
        name: "item.mc:coffinfish",
        size: { min: 15, max: 130 },
    },
    coley: {
        typeId: "mc:coley",
        name: "item.mc:coley",
        size: { min: 15, max: 130 },
    },
    crestfish: {
        typeId: "mc:crestfish",
        name: "item.mc:crestfish",
        size: { min: 15, max: 130 },
    },
    cusk_eel: {
        typeId: "mc:cusk_eel",
        name: "item.mc:cusk_eel",
        size: { min: 10, max: 130 },
    },
    deep_sea_eel: {
        typeId: "mc:deep_sea_eel",
        name: "item.mc:deep_sea_eel",
        size: { min: 10, max: 130 },
    },
    dolphin_fish: {
        typeId: "mc:dolphin_fish",
        name: "item.mc:dolphin_fish",
        size: { min: 15, max: 130 },
    },
    elasmobranch: {
        typeId: "mc:elasmobranch",
        name: "item.mc:elasmobranch",
        size: { min: 15, max: 130 },
    },
    electric_eel: {
        typeId: "mc:electric_eel",
        name: "item.mc:electric_eel",
        size: { min: 10, max: 130 },
    },
    escolar: {
        typeId: "mc:escolar",
        name: "item.mc:escolar",
        size: { min: 15, max: 130 },
    },
    flatfish: {
        typeId: "mc:flatfish",
        name: "item.mc:flatfish",
        size: { min: 15, max: 130 },
    },
    forehead_brooder: {
        typeId: "mc:forehead_brooder",
        name: "item.mc:forehead_brooder",
        size: { min: 15, max: 130 },
    },
    glassfish: {
        typeId: "mc:glassfish",
        name: "item.mc:glassfish",
        size: { min: 15, max: 130 },
    },
    gopher_rockfish: {
        typeId: "mc:gopher_rockfish",
        name: "item.mc:gopher_rockfish",
        size: { min: 15, max: 130 },
    },
    grunter: {
        typeId: "mc:grunter",
        name: "item.mc:grunter",
        size: { min: 15, max: 130 },
    },
    halosaur: {
        typeId: "mc:halosaur",
        name: "item.mc:halosaur",
        size: { min: 15, max: 130 },
    },
    horsefish: {
        typeId: "mc:horsefish",
        name: "item.mc:horsefish",
        size: { min: 15, max: 130 },
    },
    kingfish: {
        typeId: "mc:kingfish",
        name: "item.mc:kingfish",
        size: { min: 15, max: 130 },
    },
    lamprey: {
        typeId: "mc:lamprey",
        name: "item.mc:lamprey",
        size: { min: 15, max: 130 },
    },
    leaffish: {
        typeId: "mc:leaffish",
        name: "item.mc:leaffish",
        size: { min: 15, max: 130 },
    },
    ling: {
        typeId: "mc:ling",
        name: "item.mc:ling",
        size: { min: 15, max: 130 },
    },
    longnose_sucker: {
        typeId: "mc:longnose_sucker",
        name: "item.mc:longnose_sucker",
        size: { min: 15, max: 130 },
    },
    lost_river_sucker: {
        typeId: "mc:lost_river_sucker",
        name: "item.mc:lost_river_sucker",
        size: { min: 15, max: 130 },
    },
    manefish: {
        typeId: "mc:manefish",
        name: "item.mc:manefish",
        size: { min: 15, max: 130 },
    },
    modoc_sucker: {
        typeId: "mc:modoc_sucker",
        name: "item.mc:modoc_sucker",
        size: { min: 15, max: 130 },
    },
    mooneye: {
        typeId: "mc:mooneye",
        name: "item.mc:mooneye",
        size: { min: 15, max: 130 },
    },
    mummichog: {
        typeId: "mc:mummichog",
        name: "item.mc:mummichog",
        size: { min: 15, max: 130 },
    },
    muskellunge: {
        typeId: "mc:muskellunge",
        name: "item.mc:muskellunge",
        size: { min: 15, max: 130 },
    },
    new_world_rivuline: {
        typeId: "mc:new_world_rivuline",
        name: "item.mc:new_world_rivuline",
        size: { min: 15, max: 130 },
    },
    oilfish: {
        typeId: "mc:oilfish",
        name: "item.mc:oilfish",
        size: { min: 15, max: 130 },
    },
    pancake_batfish: {
        typeId: "mc:pancake_batfish",
        name: "item.mc:pancake_batfish",
        size: { min: 15, max: 130 },
    },
    paradise_fish: {
        typeId: "mc:paradise_fish",
        name: "item.mc:paradise_fish",
        size: { min: 15, max: 130 },
    },
    peamouth: {
        typeId: "mc:peamouth",
        name: "item.mc:peamouth",
        size: { min: 15, max: 130 },
    },
    pupfish: {
        typeId: "mc:pupfish",
        name: "item.mc:pupfish",
        size: { min: 15, max: 130 },
    },
    remora: {
        typeId: "mc:remora",
        name: "item.mc:remora",
        size: { min: 15, max: 130 },
    },
    roosterfish: {
        typeId: "mc:roosterfish",
        name: "item.mc:roosterfish",
        size: { min: 15, max: 130 },
    },
    ruffe: {
        typeId: "mc:ruffe",
        name: "item.mc:ruffe",
        size: { min: 15, max: 130 },
    },
    sand_stargazer: {
        typeId: "mc:sand_stargazer",
        name: "item.mc:sand_stargazer",
        size: { min: 15, max: 130 },
    },
    sea_dragon: {
        typeId: "mc:sea_dragon",
        name: "item.mc:sea_dragon",
        size: { min: 15, max: 130 },
    },
    sea_lamprey: {
        typeId: "mc:sea_lamprey",
        name: "item.mc:sea_lamprey",
        size: { min: 15, max: 130 },
    },
    sea_snail: {
        typeId: "mc:sea_snail",
        name: "item.mc:sea_snail",
        size: { min: 15, max: 130 },
    },
    searobin: {
        typeId: "mc:searobin",
        name: "item.mc:searobin",
        size: { min: 15, max: 130 },
    },
    sheatfish: {
        typeId: "mc:sheatfish",
        name: "item.mc:sheatfish",
        size: { min: 15, max: 130 },
    },
    shortnose_sucker: {
        typeId: "mc:shortnose_sucker",
        name: "item.mc:shortnose_sucker",
        size: { min: 15, max: 130 },
    },
    skilfish: {
        typeId: "mc:skilfish",
        name: "item.mc:skilfish",
        size: { min: 15, max: 130 },
    },
    algae_eater: {
        typeId: "mc:algae_eater",
        name: "item.mc:algae_eater",
        size: { min: 12, max: 160 },
    },
    american_sole: {
        typeId: "mc:american_sole",
        name: "item.mc:american_sole",
        size: { min: 15, max: 160 },
    },
    antarctic_cod: {
        typeId: "mc:antarctic_cod",
        name: "item.mc:antarctic_cod",
        size: { min: 12, max: 160 },
    },
    antarctic_icefish: {
        typeId: "mc:antarctic_icefish",
        name: "item.mc:antarctic_icefish",
        size: { min: 12, max: 160 },
    },
    antenna_codlet: {
        typeId: "mc:antenna_codlet",
        name: "item.mc:antenna_codlet",
        size: { min: 12, max: 160 },
    },
    atlantic_cod: {
        typeId: "mc:atlantic_cod",
        name: "item.mc:atlantic_cod",
        size: { min: 12, max: 160 },
    },
    atlantic_saury: {
        typeId: "mc:atlantic_saury",
        name: "item.mc:atlantic_saury",
        size: { min: 12, max: 160 },
    },
    black_scalyfin: {
        typeId: "mc:black_scalyfin",
        name: "item.mc:black_scalyfin",
        size: { min: 12, max: 160 },
    },
    blobfish: {
        typeId: "mc:blobfish",
        name: "item.mc:blobfish",
        size: { min: 12, max: 160 },
    },
    boafish: {
        typeId: "mc:boafish",
        name: "item.mc:boafish",
        size: { min: 12, max: 160 },
    },
    bocaccio: {
        typeId: "mc:bocaccio",
        name: "item.mc:bocaccio",
        size: { min: 12, max: 160 },
    },
    brook_lamprey: {
        typeId: "mc:brook_lamprey",
        name: "item.mc:brook_lamprey",
        size: { min: 12, max: 160 },
    },
    butterfish: {
        typeId: "mc:butterfish",
        name: "item.mc:butterfish",
        size: { min: 12, max: 160 },
    },
    california_halibut: {
        typeId: "mc:california_halibut",
        name: "item.mc:california_halibut",
        size: { min: 15, max: 160 },
    },
    celebes_rainbowfish: {
        typeId: "mc:celebes_rainbowfish",
        name: "item.mc:celebes_rainbowfish",
        size: { min: 12, max: 160 },
    },
    codlet: {
        typeId: "mc:codlet",
        name: "item.mc:codlet",
        size: { min: 12, max: 160 },
    },
    codling: {
        typeId: "mc:codling",
        name: "item.mc:codling",
        size: { min: 12, max: 160 },
    },
    combfish: {
        typeId: "mc:combfish",
        name: "item.mc:combfish",
        size: { min: 12, max: 160 },
    },
    cornetfish: {
        typeId: "mc:cornetfish",
        name: "item.mc:cornetfish",
        size: { min: 12, max: 160 },
    },
    crocodile_icefish: {
        typeId: "mc:crocodile_icefish",
        name: "item.mc:crocodile_icefish",
        size: { min: 12, max: 160 },
    },
    dhufish: {
        typeId: "mc:dhufish",
        name: "item.mc:dhufish",
        size: { min: 12, max: 160 },
    },
    driftfish: {
        typeId: "mc:driftfish",
        name: "item.mc:driftfish",
        size: { min: 12, max: 160 },
    },
    duckbill: {
        typeId: "mc:duckbill",
        name: "item.mc:duckbill",
        size: { min: 12, max: 160 },
    },
    eel_cod: {
        typeId: "mc:eel_cod",
        name: "item.mc:eel_cod",
        size: { min: 10, max: 160 },
    },
    eucla_cod: {
        typeId: "mc:eucla_cod",
        name: "item.mc:eucla_cod",
        size: { min: 12, max: 160 },
    },
    european_flounder: {
        typeId: "mc:european_flounder",
        name: "item.mc:european_flounder",
        size: { min: 15, max: 160 },
    },
    fathead_sculpin: {
        typeId: "mc:fathead_sculpin",
        name: "item.mc:fathead_sculpin",
        size: { min: 12, max: 160 },
    },
    fierasfer: {
        typeId: "mc:fierasfer",
        name: "item.mc:fierasfer",
        size: { min: 12, max: 160 },
    },
    flabby_whale_fish: {
        typeId: "mc:flabby_whale_fish",
        name: "item.mc:flabby_whale_fish",
        size: { min: 100, max: 700 },
    },
    flagfin: {
        typeId: "mc:flagfin",
        name: "item.mc:flagfin",
        size: { min: 12, max: 160 },
    },
    flashlight_fish: {
        typeId: "mc:flashlight_fish",
        name: "item.mc:flashlight_fish",
        size: { min: 12, max: 160 },
    },
    flier: {
        typeId: "mc:flier",
        name: "item.mc:flier",
        size: { min: 12, max: 160 },
    },
    gibberfish: {
        typeId: "mc:gibberfish",
        name: "item.mc:gibberfish",
        size: { min: 12, max: 160 },
    },
    goldeye: {
        typeId: "mc:goldeye",
        name: "item.mc:goldeye",
        size: { min: 12, max: 160 },
    },
    gombessa: {
        typeId: "mc:gombessa",
        name: "item.mc:gombessa",
        size: { min: 12, max: 160 },
    },
    armored_searobin: {
        typeId: "mc:armored_searobin",
        name: "item.mc:armored_searobin",
        size: { min: 4, max: 80 },
    },
    atlantic_herring: {
        typeId: "mc:atlantic_herring",
        name: "item.mc:atlantic_herring",
        size: { min: 4, max: 80 },
    },
    atlantic_silverside: {
        typeId: "mc:atlantic_silverside",
        name: "item.mc:atlantic_silverside",
        size: { min: 2, max: 18 },
    },
    australian_herring: {
        typeId: "mc:australian_herring",
        name: "item.mc:australian_herring",
        size: { min: 4, max: 80 },
    },
    beaked_sandfish: {
        typeId: "mc:beaked_sandfish",
        name: "item.mc:beaked_sandfish",
        size: { min: 4, max: 80 },
    },
    bigscale: {
        typeId: "mc:bigscale",
        name: "item.mc:bigscale",
        size: { min: 4, max: 80 },
    },
    blue_whiting: {
        typeId: "mc:blue_whiting",
        name: "item.mc:blue_whiting",
        size: { min: 4, max: 80 },
    },
    bombay_duck: {
        typeId: "mc:bombay_duck",
        name: "item.mc:bombay_duck",
        size: { min: 4, max: 80 },
    },
    buffalo_fish: {
        typeId: "mc:buffalo_fish",
        name: "item.mc:buffalo_fish",
        size: { min: 4, max: 80 },
    },
    california_flyingfish: {
        typeId: "mc:california_flyingfish",
        name: "item.mc:california_flyingfish",
        size: { min: 4, max: 80 },
    },
    canary_rockfish: {
        typeId: "mc:canary_rockfish",
        name: "item.mc:canary_rockfish",
        size: { min: 4, max: 80 },
    },
    capelin: {
        typeId: "mc:capelin",
        name: "item.mc:capelin",
        size: { min: 4, max: 80 },
    },
    common_tunny: {
        typeId: "mc:common_tunny",
        name: "item.mc:common_tunny",
        size: { min: 4, max: 80 },
    },
    crevice_kelpfish: {
        typeId: "mc:crevice_kelpfish",
        name: "item.mc:crevice_kelpfish",
        size: { min: 4, max: 80 },
    },
    croaker: {
        typeId: "mc:croaker",
        name: "item.mc:croaker",
        size: { min: 4, max: 80 },
    },
    cusk: {
        typeId: "mc:cusk",
        name: "item.mc:cusk",
        size: { min: 4, max: 80 },
    },
    cutthroat_eel: {
        typeId: "mc:cutthroat_eel",
        name: "item.mc:cutthroat_eel",
        size: { min: 4, max: 100 },
    },
    deep_sea_smelt: {
        typeId: "mc:deep_sea_smelt",
        name: "item.mc:deep_sea_smelt",
        size: { min: 4, max: 80 },
    },
    delta_smelt: {
        typeId: "mc:delta_smelt",
        name: "item.mc:delta_smelt",
        size: { min: 4, max: 80 },
    },
    denticle_herring: {
        typeId: "mc:denticle_herring",
        name: "item.mc:denticle_herring",
        size: { min: 4, max: 80 },
    },
    dorab_wolf_herring: {
        typeId: "mc:dorab_wolf_herring",
        name: "item.mc:dorab_wolf_herring",
        size: { min: 4, max: 80 },
    },
    elver: {
        typeId: "mc:elver",
        name: "item.mc:elver",
        size: { min: 4, max: 80 },
    },
    eulachon: {
        typeId: "mc:eulachon",
        name: "item.mc:eulachon",
        size: { min: 4, max: 80 },
    },
    false_brotula: {
        typeId: "mc:false_brotula",
        name: "item.mc:false_brotula",
        size: { min: 4, max: 80 },
    },
    false_trevally: {
        typeId: "mc:false_trevally",
        name: "item.mc:false_trevally",
        size: { min: 50, max: 260 },
    },
    flying_gurnard: {
        typeId: "mc:flying_gurnard",
        name: "item.mc:flying_gurnard",
        size: { min: 4, max: 80 },
    },
    fusilier_fish: {
        typeId: "mc:fusilier_fish",
        name: "item.mc:fusilier_fish",
        size: { min: 4, max: 80 },
    },
    galjoen_fish: {
        typeId: "mc:galjoen_fish",
        name: "item.mc:galjoen_fish",
        size: { min: 4, max: 80 },
    },
    ghost_flathead: {
        typeId: "mc:ghost_flathead",
        name: "item.mc:ghost_flathead",
        size: { min: 4, max: 80 },
    },
    ghost_pipefish: {
        typeId: "mc:ghost_pipefish",
        name: "item.mc:ghost_pipefish",
        size: { min: 4, max: 100 },
    },
    archerfish: {
        typeId: "mc:archerfish",
        name: "item.mc:archerfish",
        size: { min: 8, max: 120 },
    },
    barramundi: {
        typeId: "mc:barramundi",
        name: "item.mc:barramundi",
        size: { min: 8, max: 120 },
    },
    mudskipper: {
        typeId: "mc:mudskipper",
        name: "item.mc:mudskipper",
        size: { min: 8, max: 120 },
    },
    scat: {
        typeId: "mc:scat",
        name: "item.mc:scat",
        size: { min: 8, max: 120 },
    },
    snook: {
        typeId: "mc:snook",
        name: "item.mc:snook",
        size: { min: 8, max: 120 },
    },
    tripletail: {
        typeId: "mc:tripletail",
        name: "item.mc:tripletail",
        size: { min: 8, max: 120 },
    },
    aholehole: {
        typeId: "mc:aholehole",
        name: "item.mc:aholehole",
        size: { min: 4, max: 70 },
    },
    alaska_blackfish: {
        typeId: "mc:alaska_blackfish",
        name: "item.mc:alaska_blackfish",
        size: { min: 4, max: 70 },
    },
    anemonefish: {
        typeId: "mc:anemonefish",
        name: "item.mc:anemonefish",
        size: { min: 4, max: 70 },
    },
    arrowtooth_eel: {
        typeId: "mc:arrowtooth_eel",
        name: "item.mc:arrowtooth_eel",
        size: { min: 4, max: 100 },
    },
    ayu: {
        typeId: "mc:ayu",
        name: "item.mc:ayu",
        size: { min: 4, max: 70 },
    },
    ballan_wrasse: {
        typeId: "mc:ballan_wrasse",
        name: "item.mc:ballan_wrasse",
        size: { min: 4, max: 70 },
    },
    bandfish: {
        typeId: "mc:bandfish",
        name: "item.mc:bandfish",
        size: { min: 4, max: 70 },
    },
    bangus: {
        typeId: "mc:bangus",
        name: "item.mc:bangus",
        size: { min: 4, max: 70 },
    },
    barfish: {
        typeId: "mc:barfish",
        name: "item.mc:barfish",
        size: { min: 4, max: 70 },
    },
    barracudina: {
        typeId: "mc:barracudina",
        name: "item.mc:barracudina",
        size: { min: 4, max: 70 },
    },
    batfish: {
        typeId: "mc:batfish",
        name: "item.mc:batfish",
        size: { min: 4, max: 70 },
    },
    beardfish: {
        typeId: "mc:beardfish",
        name: "item.mc:beardfish",
        size: { min: 4, max: 70 },
    },
    betta: {
        typeId: "mc:betta",
        name: "item.mc:betta",
        size: { min: 4, max: 70 },
    },
    bigmouth_buffalo: {
        typeId: "mc:bigmouth_buffalo",
        name: "item.mc:bigmouth_buffalo",
        size: { min: 4, max: 70 },
    },
    black_angelfish: {
        typeId: "mc:black_angelfish",
        name: "item.mc:black_angelfish",
        size: { min: 4, max: 70 },
    },
    black_scabbardfish: {
        typeId: "mc:black_scabbardfish",
        name: "item.mc:black_scabbardfish",
        size: { min: 4, max: 70 },
    },
    black_triggerfish: {
        typeId: "mc:black_triggerfish",
        name: "item.mc:black_triggerfish",
        size: { min: 4, max: 70 },
    },
    blackchin: {
        typeId: "mc:blackchin",
        name: "item.mc:blackchin",
        size: { min: 4, max: 70 },
    },
    blackfish: {
        typeId: "mc:blackfish",
        name: "item.mc:blackfish",
        size: { min: 4, max: 70 },
    },
    bleak: {
        typeId: "mc:bleak",
        name: "item.mc:bleak",
        size: { min: 4, max: 70 },
    },
    blenny: {
        typeId: "mc:blenny",
        name: "item.mc:blenny",
        size: { min: 4, max: 70 },
    },
    blind_goby: {
        typeId: "mc:blind_goby",
        name: "item.mc:blind_goby",
        size: { min: 2, max: 18 },
    },
    blowfish: {
        typeId: "mc:blowfish",
        name: "item.mc:blowfish",
        size: { min: 4, max: 70 },
    },
    blue_triggerfish: {
        typeId: "mc:blue_triggerfish",
        name: "item.mc:blue_triggerfish",
        size: { min: 4, max: 70 },
    },
    bluefish: {
        typeId: "mc:bluefish",
        name: "item.mc:bluefish",
        size: { min: 4, max: 70 },
    },
    bobtail_snipe_eel: {
        typeId: "mc:bobtail_snipe_eel",
        name: "item.mc:bobtail_snipe_eel",
        size: { min: 4, max: 100 },
    },
    boga: {
        typeId: "mc:boga",
        name: "item.mc:boga",
        size: { min: 4, max: 70 },
    },
    bonnetmouth: {
        typeId: "mc:bonnetmouth",
        name: "item.mc:bonnetmouth",
        size: { min: 4, max: 70 },
    },
    boxfish: {
        typeId: "mc:boxfish",
        name: "item.mc:boxfish",
        size: { min: 4, max: 70 },
    },
    brill: {
        typeId: "mc:brill",
        name: "item.mc:brill",
        size: { min: 4, max: 70 },
    },
    brotula: {
        typeId: "mc:brotula",
        name: "item.mc:brotula",
        size: { min: 4, max: 70 },
    },
    bumblebee_goby: {
        typeId: "mc:bumblebee_goby",
        name: "item.mc:bumblebee_goby",
        size: { min: 2, max: 18 },
    },
    burbot: {
        typeId: "mc:burbot",
        name: "item.mc:burbot",
        size: { min: 4, max: 70 },
    },
    buri: {
        typeId: "mc:buri",
        name: "item.mc:buri",
        size: { min: 4, max: 70 },
    },
    burrowing_goby: {
        typeId: "mc:burrowing_goby",
        name: "item.mc:burrowing_goby",
        size: { min: 2, max: 18 },
    },
    cardinalfish: {
        typeId: "mc:cardinalfish",
        name: "item.mc:cardinalfish",
        size: { min: 4, max: 70 },
    },
    catalufa: {
        typeId: "mc:catalufa",
        name: "item.mc:catalufa",
        size: { min: 4, max: 70 },
    },
    clingfish: {
        typeId: "mc:clingfish",
        name: "item.mc:clingfish",
        size: { min: 4, max: 70 },
    },
    clown_triggerfish: {
        typeId: "mc:clown_triggerfish",
        name: "item.mc:clown_triggerfish",
        size: { min: 4, max: 70 },
    },
    cobia: {
        typeId: "mc:cobia",
        name: "item.mc:cobia",
        size: { min: 4, max: 70 },
    },
    combtooth_blenny: {
        typeId: "mc:combtooth_blenny",
        name: "item.mc:combtooth_blenny",
        size: { min: 4, max: 70 },
    },
    convict_blenny: {
        typeId: "mc:convict_blenny",
        name: "item.mc:convict_blenny",
        size: { min: 4, max: 70 },
    },
    cowfish: {
        typeId: "mc:cowfish",
        name: "item.mc:cowfish",
        size: { min: 4, max: 70 },
    },
    crappie: {
        typeId: "mc:crappie",
        name: "item.mc:crappie",
        size: { min: 4, max: 70 },
    },
    cuckoo_wrasse: {
        typeId: "mc:cuckoo_wrasse",
        name: "item.mc:cuckoo_wrasse",
        size: { min: 4, max: 70 },
    },
    dab: {
        typeId: "mc:dab",
        name: "item.mc:dab",
        size: { min: 15, max: 120 },
    },
    dartfish: {
        typeId: "mc:dartfish",
        name: "item.mc:dartfish",
        size: { min: 4, max: 70 },
    },
    deepwater_cardinalfish: {
        typeId: "mc:deepwater_cardinalfish",
        name: "item.mc:deepwater_cardinalfish",
        size: { min: 4, max: 70 },
    },
    deepwater_flathead: {
        typeId: "mc:deepwater_flathead",
        name: "item.mc:deepwater_flathead",
        size: { min: 4, max: 70 },
    },
    demoiselle: {
        typeId: "mc:demoiselle",
        name: "item.mc:demoiselle",
        size: { min: 4, max: 70 },
    },
    dottyback: {
        typeId: "mc:dottyback",
        name: "item.mc:dottyback",
        size: { min: 4, max: 70 },
    },
    dragon_goby: {
        typeId: "mc:dragon_goby",
        name: "item.mc:dragon_goby",
        size: { min: 2, max: 18 },
    },
    dragonet: {
        typeId: "mc:dragonet",
        name: "item.mc:dragonet",
        size: { min: 4, max: 70 },
    },
    duckbill_eel: {
        typeId: "mc:duckbill_eel",
        name: "item.mc:duckbill_eel",
        size: { min: 4, max: 100 },
    },
    dusky_grouper: {
        typeId: "mc:dusky_grouper",
        name: "item.mc:dusky_grouper",
        size: { min: 4, max: 90 },
    },
    earthworm_eel: {
        typeId: "mc:earthworm_eel",
        name: "item.mc:earthworm_eel",
        size: { min: 4, max: 100 },
    },
    eel_goby: {
        typeId: "mc:eel_goby",
        name: "item.mc:eel_goby",
        size: { min: 2, max: 100 },
    },
    eelpout: {
        typeId: "mc:eelpout",
        name: "item.mc:eelpout",
        size: { min: 4, max: 100 },
    },
    elephant_fish: {
        typeId: "mc:elephant_fish",
        name: "item.mc:elephant_fish",
        size: { min: 4, max: 70 },
    },
    ember_parrotfish: {
        typeId: "mc:ember_parrotfish",
        name: "item.mc:ember_parrotfish",
        size: { min: 4, max: 70 },
    },
    emperor: {
        typeId: "mc:emperor",
        name: "item.mc:emperor",
        size: { min: 4, max: 70 },
    },
    emperor_angelfish: {
        typeId: "mc:emperor_angelfish",
        name: "item.mc:emperor_angelfish",
        size: { min: 4, max: 70 },
    },
    filefish: {
        typeId: "mc:filefish",
        name: "item.mc:filefish",
        size: { min: 4, max: 70 },
    },
    fire_goby: {
        typeId: "mc:fire_goby",
        name: "item.mc:fire_goby",
        size: { min: 2, max: 18 },
    },
    firefish: {
        typeId: "mc:firefish",
        name: "item.mc:firefish",
        size: { min: 4, max: 70 },
    },
    atka_mackerel: {
        typeId: "mc:atka_mackerel",
        name: "item.mc:atka_mackerel",
        size: { min: 35, max: 260 },
    },
    atlantic_bonito: {
        typeId: "mc:atlantic_bonito",
        name: "item.mc:atlantic_bonito",
        size: { min: 35, max: 260 },
    },
    bigscale_pomfret: {
        typeId: "mc:bigscale_pomfret",
        name: "item.mc:bigscale_pomfret",
        size: { min: 35, max: 260 },
    },
    billfish: {
        typeId: "mc:billfish",
        name: "item.mc:billfish",
        size: { min: 35, max: 260 },
    },
    black_mackerel: {
        typeId: "mc:black_mackerel",
        name: "item.mc:black_mackerel",
        size: { min: 35, max: 260 },
    },
    blackfin_tuna: {
        typeId: "mc:blackfin_tuna",
        name: "item.mc:blackfin_tuna",
        size: { min: 50, max: 260 },
    },
    frigate_mackerel: {
        typeId: "mc:frigate_mackerel",
        name: "item.mc:frigate_mackerel",
        size: { min: 35, max: 260 },
    },
    jack: {
        typeId: "mc:jack",
        name: "item.mc:jack",
        size: { min: 35, max: 260 },
    },
    jack_dempsey: {
        typeId: "mc:jack_dempsey",
        name: "item.mc:jack_dempsey",
        size: { min: 35, max: 260 },
    },
    jackfish: {
        typeId: "mc:jackfish",
        name: "item.mc:jackfish",
        size: { min: 35, max: 260 },
    },
    leatherjacket: {
        typeId: "mc:leatherjacket",
        name: "item.mc:leatherjacket",
        size: { min: 35, max: 260 },
    },
    pomfret: {
        typeId: "mc:pomfret",
        name: "item.mc:pomfret",
        size: { min: 35, max: 260 },
    },
    slimy_mackerel: {
        typeId: "mc:slimy_mackerel",
        name: "item.mc:slimy_mackerel",
        size: { min: 35, max: 260 },
    },
    snake_mackerel: {
        typeId: "mc:snake_mackerel",
        name: "item.mc:snake_mackerel",
        size: { min: 35, max: 260 },
    },
    spanish_mackerel: {
        typeId: "mc:spanish_mackerel",
        name: "item.mc:spanish_mackerel",
        size: { min: 35, max: 260 },
    },
    spearfish: {
        typeId: "mc:spearfish",
        name: "item.mc:spearfish",
        size: { min: 50, max: 260 },
    },
    wahoo: {
        typeId: "mc:wahoo",
        name: "item.mc:wahoo",
        size: { min: 50, max: 260 },
    },
    white_marlin: {
        typeId: "mc:white_marlin",
        name: "item.mc:white_marlin",
        size: { min: 50, max: 260 },
    },
    yellow_jack: {
        typeId: "mc:yellow_jack",
        name: "item.mc:yellow_jack",
        size: { min: 35, max: 260 },
    },
    yellowtail_amberjack: {
        typeId: "mc:yellowtail_amberjack",
        name: "item.mc:yellowtail_amberjack",
        size: { min: 50, max: 260 },
    },
    yellowtail_barracuda: {
        typeId: "mc:yellowtail_barracuda",
        name: "item.mc:yellowtail_barracuda",
        size: { min: 35, max: 260 },
    },
    yellowtail_horse_mackerel: {
        typeId: "mc:yellowtail_horse_mackerel",
        name: "item.mc:yellowtail_horse_mackerel",
        size: { min: 35, max: 260 },
    },
    atlantic_sharpnose_shark: {
        typeId: "mc:atlantic_sharpnose_shark",
        name: "item.mc:atlantic_sharpnose_shark",
        size: { min: 45, max: 420 },
    },
    australian_grayling: {
        typeId: "mc:australian_grayling",
        name: "item.mc:australian_grayling",
        size: { min: 45, max: 420 },
    },
    bala_shark: {
        typeId: "mc:bala_shark",
        name: "item.mc:bala_shark",
        size: { min: 45, max: 420 },
    },
    bamboo_shark: {
        typeId: "mc:bamboo_shark",
        name: "item.mc:bamboo_shark",
        size: { min: 45, max: 420 },
    },
    barbeled_houndshark: {
        typeId: "mc:barbeled_houndshark",
        name: "item.mc:barbeled_houndshark",
        size: { min: 45, max: 420 },
    },
    basking_shark: {
        typeId: "mc:basking_shark",
        name: "item.mc:basking_shark",
        size: { min: 45, max: 700 },
    },
    bat_ray: {
        typeId: "mc:bat_ray",
        name: "item.mc:bat_ray",
        size: { min: 45, max: 420 },
    },
    blacktip_reef_shark: {
        typeId: "mc:blacktip_reef_shark",
        name: "item.mc:blacktip_reef_shark",
        size: { min: 45, max: 420 },
    },
    blind_shark: {
        typeId: "mc:blind_shark",
        name: "item.mc:blind_shark",
        size: { min: 45, max: 420 },
    },
    blue_shark: {
        typeId: "mc:blue_shark",
        name: "item.mc:blue_shark",
        size: { min: 45, max: 420 },
    },
    bonnethead_shark: {
        typeId: "mc:bonnethead_shark",
        name: "item.mc:bonnethead_shark",
        size: { min: 45, max: 420 },
    },
    bramble_shark: {
        typeId: "mc:bramble_shark",
        name: "item.mc:bramble_shark",
        size: { min: 45, max: 420 },
    },
    broadband_dogfish: {
        typeId: "mc:broadband_dogfish",
        name: "item.mc:broadband_dogfish",
        size: { min: 45, max: 420 },
    },
    bull_shark: {
        typeId: "mc:bull_shark",
        name: "item.mc:bull_shark",
        size: { min: 45, max: 420 },
    },
    butterfly_ray: {
        typeId: "mc:butterfly_ray",
        name: "item.mc:butterfly_ray",
        size: { min: 45, max: 420 },
    },
    carpetshark: {
        typeId: "mc:carpetshark",
        name: "item.mc:carpetshark",
        size: { min: 45, max: 420 },
    },
    cat_shark: {
        typeId: "mc:cat_shark",
        name: "item.mc:cat_shark",
        size: { min: 45, max: 420 },
    },
    collared_carpetshark: {
        typeId: "mc:collared_carpetshark",
        name: "item.mc:collared_carpetshark",
        size: { min: 45, max: 420 },
    },
    collared_dogfish: {
        typeId: "mc:collared_dogfish",
        name: "item.mc:collared_dogfish",
        size: { min: 45, max: 420 },
    },
    cookiecutter_shark: {
        typeId: "mc:cookiecutter_shark",
        name: "item.mc:cookiecutter_shark",
        size: { min: 45, max: 420 },
    },
    cow_shark: {
        typeId: "mc:cow_shark",
        name: "item.mc:cow_shark",
        size: { min: 45, max: 420 },
    },
    cownose_ray: {
        typeId: "mc:cownose_ray",
        name: "item.mc:cownose_ray",
        size: { min: 45, max: 420 },
    },
    crocodile_shark: {
        typeId: "mc:crocodile_shark",
        name: "item.mc:crocodile_shark",
        size: { min: 45, max: 420 },
    },
    deepwater_stingray: {
        typeId: "mc:deepwater_stingray",
        name: "item.mc:deepwater_stingray",
        size: { min: 45, max: 420 },
    },
    devil_ray: {
        typeId: "mc:devil_ray",
        name: "item.mc:devil_ray",
        size: { min: 45, max: 420 },
    },
    dogfish: {
        typeId: "mc:dogfish",
        name: "item.mc:dogfish",
        size: { min: 45, max: 420 },
    },
    dogfish_shark: {
        typeId: "mc:dogfish_shark",
        name: "item.mc:dogfish_shark",
        size: { min: 45, max: 420 },
    },
    dusky_shark: {
        typeId: "mc:dusky_shark",
        name: "item.mc:dusky_shark",
        size: { min: 45, max: 420 },
    },
    eagle_ray: {
        typeId: "mc:eagle_ray",
        name: "item.mc:eagle_ray",
        size: { min: 45, max: 420 },
    },
    electric_ray: {
        typeId: "mc:electric_ray",
        name: "item.mc:electric_ray",
        size: { min: 45, max: 420 },
    },
    false_cat_shark: {
        typeId: "mc:false_cat_shark",
        name: "item.mc:false_cat_shark",
        size: { min: 45, max: 420 },
    },
    false_moray: {
        typeId: "mc:false_moray",
        name: "item.mc:false_moray",
        size: { min: 45, max: 420 },
    },
    finback_cat_shark: {
        typeId: "mc:finback_cat_shark",
        name: "item.mc:finback_cat_shark",
        size: { min: 45, max: 420 },
    },
    freshwater_shark: {
        typeId: "mc:freshwater_shark",
        name: "item.mc:freshwater_shark",
        size: { min: 45, max: 420 },
    },
    frilled_shark: {
        typeId: "mc:frilled_shark",
        name: "item.mc:frilled_shark",
        size: { min: 45, max: 420 },
    },
    ganges_shark: {
        typeId: "mc:ganges_shark",
        name: "item.mc:ganges_shark",
        size: { min: 45, max: 420 },
    },
    ghost_shark: {
        typeId: "mc:ghost_shark",
        name: "item.mc:ghost_shark",
        size: { min: 45, max: 420 },
    },
    goblin_shark: {
        typeId: "mc:goblin_shark",
        name: "item.mc:goblin_shark",
        size: { min: 45, max: 420 },
    },
    gray_mullet: {
        typeId: "mc:gray_mullet",
        name: "item.mc:gray_mullet",
        size: { min: 45, max: 420 },
    },
    gray_reef_shark: {
        typeId: "mc:gray_reef_shark",
        name: "item.mc:gray_reef_shark",
        size: { min: 45, max: 420 },
    },
    angler: {
        typeId: "mc:angler",
        name: "item.mc:angler",
        size: { min: 5, max: 220 },
    },
    barbeled_dragonfish: {
        typeId: "mc:barbeled_dragonfish",
        name: "item.mc:barbeled_dragonfish",
        size: { min: 5, max: 220 },
    },
    barreleye: {
        typeId: "mc:barreleye",
        name: "item.mc:barreleye",
        size: { min: 5, max: 220 },
    },
    black_dragonfish: {
        typeId: "mc:black_dragonfish",
        name: "item.mc:black_dragonfish",
        size: { min: 5, max: 220 },
    },
    boarfish: {
        typeId: "mc:boarfish",
        name: "item.mc:boarfish",
        size: { min: 5, max: 220 },
    },
    bristlemouth: {
        typeId: "mc:bristlemouth",
        name: "item.mc:bristlemouth",
        size: { min: 5, max: 220 },
    },
    dragonfish: {
        typeId: "mc:dragonfish",
        name: "item.mc:dragonfish",
        size: { min: 5, max: 220 },
    },
    fangtooth: {
        typeId: "mc:fangtooth",
        name: "item.mc:fangtooth",
        size: { min: 5, max: 220 },
    },
    freshwater_hatchetfish: {
        typeId: "mc:freshwater_hatchetfish",
        name: "item.mc:freshwater_hatchetfish",
        size: { min: 5, max: 220 },
    },
    gulper: {
        typeId: "mc:gulper",
        name: "item.mc:gulper",
        size: { min: 5, max: 220 },
    },
    gulper_eel: {
        typeId: "mc:gulper_eel",
        name: "item.mc:gulper_eel",
        size: { min: 5, max: 220 },
    },
    hatchetfish: {
        typeId: "mc:hatchetfish",
        name: "item.mc:hatchetfish",
        size: { min: 5, max: 220 },
    },
    longfin_dragonfish: {
        typeId: "mc:longfin_dragonfish",
        name: "item.mc:longfin_dragonfish",
        size: { min: 5, max: 220 },
    },
    loosejaw: {
        typeId: "mc:loosejaw",
        name: "item.mc:loosejaw",
        size: { min: 5, max: 220 },
    },
    marine_hatchetfish: {
        typeId: "mc:marine_hatchetfish",
        name: "item.mc:marine_hatchetfish",
        size: { min: 5, max: 220 },
    },
    pacific_viperfish: {
        typeId: "mc:pacific_viperfish",
        name: "item.mc:pacific_viperfish",
        size: { min: 5, max: 220 },
    },
    pelican_gulper: {
        typeId: "mc:pelican_gulper",
        name: "item.mc:pelican_gulper",
        size: { min: 5, max: 220 },
    },
    rattail: {
        typeId: "mc:rattail",
        name: "item.mc:rattail",
        size: { min: 5, max: 220 },
    },
    scaly_dragonfish: {
        typeId: "mc:scaly_dragonfish",
        name: "item.mc:scaly_dragonfish",
        size: { min: 5, max: 220 },
    },
    slickhead: {
        typeId: "mc:slickhead",
        name: "item.mc:slickhead",
        size: { min: 5, max: 220 },
    },
    viperfish: {
        typeId: "mc:viperfish",
        name: "item.mc:viperfish",
        size: { min: 5, max: 220 },
    },
    warty_angler: {
        typeId: "mc:warty_angler",
        name: "item.mc:warty_angler",
        size: { min: 5, max: 220 },
    },
    flagblenny: {
        typeId: "mc:flagblenny",
        name: "item.mc:flagblenny",
        size: { min: 4, max: 70 },
    },
    flagfish: {
        typeId: "mc:flagfish",
        name: "item.mc:flagfish",
        size: { min: 5, max: 85 },
    },
    flagtail: {
        typeId: "mc:flagtail",
        name: "item.mc:flagtail",
        size: { min: 4, max: 70 },
    },
    footballfish: {
        typeId: "mc:footballfish",
        name: "item.mc:footballfish",
        size: { min: 5, max: 85 },
    },
    four_eyed_fish: {
        typeId: "mc:four_eyed_fish",
        name: "item.mc:four_eyed_fish",
        size: { min: 4, max: 70 },
    },
    french_angelfish: {
        typeId: "mc:french_angelfish",
        name: "item.mc:french_angelfish",
        size: { min: 4, max: 70 },
    },
    freshwater_eel: {
        typeId: "mc:freshwater_eel",
        name: "item.mc:freshwater_eel",
        size: { min: 5, max: 100 },
    },
    frogfish: {
        typeId: "mc:frogfish",
        name: "item.mc:frogfish",
        size: { min: 5, max: 85 },
    },
    ghost_fish: {
        typeId: "mc:ghost_fish",
        name: "item.mc:ghost_fish",
        size: { min: 4, max: 70 },
    },
    ghoul: {
        typeId: "mc:ghoul",
        name: "item.mc:ghoul",
        size: { min: 4, max: 70 },
    },
    giant_sea_bass: {
        typeId: "mc:giant_sea_bass",
        name: "item.mc:giant_sea_bass",
        size: { min: 100, max: 700 },
    },
    gizzard_shad: {
        typeId: "mc:gizzard_shad",
        name: "item.mc:gizzard_shad",
        size: { min: 4, max: 80 },
    },
    goatfish: {
        typeId: "mc:goatfish",
        name: "item.mc:goatfish",
        size: { min: 4, max: 70 },
    },
    goby: {
        typeId: "mc:goby",
        name: "item.mc:goby",
        size: { min: 2, max: 18 },
    },
    golden_dojo: {
        typeId: "mc:golden_dojo",
        name: "item.mc:golden_dojo",
        size: { min: 4, max: 70 },
    },
    golden_shiner: {
        typeId: "mc:golden_shiner",
        name: "item.mc:golden_shiner",
        size: { min: 2, max: 18 },
    },
    goosefish: {
        typeId: "mc:goosefish",
        name: "item.mc:goosefish",
        size: { min: 5, max: 85 },
    },
    gourami: {
        typeId: "mc:gourami",
        name: "item.mc:gourami",
        size: { min: 2, max: 40 },
    },
    grass_carp: {
        typeId: "mc:grass_carp",
        name: "item.mc:grass_carp",
        size: { min: 5, max: 90 },
    },
    graveldiver: {
        typeId: "mc:graveldiver",
        name: "item.mc:graveldiver",
        size: { min: 12, max: 160 },
    },
    grayling: {
        typeId: "mc:grayling",
        name: "item.mc:grayling",
        size: { min: 45, max: 420 },
    },
    green_spotted_puffer: {
        typeId: "mc:green_spotted_puffer",
        name: "item.mc:green_spotted_puffer",
        size: { min: 4, max: 70 },
    },
    green_swordtail: {
        typeId: "mc:green_swordtail",
        name: "item.mc:green_swordtail",
        size: { min: 2, max: 40 },
    },
    greeneye: {
        typeId: "mc:greeneye",
        name: "item.mc:greeneye",
        size: { min: 5, max: 85 },
    },
    greenling: {
        typeId: "mc:greenling",
        name: "item.mc:greenling",
        size: { min: 12, max: 160 },
    },
    ground_shark: {
        typeId: "mc:ground_shark",
        name: "item.mc:ground_shark",
        size: { min: 45, max: 420 },
    },
    grunion: {
        typeId: "mc:grunion",
        name: "item.mc:grunion",
        size: { min: 4, max: 70 },
    },
    grunt: {
        typeId: "mc:grunt",
        name: "item.mc:grunt",
        size: { min: 4, max: 80 },
    },
    grunt_sculpin: {
        typeId: "mc:grunt_sculpin",
        name: "item.mc:grunt_sculpin",
        size: { min: 12, max: 160 },
    },
    gudgeon: {
        typeId: "mc:gudgeon",
        name: "item.mc:gudgeon",
        size: { min: 5, max: 85 },
    },
    guitarfish: {
        typeId: "mc:guitarfish",
        name: "item.mc:guitarfish",
        size: { min: 45, max: 420 },
    },
    gulf_menhaden: {
        typeId: "mc:gulf_menhaden",
        name: "item.mc:gulf_menhaden",
        size: { min: 5, max: 85 },
    },
    gunnel: {
        typeId: "mc:gunnel",
        name: "item.mc:gunnel",
        size: { min: 4, max: 80 },
    },
    guppy: {
        typeId: "mc:guppy",
        name: "item.mc:guppy",
        size: { min: 2, max: 40 },
    },
    gurnard: {
        typeId: "mc:gurnard",
        name: "item.mc:gurnard",
        size: { min: 12, max: 160 },
    },
    hairtail: {
        typeId: "mc:hairtail",
        name: "item.mc:hairtail",
        size: { min: 4, max: 70 },
    },
    hake: {
        typeId: "mc:hake",
        name: "item.mc:hake",
        size: { min: 12, max: 160 },
    },
    halfbeak: {
        typeId: "mc:halfbeak",
        name: "item.mc:halfbeak",
        size: { min: 4, max: 80 },
    },
    halfmoon: {
        typeId: "mc:halfmoon",
        name: "item.mc:halfmoon",
        size: { min: 4, max: 70 },
    },
    hamlet: {
        typeId: "mc:hamlet",
        name: "item.mc:hamlet",
        size: { min: 5, max: 85 },
    },
    hammerjaw: {
        typeId: "mc:hammerjaw",
        name: "item.mc:hammerjaw",
        size: { min: 5, max: 85 },
    },
    handfish: {
        typeId: "mc:handfish",
        name: "item.mc:handfish",
        size: { min: 4, max: 70 },
    },
    harelip_sucker: {
        typeId: "mc:harelip_sucker",
        name: "item.mc:harelip_sucker",
        size: { min: 12, max: 160 },
    },
    hawkfish: {
        typeId: "mc:hawkfish",
        name: "item.mc:hawkfish",
        size: { min: 4, max: 70 },
    },
    herring_smelt: {
        typeId: "mc:herring_smelt",
        name: "item.mc:herring_smelt",
        size: { min: 4, max: 80 },
    },
    hickory_shad: {
        typeId: "mc:hickory_shad",
        name: "item.mc:hickory_shad",
        size: { min: 4, max: 80 },
    },
    hillstream_loach: {
        typeId: "mc:hillstream_loach",
        name: "item.mc:hillstream_loach",
        size: { min: 2, max: 40 },
    },
    hog_sucker: {
        typeId: "mc:hog_sucker",
        name: "item.mc:hog_sucker",
        size: { min: 4, max: 70 },
    },
    hoki: {
        typeId: "mc:hoki",
        name: "item.mc:hoki",
        size: { min: 4, max: 80 },
    },
    horn_shark: {
        typeId: "mc:horn_shark",
        name: "item.mc:horn_shark",
        size: { min: 45, max: 420 },
    },
    houndshark: {
        typeId: "mc:houndshark",
        name: "item.mc:houndshark",
        size: { min: 45, max: 420 },
    },
    huchen: {
        typeId: "mc:huchen",
        name: "item.mc:huchen",
        size: { min: 4, max: 70 },
    },
    humuhumunukunukuapua_a: {
        typeId: "mc:humuhumunukunukuapua_a",
        name: "item.mc:humuhumunukunukuapua_a",
        size: { min: 12, max: 160 },
    },
    hussar: {
        typeId: "mc:hussar",
        name: "item.mc:hussar",
        size: { min: 4, max: 80 },
    },
    ide: {
        typeId: "mc:ide",
        name: "item.mc:ide",
        size: { min: 12, max: 160 },
    },
    ilish_hilsha: {
        typeId: "mc:ilish_hilsha",
        name: "item.mc:ilish_hilsha",
        size: { min: 4, max: 70 },
    },
    inanga: {
        typeId: "mc:inanga",
        name: "item.mc:inanga",
        size: { min: 5, max: 85 },
    },
    inconnu: {
        typeId: "mc:inconnu",
        name: "item.mc:inconnu",
        size: { min: 4, max: 80 },
    },
    japanese_eel: {
        typeId: "mc:japanese_eel",
        name: "item.mc:japanese_eel",
        size: { min: 4, max: 100 },
    },
    javelin: {
        typeId: "mc:javelin",
        name: "item.mc:javelin",
        size: { min: 4, max: 70 },
    },
    jawfish: {
        typeId: "mc:jawfish",
        name: "item.mc:jawfish",
        size: { min: 12, max: 160 },
    },
    jellynose_fish: {
        typeId: "mc:jellynose_fish",
        name: "item.mc:jellynose_fish",
        size: { min: 4, max: 70 },
    },
    jewel_tetra: {
        typeId: "mc:jewel_tetra",
        name: "item.mc:jewel_tetra",
        size: { min: 2, max: 18 },
    },
    jewelfish: {
        typeId: "mc:jewelfish",
        name: "item.mc:jewelfish",
        size: { min: 4, max: 70 },
    },
    john_dory: {
        typeId: "mc:john_dory",
        name: "item.mc:john_dory",
        size: { min: 20, max: 65 },
    },
} as const satisfies Record<string, FishDefinition>;

type FishKey = keyof typeof fishCatalog;

function availabilityFor(keys: readonly FishKey[], options: Omit<Availability, "key">): Availability[] {
    return keys.map(key => ({ key, ...options }));
}

const extraColdFreshwaterFish = [
    "arctic_char",
    "atlantic_salmon",
    "australasian_salmon",
    "beachsalmon",
    "beaked_salmon",
    "bull_trout",
    "char",
    "cherry_salmon",
    "chinook_salmon",
    "chum_salmon",
    "cisco",
    "coho_salmon",
    "cutthroat_trout",
    "dolly_varden_trout",
    "gila_trout",
    "golden_trout",
    "king_of_the_salmon",
    "lake_trout",
    "lake_whitefish",
    "long_finned_char",
    "masu_salmon",
    "mexican_golden_trout",
    "pacific_salmon",
    "pacific_trout",
    "pilchard"
] as const satisfies readonly FishKey[];

const extraTemperateFreshwaterFish = [
    "alewife",
    "amur_pike",
    "armored_gurnard",
    "armorhead",
    "asian_carp",
    "asiatic_glassfish",
    "australian_prowfish",
    "banjo",
    "bass",
    "basslet",
    "bicolor_goat_fish",
    "bighead_carp",
    "black_sea_bass",
    "blue_eye_trevalla",
    "bluntnose_minnow",
    "bonytongue",
    "bream",
    "brook_stickleback",
    "candiru",
    "candlefish",
    "carpsucker",
    "central_mudminnow",
    "chain_pickerel",
    "channel_bass",
    "chubsucker",
    "climbing_perch",
    "colorado_squawfish",
    "common_carp",
    "creek_chub",
    "daggertooth_pike_conger",
    "dealfish",
    "death_valley_pupfish",
    "desert_pupfish",
    "devario",
    "dorado",
    "dory",
    "drum",
    "elephantnose_fish",
    "emperor_bream",
    "european_chub",
    "european_eel",
    "european_minnow",
    "european_perch",
    "featherback",
    "fingerfish",
    "flagfish",
    "footballfish",
    "freshwater_eel",
    "frogfish",
    "giant_sea_bass",
    "golden_shiner",
    "goosefish",
    "grass_carp",
    "greeneye",
    "gudgeon",
    "gulf_menhaden",
    "hamlet",
    "hammerjaw",
    "inanga"
] as const satisfies readonly FishKey[];

const extraPondFish = [
    "banded_killifish",
    "barb",
    "barred_danio",
    "bengal_danio",
    "black_neon_tetra",
    "black_tetra",
    "blue_danio",
    "blue_redstripe_danio",
    "blue_gourami",
    "burma_danio",
    "cardinal_tetra",
    "climbing_gourami",
    "clown_loach",
    "combtail_gourami",
    "coolie_loach",
    "danio",
    "dogteeth_tetra",
    "dojo_loach",
    "dwarf_gourami",
    "dwarf_loach",
    "fire_bar_danio",
    "giant_danio",
    "giant_gourami",
    "glowlight_danio",
    "golden_loach",
    "gourami",
    "green_swordtail",
    "guppy",
    "hillstream_loach",
    "jewel_tetra"
] as const satisfies readonly FishKey[];

const extraSwampFish = [
] as const satisfies readonly FishKey[];

const extraTropicalRiverFish = [
    "bluntnose_knifefish",
    "cichlid",
    "convict_cichlid",
    "discus",
    "electric_knifefish",
    "ghost_knifefish",
    "glass_knifefish",
    "knifefish",
    "mozambique_tilapia",
    "naked_back_knifefish",
    "old_world_knifefish",
    "oscar",
    "sand_knifefish",
    "tigerfish",
    "zebra_tilapia"
] as const satisfies readonly FishKey[];

const extraCatfishFish = [
    "airbreathing_catfish",
    "airsac_catfish",
    "angler_catfish",
    "armorhead_catfish",
    "armoured_catfish",
    "banjo_catfish",
    "barbel_less_catfish",
    "blue_catfish",
    "bristlenose_catfish",
    "bronze_corydoras",
    "bullhead",
    "bullhead_shark",
    "channel_catfish",
    "climbing_catfish",
    "driftwood_catfish",
    "eeltail_catfish",
    "electric_catfish",
    "emerald_catfish",
    "flathead_catfish",
    "frogmouth_catfish",
    "glass_catfish",
    "hardhead_catfish",
    "loach_catfish",
    "longnose_whiptail_catfish",
    "long_whiskered_catfish",
    "loweye_catfish",
    "madtom",
    "mud_catfish",
    "north_american_freshwater_catfish",
    "parasitic_catfish",
    "pencil_catfish",
    "peppered_corydoras",
    "pleco",
    "sea_catfish",
    "spiny_dwarf_catfish"
] as const satisfies readonly FishKey[];

const extraAncientRiverFish = [
    "african_lungfish",
    "alligator_gar",
    "australian_lungfish",
    "beluga_sturgeon",
    "bichir",
    "bowfin",
    "garden_eel",
    "garibaldi",
    "garpike",
    "lungfish",
    "paddlefish",
    "ropefish",
    "russian_sturgeon",
    "shovelnose_sturgeon",
    "south_american_lungfish"
] as const satisfies readonly FishKey[];

const extraTemperateOceanFish = [
    "john_dory",
    "alligatorfish",
    "baikal_oilfish",
    "bigeye",
    "bigeye_squaretail",
    "black_swallower",
    "bonefish",
    "bonytail",
    "catla",
    "cavefish",
    "cherubfish",
    "cobbler",
    "coffinfish",
    "coley",
    "crestfish",
    "cusk_eel",
    "deep_sea_eel",
    "dolphin_fish",
    "elasmobranch",
    "electric_eel",
    "escolar",
    "flatfish",
    "forehead_brooder",
    "glassfish",
    "gopher_rockfish",
    "grunter",
    "halosaur",
    "horsefish",
    "kingfish",
    "lamprey",
    "leaffish",
    "ling",
    "longnose_sucker",
    "lost_river_sucker",
    "manefish",
    "modoc_sucker",
    "mooneye",
    "mummichog",
    "muskellunge",
    "new_world_rivuline",
    "oilfish",
    "pancake_batfish",
    "paradise_fish",
    "peamouth",
    "pupfish",
    "remora",
    "roosterfish",
    "ruffe",
    "sand_stargazer",
    "sea_dragon",
    "sea_lamprey",
    "sea_snail",
    "searobin",
    "sheatfish",
    "shortnose_sucker",
    "skilfish"
] as const satisfies readonly FishKey[];

const extraColdOceanFish = [
    "algae_eater",
    "american_sole",
    "antarctic_cod",
    "antarctic_icefish",
    "antenna_codlet",
    "atlantic_cod",
    "atlantic_saury",
    "black_scalyfin",
    "blobfish",
    "boafish",
    "bocaccio",
    "brook_lamprey",
    "butterfish",
    "california_halibut",
    "celebes_rainbowfish",
    "codlet",
    "codling",
    "combfish",
    "cornetfish",
    "crocodile_icefish",
    "dhufish",
    "driftfish",
    "duckbill",
    "eel_cod",
    "eucla_cod",
    "european_flounder",
    "fathead_sculpin",
    "fierasfer",
    "flabby_whale_fish",
    "flagfin",
    "flashlight_fish",
    "flier",
    "gibberfish",
    "goldeye",
    "gombessa",
    "graveldiver",
    "greenling",
    "grunt_sculpin",
    "gurnard",
    "hake",
    "harelip_sucker",
    "humuhumunukunukuapua_a",
    "ide",
    "jawfish"
] as const satisfies readonly FishKey[];

const extraBeachFish = [
    "armored_searobin",
    "atlantic_herring",
    "atlantic_silverside",
    "australian_herring",
    "beaked_sandfish",
    "bigscale",
    "blue_whiting",
    "bombay_duck",
    "buffalo_fish",
    "california_flyingfish",
    "canary_rockfish",
    "capelin",
    "common_tunny",
    "crevice_kelpfish",
    "croaker",
    "cusk",
    "cutthroat_eel",
    "deep_sea_smelt",
    "delta_smelt",
    "denticle_herring",
    "dorab_wolf_herring",
    "elver",
    "eulachon",
    "false_brotula",
    "false_trevally",
    "flying_gurnard",
    "fusilier_fish",
    "galjoen_fish",
    "ghost_flathead",
    "ghost_pipefish",
    "gizzard_shad",
    "grunt",
    "gunnel",
    "halfbeak",
    "herring_smelt",
    "hickory_shad",
    "hoki",
    "hussar",
    "inconnu",
    "japanese_eel",
] as const satisfies readonly FishKey[];

const extraMangroveFish = [
    "archerfish",
    "barramundi",
    "mudskipper",
    "scat",
    "snook",
    "tripletail"
] as const satisfies readonly FishKey[];

const extraReefFish = [
    "aholehole",
    "alaska_blackfish",
    "anemonefish",
    "arrowtooth_eel",
    "ayu",
    "ballan_wrasse",
    "bandfish",
    "bangus",
    "barfish",
    "barracudina",
    "batfish",
    "beardfish",
    "betta",
    "bigmouth_buffalo",
    "black_angelfish",
    "black_scabbardfish",
    "black_triggerfish",
    "blackchin",
    "blackfish",
    "bleak",
    "blenny",
    "blind_goby",
    "blowfish",
    "blue_triggerfish",
    "bluefish",
    "bobtail_snipe_eel",
    "boga",
    "bonnetmouth",
    "boxfish",
    "brill",
    "brotula",
    "bumblebee_goby",
    "burbot",
    "buri",
    "burrowing_goby",
    "cardinalfish",
    "catalufa",
    "clingfish",
    "clown_triggerfish",
    "cobia",
    "combtooth_blenny",
    "convict_blenny",
    "cowfish",
    "crappie",
    "cuckoo_wrasse",
    "dab",
    "dartfish",
    "deepwater_cardinalfish",
    "deepwater_flathead",
    "demoiselle",
    "dottyback",
    "dragon_goby",
    "dragonet",
    "duckbill_eel",
    "dusky_grouper",
    "earthworm_eel",
    "eel_goby",
    "eelpout",
    "elephant_fish",
    "ember_parrotfish",
    "emperor",
    "emperor_angelfish",
    "filefish",
    "fire_goby",
    "firefish",
    "flagblenny",
    "flagtail",
    "four_eyed_fish",
    "french_angelfish",
    "ghost_fish",
    "ghoul",
    "goatfish",
    "goby",
    "golden_dojo",
    "green_spotted_puffer",
    "grunion",
    "hairtail",
    "halfmoon",
    "handfish",
    "hawkfish",
    "hog_sucker",
    "huchen",
    "ilish_hilsha",
    "javelin",
    "jellynose_fish",
    "jewelfish"
] as const satisfies readonly FishKey[];

const extraPelagicFish = [
    "atka_mackerel",
    "atlantic_bonito",
    "bigscale_pomfret",
    "billfish",
    "black_mackerel",
    "blackfin_tuna",
    "frigate_mackerel",
    "jack",
    "jack_dempsey",
    "jackfish",
    "leatherjacket",
    "pomfret",
    "slimy_mackerel",
    "snake_mackerel",
    "spanish_mackerel",
    "spearfish",
    "wahoo",
    "white_marlin",
    "yellow_jack",
    "yellowtail_amberjack",
    "yellowtail_barracuda",
    "yellowtail_horse_mackerel"
] as const satisfies readonly FishKey[];

const extraSharkRayFish = [
    "atlantic_sharpnose_shark",
    "australian_grayling",
    "bala_shark",
    "bamboo_shark",
    "barbeled_houndshark",
    "basking_shark",
    "bat_ray",
    "blacktip_reef_shark",
    "blind_shark",
    "blue_shark",
    "bonnethead_shark",
    "bramble_shark",
    "broadband_dogfish",
    "bull_shark",
    "butterfly_ray",
    "carpetshark",
    "cat_shark",
    "collared_carpetshark",
    "collared_dogfish",
    "cookiecutter_shark",
    "cow_shark",
    "cownose_ray",
    "crocodile_shark",
    "deepwater_stingray",
    "devil_ray",
    "dogfish",
    "dogfish_shark",
    "dusky_shark",
    "eagle_ray",
    "electric_ray",
    "false_cat_shark",
    "false_moray",
    "finback_cat_shark",
    "freshwater_shark",
    "frilled_shark",
    "ganges_shark",
    "ghost_shark",
    "goblin_shark",
    "gray_mullet",
    "gray_reef_shark",
    "grayling",
    "ground_shark",
    "guitarfish",
    "horn_shark",
    "houndshark"
] as const satisfies readonly FishKey[];

const extraDeepOceanFish = [
    "angler",
    "barbeled_dragonfish",
    "barreleye",
    "black_dragonfish",
    "boarfish",
    "bristlemouth",
    "dragonfish",
    "fangtooth",
    "freshwater_hatchetfish",
    "gulper",
    "gulper_eel",
    "hatchetfish",
    "longfin_dragonfish",
    "loosejaw",
    "marine_hatchetfish",
    "pacific_viperfish",
    "pelican_gulper",
    "rattail",
    "scaly_dragonfish",
    "slickhead",
    "viperfish",
    "warty_angler"
] as const satisfies readonly FishKey[];

const additionalFreshwaterRiverExpansion: Availability[] = [
    ...availabilityFor(extraColdFreshwaterFish, { weight: 8, seasons: coldSeasons, periods: lowLight, seasonWeights: { spring: 1.25, autumn: 1.2 }, sizeBias: 0.03 }),
    ...availabilityFor(extraTemperateFreshwaterFish, { weight: 9, seasons: springSummerAutumn, periods: daylight, seasonWeights: { spring: 1.15, summer: 1.15 }, sizeBias: -0.02 }),
    ...availabilityFor(extraCatfishFish, { weight: 5, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.35 }, periodWeights: { night: 1.25 }, sizeBias: 0.08 }),
    ...availabilityFor(extraAncientRiverFish, { weight: 2, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.25 }, sizeBias: 0.22 }),
];

const additionalPlainsPondExpansion: Availability[] = [
    ...availabilityFor(extraTemperateFreshwaterFish, { weight: 8, seasons: springSummerAutumn, periods: daylight, seasonWeights: { summer: 1.2 }, sizeBias: -0.04 }),
    ...availabilityFor(extraPondFish, { weight: 11, seasons: warmSeasons, periods: daylight, seasonWeights: { spring: 1.2, summer: 1.25 }, sizeBias: -0.08 }),
    ...availabilityFor(extraCatfishFish, { weight: 4, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.3 }, periodWeights: { night: 1.25 }, sizeBias: 0.04 }),
];

const additionalSavannaPondExpansion: Availability[] = [
    ...availabilityFor(extraPondFish, { weight: 9, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.35 }, sizeBias: -0.08 }),
    ...availabilityFor(extraTropicalRiverFish, { weight: 8, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.35 }, sizeBias: 0.02 }),
    ...availabilityFor(extraAncientRiverFish, { weight: 2, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.35 }, periodWeights: { night: 1.25 }, sizeBias: 0.24 }),
    ...availabilityFor(extraCatfishFish, { weight: 6, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.35 }, periodWeights: { night: 1.3 }, sizeBias: 0.08 }),
];

const additionalSwampExpansion: Availability[] = [
    ...availabilityFor(extraSwampFish, { weight: 10, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.35 }, sizeBias: -0.04 }),
    ...availabilityFor(extraTropicalRiverFish, { weight: 6, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.3 }, periodWeights: { night: 1.25 }, sizeBias: 0.03 }),
    ...availabilityFor(extraCatfishFish, { weight: 9, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.4 }, periodWeights: { night: 1.35 }, sizeBias: 0.1 }),
];

const additionalMangroveSwampExpansion: Availability[] = [
    ...availabilityFor(extraMangroveFish, { weight: 10, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.35 }, sizeBias: -0.02 }),
    ...availabilityFor(extraSwampFish, { weight: 7, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.25 }, sizeBias: -0.04 }),
    ...availabilityFor(extraTropicalRiverFish, { weight: 6, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.25 }, sizeBias: 0.02 }),
    ...availabilityFor(extraBeachFish, { weight: 5, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.2 }, sizeBias: -0.05 }),
];

const additionalTemperateOceanExpansion: Availability[] = [
    ...availabilityFor(extraTemperateOceanFish, { weight: 9, seasons: allSeasons, periods: lowLight, seasonWeights: { spring: 1.15, autumn: 1.25, winter: 1.1 }, sizeBias: 0.02 }),
    ...availabilityFor(extraPelagicFish, { weight: 4, seasons: summerAutumn, periods: lowLight, seasonWeights: { autumn: 1.25 }, sizeBias: 0.14 }),
    ...availabilityFor(extraBeachFish, { weight: 6, seasons: allSeasons, periods: daylight, seasonWeights: { spring: 1.15, summer: 1.1 }, sizeBias: -0.05 }),
];

const additionalDeepOceanExpansion: Availability[] = [
    ...availabilityFor(extraDeepOceanFish, { weight: 7, seasons: allSeasons, periods: nightOnly, periodWeights: { night: 1.5 }, sizeBias: 0.1 }),
    ...availabilityFor(extraPelagicFish, { weight: 5, seasons: summerAutumn, periods: lowLight, seasonWeights: { summer: 1.25, autumn: 1.25 }, sizeBias: 0.22 }),
    ...availabilityFor(extraSharkRayFish, { weight: 2, seasons: allSeasons, periods: lowLight, seasonWeights: { summer: 1.15, autumn: 1.15 }, sizeBias: 0.28 }),
];

const additionalColdOceanExpansion: Availability[] = [
    ...availabilityFor(extraColdOceanFish, { weight: 10, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.45, spring: 1.15 }, sizeBias: 0.04 }),
    ...availabilityFor(extraTemperateOceanFish, { weight: 5, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.25 }, sizeBias: 0.06 }),
    ...availabilityFor(extraSharkRayFish, { weight: 1, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.2 }, sizeBias: 0.28 }),
];

const additionalDeepColdOceanExpansion: Availability[] = [
    ...availabilityFor(extraColdOceanFish, { weight: 8, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.4 }, sizeBias: 0.1 }),
    ...availabilityFor(extraDeepOceanFish, { weight: 8, seasons: allSeasons, periods: nightOnly, periodWeights: { night: 1.45 }, sizeBias: 0.12 }),
    ...availabilityFor(extraSharkRayFish, { weight: 1, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.2 }, sizeBias: 0.32 }),
];

const additionalFrozenOceanExpansion: Availability[] = [
    ...availabilityFor(extraColdOceanFish, { weight: 8, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.55 }, sizeBias: 0.02 }),
];

const additionalDeepFrozenOceanExpansion: Availability[] = [
    ...availabilityFor(extraColdOceanFish, { weight: 6, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.5 }, sizeBias: 0.1 }),
    ...availabilityFor(extraDeepOceanFish, { weight: 5, seasons: allSeasons, periods: nightOnly, periodWeights: { night: 1.4 }, sizeBias: 0.14 }),
];

const additionalLukewarmOceanExpansion: Availability[] = [
    ...availabilityFor(extraTemperateOceanFish, { weight: 7, seasons: springSummerAutumn, periods: lowLight, seasonWeights: { summer: 1.2, autumn: 1.2 }, sizeBias: 0.02 }),
    ...availabilityFor(extraReefFish, { weight: 8, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.25 }, sizeBias: -0.05 }),
    ...availabilityFor(extraPelagicFish, { weight: 4, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.25 }, sizeBias: 0.16 }),
];

const additionalDeepLukewarmOceanExpansion: Availability[] = [
    ...availabilityFor(extraDeepOceanFish, { weight: 5, seasons: allSeasons, periods: nightOnly, periodWeights: { night: 1.4 }, sizeBias: 0.12 }),
    ...availabilityFor(extraPelagicFish, { weight: 5, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.25 }, sizeBias: 0.22 }),
    ...availabilityFor(extraSharkRayFish, { weight: 2, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.25 }, sizeBias: 0.3 }),
];

const additionalWarmOceanExpansion: Availability[] = [
    ...availabilityFor(extraReefFish, { weight: 11, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.35 }, sizeBias: -0.06 }),
    ...availabilityFor(extraPelagicFish, { weight: 5, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.25 }, sizeBias: 0.18 }),
    ...availabilityFor(extraSharkRayFish, { weight: 2, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.25 }, sizeBias: 0.3 }),
    ...availabilityFor(extraMangroveFish, { weight: 4, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.2 }, sizeBias: -0.02 }),
];

const additionalBeachExpansion: Availability[] = [
    ...availabilityFor(extraBeachFish, { weight: 11, seasons: allSeasons, periods: daylight, seasonWeights: { spring: 1.15, summer: 1.2 }, sizeBias: -0.06 }),
    ...availabilityFor(extraTemperateOceanFish, { weight: 5, seasons: allSeasons, periods: lowLight, seasonWeights: { autumn: 1.2 }, sizeBias: -0.02 }),
    ...availabilityFor(extraMangroveFish, { weight: 5, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.2 }, sizeBias: -0.03 }),
];

const additionalColdBeachExpansion: Availability[] = [
    ...availabilityFor(extraBeachFish, { weight: 7, seasons: coldSeasons, periods: daylight, seasonWeights: { winter: 1.25, spring: 1.15 }, sizeBias: -0.06 }),
    ...availabilityFor(extraColdOceanFish, { weight: 7, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.35 }, sizeBias: 0.02 }),
];

const additionalStoneBeachExpansion: Availability[] = [
    ...availabilityFor(extraBeachFish, { weight: 8, seasons: allSeasons, periods: daylight, seasonWeights: { spring: 1.1, summer: 1.1 }, sizeBias: -0.06 }),
    ...availabilityFor(extraReefFish, { weight: 5, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.2 }, sizeBias: -0.05 }),
    ...availabilityFor(extraTemperateOceanFish, { weight: 5, seasons: allSeasons, periods: lowLight, seasonWeights: { autumn: 1.15 }, sizeBias: 0.01 }),
];

const additionalFrozenRiverExpansion: Availability[] = [
    ...availabilityFor(extraColdFreshwaterFish, { weight: 10, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.25, spring: 1.25 }, sizeBias: 0.05 }),
    ...availabilityFor(extraTemperateFreshwaterFish, { weight: 4, seasons: coldSeasons, periods: daylight, seasonWeights: { spring: 1.15 }, sizeBias: -0.03 }),
];


const seasonSizeWindows: Record<Season, readonly [number, number]> = {
    spring: [0.08, 0.72],
    summer: [0.18, 0.88],
    autumn: [0.25, 1],
    winter: [0, 0.66],
};

const periodSizeShifts: Record<Period, number> = {
    morning: 0.02,
    afternoon: -0.03,
    evening: 0.08,
    night: 0.12,
};

function buildTable(entries: readonly Availability[]): FishingTable {
    const table = emptyTable();

    for (const season of seasons) {
        for (const period of periods) {
            table[season][period] = entries
                .filter(entry => isAvailable(entry, season, period))
                .map(entry => toFishEntry(entry, season, period));
        }
    }

    return table;
}

function emptyTable(): FishingTable {
    return {
        spring: { morning: [], afternoon: [], evening: [], night: [] },
        summer: { morning: [], afternoon: [], evening: [], night: [] },
        autumn: { morning: [], afternoon: [], evening: [], night: [] },
        winter: { morning: [], afternoon: [], evening: [], night: [] },
    };
}

function isAvailable(entry: Availability, season: Season, period: Period) {
    return (entry.seasons ?? allSeasons).includes(season)
        && (entry.periods ?? allPeriods).includes(period);
}

function toFishEntry(entry: Availability, season: Season, period: Period): FishEntry {
    const fish = fishCatalog[entry.key];
    const weight = Math.max(1, Math.round(
        entry.weight
        * (entry.seasonWeights?.[season] ?? 1)
        * (entry.periodWeights?.[period] ?? 1)
    ));

    return {
        typeId: fish.typeId,
        name: fish.name,
        weight,
        size: seasonalSize(fish.size, season, period, entry.sizeBias ?? 0),
    };
}

function seasonalSize(size: SizeRange, season: Season, period: Period, bias: number): SizeRange {
    const [seasonMin, seasonMax] = seasonSizeWindows[season];
    const shift = periodSizeShifts[period] + bias;
    let minRatio = clamp(seasonMin + shift, 0, 0.92);
    let maxRatio = clamp(seasonMax + shift, 0.08, 1);

    if (maxRatio - minRatio < 0.08) {
        if (maxRatio >= 1) {
            minRatio = Math.max(0, 0.92);
        } else {
            maxRatio = Math.min(1, minRatio + 0.08);
        }
    }

    const span = size.max - size.min;
    return {
        min: roundSize(size.min + (span * minRatio)),
        max: roundSize(size.min + (span * maxRatio)),
    };
}

function roundSize(value: number) {
    return Math.round(value * 10) / 10;
}

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

const freshwaterRiverExpansion: Availability[] = [
    ...additionalFreshwaterRiverExpansion,
    { key: "rainbow_trout", weight: 9, seasons: coldSeasons, periods: lowLight, seasonWeights: { spring: 1.3, autumn: 1.2 }, sizeBias: 0.06 },
    { key: "brown_trout", weight: 8, seasons: coldSeasons, periods: lowLight, seasonWeights: { spring: 1.2, autumn: 1.3 }, sizeBias: 0.07 },
    { key: "brook_trout", weight: 7, seasons: winterSpring, periods: lowLight, seasonWeights: { spring: 1.4 }, sizeBias: 0.03 },
    { key: "smallmouth_bass", weight: 8, seasons: springSummerAutumn, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: 0.02 },
    { key: "pike", weight: 6, seasons: coldSeasons, periods: lowLight, seasonWeights: { autumn: 1.3, winter: 1.1 }, sizeBias: 0.12 },
    { key: "muskie", weight: 3, seasons: springSummerAutumn, periods: lowLight, seasonWeights: { autumn: 1.4 }, sizeBias: 0.18 },
    { key: "walleye", weight: 7, seasons: coldSeasons, periods: eveningNight, seasonWeights: { autumn: 1.3, winter: 1.2 }, sizeBias: 0.07 },
    { key: "perch", weight: 11, seasons: allSeasons, periods: daylight, seasonWeights: { winter: 1.2 }, sizeBias: -0.02 },
    { key: "roach", weight: 12, seasons: springSummerAutumn, periods: daylight, seasonWeights: { spring: 1.2, summer: 1.2 }, sizeBias: -0.05 },
    { key: "rudd", weight: 10, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: -0.04 },
    { key: "dace", weight: 12, seasons: allSeasons, periods: daylight, seasonWeights: { spring: 1.2 }, sizeBias: -0.07 },
    { key: "chub", weight: 10, seasons: springSummerAutumn, periods: daylight, seasonWeights: { summer: 1.2 }, sizeBias: -0.02 },
    { key: "barbel", weight: 7, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3, autumn: 1.2 }, sizeBias: 0.09 },
    { key: "loach", weight: 12, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.4 }, sizeBias: -0.1 },
    { key: "bitterling", weight: 13, seasons: springSummer, periods: daylight, seasonWeights: { spring: 1.4 }, sizeBias: -0.12 },
    { key: "freshwater_goby", weight: 11, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: -0.09 },
    { key: "koi", weight: 5, seasons: allSeasons, periods: daylight, seasonWeights: { spring: 1.3 }, sizeBias: 0.04 },
    { key: "sea_bass", weight: 9, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: 0.08 },
    { key: "mullet", weight: 12, seasons: warmSeasons, periods: daylight, seasonWeights: { autumn: 1.3 }, sizeBias: 0 },
    { key: "king_salmon", weight: 3, seasons: autumnWinter, periods: lowLight, seasonWeights: { autumn: 1.6, winter: 1.2 }, sizeBias: 0.2 },
    { key: "sockeye_salmon", weight: 6, seasons: autumnWinter, periods: lowLight, seasonWeights: { autumn: 1.7 }, sizeBias: 0.08 },
];

const plainsPondExpansion: Availability[] = [
    ...additionalPlainsPondExpansion,
    { key: "smallmouth_bass", weight: 8, seasons: springSummerAutumn, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: 0.02 },
    { key: "pike", weight: 6, seasons: coldSeasons, periods: lowLight, seasonWeights: { autumn: 1.3, winter: 1.1 }, sizeBias: 0.12 },
    { key: "muskie", weight: 3, seasons: springSummerAutumn, periods: lowLight, seasonWeights: { autumn: 1.4 }, sizeBias: 0.18 },
    { key: "walleye", weight: 7, seasons: coldSeasons, periods: eveningNight, seasonWeights: { autumn: 1.3, winter: 1.2 }, sizeBias: 0.07 },
    { key: "perch", weight: 11, seasons: allSeasons, periods: daylight, seasonWeights: { winter: 1.2 }, sizeBias: -0.02 },
    { key: "roach", weight: 12, seasons: springSummerAutumn, periods: daylight, seasonWeights: { spring: 1.2, summer: 1.2 }, sizeBias: -0.05 },
    { key: "rudd", weight: 10, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: -0.04 },
    { key: "tench", weight: 8, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.4 }, sizeBias: 0.03 },
    { key: "chub", weight: 10, seasons: springSummerAutumn, periods: daylight, seasonWeights: { summer: 1.2 }, sizeBias: -0.02 },
    { key: "loach", weight: 12, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.4 }, sizeBias: -0.1 },
    { key: "bitterling", weight: 13, seasons: springSummer, periods: daylight, seasonWeights: { spring: 1.4 }, sizeBias: -0.12 },
    { key: "tilapia", weight: 12, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.5 }, sizeBias: -0.02 },
    { key: "koi", weight: 5, seasons: allSeasons, periods: daylight, seasonWeights: { spring: 1.3 }, sizeBias: 0.04 },
    { key: "goldfish", weight: 8, seasons: springSummerAutumn, periods: daylight, seasonWeights: { spring: 1.3 }, sizeBias: -0.08 },
];

const savannaPondExpansion: Availability[] = [
    ...additionalSavannaPondExpansion,
    { key: "smallmouth_bass", weight: 8, seasons: springSummerAutumn, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: 0.02 },
    { key: "snakehead", weight: 7, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.5 }, periodWeights: { night: 1.3 }, sizeBias: 0.1 },
    { key: "arapaima", weight: 2, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.4 }, periodWeights: { night: 1.2 }, sizeBias: 0.28 },
    { key: "piranha", weight: 6, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.4 }, periodWeights: { night: 1.2 }, sizeBias: -0.02 },
    { key: "arowana", weight: 4, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: 0.14 },
    { key: "tilapia", weight: 12, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.5 }, sizeBias: -0.02 },
    { key: "goldfish", weight: 8, seasons: springSummerAutumn, periods: daylight, seasonWeights: { spring: 1.3 }, sizeBias: -0.08 },
    { key: "gar", weight: 3, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.4 }, sizeBias: 0.22 },
];

const swampExpansion: Availability[] = [
    ...additionalSwampExpansion,
    { key: "rudd", weight: 10, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: -0.04 },
    { key: "tench", weight: 8, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.4 }, sizeBias: 0.03 },
    { key: "loach", weight: 12, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.4 }, sizeBias: -0.1 },
    { key: "freshwater_goby", weight: 11, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: -0.09 },
    { key: "snakehead", weight: 7, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.5 }, periodWeights: { night: 1.3 }, sizeBias: 0.1 },
    { key: "arapaima", weight: 2, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.4 }, periodWeights: { night: 1.2 }, sizeBias: 0.28 },
    { key: "piranha", weight: 6, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.4 }, periodWeights: { night: 1.2 }, sizeBias: -0.02 },
    { key: "arowana", weight: 4, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: 0.14 },
    { key: "gar", weight: 3, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.4 }, sizeBias: 0.22 },
];

const mangroveSwampExpansion: Availability[] = [
    ...additionalMangroveSwampExpansion,
    { key: "tench", weight: 8, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.4 }, sizeBias: 0.03 },
    { key: "freshwater_goby", weight: 11, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: -0.09 },
    { key: "snakehead", weight: 7, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.5 }, periodWeights: { night: 1.3 }, sizeBias: 0.1 },
    { key: "arapaima", weight: 2, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.4 }, periodWeights: { night: 1.2 }, sizeBias: 0.28 },
    { key: "piranha", weight: 6, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.4 }, periodWeights: { night: 1.2 }, sizeBias: -0.02 },
    { key: "arowana", weight: 4, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: 0.14 },
    { key: "tilapia", weight: 12, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.5 }, sizeBias: -0.02 },
    { key: "gar", weight: 3, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.4 }, sizeBias: 0.22 },
    { key: "barracuda", weight: 6, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.4 }, sizeBias: 0.12 },
    { key: "angelfish", weight: 9, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: -0.08 },
    { key: "horseshoe_crab", weight: 4, seasons: warmSeasons, periods: nightOnly, seasonWeights: { summer: 1.4 }, sizeBias: 0.04 },
    { key: "sawfish", weight: 2, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: 0.28 },
    { key: "milkfish", weight: 9, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.4 }, sizeBias: 0.06 },
    { key: "tarpon", weight: 4, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.4 }, sizeBias: 0.22 },
    { key: "mullet", weight: 12, seasons: warmSeasons, periods: daylight, seasonWeights: { autumn: 1.3 }, sizeBias: 0 },
];

const temperateOceanExpansion: Availability[] = [
    ...additionalTemperateOceanExpansion,
    { key: "mackerel", weight: 13, seasons: springSummerAutumn, periods: lowLight, seasonWeights: { autumn: 1.4 }, sizeBias: 0.01 },
    { key: "horse_mackerel", weight: 14, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: -0.04 },
    { key: "sardine", weight: 15, seasons: allSeasons, periods: daylight, seasonWeights: { summer: 1.2, autumn: 1.3 }, sizeBias: -0.08 },
    { key: "anchovy", weight: 14, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.4 }, sizeBias: -0.12 },
    { key: "saury", weight: 11, seasons: autumnWinter, periods: lowLight, seasonWeights: { autumn: 1.8 }, sizeBias: -0.03 },
    { key: "bonito", weight: 9, seasons: summerAutumn, periods: lowLight, seasonWeights: { summer: 1.3, autumn: 1.2 }, sizeBias: 0.08 },
    { key: "skipjack_tuna", weight: 8, seasons: summerAutumn, periods: lowLight, seasonWeights: { summer: 1.4, autumn: 1.2 }, sizeBias: 0.1 },
    { key: "albacore", weight: 5, seasons: summerAutumn, periods: lowLight, seasonWeights: { autumn: 1.4 }, sizeBias: 0.18 },
    { key: "amberjack", weight: 7, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3, autumn: 1.2 }, sizeBias: 0.15 },
    { key: "yellowtail", weight: 7, seasons: autumnWinter, periods: lowLight, seasonWeights: { winter: 1.5, autumn: 1.3 }, sizeBias: 0.16 },
    { key: "sea_bass", weight: 9, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: 0.08 },
    { key: "rockfish", weight: 10, seasons: coldSeasons, periods: eveningNight, seasonWeights: { winter: 1.4, spring: 1.2 }, sizeBias: -0.02 },
    { key: "alfonsino", weight: 6, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.3, spring: 1.2 }, sizeBias: 0.08 },
    { key: "great_white_shark", weight: 1, seasons: allSeasons, periods: lowLight, seasonWeights: { autumn: 1.3, winter: 1.2 }, sizeBias: 0.34 },
    { key: "sunfish", weight: 3, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: 0.25 },
    { key: "flying_fish", weight: 10, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.4 }, sizeBias: -0.02 },
    { key: "cutlassfish", weight: 8, seasons: summerAutumn, periods: eveningNight, seasonWeights: { autumn: 1.4 }, periodWeights: { night: 1.3 }, sizeBias: 0.16 },
    { key: "tilefish", weight: 7, seasons: coldSeasons, periods: daylight, seasonWeights: { winter: 1.3, spring: 1.2 }, sizeBias: 0.05 },
    { key: "conger_eel", weight: 9, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.3 }, periodWeights: { night: 1.4 }, sizeBias: 0.08 },
    { key: "sand_lance", weight: 12, seasons: winterSpring, periods: daylight, seasonWeights: { spring: 1.5 }, sizeBias: -0.1 },
];

const deepOceanExpansion: Availability[] = [
    ...additionalDeepOceanExpansion,
    { key: "skipjack_tuna", weight: 8, seasons: summerAutumn, periods: lowLight, seasonWeights: { summer: 1.4, autumn: 1.2 }, sizeBias: 0.1 },
    { key: "albacore", weight: 5, seasons: summerAutumn, periods: lowLight, seasonWeights: { autumn: 1.4 }, sizeBias: 0.18 },
    { key: "yellowfin_tuna", weight: 4, seasons: summerAutumn, periods: lowLight, seasonWeights: { summer: 1.3, autumn: 1.3 }, sizeBias: 0.24 },
    { key: "bigeye_tuna", weight: 4, seasons: summerAutumn, periods: eveningNight, seasonWeights: { autumn: 1.4 }, periodWeights: { night: 1.3 }, sizeBias: 0.26 },
    { key: "marlin", weight: 2, seasons: summerAutumn, periods: daylight, seasonWeights: { summer: 1.4 }, sizeBias: 0.32 },
    { key: "swordfish", weight: 2, seasons: summerAutumn, periods: lowLight, seasonWeights: { autumn: 1.3 }, sizeBias: 0.3 },
    { key: "yellowtail", weight: 7, seasons: autumnWinter, periods: lowLight, seasonWeights: { winter: 1.5, autumn: 1.3 }, sizeBias: 0.16 },
    { key: "anglerfish", weight: 4, seasons: coldSeasons, periods: nightOnly, seasonWeights: { winter: 1.4 }, sizeBias: 0.18 },
    { key: "lanternfish", weight: 10, seasons: allSeasons, periods: nightOnly, periodWeights: { night: 1.6 }, sizeBias: -0.08 },
    { key: "oarfish", weight: 1, seasons: allSeasons, periods: nightOnly, periodWeights: { night: 1.5 }, sizeBias: 0.34 },
    { key: "giant_squid", weight: 1, seasons: allSeasons, periods: nightOnly, periodWeights: { night: 1.5 }, sizeBias: 0.32 },
    { key: "hagfish", weight: 5, seasons: allSeasons, periods: nightOnly, periodWeights: { night: 1.3 }, sizeBias: 0.04 },
    { key: "grenadier", weight: 6, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.3 }, sizeBias: 0.12 },
    { key: "alfonsino", weight: 6, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.3, spring: 1.2 }, sizeBias: 0.08 },
    { key: "opah", weight: 3, seasons: allSeasons, periods: lowLight, sizeBias: 0.22 },
    { key: "chimaera", weight: 3, seasons: coldSeasons, periods: nightOnly, seasonWeights: { winter: 1.3 }, sizeBias: 0.16 },
    { key: "hammerhead_shark", weight: 2, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.4 }, sizeBias: 0.3 },
    { key: "great_white_shark", weight: 1, seasons: allSeasons, periods: lowLight, seasonWeights: { autumn: 1.3, winter: 1.2 }, sizeBias: 0.34 },
    { key: "sunfish", weight: 3, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: 0.25 },
    { key: "cutlassfish", weight: 8, seasons: summerAutumn, periods: eveningNight, seasonWeights: { autumn: 1.4 }, periodWeights: { night: 1.3 }, sizeBias: 0.16 },
    { key: "tilefish", weight: 7, seasons: coldSeasons, periods: daylight, seasonWeights: { winter: 1.3, spring: 1.2 }, sizeBias: 0.05 },
];

const coldOceanExpansion: Availability[] = [
    ...additionalColdOceanExpansion,
    { key: "pollock", weight: 13, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.6, spring: 1.2 }, sizeBias: 0.04 },
    { key: "haddock", weight: 10, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.4 }, sizeBias: 0.06 },
    { key: "halibut", weight: 5, seasons: coldSeasons, periods: allPeriods, seasonWeights: { winter: 1.5 }, sizeBias: 0.2 },
    { key: "saury", weight: 11, seasons: autumnWinter, periods: lowLight, seasonWeights: { autumn: 1.8 }, sizeBias: -0.03 },
    { key: "yellowtail", weight: 7, seasons: autumnWinter, periods: lowLight, seasonWeights: { winter: 1.5, autumn: 1.3 }, sizeBias: 0.16 },
    { key: "scallop", weight: 10, seasons: coldSeasons, periods: daylight, seasonWeights: { winter: 1.4 }, sizeBias: -0.06 },
    { key: "great_white_shark", weight: 1, seasons: allSeasons, periods: lowLight, seasonWeights: { autumn: 1.3, winter: 1.2 }, sizeBias: 0.34 },
    { key: "king_salmon", weight: 3, seasons: autumnWinter, periods: lowLight, seasonWeights: { autumn: 1.6, winter: 1.2 }, sizeBias: 0.2 },
    { key: "sockeye_salmon", weight: 6, seasons: autumnWinter, periods: lowLight, seasonWeights: { autumn: 1.7 }, sizeBias: 0.08 },
];

const deepColdOceanExpansion: Availability[] = [
    ...additionalDeepColdOceanExpansion,
    { key: "pollock", weight: 13, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.6, spring: 1.2 }, sizeBias: 0.04 },
    { key: "haddock", weight: 10, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.4 }, sizeBias: 0.06 },
    { key: "halibut", weight: 5, seasons: coldSeasons, periods: allPeriods, seasonWeights: { winter: 1.5 }, sizeBias: 0.2 },
    { key: "anglerfish", weight: 4, seasons: coldSeasons, periods: nightOnly, seasonWeights: { winter: 1.4 }, sizeBias: 0.18 },
    { key: "lanternfish", weight: 10, seasons: allSeasons, periods: nightOnly, periodWeights: { night: 1.6 }, sizeBias: -0.08 },
    { key: "oarfish", weight: 1, seasons: allSeasons, periods: nightOnly, periodWeights: { night: 1.5 }, sizeBias: 0.34 },
    { key: "giant_squid", weight: 1, seasons: allSeasons, periods: nightOnly, periodWeights: { night: 1.5 }, sizeBias: 0.32 },
    { key: "hagfish", weight: 5, seasons: allSeasons, periods: nightOnly, periodWeights: { night: 1.3 }, sizeBias: 0.04 },
    { key: "grenadier", weight: 6, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.3 }, sizeBias: 0.12 },
    { key: "chimaera", weight: 3, seasons: coldSeasons, periods: nightOnly, seasonWeights: { winter: 1.3 }, sizeBias: 0.16 },
    { key: "lobster", weight: 5, seasons: coldSeasons, periods: eveningNight, seasonWeights: { winter: 1.4 }, sizeBias: 0.08 },
    { key: "king_salmon", weight: 3, seasons: autumnWinter, periods: lowLight, seasonWeights: { autumn: 1.6, winter: 1.2 }, sizeBias: 0.2 },
];

const frozenOceanExpansion: Availability[] = [
    ...additionalFrozenOceanExpansion,
    { key: "pollock", weight: 13, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.6, spring: 1.2 }, sizeBias: 0.04 },
    { key: "icefish", weight: 10, seasons: coldSeasons, periods: daylight, seasonWeights: { winter: 1.7 }, sizeBias: -0.08 },
];

const deepFrozenOceanExpansion: Availability[] = [
    ...additionalDeepFrozenOceanExpansion,
    { key: "halibut", weight: 5, seasons: coldSeasons, periods: allPeriods, seasonWeights: { winter: 1.5 }, sizeBias: 0.2 },
    { key: "anglerfish", weight: 4, seasons: coldSeasons, periods: nightOnly, seasonWeights: { winter: 1.4 }, sizeBias: 0.18 },
    { key: "giant_squid", weight: 1, seasons: allSeasons, periods: nightOnly, periodWeights: { night: 1.5 }, sizeBias: 0.32 },
    { key: "grenadier", weight: 6, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.3 }, sizeBias: 0.12 },
    { key: "icefish", weight: 10, seasons: coldSeasons, periods: daylight, seasonWeights: { winter: 1.7 }, sizeBias: -0.08 },
];

const lukewarmOceanExpansion: Availability[] = [
    ...additionalLukewarmOceanExpansion,
    { key: "mackerel", weight: 13, seasons: springSummerAutumn, periods: lowLight, seasonWeights: { autumn: 1.4 }, sizeBias: 0.01 },
    { key: "horse_mackerel", weight: 14, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: -0.04 },
    { key: "sardine", weight: 15, seasons: allSeasons, periods: daylight, seasonWeights: { summer: 1.2, autumn: 1.3 }, sizeBias: -0.08 },
    { key: "anchovy", weight: 14, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.4 }, sizeBias: -0.12 },
    { key: "bonito", weight: 9, seasons: summerAutumn, periods: lowLight, seasonWeights: { summer: 1.3, autumn: 1.2 }, sizeBias: 0.08 },
    { key: "skipjack_tuna", weight: 8, seasons: summerAutumn, periods: lowLight, seasonWeights: { summer: 1.4, autumn: 1.2 }, sizeBias: 0.1 },
    { key: "mahi_mahi", weight: 7, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.5 }, sizeBias: 0.16 },
    { key: "barracuda", weight: 6, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.4 }, sizeBias: 0.12 },
    { key: "grouper", weight: 7, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.3 }, sizeBias: 0.14 },
    { key: "snapper", weight: 9, seasons: warmSeasons, periods: daylight, seasonWeights: { spring: 1.2, summer: 1.3 }, sizeBias: 0.04 },
    { key: "amberjack", weight: 7, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3, autumn: 1.2 }, sizeBias: 0.15 },
    { key: "sea_bass", weight: 9, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: 0.08 },
    { key: "scorpionfish", weight: 8, seasons: allSeasons, periods: eveningNight, periodWeights: { night: 1.3 }, sizeBias: -0.02 },
    { key: "parrotfish", weight: 9, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.4 }, sizeBias: 0.03 },
    { key: "butterflyfish", weight: 11, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: -0.09 },
    { key: "surgeonfish", weight: 10, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.4 }, sizeBias: -0.06 },
    { key: "triggerfish", weight: 8, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: 0 },
    { key: "wrasse", weight: 10, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.2 }, sizeBias: -0.04 },
    { key: "damselfish", weight: 12, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: -0.12 },
    { key: "abalone", weight: 6, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.2 }, sizeBias: -0.04 },
    { key: "mantis_shrimp", weight: 8, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: -0.04 },
    { key: "flying_fish", weight: 10, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.4 }, sizeBias: -0.02 },
    { key: "mullet", weight: 12, seasons: warmSeasons, periods: daylight, seasonWeights: { autumn: 1.3 }, sizeBias: 0 },
    { key: "needlefish", weight: 9, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: 0.02 },
    { key: "flathead", weight: 8, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: 0.08 },
    { key: "cutlassfish", weight: 8, seasons: summerAutumn, periods: eveningNight, seasonWeights: { autumn: 1.4 }, periodWeights: { night: 1.3 }, sizeBias: 0.16 },
    { key: "tilefish", weight: 7, seasons: coldSeasons, periods: daylight, seasonWeights: { winter: 1.3, spring: 1.2 }, sizeBias: 0.05 },
];

const deepLukewarmOceanExpansion: Availability[] = [
    ...additionalDeepLukewarmOceanExpansion,
    { key: "albacore", weight: 5, seasons: summerAutumn, periods: lowLight, seasonWeights: { autumn: 1.4 }, sizeBias: 0.18 },
    { key: "yellowfin_tuna", weight: 4, seasons: summerAutumn, periods: lowLight, seasonWeights: { summer: 1.3, autumn: 1.3 }, sizeBias: 0.24 },
    { key: "bigeye_tuna", weight: 4, seasons: summerAutumn, periods: eveningNight, seasonWeights: { autumn: 1.4 }, periodWeights: { night: 1.3 }, sizeBias: 0.26 },
    { key: "mahi_mahi", weight: 7, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.5 }, sizeBias: 0.16 },
    { key: "marlin", weight: 2, seasons: summerAutumn, periods: daylight, seasonWeights: { summer: 1.4 }, sizeBias: 0.32 },
    { key: "swordfish", weight: 2, seasons: summerAutumn, periods: lowLight, seasonWeights: { autumn: 1.3 }, sizeBias: 0.3 },
    { key: "sailfish", weight: 2, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.5 }, sizeBias: 0.28 },
    { key: "amberjack", weight: 7, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3, autumn: 1.2 }, sizeBias: 0.15 },
    { key: "moray_eel", weight: 6, seasons: warmSeasons, periods: eveningNight, periodWeights: { night: 1.4 }, sizeBias: 0.14 },
    { key: "lanternfish", weight: 10, seasons: allSeasons, periods: nightOnly, periodWeights: { night: 1.6 }, sizeBias: -0.08 },
    { key: "oarfish", weight: 1, seasons: allSeasons, periods: nightOnly, periodWeights: { night: 1.5 }, sizeBias: 0.34 },
    { key: "nautilus", weight: 4, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.2 }, sizeBias: -0.04 },
    { key: "alfonsino", weight: 6, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.3, spring: 1.2 }, sizeBias: 0.08 },
    { key: "opah", weight: 3, seasons: allSeasons, periods: lowLight, sizeBias: 0.22 },
    { key: "hammerhead_shark", weight: 2, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.4 }, sizeBias: 0.3 },
    { key: "whale_shark", weight: 1, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.5 }, sizeBias: 0.38 },
    { key: "tiger_shark", weight: 2, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.4 }, sizeBias: 0.32 },
    { key: "sunfish", weight: 3, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: 0.25 },
    { key: "manta_ray", weight: 2, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.4 }, sizeBias: 0.32 },
    { key: "sawfish", weight: 2, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: 0.28 },
    { key: "tarpon", weight: 4, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.4 }, sizeBias: 0.22 },
];

const warmOceanExpansion: Availability[] = [
    ...additionalWarmOceanExpansion,
    { key: "bonito", weight: 9, seasons: summerAutumn, periods: lowLight, seasonWeights: { summer: 1.3, autumn: 1.2 }, sizeBias: 0.08 },
    { key: "skipjack_tuna", weight: 8, seasons: summerAutumn, periods: lowLight, seasonWeights: { summer: 1.4, autumn: 1.2 }, sizeBias: 0.1 },
    { key: "yellowfin_tuna", weight: 4, seasons: summerAutumn, periods: lowLight, seasonWeights: { summer: 1.3, autumn: 1.3 }, sizeBias: 0.24 },
    { key: "mahi_mahi", weight: 7, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.5 }, sizeBias: 0.16 },
    { key: "marlin", weight: 2, seasons: summerAutumn, periods: daylight, seasonWeights: { summer: 1.4 }, sizeBias: 0.32 },
    { key: "sailfish", weight: 2, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.5 }, sizeBias: 0.28 },
    { key: "barracuda", weight: 6, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.4 }, sizeBias: 0.12 },
    { key: "grouper", weight: 7, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.3 }, sizeBias: 0.14 },
    { key: "snapper", weight: 9, seasons: warmSeasons, periods: daylight, seasonWeights: { spring: 1.2, summer: 1.3 }, sizeBias: 0.04 },
    { key: "scorpionfish", weight: 8, seasons: allSeasons, periods: eveningNight, periodWeights: { night: 1.3 }, sizeBias: -0.02 },
    { key: "parrotfish", weight: 9, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.4 }, sizeBias: 0.03 },
    { key: "butterflyfish", weight: 11, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: -0.09 },
    { key: "angelfish", weight: 9, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: -0.08 },
    { key: "surgeonfish", weight: 10, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.4 }, sizeBias: -0.06 },
    { key: "lionfish", weight: 6, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: 0 },
    { key: "triggerfish", weight: 8, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: 0 },
    { key: "wrasse", weight: 10, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.2 }, sizeBias: -0.04 },
    { key: "damselfish", weight: 12, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: -0.12 },
    { key: "clownfish", weight: 9, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.4 }, sizeBias: -0.12 },
    { key: "moorish_idol", weight: 6, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: -0.08 },
    { key: "moray_eel", weight: 6, seasons: warmSeasons, periods: eveningNight, periodWeights: { night: 1.4 }, sizeBias: 0.14 },
    { key: "nautilus", weight: 4, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.2 }, sizeBias: -0.04 },
    { key: "abalone", weight: 6, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.2 }, sizeBias: -0.04 },
    { key: "sea_urchin", weight: 8, seasons: allSeasons, periods: daylight, seasonWeights: { winter: 1.2, summer: 1.2 }, sizeBias: -0.09 },
    { key: "mantis_shrimp", weight: 8, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: -0.04 },
    { key: "horseshoe_crab", weight: 4, seasons: warmSeasons, periods: nightOnly, seasonWeights: { summer: 1.4 }, sizeBias: 0.04 },
    { key: "hermit_crab", weight: 10, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: -0.1 },
    { key: "hammerhead_shark", weight: 2, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.4 }, sizeBias: 0.3 },
    { key: "whale_shark", weight: 1, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.5 }, sizeBias: 0.38 },
    { key: "tiger_shark", weight: 2, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.4 }, sizeBias: 0.32 },
    { key: "manta_ray", weight: 2, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.4 }, sizeBias: 0.32 },
    { key: "sawfish", weight: 2, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: 0.28 },
    { key: "milkfish", weight: 9, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.4 }, sizeBias: 0.06 },
    { key: "flying_fish", weight: 10, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.4 }, sizeBias: -0.02 },
    { key: "tarpon", weight: 4, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.4 }, sizeBias: 0.22 },
    { key: "needlefish", weight: 9, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: 0.02 },
];

const beachExpansion: Availability[] = [
    ...additionalBeachExpansion,
    { key: "mackerel", weight: 13, seasons: springSummerAutumn, periods: lowLight, seasonWeights: { autumn: 1.4 }, sizeBias: 0.01 },
    { key: "horse_mackerel", weight: 14, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: -0.04 },
    { key: "sardine", weight: 15, seasons: allSeasons, periods: daylight, seasonWeights: { summer: 1.2, autumn: 1.3 }, sizeBias: -0.08 },
    { key: "anchovy", weight: 14, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.4 }, sizeBias: -0.12 },
    { key: "saury", weight: 11, seasons: autumnWinter, periods: lowLight, seasonWeights: { autumn: 1.8 }, sizeBias: -0.03 },
    { key: "snapper", weight: 9, seasons: warmSeasons, periods: daylight, seasonWeights: { spring: 1.2, summer: 1.3 }, sizeBias: 0.04 },
    { key: "sea_bass", weight: 9, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: 0.08 },
    { key: "oyster", weight: 13, seasons: coldSeasons, periods: daylight, seasonWeights: { winter: 1.4 }, sizeBias: -0.08 },
    { key: "mussel", weight: 13, seasons: allSeasons, periods: daylight, seasonWeights: { winter: 1.2 }, sizeBias: -0.1 },
    { key: "mantis_shrimp", weight: 8, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: -0.04 },
    { key: "horseshoe_crab", weight: 4, seasons: warmSeasons, periods: nightOnly, seasonWeights: { summer: 1.4 }, sizeBias: 0.04 },
    { key: "hermit_crab", weight: 10, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: -0.1 },
    { key: "milkfish", weight: 9, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.4 }, sizeBias: 0.06 },
    { key: "mullet", weight: 12, seasons: warmSeasons, periods: daylight, seasonWeights: { autumn: 1.3 }, sizeBias: 0 },
    { key: "needlefish", weight: 9, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: 0.02 },
    { key: "flathead", weight: 8, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: 0.08 },
    { key: "conger_eel", weight: 9, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.3 }, periodWeights: { night: 1.4 }, sizeBias: 0.08 },
    { key: "sand_lance", weight: 12, seasons: winterSpring, periods: daylight, seasonWeights: { spring: 1.5 }, sizeBias: -0.1 },
];

const coldBeachExpansion: Availability[] = [
    ...additionalColdBeachExpansion,
    { key: "pollock", weight: 13, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.6, spring: 1.2 }, sizeBias: 0.04 },
    { key: "haddock", weight: 10, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.4 }, sizeBias: 0.06 },
    { key: "halibut", weight: 5, seasons: coldSeasons, periods: allPeriods, seasonWeights: { winter: 1.5 }, sizeBias: 0.2 },
    { key: "sardine", weight: 15, seasons: allSeasons, periods: daylight, seasonWeights: { summer: 1.2, autumn: 1.3 }, sizeBias: -0.08 },
    { key: "rockfish", weight: 10, seasons: coldSeasons, periods: eveningNight, seasonWeights: { winter: 1.4, spring: 1.2 }, sizeBias: -0.02 },
    { key: "oyster", weight: 13, seasons: coldSeasons, periods: daylight, seasonWeights: { winter: 1.4 }, sizeBias: -0.08 },
    { key: "scallop", weight: 10, seasons: coldSeasons, periods: daylight, seasonWeights: { winter: 1.4 }, sizeBias: -0.06 },
    { key: "mussel", weight: 13, seasons: allSeasons, periods: daylight, seasonWeights: { winter: 1.2 }, sizeBias: -0.1 },
    { key: "sea_urchin", weight: 8, seasons: allSeasons, periods: daylight, seasonWeights: { winter: 1.2, summer: 1.2 }, sizeBias: -0.09 },
    { key: "lobster", weight: 5, seasons: coldSeasons, periods: eveningNight, seasonWeights: { winter: 1.4 }, sizeBias: 0.08 },
    { key: "sand_lance", weight: 12, seasons: winterSpring, periods: daylight, seasonWeights: { spring: 1.5 }, sizeBias: -0.1 },
];

const stoneBeachExpansion: Availability[] = [
    ...additionalStoneBeachExpansion,
    { key: "mackerel", weight: 13, seasons: springSummerAutumn, periods: lowLight, seasonWeights: { autumn: 1.4 }, sizeBias: 0.01 },
    { key: "grouper", weight: 7, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.3 }, sizeBias: 0.14 },
    { key: "rockfish", weight: 10, seasons: coldSeasons, periods: eveningNight, seasonWeights: { winter: 1.4, spring: 1.2 }, sizeBias: -0.02 },
    { key: "scorpionfish", weight: 8, seasons: allSeasons, periods: eveningNight, periodWeights: { night: 1.3 }, sizeBias: -0.02 },
    { key: "lionfish", weight: 6, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: 0 },
    { key: "wrasse", weight: 10, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.2 }, sizeBias: -0.04 },
    { key: "moray_eel", weight: 6, seasons: warmSeasons, periods: eveningNight, periodWeights: { night: 1.4 }, sizeBias: 0.14 },
    { key: "oyster", weight: 13, seasons: coldSeasons, periods: daylight, seasonWeights: { winter: 1.4 }, sizeBias: -0.08 },
    { key: "scallop", weight: 10, seasons: coldSeasons, periods: daylight, seasonWeights: { winter: 1.4 }, sizeBias: -0.06 },
    { key: "mussel", weight: 13, seasons: allSeasons, periods: daylight, seasonWeights: { winter: 1.2 }, sizeBias: -0.1 },
    { key: "abalone", weight: 6, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.2 }, sizeBias: -0.04 },
    { key: "sea_urchin", weight: 8, seasons: allSeasons, periods: daylight, seasonWeights: { winter: 1.2, summer: 1.2 }, sizeBias: -0.09 },
    { key: "lobster", weight: 5, seasons: coldSeasons, periods: eveningNight, seasonWeights: { winter: 1.4 }, sizeBias: 0.08 },
    { key: "hermit_crab", weight: 10, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: -0.1 },
    { key: "flathead", weight: 8, seasons: warmSeasons, periods: lowLight, seasonWeights: { summer: 1.3 }, sizeBias: 0.08 },
    { key: "conger_eel", weight: 9, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.3 }, periodWeights: { night: 1.4 }, sizeBias: 0.08 },
];

const frozenRiverExpansion: Availability[] = [
    ...additionalFrozenRiverExpansion,
    { key: "rainbow_trout", weight: 9, seasons: coldSeasons, periods: lowLight, seasonWeights: { spring: 1.3, autumn: 1.2 }, sizeBias: 0.06 },
    { key: "brown_trout", weight: 8, seasons: coldSeasons, periods: lowLight, seasonWeights: { spring: 1.2, autumn: 1.3 }, sizeBias: 0.07 },
    { key: "brook_trout", weight: 7, seasons: winterSpring, periods: lowLight, seasonWeights: { spring: 1.4 }, sizeBias: 0.03 },
    { key: "pike", weight: 6, seasons: coldSeasons, periods: lowLight, seasonWeights: { autumn: 1.3, winter: 1.1 }, sizeBias: 0.12 },
    { key: "walleye", weight: 7, seasons: coldSeasons, periods: eveningNight, seasonWeights: { autumn: 1.3, winter: 1.2 }, sizeBias: 0.07 },
    { key: "perch", weight: 11, seasons: allSeasons, periods: daylight, seasonWeights: { winter: 1.2 }, sizeBias: -0.02 },
    { key: "dace", weight: 12, seasons: allSeasons, periods: daylight, seasonWeights: { spring: 1.2 }, sizeBias: -0.07 },
    { key: "icefish", weight: 10, seasons: coldSeasons, periods: daylight, seasonWeights: { winter: 1.7 }, sizeBias: -0.08 },
    { key: "king_salmon", weight: 3, seasons: autumnWinter, periods: lowLight, seasonWeights: { autumn: 1.6, winter: 1.2 }, sizeBias: 0.2 },
    { key: "sockeye_salmon", weight: 6, seasons: autumnWinter, periods: lowLight, seasonWeights: { autumn: 1.7 }, sizeBias: 0.08 },
];

const freshwaterRiver: Availability[] = [
    ...freshwaterRiverExpansion,
    { key: "crucian_carp", weight: 18 },
    { key: "carp", weight: 13, sizeBias: 0.03 },
    { key: "medaka", weight: 14, seasons: springSummerAutumn, periods: daylight, sizeBias: -0.08 },
    { key: "sweetfish", weight: 14, seasons: springSummerAutumn, periods: daylight, seasonWeights: { summer: 1.4, autumn: 0.8 } },
    { key: "yamame_trout", weight: 11, seasons: springSummerAutumn, periods: lowLight, seasonWeights: { spring: 1.3, summer: 0.8 } },
    { key: "charr", weight: 9, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 0.8, spring: 1.2 } },
    { key: "eel", weight: 8, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.5 }, periodWeights: { night: 1.4 }, sizeBias: 0.08 },
    { key: "catfish", weight: 7, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.4 }, periodWeights: { night: 1.3 }, sizeBias: 0.1 },
    { key: "black_bass", weight: 8, seasons: springSummerAutumn, periods: daylight, seasonWeights: { summer: 1.3 } },
    { key: "bluegill", weight: 11, seasons: springSummerAutumn, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: -0.04 },
    { key: "salmon", weight: 8, seasons: coldSeasons, periods: lowLight, seasonWeights: { autumn: 1.7, winter: 0.8, spring: 0.7 }, sizeBias: 0.08 },
    { key: "sturgeon", weight: 2, seasons: coldSeasons, periods: lowLight, seasonWeights: { autumn: 1.4 }, sizeBias: 0.22 },
    { key: "crayfish", weight: 9, seasons: springSummerAutumn, periods: eveningNight, seasonWeights: { summer: 1.4 }, sizeBias: -0.08 },
];

const plainsPond: Availability[] = [
    ...plainsPondExpansion,
    { key: "crucian_carp", weight: 20, sizeBias: -0.05 },
    { key: "carp", weight: 12, sizeBias: -0.03 },
    { key: "medaka", weight: 18, seasons: springSummerAutumn, periods: daylight, sizeBias: -0.1 },
    { key: "bluegill", weight: 12, seasons: springSummerAutumn, periods: daylight, seasonWeights: { summer: 1.3 }, sizeBias: -0.05 },
    { key: "black_bass", weight: 8, seasons: springSummerAutumn, periods: daylight, seasonWeights: { summer: 1.2 } },
    { key: "catfish", weight: 6, seasons: warmSeasons, periods: eveningNight, periodWeights: { night: 1.4 }, sizeBias: 0.08 },
    { key: "eel", weight: 5, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.4 }, sizeBias: 0.03 },
    { key: "sweetfish", weight: 5, seasons: springSummerAutumn, periods: ["morning", "evening"], seasonWeights: { summer: 1.2 } },
    { key: "crayfish", weight: 10, seasons: springSummerAutumn, periods: eveningNight, seasonWeights: { summer: 1.3 }, sizeBias: -0.1 },
    { key: "salmon", weight: 3, seasons: autumnWinter, periods: lowLight, seasonWeights: { autumn: 1.5 }, sizeBias: 0.05 },
];

const savannaPond: Availability[] = [
    ...savannaPondExpansion,
    { key: "bluegill", weight: 18, seasons: springSummerAutumn, periods: daylight, seasonWeights: { summer: 1.5 }, sizeBias: -0.04 },
    { key: "black_bass", weight: 13, seasons: springSummerAutumn, periods: daylight, seasonWeights: { summer: 1.4 }, sizeBias: 0.02 },
    { key: "catfish", weight: 12, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.5 }, periodWeights: { night: 1.4 }, sizeBias: 0.12 },
    { key: "carp", weight: 10, sizeBias: -0.02 },
    { key: "crucian_carp", weight: 13, sizeBias: -0.06 },
    { key: "eel", weight: 6, seasons: warmSeasons, periods: nightOnly, seasonWeights: { summer: 1.6 }, sizeBias: 0.08 },
    { key: "medaka", weight: 10, seasons: springSummer, periods: daylight, sizeBias: -0.08 },
    { key: "crayfish", weight: 9, seasons: warmSeasons, periods: eveningNight, sizeBias: -0.06 },
];

const swamp: Availability[] = [
    ...swampExpansion,
    { key: "catfish", weight: 18, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.5 }, periodWeights: { night: 1.5 }, sizeBias: 0.16 },
    { key: "eel", weight: 14, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.5 }, periodWeights: { night: 1.4 }, sizeBias: 0.12 },
    { key: "carp", weight: 12 },
    { key: "crucian_carp", weight: 17 },
    { key: "black_bass", weight: 9, seasons: springSummerAutumn, periods: daylight, seasonWeights: { summer: 1.3 } },
    { key: "bluegill", weight: 13, seasons: springSummerAutumn, periods: daylight, seasonWeights: { summer: 1.4 }, sizeBias: -0.05 },
    { key: "medaka", weight: 10, seasons: springSummerAutumn, periods: daylight, sizeBias: -0.1 },
    { key: "crayfish", weight: 12, seasons: springSummerAutumn, periods: eveningNight, seasonWeights: { summer: 1.4 }, sizeBias: -0.05 },
    { key: "sturgeon", weight: 2, seasons: coldSeasons, periods: lowLight, sizeBias: 0.18 },
];

const mangroveSwamp: Availability[] = [
    ...mangroveSwampExpansion,
    { key: "catfish", weight: 13, seasons: warmSeasons, periods: eveningNight, periodWeights: { night: 1.5 }, sizeBias: 0.12 },
    { key: "eel", weight: 13, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.4 }, sizeBias: 0.1 },
    { key: "crab", weight: 12, sizeBias: -0.03 },
    { key: "shrimp", weight: 15, seasons: warmSeasons, sizeBias: -0.05 },
    { key: "stingray", weight: 4, seasons: summerAutumn, periods: daylight, sizeBias: 0.04 },
    { key: "sea_cucumber", weight: 8, seasons: warmSeasons, periods: allPeriods, sizeBias: -0.05 },
    { key: "jellyfish", weight: 7, seasons: summerAutumn, periods: eveningNight },
    { key: "medaka", weight: 8, seasons: springSummerAutumn, periods: daylight, sizeBias: -0.1 },
    { key: "bluegill", weight: 7, seasons: springSummerAutumn, periods: daylight, sizeBias: -0.04 },
    { key: "crayfish", weight: 7, seasons: springSummerAutumn, periods: eveningNight, sizeBias: -0.08 },
];

const temperateOcean: Availability[] = [
    ...temperateOceanExpansion,
    { key: "cod", weight: 13, seasonWeights: { winter: 1.6, spring: 1.2, summer: 0.7 }, sizeBias: 0.03 },
    { key: "herring", weight: 12, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.5, spring: 1.2 } },
    { key: "tai", weight: 11, seasons: warmSeasons, periods: daylight, seasonWeights: { spring: 1.3, summer: 1.1 }, sizeBias: 0.03 },
    { key: "tuna", weight: 7, seasons: summerAutumn, periods: lowLight, seasonWeights: { summer: 1.2, autumn: 1.4 }, sizeBias: 0.1 },
    { key: "flounder", weight: 10, seasons: coldSeasons, periods: allPeriods, seasonWeights: { winter: 1.3 }, sizeBias: 0.02 },
    { key: "squid", weight: 9, periods: eveningNight, seasonWeights: { winter: 1.2, summer: 0.8 }, periodWeights: { night: 1.3 } },
    { key: "octopus", weight: 7, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.3 }, sizeBias: 0.02 },
    { key: "shrimp", weight: 11, seasons: warmSeasons, sizeBias: -0.06 },
    { key: "crab", weight: 8, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.4 }, sizeBias: -0.02 },
    { key: "jellyfish", weight: 6, seasons: summerAutumn, periods: eveningNight },
    { key: "starfish", weight: 5, sizeBias: -0.06 },
    { key: "stingray", weight: 4, seasons: summerAutumn, periods: daylight, sizeBias: 0.03 },
    { key: "salmon", weight: 5, seasons: coldSeasons, periods: lowLight, seasonWeights: { autumn: 1.6 }, sizeBias: 0.08 },
];

const deepOcean: Availability[] = [
    ...deepOceanExpansion,
    { key: "tuna", weight: 11, seasons: summerAutumn, periods: lowLight, seasonWeights: { autumn: 1.4 }, sizeBias: 0.2 },
    { key: "bluefin_tuna", weight: 5, seasons: summerAutumn, periods: lowLight, seasonWeights: { autumn: 1.4 }, sizeBias: 0.26 },
    { key: "cod", weight: 8, seasonWeights: { winter: 1.5, spring: 1.2, summer: 0.7 }, sizeBias: 0.12 },
    { key: "sturgeon", weight: 4, seasons: coldSeasons, periods: lowLight, seasonWeights: { autumn: 1.3 }, sizeBias: 0.28 },
    { key: "coelacanth", weight: 1, seasons: allSeasons, periods: nightOnly, sizeBias: 0.2 },
    { key: "squid", weight: 10, periods: eveningNight, periodWeights: { night: 1.4 }, sizeBias: 0.1 },
    { key: "octopus", weight: 8, seasons: warmSeasons, periods: eveningNight, sizeBias: 0.1 },
    { key: "stingray", weight: 6, seasons: summerAutumn, periods: lowLight, sizeBias: 0.18 },
    { key: "jellyfish", weight: 8, seasons: summerAutumn, periods: eveningNight, sizeBias: 0.08 },
    { key: "flounder", weight: 5, seasons: coldSeasons, sizeBias: 0.12 },
];

const coldOcean: Availability[] = [
    ...coldOceanExpansion,
    { key: "cod", weight: 18, seasonWeights: { winter: 1.7, spring: 1.3, summer: 0.8 }, sizeBias: 0.08 },
    { key: "salmon", weight: 14, seasons: coldSeasons, periods: lowLight, seasonWeights: { autumn: 1.6, winter: 1.2 }, sizeBias: 0.1 },
    { key: "herring", weight: 15, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.5 }, sizeBias: 0.04 },
    { key: "flounder", weight: 11, seasons: coldSeasons, seasonWeights: { winter: 1.3 }, sizeBias: 0.06 },
    { key: "crab", weight: 9, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.4 }, sizeBias: 0.02 },
    { key: "squid", weight: 7, periods: eveningNight, seasonWeights: { winter: 1.3 }, periodWeights: { night: 1.3 }, sizeBias: 0.04 },
    { key: "sturgeon", weight: 3, seasons: coldSeasons, periods: lowLight, sizeBias: 0.2 },
    { key: "jellyfish", weight: 3, seasons: summerAutumn, periods: eveningNight, sizeBias: 0.02 },
];

const deepColdOcean: Availability[] = [
    ...deepColdOceanExpansion,
    { key: "cod", weight: 16, seasonWeights: { winter: 1.7, spring: 1.3 }, sizeBias: 0.16 },
    { key: "salmon", weight: 10, seasons: coldSeasons, periods: lowLight, seasonWeights: { autumn: 1.6 }, sizeBias: 0.16 },
    { key: "herring", weight: 12, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.5 }, sizeBias: 0.1 },
    { key: "sturgeon", weight: 6, seasons: coldSeasons, periods: lowLight, seasonWeights: { autumn: 1.4 }, sizeBias: 0.3 },
    { key: "bluefin_tuna", weight: 3, seasons: summerAutumn, periods: lowLight, seasonWeights: { autumn: 1.4 }, sizeBias: 0.28 },
    { key: "coelacanth", weight: 1, seasons: allSeasons, periods: nightOnly, sizeBias: 0.24 },
    { key: "squid", weight: 8, periods: eveningNight, seasonWeights: { winter: 1.3 }, sizeBias: 0.12 },
    { key: "flounder", weight: 8, seasons: coldSeasons, sizeBias: 0.14 },
    { key: "crab", weight: 6, seasons: coldSeasons, periods: lowLight, sizeBias: 0.06 },
];

const frozenOcean: Availability[] = [
    ...frozenOceanExpansion,
    { key: "cod", weight: 20, seasons: allSeasons, seasonWeights: { winter: 1.8, spring: 1.3, summer: 0.6 }, sizeBias: 0.04 },
    { key: "salmon", weight: 12, seasons: coldSeasons, periods: lowLight, seasonWeights: { autumn: 1.5, winter: 1.3 }, sizeBias: 0.08 },
    { key: "herring", weight: 13, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.6 }, sizeBias: 0.04 },
    { key: "crab", weight: 8, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.5 } },
    { key: "flounder", weight: 8, seasons: coldSeasons, seasonWeights: { winter: 1.3 }, sizeBias: 0.04 },
    { key: "squid", weight: 4, seasons: winterSpring, periods: eveningNight, periodWeights: { night: 1.4 }, sizeBias: 0.04 },
    { key: "sturgeon", weight: 2, seasons: coldSeasons, periods: lowLight, sizeBias: 0.16 },
];

const deepFrozenOcean: Availability[] = [
    ...deepFrozenOceanExpansion,
    { key: "cod", weight: 18, seasonWeights: { winter: 1.8, spring: 1.3 }, sizeBias: 0.16 },
    { key: "salmon", weight: 10, seasons: coldSeasons, periods: lowLight, seasonWeights: { autumn: 1.5, winter: 1.2 }, sizeBias: 0.16 },
    { key: "herring", weight: 10, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.5 }, sizeBias: 0.1 },
    { key: "sturgeon", weight: 5, seasons: coldSeasons, periods: lowLight, sizeBias: 0.3 },
    { key: "coelacanth", weight: 1, seasons: allSeasons, periods: nightOnly, sizeBias: 0.24 },
    { key: "squid", weight: 5, seasons: winterSpring, periods: eveningNight, sizeBias: 0.12 },
    { key: "flounder", weight: 8, seasons: coldSeasons, sizeBias: 0.12 },
    { key: "crab", weight: 5, seasons: coldSeasons, periods: lowLight, sizeBias: 0.08 },
];

const lukewarmOcean: Availability[] = [
    ...lukewarmOceanExpansion,
    { key: "tai", weight: 15, seasons: warmSeasons, periods: daylight, seasonWeights: { spring: 1.4, summer: 1.2 }, sizeBias: 0.06 },
    { key: "tuna", weight: 9, seasons: summerAutumn, periods: lowLight, seasonWeights: { autumn: 1.3 }, sizeBias: 0.12 },
    { key: "flounder", weight: 8, seasons: coldSeasons, sizeBias: 0.02 },
    { key: "shrimp", weight: 14, seasons: warmSeasons, sizeBias: -0.04 },
    { key: "crab", weight: 9, periods: lowLight, sizeBias: -0.03 },
    { key: "squid", weight: 10, periods: eveningNight, periodWeights: { night: 1.3 }, sizeBias: 0.03 },
    { key: "octopus", weight: 9, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.3 }, sizeBias: 0.05 },
    { key: "jellyfish", weight: 7, seasons: summerAutumn, periods: eveningNight, seasonWeights: { summer: 1.3 } },
    { key: "starfish", weight: 7, sizeBias: -0.06 },
    { key: "sea_cucumber", weight: 5, seasons: warmSeasons, sizeBias: -0.04 },
    { key: "stingray", weight: 6, seasons: summerAutumn, periods: daylight, sizeBias: 0.08 },
    { key: "herring", weight: 4, seasons: winterSpring, periods: lowLight },
];

const deepLukewarmOcean: Availability[] = [
    ...deepLukewarmOceanExpansion,
    { key: "tuna", weight: 13, seasons: summerAutumn, periods: lowLight, seasonWeights: { autumn: 1.4 }, sizeBias: 0.24 },
    { key: "bluefin_tuna", weight: 4, seasons: summerAutumn, periods: lowLight, seasonWeights: { autumn: 1.3 }, sizeBias: 0.28 },
    { key: "tai", weight: 8, seasons: warmSeasons, periods: daylight, sizeBias: 0.12 },
    { key: "coelacanth", weight: 1, seasons: allSeasons, periods: nightOnly, sizeBias: 0.24 },
    { key: "sturgeon", weight: 3, seasons: coldSeasons, periods: lowLight, sizeBias: 0.24 },
    { key: "squid", weight: 11, periods: eveningNight, periodWeights: { night: 1.4 }, sizeBias: 0.12 },
    { key: "octopus", weight: 9, seasons: warmSeasons, periods: eveningNight, sizeBias: 0.13 },
    { key: "stingray", weight: 7, seasons: summerAutumn, periods: lowLight, sizeBias: 0.2 },
    { key: "jellyfish", weight: 8, seasons: summerAutumn, periods: eveningNight, sizeBias: 0.08 },
    { key: "flounder", weight: 4, seasons: coldSeasons, sizeBias: 0.08 },
];

const warmOcean: Availability[] = [
    ...warmOceanExpansion,
    { key: "tai", weight: 14, seasons: warmSeasons, periods: daylight, seasonWeights: { spring: 1.2, summer: 1.4 }, sizeBias: 0.04 },
    { key: "tuna", weight: 8, seasons: summerAutumn, periods: lowLight, seasonWeights: { summer: 1.2, autumn: 1.2 }, sizeBias: 0.1 },
    { key: "bluefin_tuna", weight: 2, seasons: summerAutumn, periods: lowLight, sizeBias: 0.22 },
    { key: "shrimp", weight: 16, seasons: warmSeasons, sizeBias: -0.04 },
    { key: "crab", weight: 10, periods: lowLight, sizeBias: -0.03 },
    { key: "octopus", weight: 10, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.4 }, sizeBias: 0.05 },
    { key: "squid", weight: 8, periods: eveningNight, periodWeights: { night: 1.3 }, sizeBias: 0.02 },
    { key: "jellyfish", weight: 10, seasons: summerAutumn, periods: eveningNight, seasonWeights: { summer: 1.4 } },
    { key: "starfish", weight: 11, sizeBias: -0.08 },
    { key: "sea_cucumber", weight: 10, seasons: warmSeasons, sizeBias: -0.05 },
    { key: "stingray", weight: 8, seasons: summerAutumn, periods: daylight, sizeBias: 0.1 },
    { key: "flounder", weight: 4, seasons: winterSpring, sizeBias: -0.02 },
];

const beach: Availability[] = [
    ...beachExpansion,
    { key: "clam", weight: 20, periods: daylight, sizeBias: -0.04 },
    { key: "crab", weight: 15, periods: lowLight, seasonWeights: { winter: 1.3 }, sizeBias: -0.05 },
    { key: "shrimp", weight: 14, seasons: warmSeasons, sizeBias: -0.08 },
    { key: "flounder", weight: 12, seasons: coldSeasons, periods: allPeriods, seasonWeights: { winter: 1.3 }, sizeBias: -0.02 },
    { key: "tai", weight: 8, seasons: warmSeasons, periods: daylight, seasonWeights: { spring: 1.3 }, sizeBias: -0.03 },
    { key: "herring", weight: 7, seasons: coldSeasons, periods: lowLight, sizeBias: -0.02 },
    { key: "sea_cucumber", weight: 7, seasons: warmSeasons, sizeBias: -0.08 },
    { key: "starfish", weight: 11, sizeBias: -0.1 },
    { key: "jellyfish", weight: 8, seasons: summerAutumn, periods: eveningNight },
    { key: "octopus", weight: 5, seasons: warmSeasons, periods: eveningNight, sizeBias: -0.02 },
    { key: "squid", weight: 5, periods: eveningNight },
    { key: "stingray", weight: 3, seasons: summerAutumn, periods: daylight, sizeBias: 0.02 },
];

const coldBeach: Availability[] = [
    ...coldBeachExpansion,
    { key: "clam", weight: 18, periods: daylight, sizeBias: -0.04 },
    { key: "crab", weight: 16, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.5 }, sizeBias: -0.02 },
    { key: "cod", weight: 11, seasons: coldSeasons, seasonWeights: { winter: 1.5 }, sizeBias: -0.02 },
    { key: "salmon", weight: 10, seasons: coldSeasons, periods: lowLight, seasonWeights: { autumn: 1.5, winter: 1.2 }, sizeBias: 0.05 },
    { key: "herring", weight: 12, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.4 } },
    { key: "flounder", weight: 12, seasons: coldSeasons, seasonWeights: { winter: 1.3 }, sizeBias: 0.02 },
    { key: "squid", weight: 5, seasons: winterSpring, periods: eveningNight, sizeBias: 0.02 },
    { key: "jellyfish", weight: 4, seasons: summerAutumn, periods: eveningNight },
    { key: "starfish", weight: 6, sizeBias: -0.08 },
];

const stoneBeach: Availability[] = [
    ...stoneBeachExpansion,
    { key: "crab", weight: 18, periods: lowLight, seasonWeights: { winter: 1.3 }, sizeBias: -0.02 },
    { key: "clam", weight: 12, periods: daylight, sizeBias: -0.05 },
    { key: "octopus", weight: 11, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.3 }, sizeBias: 0.02 },
    { key: "squid", weight: 9, periods: eveningNight, periodWeights: { night: 1.3 }, sizeBias: 0.03 },
    { key: "herring", weight: 8, seasons: coldSeasons, periods: lowLight },
    { key: "flounder", weight: 9, seasons: coldSeasons, sizeBias: 0.03 },
    { key: "cod", weight: 8, seasons: coldSeasons, seasonWeights: { winter: 1.4 }, sizeBias: 0.02 },
    { key: "starfish", weight: 13, sizeBias: -0.06 },
    { key: "sea_cucumber", weight: 6, seasons: warmSeasons, sizeBias: -0.04 },
    { key: "jellyfish", weight: 5, seasons: summerAutumn, periods: eveningNight },
];

const frozenRiver: Availability[] = [
    ...frozenRiverExpansion,
    { key: "salmon", weight: 17, seasons: coldSeasons, periods: lowLight, seasonWeights: { autumn: 1.5, winter: 1.2 }, sizeBias: 0.1 },
    { key: "charr", weight: 15, seasons: coldSeasons, periods: lowLight, seasonWeights: { winter: 1.1, spring: 1.3 }, sizeBias: 0.08 },
    { key: "yamame_trout", weight: 10, seasons: winterSpring, periods: lowLight, seasonWeights: { spring: 1.4 }, sizeBias: 0.04 },
    { key: "sturgeon", weight: 3, seasons: coldSeasons, periods: lowLight, sizeBias: 0.24 },
    { key: "carp", weight: 5, sizeBias: -0.02 },
    { key: "crucian_carp", weight: 8, sizeBias: -0.04 },
    { key: "crayfish", weight: 4, seasons: springSummer, periods: eveningNight, sizeBias: -0.08 },
];

const commonSpecialFishing: Availability[] = [
    { key: "cod", weight: 7, sizeBias: -0.02 },
    { key: "pufferfish", weight: 2, seasons: warmSeasons, periods: lowLight, sizeBias: -0.05 },
    { key: "tropical_fish", weight: 1, seasons: warmSeasons, periods: daylight, sizeBias: -0.08 },
    { key: "carp", weight: 7, periods: daylight, sizeBias: -0.04 },
    { key: "crucian_carp", weight: 8, periods: daylight, sizeBias: -0.06 },
    { key: "medaka", weight: 7, seasons: springSummerAutumn, periods: daylight, sizeBias: -0.12 },
    { key: "bluegill", weight: 6, seasons: warmSeasons, periods: daylight, seasonWeights: { summer: 1.2 }, sizeBias: -0.07 },
    { key: "black_bass", weight: 4, seasons: springSummerAutumn, periods: daylight, seasonWeights: { summer: 1.2 }, sizeBias: 0.01 },
    { key: "salmon", weight: 5, seasons: coldSeasons, periods: lowLight, seasonWeights: { autumn: 1.4, winter: 1.2 }, sizeBias: 0.04 },
    { key: "herring", weight: 4, seasons: coldSeasons, periods: lowLight, sizeBias: -0.02 },
    { key: "catfish", weight: 4, seasons: warmSeasons, periods: eveningNight, periodWeights: { night: 1.25 }, sizeBias: 0.08 },
    { key: "eel", weight: 3, seasons: warmSeasons, periods: eveningNight, seasonWeights: { summer: 1.25 }, sizeBias: 0.04 },
    { key: "shrimp", weight: 5, seasons: warmSeasons, sizeBias: -0.08 },
    { key: "crab", weight: 4, periods: lowLight, sizeBias: -0.06 },
    { key: "squid", weight: 3, periods: eveningNight, periodWeights: { night: 1.2 } },
];

const fishingTables = {
    common: buildTable(commonSpecialFishing),
    temperateOcean: buildTable(temperateOcean),
    deepOcean: buildTable(deepOcean),
    coldOcean: buildTable(coldOcean),
    deepColdOcean: buildTable(deepColdOcean),
    frozenOcean: buildTable(frozenOcean),
    deepFrozenOcean: buildTable(deepFrozenOcean),
    lukewarmOcean: buildTable(lukewarmOcean),
    deepLukewarmOcean: buildTable(deepLukewarmOcean),
    warmOcean: buildTable(warmOcean),
    freshwaterRiver: buildTable(freshwaterRiver),
    frozenRiver: buildTable(frozenRiver),
    beach: buildTable(beach),
    coldBeach: buildTable(coldBeach),
    stoneBeach: buildTable(stoneBeach),
    swamp: buildTable(swamp),
    mangroveSwamp: buildTable(mangroveSwamp),
    savannaPond: buildTable(savannaPond),
    plainsPond: buildTable(plainsPond),
};

const biomeFishingTables: Record<string, FishingTable> = {
    "minecraft:ocean": fishingTables.temperateOcean,
    "minecraft:deep_ocean": fishingTables.deepOcean,
    "minecraft:cold_ocean": fishingTables.coldOcean,
    "minecraft:deep_cold_ocean": fishingTables.deepColdOcean,
    "minecraft:frozen_ocean": fishingTables.frozenOcean,
    "minecraft:legacy_frozen_ocean": fishingTables.frozenOcean,
    "minecraft:deep_frozen_ocean": fishingTables.deepFrozenOcean,
    "minecraft:lukewarm_ocean": fishingTables.lukewarmOcean,
    "minecraft:deep_lukewarm_ocean": fishingTables.deepLukewarmOcean,
    "minecraft:warm_ocean": fishingTables.warmOcean,
    "minecraft:deep_warm_ocean": fishingTables.deepLukewarmOcean,

    "minecraft:river": fishingTables.freshwaterRiver,
    "minecraft:frozen_river": fishingTables.frozenRiver,

    "minecraft:beach": fishingTables.beach,
    "minecraft:mushroom_island_shore": fishingTables.beach,
    "minecraft:cold_beach": fishingTables.coldBeach,
    "minecraft:stone_beach": fishingTables.stoneBeach,

    "minecraft:swampland": fishingTables.swamp,
    "minecraft:swampland_mutated": fishingTables.swamp,
    "minecraft:mangrove_swamp": fishingTables.mangroveSwamp,

    "minecraft:plains": fishingTables.plainsPond,
    "minecraft:sunflower_plains": fishingTables.plainsPond,
    "minecraft:forest": fishingTables.plainsPond,
    "minecraft:flower_forest": fishingTables.plainsPond,
    "minecraft:forest_hills": fishingTables.plainsPond,
    "minecraft:birch_forest": fishingTables.plainsPond,
    "minecraft:birch_forest_hills": fishingTables.plainsPond,
    "minecraft:birch_forest_mutated": fishingTables.plainsPond,
    "minecraft:birch_forest_hills_mutated": fishingTables.plainsPond,
    "minecraft:roofed_forest": fishingTables.plainsPond,
    "minecraft:roofed_forest_mutated": fishingTables.plainsPond,
    "minecraft:mushroom_island": fishingTables.plainsPond,
    "minecraft:meadow": fishingTables.plainsPond,
    "minecraft:cherry_grove": fishingTables.plainsPond,
    "minecraft:pale_garden": fishingTables.plainsPond,
    "minecraft:lush_caves": fishingTables.plainsPond,

    "minecraft:taiga": fishingTables.freshwaterRiver,
    "minecraft:taiga_hills": fishingTables.freshwaterRiver,
    "minecraft:taiga_mutated": fishingTables.freshwaterRiver,
    "minecraft:mega_taiga": fishingTables.freshwaterRiver,
    "minecraft:mega_spruce_taiga": fishingTables.freshwaterRiver,
    "minecraft:mega_taiga_hills": fishingTables.freshwaterRiver,
    "minecraft:mega_taiga_mutated": fishingTables.freshwaterRiver,
    "minecraft:mega_spruce_taiga_mutated": fishingTables.freshwaterRiver,
    "minecraft:redwood_taiga": fishingTables.freshwaterRiver,
    "minecraft:redwood_taiga_hills": fishingTables.freshwaterRiver,
    "minecraft:redwood_taiga_mutated": fishingTables.freshwaterRiver,
    "minecraft:redwood_taiga_hills_mutated": fishingTables.freshwaterRiver,
    "minecraft:extreme_hills": fishingTables.freshwaterRiver,
    "minecraft:extreme_hills_edge": fishingTables.freshwaterRiver,
    "minecraft:extreme_hills_mutated": fishingTables.freshwaterRiver,
    "minecraft:extreme_hills_plus_trees": fishingTables.freshwaterRiver,
    "minecraft:extreme_hills_plus_trees_mutated": fishingTables.freshwaterRiver,
    "minecraft:jagged_peaks": fishingTables.freshwaterRiver,
    "minecraft:stony_peaks": fishingTables.freshwaterRiver,
    "minecraft:dripstone_caves": fishingTables.freshwaterRiver,
    "minecraft:deep_dark": fishingTables.freshwaterRiver,

    "minecraft:ice_plains": fishingTables.frozenRiver,
    "minecraft:ice_plains_spikes": fishingTables.frozenRiver,
    "minecraft:ice_mountains": fishingTables.frozenRiver,
    "minecraft:cold_taiga": fishingTables.frozenRiver,
    "minecraft:cold_taiga_hills": fishingTables.frozenRiver,
    "minecraft:cold_taiga_mutated": fishingTables.frozenRiver,
    "minecraft:frozen_peaks": fishingTables.frozenRiver,
    "minecraft:snowy_slopes": fishingTables.frozenRiver,
    "minecraft:grove": fishingTables.frozenRiver,

    "minecraft:savanna": fishingTables.savannaPond,
    "minecraft:savanna_plateau": fishingTables.savannaPond,
    "minecraft:savanna_mutated": fishingTables.savannaPond,
    "minecraft:savanna_plateau_mutated": fishingTables.savannaPond,
    "minecraft:desert": fishingTables.savannaPond,
    "minecraft:desert_hills": fishingTables.savannaPond,
    "minecraft:desert_mutated": fishingTables.savannaPond,
    "minecraft:mesa": fishingTables.savannaPond,
    "minecraft:mesa_bryce": fishingTables.savannaPond,
    "minecraft:mesa_mutated": fishingTables.savannaPond,
    "minecraft:mesa_plateau": fishingTables.savannaPond,
    "minecraft:mesa_plateau_mutated": fishingTables.savannaPond,
    "minecraft:mesa_plateau_stone": fishingTables.savannaPond,
    "minecraft:mesa_plateau_stone_mutated": fishingTables.savannaPond,
    "minecraft:jungle": fishingTables.savannaPond,
    "minecraft:bamboo_jungle": fishingTables.savannaPond,
    "minecraft:jungle_mutated": fishingTables.savannaPond,
    "minecraft:jungle_hills": fishingTables.savannaPond,
    "minecraft:bamboo_jungle_hills": fishingTables.savannaPond,
    "minecraft:jungle_edge": fishingTables.savannaPond,
    "minecraft:jungle_edge_mutated": fishingTables.savannaPond,
};

const config = {
    fishes: fishingTables.common,
    biomes: Object.fromEntries(
        Object.entries(biomeFishingTables).map(([biomeId, fishes]) => [biomeId, { fishes }])
    ),
    allFishes: Object.values(fishCatalog).map(fish => ({
        typeId: fish.typeId,
        name: fish.name,
        size: fish.size,
    })),
};

export default config;
