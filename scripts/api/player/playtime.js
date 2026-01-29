import { system, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp";

/**
 * @type {DynamicProperties}
 */
let playTimeDB;
world.afterEvents.worldLoad.subscribe(() => {
    playTimeDB = new DynamicProperties('playtime');

    const lastPlayers = JSON.parse(playTimeDB.get('worldLoginPlayers') || '[]');
    const lastTime = Number(playTimeDB.get('worldLastTime') || Date.now().toString());
    for (const data of lastPlayers) {
        const start = data.loginTime;
        const end = lastTime;

        addPlayTimeRange(data.id, start, end);
    };
    let newData = [];
    for (const player of world.getPlayers()) {
        newData.push({ id: player.id, loginTime: Date.now() });
    };
    playTimeDB.set('worldLoginPlayers', JSON.stringify(newData));
});

system.runInterval(() => {
    playTimeDB.set('worldLastTime', Date.now().toString());
}, 20 * 60);

world.afterEvents.playerSpawn.subscribe((ev) => {
    const { player, initialSpawn } = ev;
    if (!initialSpawn) return;
    let lastPlayers = JSON.parse(playTimeDB.get('worldLoginPlayers') || '[]');
    lastPlayers = lastPlayers.filter(p => p.id != player.id);
    lastPlayers.push({ id: player.id, loginTime: Date.now() });
    playTimeDB.set('worldLoginPlayers', JSON.stringify(lastPlayers));
});

world.afterEvents.playerLeave.subscribe((ev) => {
    const { playerId } = ev;
    let lastPlayers = JSON.parse(playTimeDB.get('worldLoginPlayers') || '[]');
    const data = lastPlayers.find(p => p.id == playerId);
    if (!data) return;
    addPlayTimeRange(playerId, data.loginTime, Date.now());
    lastPlayers = lastPlayers.filter(p => p.id != playerId);
    playTimeDB.set('worldLoginPlayers', JSON.stringify(lastPlayers));
});

function addPlayTimeRange(playerId, startMs, endMs) {
    if (endMs <= startMs) return;

    const segments = splitByDay(startMs, endMs);

    for (const seg of segments) {
        // ===== total =====
        const total = JSON.parse(
            playTimeDB.get(`player_${playerId}_total`) || '0'
        );
        playTimeDB.set(
            `player_${playerId}_total`,
            total + seg.minutes
        );

        // ===== daily（45日制限）=====
        let daily = JSON.parse(
            playTimeDB.get(`player_${playerId}_daily`) || '{}'
        );

        const isNewDay = daily[seg.dateKey] === undefined;

        daily[seg.dateKey] = (daily[seg.dateKey] || 0) + seg.minutes;
        daily = pruneDailyMap(daily, 45);

        playTimeDB.set(
            `player_${playerId}_daily`,
            JSON.stringify(daily)
        );

        // ===== monthly =====
        const monthKey = getMonthKey(seg.dateKey);
        let monthly = JSON.parse(
            playTimeDB.get(`player_${playerId}_monthly`) || '{}'
        );

        if (!monthly[monthKey]) {
            monthly[monthKey] = { minutes: 0, days: 0 };
        }

        monthly[monthKey].minutes += seg.minutes;

        // その日が初めてなら days +1
        if (isNewDay) {
            monthly[monthKey].days += 1;
        }

        playTimeDB.set(
            `player_${playerId}_monthly`,
            JSON.stringify(monthly)
        );

        // ===== yearly =====
        const yearly = JSON.parse(
            playTimeDB.get(`player_${playerId}_yearly`) || '{}'
        );
        yearly[seg.yearKey] = (yearly[seg.yearKey] || 0) + seg.minutes;

        playTimeDB.set(
            `player_${playerId}_yearly`,
            JSON.stringify(yearly)
        );
    }
}

function splitByDay(startMs, endMs) {
    const result = [];
    let cur = new Date(startMs);

    while (cur.getTime() < endMs) {
        const dayStart = new Date(cur);
        dayStart.setHours(0, 0, 0, 0);

        const nextDay = new Date(dayStart);
        nextDay.setDate(nextDay.getDate() + 1);

        const segmentEnd = Math.min(nextDay.getTime(), endMs);
        const minutes = Math.floor((segmentEnd - cur.getTime()) / 1000 / 60);

        if (minutes > 0) {
            result.push({
                dateKey: dayStart.toISOString().slice(0, 10),
                yearKey: dayStart.getFullYear().toString(),
                minutes
            });
        }

        cur = new Date(segmentEnd);
    }

    return result;
}

function pruneDailyMap(daily, keepDays = 30) {
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - keepDays + 1);

    for (const dateKey of Object.keys(daily)) {
        if (new Date(dateKey) < cutoff) {
            delete daily[dateKey];
        }
    }

    return daily;
}

function getMonthKey(dateKey) {
    return dateKey.slice(0, 7);
}

export function showPlayTimeStats(player) {
    const id = player.id;

    const totalMinBase = JSON.parse(
        playTimeDB.get(`player_${id}_total`) || '0'
    );

    const daily = JSON.parse(
        playTimeDB.get(`player_${id}_daily`) || '{}'
    );

    const yearly = JSON.parse(
        playTimeDB.get(`player_${id}_yearly`) || '{}'
    );

    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10);
    const monthKey = todayKey.slice(0, 7);
    const yearKey = now.getFullYear().toString();

    // ===== セッション分 =====
    const sessionSegments = getCurrentSessionSegments(id);

    let totalMin = totalMinBase;
    let todayMin = daily[todayKey] || 0;
    let monthMin = 0;
    let yearMin = yearly[yearKey] || 0;

    for (const seg of sessionSegments) {
        totalMin += seg.minutes;
        yearMin += seg.minutes;

        if (seg.dateKey === todayKey) {
            todayMin += seg.minutes;
        }
        if (seg.dateKey.startsWith(monthKey)) {
            monthMin += seg.minutes;
        }
    }

    // ===== 今月（日数は daily から再計算）=====
    const monthDaysSet = new Set();
    for (const key of Object.keys(daily)) {
        if (key.startsWith(monthKey)) {
            monthMin += daily[key];
            monthDaysSet.add(key);
        }
    }
    for (const seg of sessionSegments) {
        if (seg.dateKey.startsWith(monthKey)) {
            monthDaysSet.add(seg.dateKey);
        }
    }

    const monthDays = monthDaysSet.size;

    // ===== 直近30日 =====
    let last30Min = 0;
    for (const v of Object.values(daily)) {
        last30Min += v;
    }
    for (const seg of sessionSegments) {
        last30Min += seg.minutes;
    }

    const activeDays = Object.keys(daily).length;
    const avgMin = activeDays === 0 ? 0 : Math.floor(last30Min / activeDays);
    player.sendMessage({
        rawtext: [
            { text: '§6==== ' },
            { translate: 'playtime.dsc.title' },
            { text: ' §6====\n§e- ' },
            { translate: 'playtime.dsc.total' },
            { text: '\n  ' },
            { translate: 'playtime.dsc.total.value' },
            { text: `: §f${formatMinutes(totalMin)}\n\n§e- ` },
            { translate: 'playtime.dsc.today' },
            { text: ` (${todayKey})\n  ` },
            { translate: 'playtime.dsc.playtime' },
            { text: `: §f${formatMinutes(todayMin)}\n\n§e- ` },
            { translate: 'playtime.dsc.thismonth' },
            { text: ` (${monthKey})\n  ` },
            { translate: 'playtime.dsc.playtime' },
            { text: `: §f${formatMinutes(monthMin)}\n  ` },
            { translate: 'playtime.dsc.logindays' },
            { text: `: §f${monthDays}` },
            { translate: 'playtime.dsc.day' },
            { text: `\n\n§e- ` },
            { translate: 'playtime.dsc.30days' },
            { text: `\n  ` },
            { translate: 'playtime.dsc.total' },
            { text: `: §f${formatMinutes(last30Min)}\n  ` },
            { translate: 'playtime.dsc.ave' },
            { text: `: §f${formatMinutes(avgMin)} / ` },
            { translate: 'playtime.dsc.day' },
            { text: `\n\n§e- ` },
            { translate: 'playtime.dsc.thisyear' },
            { text: ` (${yearKey})\n  ` },
            { translate: 'playtime.dsc.total' },
            { text: `: §f${formatMinutes(yearMin)}\n§6========================` },
        ]
    })
}


function formatMinutes(min) {
    const h = Math.floor(min / 60);
    const m = min % 60;

    if (h > 0) {
        return `${h}hour ${m}min`;
    }
    return `${m}min`;
}

function getCurrentSessionMinutes(playerId) {
    const list = JSON.parse(
        playTimeDB.get('worldLoginPlayers') || '[]'
    );
    const data = list.find(p => p.id === playerId);
    if (!data) return 0;

    return Math.floor((Date.now() - data.loginTime) / 1000 / 60);
}

function getCurrentSessionSegments(playerId) {
    const list = JSON.parse(
        playTimeDB.get('worldLoginPlayers') || '[]'
    );
    const data = list.find(p => p.id === playerId);
    if (!data) return [];

    return splitByDay(data.loginTime, Date.now());
}

export function hasJoinedInPeriodWithinDailyRetention(playerId, startDate, endDate) {
    const daily = JSON.parse(
        playTimeDB.get(`player_${playerId}_daily`) || '{}'
    );

    const start = new Date(`${startDate}T00:00:00Z`);
    const end = new Date(`${endDate}T00:00:00Z`);
    end.setUTCDate(end.getUTCDate() + 1);

    for (const dateKey of Object.keys(daily)) {
        const d = new Date(`${dateKey}T00:00:00Z`);
        if (d >= start && d < end) {
            return true;
        }
    }

    // 現在ログイン中セッション
    const sessionSegs = getCurrentSessionSegments(playerId);
    for (const seg of sessionSegs) {
        const d = new Date(`${seg.dateKey}T00:00:00Z`);
        if (d >= start && d < end) {
            return true;
        }
    }

    return false;
}