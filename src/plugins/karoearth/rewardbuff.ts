import { world } from "@minecraft/server";
import { sendEvent } from "./server_net.js";
import { RewardBuff } from "../../api/rewardbuff.js";
import config from "../../config.js";

const serverId = config.world.replace('karo', '');

export function boost(data: any) {
    if (data.server != serverId) return;
    const buff = new RewardBuff();
    buff.addBuff(data.job, Math.floor(((data.odds * 0.2) + 1) * 10) / 10, data.time * 60);
    world.sendMessage(`§l§7[RewardBuff]\n§f${data.user}§r§fが§a${data.job}§fの職業報酬を§a${data.time}§f時間、§a${Math.floor((data.odds * 0.2) * 10) / 10}倍§f増加させた!!`);
    sendEvent({
        type: 'boost-complete',
        data: {
            server: serverId,
            job: data.job,
            user: data.user,
            time: data.time,
            odds: data.odds
        }
    })
}