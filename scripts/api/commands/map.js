import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import { GetAndParsePropertyData, GetPlayerChunkPropertyId } from "../../lib/util";

function mapExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    const playerDataBase = new DynamicProperties("player");
    const countryDataBase = new DynamicProperties("country");

    const rawData = playerDataBase.get(`player_${sender.id}`);
    const playerData = JSON.parse(rawData);
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`, countryDataBase);

    const chunkDataBase = new DynamicProperties("chunk");
    const playerCurrentChunk = GetPlayerChunkPropertyId(sender);
    const alliance = playerCountryData?.alliance ?? [];
    const hostility = playerCountryData?.hostility ?? [];
    const friendly = playerCountryData?.friendly ?? [];
    let [chunk, currentX, currentZ, dimension] = playerCurrentChunk.split(`_`);
    let currentXNum = Number(currentX);
    let currentZNum = Number(currentZ);
    let playerCountryId = playerData?.country ?? -10;
    let result = [];
    for (let i = 10; i > -11; i--) {
        let jResult = [];
        for (let j = -10; j < 11; j++) {
            let chunkX = currentXNum + i;
            let chunkZ = currentZNum + j;
            let chunkId = `${chunk}_${chunkX}_${chunkZ}_${dimension}`;
            let chunkData = GetAndParsePropertyData(`${chunkId}`, chunkDataBase);
            let colorCode = "f"
            if (chunkData?.countryId) {
                colorCode = "e";
                if (chunkData?.countryId === playerCountryId && playerCountryId != 0) {
                    colorCode = "a";
                };
                if (alliance.includes(chunkData?.countryId)) {
                    colorCode = "b";
                };
                if (hostility.includes(chunkData?.countryId)) {
                    colorCode = "c";
                };
                if (friendly.includes(chunkData?.countryId)) {
                    colorCode = "d";
                };
            };
            if (i === 0 && j === 0) {
                colorCode = "4"
            };
            jResult.push(`§${colorCode}O`);
        };
        result.push(jResult.join(``));
    };
    sender.sendMessage(`§c----------------------------------------------------\n${result.join(`\n`)}\n§c----------------------------------------------------`);
    sender.teleport(sender.location, { rotation: { x: 0, y: -90 } });
    return;
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:map',
            description: 'command.help.map.message',
            permissionLevel: CommandPermissionLevel.Any,
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                mapExecuter(origin, args);
            })
        })
    )
});