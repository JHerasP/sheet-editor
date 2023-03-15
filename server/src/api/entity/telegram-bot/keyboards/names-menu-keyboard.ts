import { ICustomInLineKeyboadButton } from "../../../utils/types";
import { returnButton, TReturnMenu, TReturnMenuText } from "./return-button-keyboard";
const nameList = ["Jesus Heras", "Angela Perez"];
export type TNamesMenu = "Name" | "Cells" | TReturnMenu;
export type TNamesMenuText = "🏷 Name" | "🔩 Cells" | TReturnMenuText;

export type TNamesMenuValues = ICustomInLineKeyboadButton<string, string>;

const buttonList = nameList.map((name) => [{ text: name, callback_data: `$*$${name}` }]);
buttonList.push([returnButton]);

export const employeeNamesMenu: TNamesMenuValues[][] = buttonList;
