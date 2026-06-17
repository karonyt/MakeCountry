import { system, Player, CommandPermissionLevel } from "@minecraft/server";
import { MessageFormData, ActionFormData, uiManager } from "@minecraft/server-ui";

async function pingExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    await system.waitTicks(1);

    new MessageFormData().title(" ").body({ translate: "ping.measure.body" }).show(sender);

    system.runTimeout(() => {
        measurePing(sender)
        system.run(() => {
            uiManager.closeAllForms(sender);
        })
    }, 3)
}

/**
 * 
 * @param { Player} player 
 * @author
 */
async function measurePing(player: any) {
    const startTime = Date.now();
    const form = new ActionFormData().title("").body("");

    await form.show(player)

    const endTime = Date.now();
    const ping = endTime - startTime;

    player.sendMessage({ translate: "ping.result", with: [`${ping - 20}`] });
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:ping',
            description: 'command.help.ping.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                pingExecuter(origin, args);
            })
        })
    )
});
