import { Player, world } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { GetAndParsePropertyData } from "@/shared/utils/minecraft.js";
import config from "@/config/server.js";
import { playerHandler } from "@/shared/events/make-country-events.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { isPlayerMuted } from "@/domain/chat/mute.js";
import { getGroupChatRecipients } from "@/domain/player/group-chat.js";
import { getPlayerDataById } from "@/domain/player/marriage.js";
import { getFederationMemberIds, isFederationActive, normalizeFederationData } from "@/domain/country/relationships/federation.js";

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
        this.message = event.message;
        this.sender = event.sender;
        const playerDataBase = new DynamicProperties("player");
        this.playerData = JSON.parse(playerDataBase.get(`player_${this.sender.id}`) ?? '{}');
        this.playerCountryManager = this.playerData?.country ? new CountryManager(this.playerData.country) : undefined;
        this.playerCountryData = this.playerData?.country ? this.playerCountryManager.countryData : undefined;
    }

    handleChat() {
        const chatType = this.sender.getDynamicProperty(`chatType`) || `general`;
        const playerDataBase = new DynamicProperties("player");
        let landId = this.playerData?.country;
        let land = `chat.player.no.join.any.country`;
        let penname = ``;
        if (config.pennameEnable) {
            const penNameBefore = this.sender.getDynamicProperty(`pennameBefore`) ?? config.initialPennameBefore;
            const penNameAfter = this.sender.getDynamicProperty(`pennameAfter`) ?? config.initialPennameAfter;
            penname = `§r|${penNameBefore}§r${penNameAfter}`;
        }
        if (landId) land = this.playerCountryData?.name;
        const federationData = this.playerCountryData ? normalizeFederationData(this.playerCountryData) : undefined;
        const federationNameInChat = federationData && isFederationActive(federationData) && federationData.settings?.showInChat
            ? `§r/§9${federationData.name}`
            : ``;

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

        // @ts-ignore TS(2322)
        eventData.cancel = undefined;
        playerHandler.afterEvents.chat.emit(eventData);

        switch (chatType) {
            case `general`: {
                for (const p of world.getPlayers()) {
                    if (p.getDynamicProperty('isMuteGeneralChat') != 'true' && !isPlayerMuted(p, this.sender.name)) {
                        p.sendMessage([{ text: `[§${this.playerCountryData?.color ?? `a`}` }, { translate: land }, { text: `${federationNameInChat}${penname}§r] §7${this.sender.name}§f: ${this.message}` }]);
                    }
                }
                break;
            }
            case `country`: {
                if (!this.playerData?.country) {
                    this.sender.sendMessage({ translate: `cannnot.use.nojoin.country` });
                    return;
                }
                for (const player of world.getPlayers()) {
                    if (player.getDynamicProperty('isMuteCountryChat') != 'true' && !isPlayerMuted(player, this.sender.name)) {
                        const pData = GetAndParsePropertyData(`player_${player.id}`, playerDataBase);
                        if (pData?.country == this.playerData?.country) {
                            player.sendMessage([{ text: `[§aCC§r] §7${this.sender.name}§f: §a${this.message}` }]);
                        }
                    }
                }
                break;
            }
            case `alliance`: {
                if (!this.playerData?.country) {
                    this.sender.sendMessage({ translate: `cannnot.use.nojoin.country` });
                    return;
                }
                for (const player of world.getPlayers()) {
                    if (player.getDynamicProperty('isMuteAllianceChat') != 'true' && !isPlayerMuted(player, this.sender.name)) {
                        const pData = GetAndParsePropertyData(`player_${player.id}`, playerDataBase);
                        const alliance = this.playerCountryData.alliance ?? [];
                        if (alliance.includes(pData?.country ?? 0) || pData?.country == this.playerData.country) {
                            player.sendMessage([{ text: `[§2AC§r] §7${this.sender.name}§f: §a${this.message}` }]);
                        }
                    }
                }
                break;
            }
            case `federation`: {
                if (!this.playerData?.country) {
                    this.sender.sendMessage({ translate: `cannnot.use.nojoin.country` });
                    return;
                }
                const federation = getFederationMemberIds(this.playerCountryData);
                if (federation.length === 0) {
                    this.sender.sendMessage({ translate: `federation.no.active` });
                    this.sender.setDynamicProperty(`chatType`, `general`);
                    return;
                }
                for (const player of world.getPlayers()) {
                    if (player.getDynamicProperty('isMuteFederationChat') != 'true' && !isPlayerMuted(player, this.sender.name)) {
                        const pData = GetAndParsePropertyData(`player_${player.id}`, playerDataBase);
                        if (federation.includes(pData?.country ?? 0) || pData?.country == this.playerData.country) {
                            player.sendMessage([{ text: `[§9FDC§r] §7${this.sender.name}§f: §a${this.message}` }]);
                        }
                    }
                }
                break;
            }
            case `friendly`: {
                if (!this.playerData?.country) {
                    this.sender.sendMessage({ translate: `cannnot.use.nojoin.country` });
                    return;
                }
                for (const player of world.getPlayers()) {
                    if (player.getDynamicProperty('isMuteFriendlyChat') != 'true' && !isPlayerMuted(player, this.sender.name)) {
                        const pData = GetAndParsePropertyData(`player_${player.id}`, playerDataBase);
                        const friendly = this.playerCountryData.friendly ?? [];
                        if (friendly.includes(pData?.country ?? 0) || pData?.country == this.playerData.country) {
                            player.sendMessage([{ text: `[§6FC§r] §7${this.sender.name}§f: §a${this.message}` }]);
                        }
                    }
                }
                break;
            }
            case `local`: {
                const players = this.sender.dimension.getPlayers({ location: this.sender.location, maxDistance: 100 });
                for (const player of players) {
                    if (player.getDynamicProperty('isMuteLocalChat') != 'true' && !isPlayerMuted(player, this.sender.name)) {
                        player.sendMessage([{ text: `[§sLC§r] §7${this.sender.name}§f: ${this.message}` }]);
                    }
                }
                break;
            }
            case `group`: {
                const groupResult = getGroupChatRecipients(this.sender);
                if (groupResult.error || !groupResult.recipients) {
                    this.sender.sendMessage(groupResult.error);
                    this.sender.setDynamicProperty("chatType", "general");
                    return;
                }
                for (const player of groupResult.recipients) {
                    if (!isPlayerMuted(player, this.sender.name)) {
                        player.sendMessage({ translate: "chat.group.format", with: [groupResult.groupName, this.sender.name, this.message] });
                    }
                }
                break;
            }
            case `spouse`: {
                const senderData = getPlayerDataById(this.sender.id);
                const spouseId = senderData?.marriage?.spouseId;
                if (!spouseId) {
                    this.sender.sendMessage({ translate: "marriage.error.not_married" });
                    this.sender.setDynamicProperty("chatType", "general");
                    return;
                }
                const spouseData = getPlayerDataById(spouseId);
                const spouse = spouseData?.name ? world.getPlayers({ name: spouseData.name })[0] : undefined;
                const recipients = [this.sender];
                if (spouse) {
                    recipients.push(spouse);
                }
                for (const player of recipients) {
                    if (!isPlayerMuted(player, this.sender.name)) {
                        player.sendMessage({ translate: "chat.spouse.format", with: [this.sender.name, this.message] });
                    }
                }
                break;
            }
        }
    }
}

world.beforeEvents.chatSend.subscribe(event => {
    const chatHandler = new ChatHandler(event);
    chatHandler.handleChat();
});
