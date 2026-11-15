/**
 * プロットの権限を「立場ごと」に一覧する (/plot hud のアクションバー)。計算だけで、ゲームにも DB にも触らない。
 *
 * 判定は shared/utils/minecraft.ts の CheckPermissionFromLocation をそのまま写してある。
 * あちらを変えたら、ここも同じに変えること (test/plot-hud.test.cjs が両方の食い違いの見張り)。
 *
 * 立場は「その立場の、役職も個別許可も持たないふつうの人」で見る。国民だけは国の既定の役職 (peopleRole) を持つ人として見る。
 * 個別許可・国指定・役職指定があるときは、その数を注記に出す (人や国によって結果が変わるため)。
 */

export const HUD_PERMISSIONS = [
    ["place", "設置"],
    ["break", "破壊"],
    ["openContainer", "チェスト"],
    ["blockUse", "使用"],
    ["entityUse", "生物"],
] as const;

export type Relation = "member" | "federation" | "alliance" | "friendly" | "neutrality" | "hostility";
export const RELATIONS: Array<[Relation, string]> = [
    ["member", "国民"],
    ["federation", "連邦"],
    ["alliance", "同盟"],
    ["friendly", "友好"],
    ["neutrality", "中立"],
    ["hostility", "敵対"],
];

const ADMIN_LIKE = ["admin", "owner", "plotAdmin"];

export type HudInput = {
    /** チャンクのデータ (無ければ荒野) */
    chunk: any;
    /** グループを解決したあとのプロット (無ければ undefined) */
    plot: any;
    /** チャンクの国 */
    country: any;
    /** 国民の既定の役職の権限 */
    peopleRolePermissions: string[];
    /** embassy の持ち主の国 id (embassy のときだけ) */
    embassyCountryId?: number;
    wildernessAllow: string[];
    specialAllow: string[];
};

export type HudRow = { relation: Relation | "embassy"; label: string; allowed: Record<string, boolean> };

/** 役職 1 つだけを持つ人が、その権限を役職から得られるか (CheckPermissionFromLocation の hasRolePermission と同じ) */
function roleGrants(rolePermissions: string[], permission: string): boolean {
    return rolePermissions.includes(permission) || ADMIN_LIKE.some((p) => rolePermissions.includes(p));
}

const RELATION_KEYS: Record<Exclude<Relation, "member">, string> = {
    federation: "federationPermission",
    alliance: "alliancePermission",
    friendly: "friendlyPermission",
    neutrality: "neutralityPermission",
    hostility: "hostilityPermission",
};

/** 1 つの立場・1 つの権限が許されるか */
export function allows(input: HudInput, relation: Relation | "embassy", permission: string): boolean {
    const { chunk, plot, country } = input;
    if (!chunk || (!chunk.countryId && !chunk.owner && !chunk.special)) return input.wildernessAllow.includes(permission);
    if (chunk.special) return input.specialAllow.includes(permission);
    const plotPerms: string[] = plot?.permissions ?? [];
    const member = relation === "member";
    const rolePerms = input.peopleRolePermissions;

    if (plot?.enable && plot.type === "private") {
        if (plotPerms.includes(permission)) return true;
        return member && roleGrants(rolePerms, permission);
    }
    if (plot?.enable && plot.type === "embassy" && plot.owner) {
        if (relation === "embassy") return plotPerms.includes(permission);
        // 領土の国の国民は admin 相当の役職が無いと何もできない (国指定は国ごとなので注記で出す)
        if (member) return ADMIN_LIKE.some((p) => rolePerms.includes(p));
        return false;
    }
    if (plot?.enable && plot.type === "public") {
        if (!member) return false;
        if (plotPerms.includes(permission)) return true;
        const peopleRoleId = String(country?.peopleRole ?? "");
        if ((plot.roles ?? []).some((r: any) => String(r.id) === peopleRoleId && (r.permissions ?? []).includes(permission))) return true;
        return ADMIN_LIKE.some((p) => rolePerms.includes(p));
    }
    // プロットが無い・止めてある: 国の決まり
    if (member) return roleGrants(rolePerms, permission);
    if (relation === "embassy") return false;
    return (country?.[RELATION_KEYS[relation]] ?? []).includes(permission);
}

export type HudView = { header: string; rows: HudRow[]; notes: string[] };

/** アクションバーに出す中身。行は 立場ごと、列は HUD_PERMISSIONS */
export function buildHud(input: HudInput, names: { owner?: string; embassyCountry?: string; group?: string } = {}): HudView {
    const { chunk, plot, country } = input;
    if (!chunk || (!chunk.countryId && !chunk.owner && !chunk.special)) {
        return { header: "§2荒野", rows: [], notes: [] };
    }
    if (chunk.special) return { header: "§e特別区域", rows: [], notes: [] };

    const countryName = String(country?.name ?? "?");
    const active = Boolean(plot?.enable);
    const typeLabel: Record<string, string> = { public: "公開", private: "私有地", embassy: "大使館" };
    let header = `§f${countryName}§r`;
    if (plot && (plot.name || active || plot.group)) {
        header += ` §6~${plot.name ?? "プロット"}§r §7[${typeLabel[plot.type] ?? plot.type}${active ? "" : "・停止中"}]`;
        if (names.group) header += ` §8G:${names.group}`;
        if (plot.owner) header += ` §7持ち主 ${names.owner ?? "?"}`;
        if (plot.is_selling && plot.price) header += ` §e売出 ${plot.price}`;
    } else {
        header += " §7[国の決まり]";
    }

    const relations: Array<[Relation | "embassy", string]> = [...RELATIONS];
    if (active && plot.type === "embassy" && plot.owner) relations.splice(1, 0, ["embassy", `持主国${names.embassyCountry ? `(${names.embassyCountry})` : ""}`]);
    const rows = relations.map(([relation, label]) => ({
        relation,
        label,
        allowed: Object.fromEntries(HUD_PERMISSIONS.map(([perm]) => [perm, allows(input, relation, perm)])),
    }));

    const notes: string[] = [];
    if (active) {
        const players = (plot.players ?? []).length;
        const countries = (plot.countries ?? []).length;
        const roles = (plot.roles ?? []).length;
        if (players) notes.push(`個別許可 ${players}人`);
        if (countries) notes.push(`国指定 ${countries}か国`);
        if (roles) notes.push(`役職指定 ${roles}`);
        // 見落としやすいもの: 私有地の共通権限は、国民だけでなく他国の人にも効く
        if (plot.type === "private" && (plot.permissions ?? []).length > 0) notes.push("§c私有地の共通権限は他国の人にも効きます");
    } else if (plot && (plot.type !== "public" || plot.owner)) {
        notes.push("§cプロットが止まっているので国の決まりが効いています");
    }
    return { header, rows, notes };
}

/**
 * アクションバー用の文字列。できる = 緑、できない = 暗い赤で、権限名そのものに色を付ける。
 * ○ や ✔ はゲームのフォントに無く □ になる (2026-09-24 の画面で確認) ので記号は使わない。
 * 全部できる・全部できない行は 1 語にまとめて短くする。
 */
export function renderHud(view: HudView): string {
    if (view.rows.length === 0) return view.header;
    const lines = view.rows.map((row) => {
        const values = HUD_PERMISSIONS.map(([perm]) => row.allowed[perm]);
        let body: string;
        if (values.every(Boolean)) body = "§aすべてできる";
        else if (!values.some(Boolean)) body = "§4なにもできない";
        else body = HUD_PERMISSIONS.map(([perm, label]) => `${row.allowed[perm] ? "§a" : "§4"}${label}`).join(" ");
        return `§e${row.label}§r  ${body}`;
    });
    return [view.header, ...lines, ...(view.notes.length ? [`§7${view.notes.join(" ／ ")}`] : [])].join("\n");
}
