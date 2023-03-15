import { ICustomInLineKeyboadButton } from "../../../utils/types";
import { returnButton, TReturnMenu, TReturnMenuText } from "./return-button-keyboard";

export type TEmployeeMenu = "Name" | "Cells" | TReturnMenu;
export type TEmployeeMenuText = "🏷 Name" | "🔩 Cells" | TReturnMenuText;

export type TEmployeeMenuValues = ICustomInLineKeyboadButton<TEmployeeMenuText, TEmployeeMenu>;

export const employeeMenu: TEmployeeMenuValues[][] = [
  [{ text: "🏷 Name", callback_data: "Name" }],
  [{ text: "🔩 Cells", callback_data: "Cells" }],
  [returnButton],
];
