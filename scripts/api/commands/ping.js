import { system, Player, CommandPermissionLevel } from "@minecraft/server";
import { MessageFormData, ActionFormData, uiManager } from "@minecraft/server-ui";

async function pingExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    await system.waitTicks(1);

    new MessageFormData().title(" ").body("閉じないでください\n計測が終了したら自動で閉じます").show(sender);

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
async function measurePing(player) {
    const startTime = Date.now();
    const form = new ActionFormData().title("").body("");

    await form.show(player)

    const endTime = Date.now();
    const ping = endTime - startTime;

    player.sendMessage(`Pong! ${ping - 20}ms`);
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:ping',
            description: 'command.help.ping.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                pingExecuter(origin, args);
            })
        })
    )
});