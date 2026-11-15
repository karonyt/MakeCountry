import { Player, world } from "@minecraft/server";
import { allowedColor, supporterBadge, supporterOf } from "@/domain/player/supporter-badge.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { GetAndParsePropertyData } from "@/shared/utils/minecraft.js";
import config from "@/config/server.js";
import { playerHandler } from "@/shared/events/make-country-events.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { isPlayerMuted } from "@/domain/chat/mute.js";
import { getGroupChatRecipients } from "@/domain/player/group-chat.js";
import { getPlayerDataById } from "@/domain/player/marriage.js";
import { getFederationMemberIds, isFederationActive, normalizeFederationData } from "@/domain/country/relationships/federation.js";
import { notifyDiscordChat } from "@/features/discord-mcbe/index.js";

import { initializeChatTranslation, sendChatBatch, type ChatRecipient, type ChatOutput } from "./translation/index.js";

initializeChatTranslation(config.world, 'makecountry');

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
        const chatType = this.event.targets !== undefined ? "direct" : this.sender.getDynamicProperty(`chatType`) || `general`;
        const senderName: string = this.sender.name;
        const deliveries: ChatRecipient[] = [];
        const send = (player: Player, format: (body: string) => ChatOutput) => deliveries.push({ player, format });
        const playerDataBase = new DynamicProperties("player");
        let landId = this.playerData?.country;
        let land = `chat.player.no.join.any.country`;
        let penname = ``;
        // 月額サポーターの印 (★)。サポーターでなければ空
        const badge = supporterBadge(this.sender.name);
        // 発言の文字色 (シルバー以上が選べる)。読む側が「色を消す」にしていれば白のまま
        const chatColor = allowedColor(supporterOf(this.sender.name)?.tier, this.sender.getDynamicProperty(`supporterChatColor`)) ?? `§f`;
        const colorFor = (viewer: any) => (chatColor !== `§f` && viewer.getDynamicProperty(`hideChatColors`) === `true` ? `§f` : chatColor);
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
            case "direct": {
                for (const player of [this.sender, ...this.event.targets]) {
                    if (!isPlayerMuted(player, senderName)) {
                        send(player, (body) => `§8[DM] §7${senderName}§f: ${body}`);
                    }
                }
                break;
            }
            case `general`: {
                for (const p of world.getPlayers()) {
                    if (p.getDynamicProperty('isMuteGeneralChat') != 'true' && !isPlayerMuted(p, this.sender.name)) {
                        send(p, (body) => [{ text: `[§${this.playerCountryData?.color ?? `a`}` }, { translate: land }, { text: `${federationNameInChat}${penname}§r] §7${badge}${senderName}§f: ${colorFor(p)}${body}` }]);
                    }
                }
                // 全体チャットだけを discord-mcbe 経由で Discord に流す。未所属の国名は翻訳キーなので、設定の文字列に置き換える
                notifyDiscordChat(this.sender, this.message, {
                    namePrefix: `[§${this.playerCountryData?.color ?? `a`}${landId ? land : config.discordNoCountryName}${federationNameInChat}${penname}§r] §7${badge}`,
                    messagePrefix: chatColor !== `§f` ? chatColor : undefined,
                });
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
                            send(player, (body) => [{ text: `[§aCC§r] §7${badge}${senderName}§f: §a${body}` }]);
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
                            send(player, (body) => [{ text: `[§2AC§r] §7${badge}${senderName}§f: §a${body}` }]);
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
                            send(player, (body) => [{ text: `[§9FDC§r] §7${badge}${senderName}§f: §a${body}` }]);
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
                            send(player, (body) => [{ text: `[§6FC§r] §7${badge}${senderName}§f: §a${body}` }]);
                        }
                    }
                }
                break;
            }
            case `local`: {
                const players = this.sender.dimension.getPlayers({ location: this.sender.location, maxDistance: 100 });
                for (const player of players) {
                    if (player.getDynamicProperty('isMuteLocalChat') != 'true' && !isPlayerMuted(player, this.sender.name)) {
                        send(player, (body) => [{ text: `[§sLC§r] §7${badge}${senderName}§f: ${colorFor(player)}${body}` }]);
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
                        send(player, (body) => ({ translate: "chat.group.format", with: [groupResult.groupName, senderName, body] }));
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
                        send(player, (body) => ({ translate: "chat.spouse.format", with: [senderName, body] }));
                    }
                }
                break;
            }
        }
        sendChatBatch(this.message, deliveries, this.sender.id);
    }
}

world.beforeEvents.chatSend.subscribe(event => {
    const chatHandler = new ChatHandler(event);
    chatHandler.handleChat();
});
