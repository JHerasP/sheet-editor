import { ICustomInLineKeyboadButton } from "../../../utils/types";

export type TReturnMenu = "Return";
export type TReturnMenuText = "⬅ Return";

export type TSheetMenuValues = ICustomInLineKeyboadButton<TReturnMenuText, TReturnMenu>;

export const returnButton: TSheetMenuValues = { text: "⬅ Return", callback_data: "Return" };
