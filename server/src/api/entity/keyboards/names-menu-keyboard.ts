import { ENV } from "../../../config";
import { ICustomInLineKeyboadButton } from "../../utils/types";
import { returnButton } from "./return-button-keyboard";
const nameList = ["Jesus Heras", "Angela Perez"];

export type TNamesMenuValues = ICustomInLineKeyboadButton<string, string>;

const buttonList = nameList.map((name) => [{ text: name, callback_data: `${ENV.telegram.secretCode}${name}` }]);
buttonList.push([returnButton]);

export const employeeNamesMenu: TNamesMenuValues[][] = buttonList;
