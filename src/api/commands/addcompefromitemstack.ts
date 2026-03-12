import { CommandPermissionLevel, CustomCommandParamType, ItemStack, Player, system, world } from "@minecraft/server";
import config from "../../config.js";
import { addCompeByItemStack } from "../player/compensation.js";

function addCompensationFromItemStackExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    const container = sender.getComponent(`inventory`).container;
    /**
     * @type {ItemStack}
     */
    const item = container.getItem(sender.selectedSlotIndex);
    if (item) {
        addCompeByItemStack(args[0], item, args[1]);
        container.setItem(sender.selectedSlotIndex);
    };
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:addcompensationfromitemstack',
            description: 'command.help.addcompensationfromitemstack.message',
            permissionLevel: CommandPermissionLevel.Admin,
            mandatoryParameters: [{ name: 'userId', type: CustomCommandParamType.String }, { name: 'onlyContents', type: CustomCommandParamType.Boolean }]
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                addCompensationFromItemStackExecuter(origin, args);
            })
        })
    )
});