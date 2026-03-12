import { CommandPermissionLevel, CustomCommandParamType, ItemStack, Player, system, world } from "@minecraft/server";
import config from "../../config.js";
import { addCompeByItemStack } from "../player/compensation.js";

function addCompensationFromItemStackSelectorExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    const targetPlayer = args[0][0];

    if (!targetPlayer) {
        sender.sendMessage({ translate: `command.error.notarget.this.dimension` });
        return;
    };

    const container = sender.getComponent(`inventory`).container;
    /**
     * @type {ItemStack}
     */
    const item = container.getItem(sender.selectedSlotIndex);
    if (item) {
        addCompeByItemStack(targetPlayer.id, item, args[1]);
        container.setItem(sender.selectedSlotIndex);
    };
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:addcompensationfromitemstackselector',
            description: 'command.help.addcompensationfromitemstackselector.message',
            permissionLevel: CommandPermissionLevel.Admin,
            mandatoryParameters: [{ name: 'player', type: CustomCommandParamType.PlayerSelector }, { name: 'onlyContents', type: CustomCommandParamType.Boolean }]
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                addCompensationFromItemStackSelectorExecuter(origin, args);
            })
        })
    )
});