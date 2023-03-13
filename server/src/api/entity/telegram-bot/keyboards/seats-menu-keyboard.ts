import { ICustomInLineKeyboadButton } from "../../../utils/types";
import { SEAT_OPTIONS, TSeatOption } from "../../sheet/weekConfiguration";
import { TReturnMenu, TReturnMenuText } from "./return-button-keyboard";

export type TSeatsMenu = TSeatOption | TReturnMenu | "Edit configuration";
export type TSeatMenuText = TSeatOption | TReturnMenuText;

export type TDaysSeatValues = ICustomInLineKeyboadButton<TSeatMenuText, TSeatsMenu>;

const seats = SEAT_OPTIONS.map((seat) => ({ text: seat, callback_data: seat }));

const fristRow = [...seats];
const secondRow = fristRow.splice(4);
const thirdRow = secondRow.splice(5);
const fourthRow = thirdRow.splice(5);
const fifthRow = fourthRow.splice(3);
const sixthRow = fifthRow.splice(3);

export const seatsMenu: TDaysSeatValues[][] = [
  fristRow,
  secondRow,
  thirdRow,
  fourthRow,
  fifthRow,
  sixthRow,
  [{ text: "⬅ Return", callback_data: "Edit configuration" }],
];
