// 本体 (フル版・Lite) が持つ差し込み口。機能パックの画面から本体の画面へ戻るときなどに使う。
import { provideHook } from "@/shared/hooks.js";
import { callPlayerMainMenuForm } from "@/features/forms/form-registry.js";

provideHook("lite.openMainMenu", player => { if (player) callPlayerMainMenuForm(player); });
