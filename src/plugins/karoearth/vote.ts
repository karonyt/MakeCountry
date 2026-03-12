import { DynamicProperties } from "../../api/dyp.js";
import { hasJoinedInPeriodWithinDailyRetention } from "../../api/player/playtime.js";
import config from "../../config.js";
import { Player, system, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";

world.afterEvents.playerSpawn.subscribe((ev) => {
    if (config.world != "karoearth") return;
    const { player, initialSpawn } = ev;
    if (!initialSpawn) return;

    const joined = hasJoinedInPeriodWithinDailyRetention(
        player.id,
        "2026-02-01",
        "2026-02-25"
    );
    if (joined && !player.hasTag("vote-20260226")) {
        VoteMainForm(player);
    }
});

function VoteMainForm(player: Player) {
    const form = new ActionFormData();
    form.title({ translate: "vote.form.title" });
    form.body({ translate: "vote.form.body" });
    form.button({ translate: "vote.form.button.open" });
    //@ts-ignore
    form.show(player).then((rs) => {
        if (rs.canceled) {
            system.runTimeout(() => VoteMainForm(player), 10);
            return;
        }
        VoteSelectForm(player);
    });
}

function VoteSelectForm(player: Player) {
    const form = new ModalFormData();
    form.title({ translate: "vote.form.title" });
    form.label({ translate: "vote.select.label" });
    form.textField({ translate: "vote.select.input" }, { translate: "vote.select.placeholder" });

    //@ts-ignore
    form.show(player).then((rs) => {
        if (rs.canceled) {
            system.runTimeout(() => VoteSelectForm(player), 10);
            return;
        }
        if (!rs.formValues || !rs.formValues[1]) return;
        if (typeof rs.formValues[1] !== "string") return;

        const input = rs.formValues[1] as string;
        if (input !== "1" && input !== "2") {
            player.sendMessage({ translate: "vote.error.invalid_input" });
            system.runTimeout(() => VoteSelectForm(player), 10);
            return;
        }
        if (player.hasTag("vote-20260226")) return;

        const voteDB = new DynamicProperties("vote-20260226");
        const currentData = voteDB.get("votes") || "{}";
        const parsedData = JSON.parse(currentData) as Record<string, { name: string; vote: string }>;

        parsedData[player.id] = { name: player.name, vote: input };
        voteDB.set("votes", JSON.stringify(parsedData));

        player.addTag("vote-20260226");
        player.sendMessage({ translate: "vote.success" });
    });
}

export function ShowVoteResults(admin: Player) {
    const voteDB = new DynamicProperties("vote-20260226");
    const currentData = voteDB.get("votes") || "{}";
    const parsedData = JSON.parse(currentData) as Record<string, { name: string; vote: string }>;

    let yesCount = 0;
    let noCount = 0;
    const body: any[] = [
        { translate: "vote.result.header" },
        { text: "\n" }
    ];

    for (const key in parsedData) {
        const { name, vote } = parsedData[key];
        body.push({ text: "・" });
        body.push({ text: `${name}: ` });
        body.push({ translate: vote === "1" ? "vote.result.choice.yes" : "vote.result.choice.no" });
        body.push({ text: "\n" });
        if (vote === "1") yesCount++;
        else if (vote === "2") noCount++;
    }

    body.push({ text: "\n" });
    body.push({ translate: "vote.result.summary", with: [`${yesCount}`, `${noCount}`] });
    admin.sendMessage({ rawtext: body });
}

system.afterEvents.scriptEventReceive.subscribe((ev) => {
    if (ev.id == "vote:result") {
        const player = ev.sourceEntity as Player;
        ShowVoteResults(player);
    }
});
