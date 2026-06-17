import { CommandPermissionLevel, Player, system } from "@minecraft/server";

function checkBiomeExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    /**
     * @type {Player}
     */
    const sender = origin.sourceEntity;
    const biome = sender.dimension.getBiome(sender.location);

    sender.sendMessage(`§a${biome.id}(${biome.getTags().join(',')})`);
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:checkbiome',
            description: 'command.help.checkbiome.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                checkBiomeExecuter(origin, args);
            })
        })
    )
});

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:cb',
            description: 'command.help.checkbiome.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                checkBiomeExecuter(origin, args);
            })
        })
    )
});