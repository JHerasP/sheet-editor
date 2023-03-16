import { ICustomInLineKeyboadButton } from "../../utils/types";
import { returnButton, TReturnMenu, TReturnMenuText } from "./return-button-keyboard";

export type TCronMenu = "Turn on" | "Turn off" | "Status" | TReturnMenu;
export type TCronMenuText = "📱 Turn on" | "📴 Turn off" | "📊 Status" | TReturnMenuText;

export type TMainMenuValues = ICustomInLineKeyboadButton<TCronMenuText, TCronMenu>;

export const cronMenu: TMainMenuValues[][] = [
  [{ text: "📱 Turn on", callback_data: "Turn on" }],
  [{ text: "📴 Turn off", callback_data: "Turn off" }],
  [{ text: "📊 Status", callback_data: "Status" }],
  [returnButton],
];
