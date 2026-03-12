import { world } from "@minecraft/server";

const STATE_KEY = "map_renderer_state";

export class StateManager {
    static save(data: any) {
        try {
            const payload = JSON.stringify(data);
            world.setDynamicProperty(STATE_KEY, payload);
        } catch (e) {
            // データ量が多すぎる場合の安全策（今回は簡易的）
            console.warn("[Map] Failed to save state:", e);
        }
    }

    static load() {
        const raw = world.getDynamicProperty(STATE_KEY);
        if (!raw) return null;
        try {
            // @ts-ignore TS(2345): Argument of type 'string | number | true | Vector3... Remove this comment to see the full error message
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    // 進行状況のみクリアし、統計情報(ETA用学習データ)は保持する
    static clearProgress() {
        const current = this.load();
        const newState = {};
        
        // 統計データがあれば引き継ぐ
        if (current && current.stats) {
            // @ts-ignore TS(2339): Property 'stats' does not exist on type '{}'.
            newState.stats = current.stats;
        }
        
        // ステータスを完了にして保存
        // @ts-ignore TS(2339): Property 'status' does not exist on type '{}'.
        newState.status = "completed";
        
        this.save(newState);
    }
    
    // 完全リセット（統計も消す）
    static clearAll() {
        world.setDynamicProperty(STATE_KEY, undefined);
    }
}