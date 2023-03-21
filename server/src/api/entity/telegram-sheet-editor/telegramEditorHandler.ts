import { caseGuard } from "../../../../TS_tools/general-utility";
import { TMenus } from "../keyboards";
import { TSeatOption, TWeekDay } from "../sheet/weekConfiguration";
import { TelegramSheetEditor } from "./TelegramSheetEditor";

export const queryHandler = async (telegram: TelegramSheetEditor, command: TMenus) => {
  switch (command) {
    case "Sheet":
      return;
    case "Cron":
      return;
    case "Edit configuration":
      return;
    case "Get values":
      return await readSheetValues(telegram);
    case "Fill sheet":
      return await fillSheet(telegram);
    case "Monday":
    case "Tuesday":
    case "Wednesday":
    case "Thursday":
    case "Friday":
      return setDay(telegram, command);
    case "A1":
    case "A2":
    case "A3":
    case "A4":
    case "A5":
    case "B1":
    case "B2":
    case "B3":
    case "B4":
    case "B5":
    case "C1":
    case "C2":
    case "C3":
    case "D1":
    case "D2":
    case "D3":
    case "Teletrabajo":
    case "Presencial":
    case "Vacaciones":
    case "Remove":
    case "No sabe":
      return setSeat(telegram, command);
    case "Turn on":
      return turnOn(telegram);
    case "Turn off":
      return turnOff(telegram);
    case "Status":
      return cronStatus(telegram);
    case "Get error":
      return getError(telegram);
    case "Employee":
      return;
    case "Return":
      return;
    default:
      caseGuard(command);
  }
};

const setDay = (telegram: TelegramSheetEditor, command: TWeekDay) => {
  telegram.setSelectedDay(command);
};
const setSeat = (telegram: TelegramSheetEditor, command: TSeatOption) => {
  telegram.setSelectedSeat(command);
  telegram.saveWeekConfig();
};

const turnOn = (telegram: TelegramSheetEditor) => {
  telegram.enableCron();
};

const turnOff = (telegram: TelegramSheetEditor) => {
  telegram.removeCron();
};
const cronStatus = (telegram: TelegramSheetEditor) => {
  telegram.getStatusCron();
};

const readSheetValues = (telegram: TelegramSheetEditor) => {
  return telegram.readSheetValues();
};

const fillSheet = (telegram: TelegramSheetEditor) => {
  return telegram.writeSheet();
};

const getError = (telegram: TelegramSheetEditor) => {
  throw new Error(telegram.getStatusCron().lastError);
};
