import { CommandPermissionLevel, Player, system, world } from "@minecraft/server";

function itemIdExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    const container = sender.getComponent(`inventory`).container;
    const item = container.getItem(sender.selectedSlotIndex);
    if (item) {
        sender.sendMessage(`§aID: ${item.typeId}`)
    };
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:itemid',
            description: 'command.help.itemid.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                itemIdExecuter(origin, args);
            })
        })
    )
});