import { caseGuard } from "../../../../TS_tools/general-utility";
import { getNamesColumn } from "../sheet/sheet-service";
import { TSeatOption, TWeekDay } from "../sheet/weekConfiguration";
import { TMenus } from "./keyboards";
import { TelegramChat } from "./TelegramChat";

export const queryHandler = async (telegram: TelegramChat, command: TMenus) => {
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
    case "Name":
      return;
    case "Cells":
      return;
    case "Return":
      return;
    default:
      caseGuard(command);
      return findNameSecretCode(telegram, command as any);
  }
};

const setDay = (telegram: TelegramChat, command: TWeekDay) => {
  telegram.setSelectedDay(command);
};
const setSeat = (telegram: TelegramChat, command: TSeatOption) => {
  telegram.setSelectedSeat(command);
  telegram.saveWeekConfig();
};

const turnOn = (telegram: TelegramChat) => {
  telegram.enableCron();
};

const turnOff = (telegram: TelegramChat) => {
  telegram.removeCron();
};
const cronStatus = (telegram: TelegramChat) => {
  telegram.getStatusCron();
};

const readSheetValues = (telegram: TelegramChat) => {
  return telegram.readSheetValues();
};

const fillSheet = (telegram: TelegramChat) => {
  return telegram.writeSheet();
};

const getError = (telegram: TelegramChat) => {
  throw new Error(telegram.getStatusCron().lastError);
};

const findName = async (telegram: TelegramChat, userName: string) => {
  const columnCells = await getNamesColumn(userName);

  Object.entries(columnCells).forEach((value) => {
    const [day, cell] = value as [TWeekDay, string];

    telegram.saveWeekCellsConfig(day, { cell: cell, seat: "Remove" });
  });
};

const findNameSecretCode = (telegram: TelegramChat, name: string) => {
  if (name.includes("$*$")) return findName(telegram, name.replace("$*$", ""));
};
