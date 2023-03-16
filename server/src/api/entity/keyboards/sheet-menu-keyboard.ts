import { ICustomInLineKeyboadButton } from "../../utils/types";
import { returnButton, TReturnMenu, TReturnMenuText } from "./return-button-keyboard";

export type TSheetMenu = "Get values" | "Edit configuration" | "Fill sheet" | TReturnMenu;
export type TSheetMenuText = "🗃 Get values" | "🛠 Edit configuration" | "🗳 Fill sheet" | TReturnMenuText;

export type TSheetMenuValues = ICustomInLineKeyboadButton<TSheetMenuText, TSheetMenu>;

export const sheetMenu: TSheetMenuValues[][] = [
  [{ text: "🗃 Get values", callback_data: "Get values" }],
  [{ text: "🛠 Edit configuration", callback_data: "Edit configuration" }],
  [{ text: "🗳 Fill sheet", callback_data: "Fill sheet" }],
  [returnButton],
];
