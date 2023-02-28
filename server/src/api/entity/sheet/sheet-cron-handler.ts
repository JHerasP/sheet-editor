import { TWeekConfiguration } from "../telegram-bot/weekConfiguration";
import {
  checkIfIsMyRow,
  checkIfRowHasValues,
  checkSheetValues,
  notValidRow,
  rowFilledAlready,
  sheetNotFound,
  sheetNoValues,
} from "./sheet-error-handler";
import { getSheetValues, postSheetValues } from "./sheet-service";

export const cronHandler = async (configData: TWeekConfiguration) => {
  const { Monday, Tuesday, Wednesday, Thursday, Friday } = configData;
  const sheet = await getSheetValues();
  if (!sheet) return sheetNotFound();

  const sheetValues = checkSheetValues(sheet);
  if (!sheetValues) return sheetNoValues();

  const employeeName = sheetValues[0];

  const isMyRow = checkIfIsMyRow(employeeName);
  if (!isMyRow) return notValidRow();

  const hasValues = checkIfRowHasValues(sheetValues);
  if (hasValues) return rowFilledAlready();

  return await postSheetValues([[Monday, Tuesday, Wednesday, Thursday, Friday]]);
};
