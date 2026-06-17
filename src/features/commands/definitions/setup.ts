import { CommandPermissionLevel, Player, PlayerPermissionLevel, system, world } from "@minecraft/server";

function setUpExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    sender.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `system.setup.complete` }] });
    sender.addTag("mc_admin");
    world.setDynamicProperty(`start2`, `true`);
    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    world.getPlayers()[0].runCommand('gamerule recipesunlock true');
    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    world.getPlayers()[0].runCommand('gamerule dolimitedcrafting true');
    return;
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:setup',
            description: 'command.help.setup.message',
            permissionLevel: CommandPermissionLevel.Admin
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                setUpExecuter(origin, args);
            })
        })
    )
});