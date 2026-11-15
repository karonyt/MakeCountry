import { CommandPermissionLevel, CustomCommandParamType, Player, system } from "@minecraft/server";
import { GetPlayerChunkPropertyId } from "@/shared/utils/minecraft.js";
import { groupSetPermission, LAND_PERMISSIONS, plotSetPermission } from "@/domain/country/plot-service.js";

/**
 * /plotperm <権限> <on|off> ／ /pgperm <グループ> <権限> <on|off>
 *
 * /plot perm と /plotgroup perm は値が自由入力 (名前や値段にも使う枠) なので、権限の名前が入力補完に出ない。
 * こちらは権限と on/off を enum にして、打っている途中に候補が出るようにした別の入口 (中身は同じ関数)。
 */
const STATES = ["on", "off"];

function reply(origin: any, work: (player: Player) => { message: string }) {
    system.run(() => {
        const player = origin?.sourceEntity;
        if (!(player instanceof Player)) return;
        try {
            player.sendMessage(work(player).message);
        } catch (error) {
            player.sendMessage("§c[プロット] 処理に失敗しました。少し待ってからお試しください。");
            console.warn(`[plotperm] failed: ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
        }
    });
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum("makecountry:landpermission", [...LAND_PERMISSIONS]);
    event.customCommandRegistry.registerEnum("makecountry:onoff", STATES);

    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:plotperm",
            description: "いま居るプロットの権限を 1 つ切り替えます (/plot perm と同じ。候補が出ます)",
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [
                { name: "permission", type: CustomCommandParamType.Enum, enumName: "makecountry:landpermission" },
                { name: "state", type: CustomCommandParamType.Enum, enumName: "makecountry:onoff" },
            ],
        },
        // @ts-ignore TS(2345): registerCommand の型が origin を受ける形と合わない
        ((origin: any, permission: string, state: string) => {
            reply(origin, (player) => plotSetPermission(player, GetPlayerChunkPropertyId(player), String(permission), state === "on"));
        }),
    );

    for (const name of ["makecountry:plotgroupperm", "makecountry:pgperm"]) {
        event.customCommandRegistry.registerCommand(
            {
                name,
                description: "プロットグループの権限を 1 つ切り替えます (/plotgroup perm と同じ。候補が出ます)",
                permissionLevel: CommandPermissionLevel.Any,
                mandatoryParameters: [
                    { name: "group", type: CustomCommandParamType.String },
                    { name: "permission", type: CustomCommandParamType.Enum, enumName: "makecountry:landpermission" },
                    { name: "state", type: CustomCommandParamType.Enum, enumName: "makecountry:onoff" },
                ],
            },
            // @ts-ignore TS(2345): registerCommand の型が origin を受ける形と合わない
            ((origin: any, group: string, permission: string, state: string) => {
                reply(origin, (player) => groupSetPermission(player, String(group), String(permission), state === "on"));
            }),
        );
    }
});
