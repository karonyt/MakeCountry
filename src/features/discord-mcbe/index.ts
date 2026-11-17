import { Player, system, world } from "@minecraft/server";
import { IPC, PROTO } from "mcbe-ipc";
import config from "@/config/server.js";

/**
 * discord-mcbe (https://github.com/tutinoko2048/discord-mcbe) との連携。
 *
 * MakeCountry は chatSend をすべて cancel して独自に配信するため、discord-mcbe 単体では
 * チャットを検知できない。ワールド読み込み時に discord-mcbe へ登録し、Discord に流したい
 * チャットを MakeCountry 側から通知する。
 *
 * Discord から届いたチャットの表示も MakeCountry が引き受け、全体チャットをミュートしている
 * プレイヤーには表示しない。
 *
 * discord-mcbe が導入されていない場合は登録の応答が返らず、何も通知しない。
 * 仕様: https://discord-mcbe.retomc.dev/guides/addon-integration/
 */

const SOURCE = "makecountry";
const PROTOCOL_VERSION = 1;
const FEATURE_MINECRAFT_CHAT = "minecraft_chat";
/** Discord から届いたチャットを discord-mcbe の代わりに表示する機能。未対応の discord-mcbe では無視される */
const FEATURE_DISCORD_CHAT = "discord_chat";
/** 登録の応答を待つ時間 (tick)。これを過ぎたら discord-mcbe は導入されていないとみなす */
const REGISTER_TIMEOUT_TICKS = 20;

/** 送信者名と本文の前後に付ける文字列。Discord 側では色コード(§)を除いて表示される */
export interface DiscordChatFormatting {
    namePrefix?: string;
    nameSuffix?: string;
    messagePrefix?: string;
    messageSuffix?: string;
}

/** discord-mcbe がチャットの通知を受け付けているか */
let registered = false;

async function register(): Promise<void> {
    const response = await Promise.race([
        IPC.invoke(
            "dmc:register",
            PROTO.String,
            JSON.stringify({ source: SOURCE, protocol: PROTOCOL_VERSION, features: [FEATURE_MINECRAFT_CHAT, FEATURE_DISCORD_CHAT] }),
            PROTO.String,
        ),
        system.waitTicks(REGISTER_TIMEOUT_TICKS).then(() => undefined),
    ]);
    if (response === undefined) return;

    const { features } = JSON.parse(response);
    registered = Array.isArray(features) && features.includes(FEATURE_MINECRAFT_CHAT);
}

/** Discord から届いたチャットを、全体チャットをミュートしていないプレイヤーに表示する */
function showDiscordChat(json: string): void {
    const { text } = JSON.parse(json);
    if (typeof text !== "string") return;

    for (const player of world.getPlayers()) {
        if (player.getDynamicProperty("isMuteGeneralChat") != "true") player.sendMessage(text);
    }
}

if (config.discordMcbeIntegration) {
    // discord_chat を登録できた場合だけ discord-mcbe から届く
    IPC.on("dmc:discord_chat", PROTO.String, showDiscordChat);
    world.afterEvents.worldLoad.subscribe(() => {
        register().catch((error) => console.warn(`[MakeCountry] Failed to register with discord-mcbe: ${error}`));
    });
}

/**
 * チャットを discord-mcbe へ通知する。Discord に流してよいチャットだけを渡すこと。
 * discord-mcbe へ登録できていない場合は何もしない。
 * @param message 装飾を含まない本文
 */
export function notifyDiscordChat(sender: Player, message: string, formatting: DiscordChatFormatting = {}): void {
    if (!registered) return;

    IPC.send(
        "dmc:on_chat_send",
        PROTO.String,
        JSON.stringify({ source: SOURCE, playerId: sender.id, message, formatting }),
    );
}
