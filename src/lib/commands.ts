import { Player, world } from "@minecraft/server";
import { DynamicProperties } from "../api/dyp.js";
import { GetAndParsePropertyData } from "./util.js";
import config from "../config.js";
import { playerHandler } from "../api/api.js";
import { CountryManager } from "../api/country/country.js";

const GENERAL_CHAT_COOLDOWN = 3000;

class ChatHandler {
    event: any;
    message: any;
    playerCountryData: any;
    playerCountryManager: any;
    playerData: any;
    sender: any;
    constructor(event: any) {
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
        const playerDataBase = new DynamicProperties("player");
        // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
        this.playerData = JSON.parse(playerDataBase.get(`player_${this.sender.id}`));
        this.playerCountryManager = this.playerData?.country ? new CountryManager(this.playerData.country) : undefined;
        this.playerCountryData = this.playerData?.country ? this.playerCountryManager.countryData : undefined;
    }

    handleChat() {
        const chatType = this.sender.getDynamicProperty(`chatType`) || `general`;
        let landId = this.playerData?.country;
        let land = `chat.player.no.join.any.country`;
        let penname = ``;
        if (config.pennameEnable) {
            let penNameBefore = this.sender.getDynamicProperty(`pennameBefore`) ?? config.initialPennameBefore;
            let penNameAfter = this.sender.getDynamicProperty(`pennameAfter`) ?? config.initialPennameAfter;
            penname = `§r|${penNameBefore}§r${penNameAfter}`;
        };
        if (landId) land = this.playerCountryData?.name;
        /*if (!/^[a-z]$/.test(this.message.charAt(0))) {
            this.event.cancel = true;
            world.sendMessage([{ text: `<§${this.playerCountryData?.color ?? `a`}` }, { translate: land }, { text: ` §r| ${this.sender.name}> ${this.message}` }]);
        };*/
        this.event.cancel = true;
        const eventData = {
            player: this.sender,
            message: this.message,
            type: chatType,
            cancel: false
        };
        const isCanceled = playerHandler.beforeEvents.chat.emit(eventData);
        if (isCanceled) return;
        if (chatType === 'general') {
            const now = Date.now();
            const lastChat = this.sender.getDynamicProperty('lastGeneralChatTime') ?? 0;

            if (now - lastChat < GENERAL_CHAT_COOLDOWN) {
                this.event.cancel = true;
                this.sender.sendMessage({
                    translate: 'generalchat.rate.limit', with: [`${GENERAL_CHAT_COOLDOWN / 1000}`]
                });
                return;
            }

            this.sender.setDynamicProperty('lastGeneralChatTime', now);
        }

        // @ts-ignore TS(2322): Type 'undefined' is not assignable to type 'boolea... Remove this comment to see the full error message
        eventData.cancel = undefined;
        playerHandler.afterEvents.chat.emit(eventData);
        const playerDataBase = new DynamicProperties("player");

        switch (chatType) {
            case `general`: {
                for (const p of world.getPlayers()) {
                    if (p.getDynamicProperty('isMuteGeneralChat') != 'true') {
                        p.sendMessage([{ text: `[§${this.playerCountryData?.color ?? `a`}` }, { translate: land }, { text: `${penname}§r] §7${this.sender.name}§f: ${this.message}` }]);
                    };
                };
                break;
            };
            case `country`: {
                // @ts-ignore TS(2339): Property 'country' does not exist on type 'string'... Remove this comment to see the full error message
                if (!land || land.country < 1) {
                    this.sender.sendMessage({ rawtext: [{ rawtext: `cannnot.use.nojoin.country` }] });
                    return;
                };
                const players = world.getPlayers();
                for (const player of players) {
                    if (player.getDynamicProperty('isMuteCountryChat') != 'true') {
                        // @ts-ignore TS(2345): Argument of type 'DynamicProperties' is not assign... Remove this comment to see the full error message
                        const pData = GetAndParsePropertyData(`player_${player.id}`, playerDataBase);
                        if (pData?.country == this.playerData?.country) {
                            player.sendMessage([{ text: `[§aCC§r] §7${this.sender.name}§f: §a${this.message}` }]);
                        };
                    };
                };
                break;
            };
            case `alliance`: {
                // @ts-ignore TS(2339): Property 'country' does not exist on type 'string'... Remove this comment to see the full error message
                if (!land || land.country < 1) {
                    this.sender.sendMessage({ rawtext: [{ rawtext: `cannnot.use.nojoin.country` }] })
                    return;
                };
                const players = world.getPlayers();
                for (const player of players) {
                    if (player.getDynamicProperty('isMuteAllianceChat') != 'true') {
                        // @ts-ignore TS(2345): Argument of type 'DynamicProperties' is not assign... Remove this comment to see the full error message
                        const pData = GetAndParsePropertyData(`player_${player.id}`, playerDataBase);
                        const alliance = this.playerCountryData.alliance ?? [];
                        if (alliance.includes(pData?.country ?? 0) || pData?.country == this.playerData.country) {
                            player.sendMessage([{ text: `[§2AC§r] §7${this.sender.name}§f: §a${this.message}` }]);
                        };
                    };
                };
                break;
            };
            case `friendly`: {
                // @ts-ignore TS(2339): Property 'country' does not exist on type 'string'... Remove this comment to see the full error message
                if (!land || land.country < 1) {
                    this.sender.sendMessage({ rawtext: [{ rawtext: `cannnot.use.nojoin.country` }] })
                    return;
                };
                const players = world.getPlayers();
                for (const player of players) {
                    if (player.getDynamicProperty('isMuteFriendlyChat') != 'true') {
                        // @ts-ignore TS(2345): Argument of type 'DynamicProperties' is not assign... Remove this comment to see the full error message
                        const pData = GetAndParsePropertyData(`player_${player.id}`, playerDataBase);
                        const friendly = this.playerCountryData.friendly ?? [];
                        if (friendly.includes(pData?.country ?? 0) || pData?.country == this.playerData.country) {
                            player.sendMessage([{ text: `[§6FC§r] §7${this.sender.name}§f: §a${this.message}` }]);
                        };
                    };
                };
                break;
            };
            case `local`: {
                const players = this.sender.dimension.getPlayers({ location: this.sender.location, maxDistance: 100 });
                for (const player of players) {
                    if (player.getDynamicProperty('isMuteLocalChat') != 'true') {
                        player.sendMessage([{ text: `[§sLC§r] §7${this.sender.name}§f: ${this.message}` }]);
                    };
                };
                break;
            };
        };
    }
};


world.beforeEvents.chatSend.subscribe(event => {
    const chatHandler = new ChatHandler(event);
    chatHandler.handleChat();
});
