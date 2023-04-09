import { ICustomInLineKeyboadButton } from "../../utils/types";
import { TMainMenu } from "./main-menu-keyboard";
import { returnButton, TReturnMenuText } from "./return-button-keyboard";

export type TCronStatusMenu = "Get error" | Extract<TMainMenu, "Cron">;
export type TCronStatusMenuText = "🩹 Get error" | TReturnMenuText;

export type TCronStatusMenuValues = ICustomInLineKeyboadButton<TCronStatusMenuText, TCronStatusMenu>;

export const cronStatusMenu: TCronStatusMenuValues[][] = [
  [{ text: "🩹 Get error", callback_data: "Get error" }],
  [{ text: returnButton.text, callback_data: "Cron" }],
];
