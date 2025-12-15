import { CommandPermissionLevel, CustomCommandParamType, Player, system } from "@minecraft/server";
import { DynamicProperties } from "../../api/dyp";
import { isNumber, StringifyAndSavePropertyData } from "../../lib/util";
import { GenerateChunkData } from "../../lib/land";

function adminChunkExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    const chunkDataBase = new DynamicProperties("chunk")
    if (!sender.hasTag("mc_admin")) {
        sender.sendMessage({ translate: `command.permission.error` });
        return;
    };
    if (args.length == 2) {
        const [ix, iz] = args.map(str => Math.floor(Number(str)));
        const { x, z } = sender.location;
        const chunks = getChunksInRange(Math.floor(x), Math.floor(z), ix, iz);
        if (!isNumber(ix) || !isNumber(iz)) {
            sender.sendMessage({ translate: 'command.error.coordinates.incorrect' });
            return;
        };
        if (chunks.length > 100) {
            sender.sendMessage({ translate: 'command.error.chunks.limit.toadminchunk', with: ['100'] });
            return;
        };
        for (let i = 0; i < chunks.length; i++) {
            system.runTimeout(() => {
                sender.sendMessage({ translate: `command.setadminchunk.result`, with: { rawtext: [{ translate: `special.name` }] } });
                const chunk = GenerateChunkData(chunks[i].chunkX, chunks[i].chunkZ, sender.dimension.id, undefined, undefined, 10000, true);
                StringifyAndSavePropertyData(chunk.id, chunk, chunkDataBase);
                return;
            }, i)
        }
        return;
    }
    const { x, z } = sender.location;
    sender.sendMessage({ translate: `command.setadminchunk.result`, with: { rawtext: [{ translate: `special.name` }] } });
    const chunk = GenerateChunkData(x, z, sender.dimension.id, undefined, undefined, 10000, true);
    StringifyAndSavePropertyData(chunk.id, chunk, chunkDataBase);
    return;
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:adminchunk',
            description: 'command.help.adminchunk.message',
            permissionLevel: CommandPermissionLevel.Admin,
            optionalParameters: [{ name: "x", type: CustomCommandParamType.Integer }, { name: "z", type: CustomCommandParamType.Integer }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                adminChunkExecuter(origin, args)
            })
        })
    )
});

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:adminc',
            description: 'command.help.adminchunk.message',
            permissionLevel: CommandPermissionLevel.Admin,
            optionalParameters: [{ name: "x", type: CustomCommandParamType.Integer }, { name: "z", type: CustomCommandParamType.Integer }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                adminChunkExecuter(origin, args)
            })
        })
    )
});

/**
 * 
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 * @returns {Array<{chunkX: number,chunkZ: number}>}
 * @returns 
 */
function getChunksInRange(x1, z1, x2, z2) {
    // 小さい座標を開始点にする
    let startX = Math.floor(Math.min(x1, x2) / 16);
    let endX = Math.floor(Math.max(x1, x2) / 16);
    let startZ = Math.floor(Math.min(z1, z2) / 16);
    let endZ = Math.floor(Math.max(z1, z2) / 16);

    let chunks = [];

    // 範囲内のすべてのチャンク座標を取得
    for (let cx = startX; cx <= endX; cx++) {
        for (let cz = startZ; cz <= endZ; cz++) {
            if (chunks.length > 101) return chunks;
            chunks.push({ chunkX: cx, chunkZ: cz });
        }
    }
    return chunks;
};