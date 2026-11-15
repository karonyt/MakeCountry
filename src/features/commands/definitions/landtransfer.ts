import { CommandPermissionLevel, CustomCommandParamType, Player, system } from "@minecraft/server";
import { confirmLandTransferSend, landTransferForm, showLandTransferRequest } from "@/features/forms/country/land-transfer-form.js";
import { closeLandTransfer, listLandTransfers, transferMessage as t, reportTransferError } from "@/domain/country/land-transfer.js";

system.beforeEvents.startup.subscribe(event => {
    event.customCommandRegistry.registerEnum("makecountry:land_transfer_action", ["help", "list", "send", "info", "accept", "reject", "cancel"]);
    event.customCommandRegistry.registerCommand({
        name: "makecountry:landtransfer", description: "land.transfer.command", permissionLevel: CommandPermissionLevel.Any,
        optionalParameters: [
            { name: "makecountry:land_transfer_action", type: CustomCommandParamType.Enum },
            { name: "group_or_request", type: CustomCommandParamType.String },
            { name: "country_id", type: CustomCommandParamType.String },
        ],
    }, (origin, action?: string, value?: string, countryId?: string) => {
        system.run(() => {
            const player = origin.sourceEntity;
            if (!(player instanceof Player)) return;
            try {
                switch (action) {
                    case undefined: void landTransferForm(player); return;
                    case "help": player.sendMessage(t("help")); return;
                    case "list": {
                        const pending = listLandTransfers(player);
                        player.sendMessage(t("list", [String(pending.length)]));
                        for (const request of pending) player.sendMessage(t("list.entry", [request.id, request.sourceName, request.targetName, request.groupName, String(request.chunks.length)]));
                        return;
                    }
                    case "send":
                        if (!value || !countryId || !/^\d+$/.test(countryId)) { player.sendMessage(t("help")); return; }
                        void confirmLandTransferSend(player, value, Number(countryId)); return;
                    case "info": case "accept":
                        if (value) void showLandTransferRequest(player, value); else player.sendMessage(t("help"));
                        return;
                    case "reject": case "cancel":
                        if (!value) { player.sendMessage(t("help")); return; }
                        closeLandTransfer(player, value, action === "reject" ? "rejected" : "cancelled");
                        player.sendMessage(t(action === "reject" ? "rejected" : "cancelled", [value])); return;
                }
            } catch (error) { reportTransferError(player, error); }
        });
        return undefined;
    });
});
