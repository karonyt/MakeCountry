/*import { CommandPermissionLevel, system } from "@minecraft/server";

const commandCategories = {
    country: {
        displayName: "国",
        aliases: ["country", "国", "国家"],
        commands: {
            "/makecountry, /mc": "新しい国を作成します",
            "/settingcountry, /sc": "国の設定メニューを開きます",
            "/countrylist, /cl": "国家リストを開きます",
            "/joincountry, /jc": "既存の国に参加します",
            "/leavecountry": "国から抜けます",
        }
    },
    chunk: {
        displayName: "チャンク",
        aliases: ["chunk", "チャンク"],
        commands: {
            "/buychunk, /buyc": "チャンクを購入します",
            "/sellchunk, /sellc": "チャンクを売却します",
            "/invade": "現在のチャンクを侵略(戦争)します",
            "/plot": "現在のチャンクのプロットメニューを開きます",
            "/checkchunk, /cc": "現在のチャンクの状態を確認します",
        }
    },
    chat: {
        displayName: "チャット",
        aliases: ["chat", "チャット"],
        commands: {
            "/generalchat, /gc, /g": "ジェネラルチャットに切り替えます",
            "/localchat, /lc": "ローカルチャットに切り替えます",
            "/countrychat, /cchat": "国内チャットに切り替えます",
            "/alliancechat, /ac": "同盟チャットに切り替えます",
            "/friendlychat, /fc": "フレンドリーチャットに切り替えます",
        }
    },
    economy: {
        displayName: "経済",
        aliases: ["economy", "経済"],
        commands: {
            "/money, /bal": "所持金を確認します",
            "/sendmoney, /pay": "お金を送ります",
            "/shop": "AdminShopを開きます",
            "/playermarket, /pm": "PlayerMarketを開きます",
        }
    },
    etc: {
        displayName: "その他",
        aliases: ["etc", "その他"],
        commands: {
            "/menu": "メニューを開きます",
            "/jobs": "職業メニューを開きます",
            "/selfkill": "自身をkillします",
            "/selfclear": "自身のインベントリをクリアします",
            "/itemid": "手持ちのアイテムのIDを調べます",
            "/fixcamera": "視点を固定します",
        }
    }
};

const allAliases = Object.values(commandCategories).flatMap(c => c.aliases);

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:karohelp',
            description: 'ヘルプを表示します',
            permissionLevel: CommandPermissionLevel.Any,
        },
        (origin, ...args) => {
            if (!origin.sourceEntity || !(origin.sourceEntity instanceof Player)) return;
    
            const category = args[0];
            if (!category) {
                const cats = Object.values(commandCategories)
                    .map(c => `${c.displayName} (${c.aliases.join("/")})`)
                    .join("\n");
                origin.sendMessage(`§a使い方: /karohelp <カテゴリー>\n利用可能なカテゴリー:\n${cats}`);
                return;
            }
    
            const normalized = category.toLowerCase();
            const found = Object.values(commandCategories).find(obj =>
                obj.aliases.some(alias => alias.toLowerCase() === normalized)
            );
    
            if (!found) {
                origin.sendMessage(`§cカテゴリー "${category}" は存在しません。`);
                return;
            }
    
            const headerFooter = "§l§a---------------------------------------------------------------";
            const body = Object.entries(found.commands)
                .map(([cmd, desc]) => `${cmd}: ${desc}`)
                .join("\n");
    
            origin.sendMessage(`${headerFooter}\n§6§l[${found.displayName}]§r\n${body}\n${headerFooter}`);
        }
    );
});
*/