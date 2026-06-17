import { system, world } from "@minecraft/server";
import { ActionFormData, FormCancelationReason } from "@minecraft/server-ui";
import config from "@/config/server.js";
import { KayKayApp } from "@/features/smartphone/apps/bank.js";
import { KarcariApp } from "@/features/smartphone/apps/karcari.js";
import { MapApp } from "@/features/smartphone/apps/map.js";
import { KarozonApp } from "@/features/smartphone/apps/karozon.js";
import { CountryApp } from "@/features/smartphone/apps/country.js";
import { TeleportApp } from "@/features/smartphone/apps/teleport.js";

let smartphoneId = "mc:smartphone";

world.afterEvents.itemUse.subscribe((ev) => {
    if (ev.itemStack.typeId != smartphoneId) return;
    const player = ev.source;
    SmartPhoneHomeScreen(player);
})

export function SmartPhoneHomeScreen(player: any) {
    const time = new Date();
    const form = new ActionFormData();
    form.title('§s§m§a§r§t§p§h§o§n§e');
    let m = time.getMinutes();
    form.body(`${time.getUTCHours() + config.timeDifference}:${m < 10 ? `0${m}` : m}`)
    form.button("KayKay");
    form.button("Karcari");
    form.button({ translate: "smartphone.app.map" });
    form.button("Karozon");
    form.button({ translate: "smartphone.app.country" });
    form.button({ translate: "smartphone.app.teleport" });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                system.runTimeout(() => {
                    SmartPhoneHomeScreen(player);
                }, 10)
            }
        }
        switch (rs.selection) {
            case 0: {
                KayKayApp(player);
                break;
            }
            case 1: {
                KarcariApp(player);
                break;
            }
            case 2: {
                MapApp(player);
                break;
            }
            case 3: {
                KarozonApp(player);
                break;
            }
            case 4: {
                CountryApp(player);
                break;
            }
            case 5: {
                TeleportApp(player);
                break;
            }
        }
    })
}
