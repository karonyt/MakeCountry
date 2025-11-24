import { world } from "@minecraft/server";

export class TimeManager {
    constructor(startYear = 2000) {
        this.startYear = startYear;
    }

    getCalendar() {
        const totalDays = world.getDay();
        const timeOfDay = world.getTimeOfDay();

        // ============
        // ■ 年計算
        // ============
        let year = this.startYear;
        let daysLeft = totalDays;

        while (true) {
            const daysInYear =
                (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
                    ? 366
                    : 365;

            if (daysLeft >= daysInYear) {
                daysLeft -= daysInYear;
                year++;
            } else break;
        }

        const isLeap =
            (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

        const { month, day } = getMonthDay(daysLeft, isLeap);

        // ============
        // ■ 曜日
        // ============
        const weekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
        const weekday = weekdays[totalDays % 7];

        // ============
        // ■ 季節
        // ============
        const season = getSeason(month);

        // ============
        // ■ 時刻（24h）
        // ============
        let hours = Math.floor((timeOfDay / 1000 + 6) % 24);
        let minutes = Math.floor(((timeOfDay % 1000) / 1000) * 60);
        let seconds = Math.floor((((timeOfDay % 1000) / 1000) * 60 % 1) * 60);

        // ============
        // ■ AM / PM
        // ============
        const ampm = hours < 12 ? "AM" : "PM";
        const displayHour = hours % 12 === 0 ? 12 : hours % 12;

        // ============
        // ■ 時間帯
        // ============
        const period = getDayPeriod(hours);

        return {
            year,
            month,
            day,
            weekday,
            season,
            hours,
            minutes,
            seconds,
            ampm,
            displayHour,
            period
        };
    }
}

// ===== 月日 =====
function getMonthDay(daysLeft, isLeap) {
    const monthDays = [
        31,
        isLeap ? 29 : 28,
        31, 30,
        31, 30,
        31, 31,
        30, 31,
        30, 31
    ];

    let month = 0;
    while (daysLeft >= monthDays[month]) {
        daysLeft -= monthDays[month];
        month++;
    }

    return {
        month: month + 1,
        day: daysLeft + 1
    };
}

// ===== 季節 =====
function getSeason(month) {
    if (3 <= month && month <= 5) return "spring";
    if (6 <= month && month <= 8) return "summer";
    if (9 <= month && month <= 11) return "autumn";
    return "winter";
}

// ===== 時間帯 =====
function getDayPeriod(hours) {
    if (hours >= 5 && hours < 12) return "morning";
    if (hours >= 12 && hours < 17) return "afternoon";
    if (hours >= 17 && hours < 20) return "evening";
    return "night";
}