import { CommandPermissionLevel, CustomCommandParamType, Player, system } from "@minecraft/server";
import { CountryManager } from "../country/country";
import { DynamicProperties } from "../dyp";

function nationalTierLevelExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    const countryManager = new CountryManager(args[0]);

    if (!countryManager.isVaildProperty) {
        sender.sendMessage({ translate: 'command.error.not.exist.country' });
        return;
    };
    const countryData = countryManager.countryData;

    let message;

    switch (args[1]) {
        case 'add': {
            countryData.lv = countryData.lv + args[2];
            message = { translate: 'command.nationaltierlevel.result.add', with: [`${countryData.name}§r§a(ID: ${countryData.id})`, `${args[2]}`] };
            break;
        };
        case 'set': {
            countryData.lv = args[2];
            message = { translate: 'command.nationaltierlevel.result.set', with: [`${countryData.name}§r§a(ID: ${countryData.id})`, `${args[2]}`] };
            break;
        };
    };

    const countryDataBase = new DynamicProperties('country');
    countryDataBase.set(`country_${countryManager.id}`, countryData);
    sender.sendMessage(message);
    return;
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum('makecountry:nationaltierlevel_type', [
        'add',
        'set'
    ]);
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:nationaltierlevel',
            description: 'command.help.nationaltierlevel.message',
            permissionLevel: CommandPermissionLevel.Admin,
            mandatoryParameters: [
                { name: "country", type: CustomCommandParamType.Float },
                { name: "type", type: CustomCommandParamType.Enum, enumName: 'makecountry:nationaltierlevel_type' },
                { name: "level", type: CustomCommandParamType.Float },
            ]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                nationalTierLevelExecuter(origin, args)
            })
        })
    )
});