import {
    CommandPermissionLevel,
    CustomCommandParamType,
    Player,
    system
} from "@minecraft/server";
import jobs_config from "../../jobs_config";
import { JobLevel } from "../../lib/jobslevel";

function jobLevelExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin.sourceEntity instanceof Player)) return;

    const targets = args[0]; // Player[]
    const job = args[1];     // string
    const xpOrLv = args[2];  // "xp" | "lv"
    const action = args[3];  // "add" | "remove" | "set"
    const value = Number(args[4]);

    if (Number.isNaN(value)) return;

    for (const player of targets) {
        const jobManager = new JobLevel(player, job);

        if (xpOrLv === "xp") {
            const current = jobManager.getXp();

            switch (action) {
                case "add":
                    jobManager.addXp(value);
                    break;
                case "remove":
                    jobManager.setXp(Math.max(0, current - value));
                    break;
                case "set":
                    jobManager.setXp(Math.max(0, value));
                    break;
            }
        }

        if (xpOrLv === "lv") {
            const current = jobManager.getLevel();

            switch (action) {
                case "add":
                    jobManager.setLevel(current + value);
                    break;
                case "remove":
                    jobManager.setLevel(Math.max(1, current - value));
                    break;
                case "set":
                    jobManager.setLevel(Math.max(1, value));
                    break;
            }
        }
    }
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum(
        "makecountry:job",
        jobs_config.jobsList.map(j => j.id)
    );

    event.customCommandRegistry.registerEnum(
        "makecountry:xporlv",
        ["xp", "lv"]
    );

    event.customCommandRegistry.registerEnum(
        "makecountry:jobleveltype",
        ["add", "remove", "set"]
    );

    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:joblevel",
            description: "command.help.joblevel.message",
            permissionLevel: CommandPermissionLevel.Admin,
            mandatoryParameters: [
                { name: "selector", type: CustomCommandParamType.PlayerSelector },
                { name: "job", type: CustomCommandParamType.Enum, enumName: "makecountry:job" },
                { name: "target", type: CustomCommandParamType.Enum, enumName: "makecountry:xporlv" },
                { name: "action", type: CustomCommandParamType.Enum, enumName: "makecountry:jobleveltype" },
                { name: "value", type: CustomCommandParamType.Integer }
            ]
        },
        (origin, ...args) => {
            system.run(() => jobLevelExecuter(origin, args));
        }
    );
});
