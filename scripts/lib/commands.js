import { Player, system, world } from "@minecraft/server";
import config from "../config";
import * as DyProp from "./DyProp";
import { CheckPermission, CheckPermissionFromLocation, ConvertChunk, GetAndParsePropertyData, GetChunkPropertyId, GetPlayerChunkPropertyId, StringifyAndSavePropertyData } from "./util";
import { GenerateChunkData } from "./land";
import { MakeCountryForm } from "./form";

class ChatHandler {
    constructor(event) {
        this.event = event;
        /**
         * @type {string}
         */
        this.message = event.message;
        /**
         * @type {Player}
         */
        this.sender = event.sender;
        /**
         * @type {string}
         */
        this.prefix = config.prefix;
        this.playerData = GetAndParsePropertyData(`player_${sender.id}`);
        this.playerCountryData = GetAndParsePropertyData(`country_${sender.country}`);
    }

    isCommand() {
        return this.message.startsWith(this.prefix);
    }

    handleChat() {
        if (!config.showCountryChatLeftName) {
            world.sendMessage(`<${this.sender.name}> ${this.message}`);
            return;
        };
        let landId = this.playerData.country;
        let land = `chat.player.no.join.any.country`;
        if (landId) land = this.playerCountryData.id;
        world.sendMessage([{ text: `<§${this.playerCountryData.color}` }, { translate: land }, { text: ` §r| ${this.sender.name}> ${this.message}` }]);
        this.event.targets = [];
    };

    handleCommand() {
        const command = this.message.split(" ")[0];
        const args = this.message.split(" ").slice(1);
        system.run(() => {
            switch (command) {
                case `${this.prefix}money`:
                    this.Money();
                    break;
                case `${this.prefix}setup`:
                    this.setup();
                    break;
                case `${this.prefix}msend`:
                    this.sendMoney(args);
                    break;
                case `${this.prefix}checkchunk`:
                    this.checkChunk();
                    break;
                case `${this.prefix}sethome`:
                    this.setHome();
                    break;
                case `${this.prefix}home`:
                    this.teleportHome();
                    break;
                case `${this.prefix}checkhome`:
                    this.checkHome();
                    break;
                case `${this.prefix}adminchunk`:
                    this.setAdminChunk();
                    break;
                case `${this.prefix}resetchunk`:
                    this.resetChunk();
                    break;
                case `${this.prefix}buychunk`:
                    this.buyChunk();
                    break;
                case `${this.prefix}sellchunk`:
                    this.sellChunk();
                    break;
                case `${this.prefix}help`:
                    this.sendHelp();
                    break;
                case `${this.prefix}makecountry`:
                    this.makeCountry();
                    break;
                case `${this.prefix}settingcountry`:
                    this.settingCountry();
                    break;
                case `${this.prefix}leavecountry`:
                    this.leaveCountry();
                    break;
                case `${this.prefix}kill`:
                    this.kill();
                    break;
                case `${this.prefix}countrylist`:
                    this.countryList();
                    break;
                case `${this.prefix}chome`:
                    this.chome();
                    break;
                default:
                    this.sender.sendMessage({ translate: `command.unknown.error`, with: command });
            }
        });
    };

    Money() {
        this.sender.sendMessage({ translate: `command.money.result.message`, with: `${config.MoneyName} ${this.playerData.money}` });
    };

    setup() {
        system.runTimeout(() => {
            if (!this.sender.isOp()) {
                this.sender.sendMessage({ translate: `command.permission.error` });
                return;
            }
            this.sender.sendMessage({ translate: `system.setup.complete` });
            this.sender.addTag("mc_admin");
            world.setDynamicProperty(`start`, `true`)
            return;
        }, 1);
    };

    sendMoney(args) {
        if (args.length < 2 || isNaN(args[0]) || !args[1]) {
            this.sender.sendMessage({ translate: `command.sendmoney.error.name`, with: config.prefix });
            return;
        }

        const amount = Number(args[0]);
        const targetName = args[1];
        /**
         * @type {Player}
         */
        const targetPlayer = world.getDimension(this.sender.dimension.id).getEntities({ type: "minecraft:player", name: targetName })[0];

        if (!targetPlayer) {
            this.sender.sendMessage({ translate: `command.error.notarget.this.dimension` });
            return;
        };
        if (amount < 1) {
            this.sender.sendMessage({ translate: `command.error.canuse.number.more`, with: `1` });
            return;
        };
        if (this.playerData.money < amount) {
            this.sender.sendMessage({ translate: `command.error.trysend.moremoney.youhave`, with: `${this.playerData.money}` });
            return;
        };
        const targetData = GetAndParsePropertyData(`player_${targetPlayer.id}`);
        targetData.money += Math.floor(amount);
        this.playerData.money -= Math.floor(amount);
        StringifyAndSavePropertyData(`player_${targetPlayer.id}`, targetData);
        StringifyAndSavePropertyData(`player_${this.sender.id}`, this.playerData);
        this.sender.sendMessage({ translate: `command.sendmoney.result.sender`, with: [targetName, `${config.MoneyName} ${Math.floor(amount)}`] });
        targetPlayer.sendMessage({ translate: `command.sendmoney.result.receiver`, with: [this.sender.name, `${config.MoneyName} ${Math.floor(amount)}`] });
    };

    checkChunk() {
        const chunkData = GetAndParsePropertyData(GetPlayerChunkPropertyId(this.sender));
        if (!chunkData || (!chunkData.special && !chunkData.countryId)) {
            this.sender.sendMessage({ translate: `command.checkchunk.result.wilderness`, with: { translate: `wilderness.name` } });
            return;
        } else if (chunkData.special) {
            this.sender.sendMessage({ translate: `command.checkchunk.result.special`, with: { translate: `special.name` } });
            return;
        } else {
            if (chunkData.owner) {
                this.sender.sendMessage({ translate: `command.checkchunk.result.ownerland`, with: `${chunkCountryData.owner}` });
                return;
            };
            const chunkCountryData = GetAndParsePropertyData(`country_${chunkData.countryId}`)
            this.sender.sendMessage({ translate: `command.checkchunk.result.territory`, with: `${chunkCountryData.name}` });
            return;
        };
    };

    setHome() {
        const chunkData = GetAndParsePropertyData(GetPlayerChunkPropertyId(this.sender));
        const check = CheckPermission(this.sender, `setHome`);
        if (check) {
            if (chunkData.special) {
                this.sender.sendMessage({ translate: `command.sethome.error.special`, with: { translate: `special.name` } });
                return;
            };
            this.sender.sendMessage({ translate: `command.sethome.error.thischunk` });
            return;
        };
        this.sender.sendMessage({ translate: `command.sethome.result`, with: [`${Math.floor(this.sender.location.x)} ${Math.floor(this.sender.location.y)} ${Math.floor(this.sender.location.z)}(${this.sender.dimension.id})`, config.prefix] });
        this.sender.setDynamicProperty("homePoint", `${Math.floor(this.sender.location.x)} ${Math.floor(this.sender.location.y)} ${Math.floor(this.sender.location.z)} ${this.sender.dimension.id}`);
        return;
    };

    teleportHome() {
        const homePoint = this.sender.getDynamicProperty("homePoint");
        if (!homePoint) {
            this.sender.sendMessage({ translate: `command.error.nosethome` });
            return;
        };
        let [x, y, z, dimension] = homePoint.split(" ");
        [x, y, z] = [x, y, z].map(Number);
        const check = CheckPermissionFromLocation(this.sender, x, z, dimension, `setHome`);
        if (check) {
            this.sender.sendMessage({ translate: `command.home.error.thischunk` });
            return;
        };
        this.sender.teleport({ x, y, z }, { dimension: world.getDimension(dimension.replace(`minecraft:`, ``)) });
        return;
    };

    checkHome() {
        const homePoint = this.sender.getDynamicProperty("homePoint");
        if (!homePoint) {
            this.sender.sendMessage({ translate: `command.error.nosethome` });
        } else {
            let [x, y, z, dimension] = homePoint.split(" ");
            const homePointString = `${x},${y},${z}(${dimension.replace(`minecraft:`, ``)})`
            this.sender.sendMessage({ translate: `command.checkhome.result`, with: [homePointString] });
        };
    };

    setAdminChunk() {
        if (!this.sender.hasTag("mc_admin")) {
            this.sender.sendMessage({ translate: `command.permission.error` });
            return;
        };
        const { x, z } = this.sender.location;
        this.sender.sendMessage({ translate: `command.setadminchunk.result`, with: { translate: `special.name` } });
        const chunk = GenerateChunkData(x, z, this.sender.dimension.id, undefined, undefined, 10000, true);
        StringifyAndSavePropertyData(chunk.id, chunk);
        return;
    };

    resetChunk() {
        if (!this.sender.hasTag("mc_admin")) {
            this.sender.sendMessage({ translate: `command.permission.error` });
            return;
        };
        DyProp.setDynamicProperty(GetPlayerChunkPropertyId(this.sender));
        this.sender.sendMessage({ translate: `command.resetchunk.result`, with: { translate: `wilderness.name` } });

    };

    buyChunk() {
        if (!this.playerData.country) {
            this.sender.sendMessage({ translate: `command.buychunk.error.notjoin.country` });
            return;
        };
        const chunkData = GetAndParsePropertyData(GetPlayerChunkPropertyId(this.sender));
        let chunkPrice = config.defaultChunkPrice;
        if (chunkData && chunkData.price) chunkPrice = chunkData.price;
        const cannotBuy = CheckPermission(this.sender, `buyChunk`);
        if (cannotBuy) {
            if (!chunkData) {
                this.sender.sendMessage({ translate: `command.buychunk.error.thischunk.wilderness`, with: { translate: `wilderness.name` } });
                return;
            };
            if (chunkData.special) {
                this.sender.sendMessage({ translate: `command.buychunk.error.thischunk.special`, with: { translate: `special.name` } });
                return;
            };
            if (chunkData.owner) {
                const ownerData = GetAndParsePropertyData(`player_${chunkData.owner}`);
                this.sender.sendMessage({ translate: `command.buychunk.error.thischunk.hasowner`, with: [ownerData.name] });
                return;
            };
            if (chunkData.countryId) {
                if (chunkData.countryId === this.playerData.country) {
                    this.sender.sendMessage({ translate: `command.buychunk.error.thischunk.yourcountry` });
                    return;
                };
                this.sender.sendMessage({ translate: `command.buychunk.error.thischunk.othercountry`, with: { translate: `${chunkData.countryId}` } });
                return;
            };
            this.sender.sendMessage({ translate: `command.permission.error` });
            return;
        };
        const playerCountryData = GetAndParsePropertyData(this.playerData.country);
        if (playerCountryData.resourcePoint < chunkPrice) {
            this.sender.sendMessage({ translate: `command.buychunk.error.not.enough.money`, with: [`${chunkPrice}`] });
            return;
        };

        chunkData.country = this.playerData.country;
        playerCountryData.resourcePoint -= chunkPrice;
        playerCountryData.territories.push(chunkData.id);
        StringifyAndSavePropertyData(chunkData.id, chunkData);
        StringifyAndSavePropertyData(`country_${playerCountryData.id}`, playerCountryData);
        this.sender.sendMessage({ translate: `command.buychunk.result`, with: [`${playerCountryData.resourcePoint}`] });
        return;
    };

    sellChunk() {
        if (!this.playerData.country) {
            this.sender.sendMessage({ translate: `command.sellchunk.error.notjoin.country` });
            return;
        };
        const chunkData = GetAndParsePropertyData(GetPlayerChunkPropertyId(this.sender));
        let chunkPrice = config.defaultChunkPrice / 2;
        if (chunkData && chunkData.price) chunkPrice = chunkData.price / 2;
        const cannotSell = CheckPermission(this.sender, `sellChunk`);
        if (cannotSell) {
            if (chunkData && chunkData.country && chunkData.countryId == playerData.country) {
                this.sender.sendMessage({ translate: `command.permission.error` });
            };
            this.sender.sendMessage({ translate: `command.sellchunk.error.thischunk.notterritory` })
            return;
        };
        const playerCountryData = GetAndParsePropertyData(this.playerData.country);
        if (playerCountryData.resourcePoint < chunkPrice) {
            this.sender.sendMessage({ translate: `command.buychunk.error.not.enough.money`, with: [`${chunkPrice}`] });
            return;
        };

        chunkData.country = this.playerData.country;
        playerCountryData.resourcePoint += chunkPrice;
        playerCountryData.territories.splice(playerCountryData.territories.indexOf(chunkData.id), 1);
        StringifyAndSavePropertyData(chunkData.id, chunkData);
        StringifyAndSavePropertyData(`country_${playerCountryData.id}`, playerCountryData);
        this.sender.sendMessage({ translate: `command.sellchunk.result`, with: [`${playerCountryData.resourcePoint}`] });
        return;
    };

    sendHelp() {
        /** 
         * @type {Array{}}
         */
        const helpMessage = [
            { text: `§a--------------------------\n` },
            { translate: `command.help.money` },
            { translate: `command.help.setup` },
            { translate: `command.help.msend` },
            { translate: `command.help.checkchunk` },
            { translate: `command.help.sethome` },
            { translate: `command.help.home` },
            { translate: `command.help.checkhome` },
            { translate: `command.help.adminchunk` },
            { translate: `command.help.resetchunk`, with: { translate: `special.name` } },
            { translate: `command.help.buychunk` },
            { translate: `command.help.sellchunk` },
            { translate: `command.help.makecountry` },
            { translate: `command.help.settingcountry` },
            { translate: `command.help.leavecountry` },
            { translate: `command.help.kill` },
            { translate: `command.help.countrylist` },
            { translate: `command.help.joincountry` },
            { translate: `command.help.chome` },
            { text: `§a--------------------------` },
        ];
        this.sender.sendMessage(helpMessage);
    };

    makeCountry() {
        if (this.playerData.country) {
            this.sender.sendMessage({ translate: `command.makecountry.error.belong.country` });
            return;
        };
        MakeCountryForm(this.sender);
        return;
    };

    settingCountry() {
    };

    leaveCountry() {
    };
    kill() {
        this.sender.runCommand(`kill @s`);
        return;
    };
    countryList() {
    };

    joinCountry() {
    };

    chome() {
        if (!this.playerData.country) {
            this.sender.sendMessage({ translate: `command.chome.error.notjoin.country` });
            return;
        };
        const countryData = GetAndParsePropertyData(`country_${this.playerData.country}`)
        if (!countryData.spawn) {
            return;
        };
        this.sender.teleport(countryData.spawn.location,{dimension: world.getDimension(countryData.spawn.dimension)});
        this.sender.sendMessage({translate: `command.chome.result`})
        return;
    };
};

world.beforeEvents.chatSend.subscribe(event => {
    const chatHandler = new ChatHandler(event);
    if (chatHandler.isCommand()) {
        chatHandler.handleCommand();
    } else {
        chatHandler.handleChat();
    };
});