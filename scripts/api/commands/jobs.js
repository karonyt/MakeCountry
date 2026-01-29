import { CommandPermissionLevel, Player, system, world } from "@minecraft/server";
import jobs_config from "../../jobs_config";
import { jobsForm } from "../../lib/jobs";

function jobsExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    if (!jobs_config.validity) {
        sender.sendMessage({ translate: `command.error.jobs.novalidity` });
        return;
    };
    jobsForm(sender);
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:jobs',
            description: 'command.help.jobs.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                jobsExecuter(origin, args);
            })
        })
    )
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:job',
            description: 'command.help.jobs.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                jobsExecuter(origin, args);
            })
        })
    )
});