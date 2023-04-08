import { ENV } from "../../../config";
import { removeSecretCode } from "../../utils/tools";
import { TMenus } from "../keyboards";
import { getNamesColumn } from "../sheet/sheet-service";
import { TWeekDay } from "../sheet/weekConfiguration";
import { TelegramSheetEditor } from "./TelegramSheetEditor";

export const showOperationDone = (command: TMenus) =>
  command === "Get values" ||
  command === "Fill sheet" ||
  command === "Turn on" ||
  command === "Turn off" ||
  command.includes(ENV.telegram.secretCode);

const findName = async (telegram: TelegramSheetEditor, userName: string) => {
  const columnCells = await getNamesColumn(userName);

  Object.entries(columnCells).forEach((value) => {
    const [day, cell] = value as [TWeekDay, string];
    console.info("✅", day, cell);
    telegram.saveWeekCellsConfig(day, cell);
  });
};

export const setEmployeeCells = (telegram: TelegramSheetEditor, name: string) => {
  return findName(telegram, removeSecretCode(name));
};
