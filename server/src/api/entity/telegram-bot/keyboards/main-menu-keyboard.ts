import { ICustomInLineKeyboadButton } from "../../../utils/types";

export type TMainMenu = "Sheet" | "Cron";
export type TMainMenuText = "📖 Sheet" | "⌚ Cron";

export type TMainMenuValues = ICustomInLineKeyboadButton<TMainMenuText, TMainMenu>;

export const mainMenu: TMainMenuValues[][] = [
  [{ text: "📖 Sheet", callback_data: "Sheet" }],
  [{ text: "⌚ Cron", callback_data: "Cron" }],
];
