import { ICustomInLineKeyboadButton } from "../../../utils/types";
import { TWeekDay, WEEKDAYS } from "../../sheet/weekConfiguration";
import { TMainMenu } from "./main-menu-keyboard";
import { TReturnMenuText } from "./return-button-keyboard";

export type TWeekMenu = TWeekDay | Extract<TMainMenu, "Sheet">;
export type TWeekMenuText = TWeekDay | TReturnMenuText;

export type TWeekMenuValues = ICustomInLineKeyboadButton<TWeekMenuText, TWeekMenu>;

const days = WEEKDAYS.map((day) => ({ text: day, callback_data: day }));

const fristRow = [...days];
const secondRow = fristRow.splice(2);
const thirdRow = secondRow.splice(1);

export const weekMenu: TWeekMenuValues[][] = [
  fristRow,
  secondRow,
  thirdRow,
  [{ text: "⬅ Return", callback_data: "Sheet" }],
];
