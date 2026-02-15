import { CommandPermissionLevel, Player, system } from "@minecraft/server";

function checkBiomeExecuter(origin, args) {
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
        ((origin, ...args) => {
            system.runTimeout(() => {
                checkBiomeExecuter(origin, args);
            })
        })
    )
});