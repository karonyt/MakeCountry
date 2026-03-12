import { http, HttpRequest, HttpHeader, HttpRequestMethod } from "@minecraft/server-net";

const SERVER_URL = "http://localhost:20007";

async function sendRequest(path: any, method = HttpRequestMethod.Get, body = null) {
    try {
        const request = new HttpRequest(`${SERVER_URL}${path}`);
        request.method = method;
        if (body) {
            request.headers = [new HttpHeader("Content-Type", "application/json")];
            request.body = JSON.stringify(body);
        }
        const response = await http.request(request);
        return JSON.parse(response.body);
    } catch (error) {
        console.error(`[DailyQuestAPI] Request to ${path} failed:`, JSON.stringify(error));
        return { error: `HTTPリクエストに失敗しました。外部サーバーが起動しているか確認してください。` };
    }
}

export async function getQuests(player: any) {
    return await sendRequest(`/quests/progress?playerId=${player.id}`);
}

export async function sendQuestActionEvent(player: any, actionType: any, value: any, actionTarget = null) {
    // サーバーからのレスポンスを受け取るためにawaitを追加
    // @ts-ignore TS(2345): Argument of type '{ playerId: any; actionType: any... Remove this comment to see the full error message
    return await sendRequest('/quests/action', HttpRequestMethod.Post, {
        playerId: player.id,
        actionType,
        actionTarget,
        value
    });
}

export async function claimReward(player: any, questId: any, assignmentDate: any) {
    // @ts-ignore TS(2345): Argument of type '{ playerId: any; questId: any; a... Remove this comment to see the full error message
    return await sendRequest('/quests/claim', HttpRequestMethod.Post, {
        playerId: player.id,
        questId,
        assignmentDate
    });
}