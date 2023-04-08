import { ENV } from "../../../config";
import { ICustomInLineKeyboadButton } from "../../utils/types";
const { employeeNames } = ENV;

const nameList = employeeNames;

export type TNamesMenuValues = ICustomInLineKeyboadButton<string, string>;

const buttonList = nameList.map((name) => [{ text: name, callback_data: `${ENV.telegram.secretCode}${name}` }]);

export const employeeNamesMenu: TNamesMenuValues[][] = buttonList;
