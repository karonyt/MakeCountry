import { Player } from "@minecraft/server";
import { http, HttpRequest, HttpRequestMethod, HttpHeader } from "@minecraft/server-net";

const webhook = "https://discord.com/api/webhooks/1422469188441866335/mgM46E4ru2JSAPIsw30aO-NQAc0rDH04dJYrPWLHXmkpA35J5ZwVpbmIjt7-i6lJNm4C";

function stripFormat(text: any) {
    return text.replace(/§./g, "");
}

/**
 * 
 * @param {string} name 
 * @param {Player} owner 
 * @param {boolean} invite
 * @param {boolean} peace
 * @param {number} country_id
 */
export async function Webhook_Make_Country(name: any, owner: any, invite: any, peace: any, country_id: any) {
    const invite_text = invite ? "招待制" : "参加自由";
    const peace_text = peace ? "平和" : "非平和";

    const title = `${stripFormat(name)} が建国された`;
    const description = `
国家名: ${name}
Owner: \`${owner.name}\`

\`\`\`
${invite_text}
${peace_text} 主義
\`\`\`

国家ID: \`${country_id}\``;

    const payload = {
        username: "MakeCountry",
        avatar_url: null,
        embeds: [
            {
                title: title,
                description: description,
                color: 3447003,
                timestamp: new Date().toISOString()
            }
        ]
    };

    const request = new HttpRequest(webhook);
    request.method = HttpRequestMethod.Post;
    request.headers = [
        new HttpHeader("Content-Type", "application/json")
    ];
    request.body = JSON.stringify(payload);

    try {
        const res = await http.request(request);
        if (res.status < 200 || res.status >= 300) {
            console.warn(`[MakeCountry] Webhookの送信に失敗しました: ${res.status}`);
        }
    } catch (err) {
        console.error(`[MakeCountry] Webhookの送信中にエラーが発生しました:`, err);
    }
}

export async function Webhook_Delete_Country(name: any, country_id: any) {
    const title = `${stripFormat(name)} が崩壊した`;
    const description = `
国家名: ${name}

国家ID: \`${country_id}\``;

    const payload = {
        username: "MakeCountry",
        avatar_url: null,
        embeds: [
            {
                title: title,
                description: description,
                color: 3447003,
                timestamp: new Date().toISOString()
            }
        ]
    };

    const request = new HttpRequest(webhook);
    request.method = HttpRequestMethod.Post;
    request.headers = [
        new HttpHeader("Content-Type", "application/json")
    ];
    request.body = JSON.stringify(payload);

    try {
        const res = await http.request(request);
        if (res.status < 200 || res.status >= 300) {
            console.warn(`[MakeCountry] Webhookの送信に失敗しました: ${res.status}`);
        }
    } catch (err) {
        console.error(`[MakeCountry] Webhookの送信中にエラーが発生しました:`, err);
    }
}

export async function Webhook_Rename_Country(before_name: any, after_name: any, country_id: any) {
    const title = `${stripFormat(before_name)} の国名が変更された`;
    const description = `
変更前:
\`\`\`${before_name}\`\`\`

変更後:
\`\`\`${after_name}\`\`\`

国家ID: \`${country_id}\``;

    const payload = {
        username: "MakeCountry",
        avatar_url: null,
        embeds: [
            {
                title: title,
                description: description,
                color: 3447003,
                timestamp: new Date().toISOString()
            }
        ]
    };

    const request = new HttpRequest(webhook);
    request.method = HttpRequestMethod.Post;
    request.headers = [
        new HttpHeader("Content-Type", "application/json")
    ];
    request.body = JSON.stringify(payload);

    try {
        const res = await http.request(request);
        if (res.status < 200 || res.status >= 300) {
            console.warn(`[MakeCountry] Webhookの送信に失敗しました: ${res.status}`);
        }
    } catch (err) {
        console.error(`[MakeCountry] Webhookの送信中にエラーが発生しました:`, err);
    }
}