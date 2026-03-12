import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../api/dyp.js";
import { GetAndParsePropertyData, GetPlayerChunkPropertyId } from "../util.js";

/**
 * 
 * @param {Player} player 
 * @returns 
 */
export function MapApp(player: any) {
    const playerDataBase = new DynamicProperties("player");
    const countryDataBase = new DynamicProperties("country");

    const rawData = playerDataBase.get(`player_${player.id}`);
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const playerData = JSON.parse(rawData);
    // @ts-ignore TS(2345): Argument of type 'DynamicProperties' is not assign... Remove this comment to see the full error message
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`, countryDataBase);

    const chunkDataBase = new DynamicProperties("chunk");
    const playerCurrentChunk = GetPlayerChunkPropertyId(player);
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
            // @ts-ignore TS(2345): Argument of type 'DynamicProperties' is not assign... Remove this comment to see the full error message
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
    player.sendMessage(`§c----------------------------------------------------\n${result.join(`\n`)}\n§c----------------------------------------------------`);
    player.teleport(player.location, { rotation: { x: 0, y: -90 } });
    return;
}