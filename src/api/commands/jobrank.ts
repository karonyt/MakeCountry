import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";
import { showJobRanking } from "../jobs/ranking.js";
import jobs_config from "../../jobs_config.js";

function jobRankExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    showJobRanking(sender, args[0]);
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum('makecountry:jobids', jobs_config.jobsList.map(job => job.id));
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:jobrank',
            description: 'command.help.jobrank.message',
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [
                {
                    name: 'jobId',
                    enumName: 'makecountry:jobids',
                    type: CustomCommandParamType.Enum,
                }]
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                jobRankExecuter(origin, args);
            })
        })
    )
});