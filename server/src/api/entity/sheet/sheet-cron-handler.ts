import { ENV } from "../../../config";
import {
  checkIfIsMyRow,
  checkIfRowHasValues,
  checkSheetValues,
  missingWeekConfiguration,
  notValidRow,
  rowFilledAlready,
  sheetNotFound,
  sheetNoValues,
} from "./sheet-error-handler";
import { getSheetValues, postSheetValues } from "./sheet-service";

const SHEET_INFO = ENV.sheetConfig;
const { monday, tuesday, wedneeday, thursday, friday } = SHEET_INFO;

export const cronHandler = async () => {
  const sheet = await getSheetValues();
  if (!sheet) return sheetNotFound();

  const sheetValues = checkSheetValues(sheet);
  if (!sheetValues) return sheetNoValues();

  const employeeName = sheetValues[0];

  const isMyRow = checkIfIsMyRow(employeeName);
  if (!isMyRow) return notValidRow();

  const hasValues = checkIfRowHasValues(sheetValues);
  if (hasValues) return rowFilledAlready();

  if (monday && tuesday && wedneeday && thursday && friday)
    return await postSheetValues([[monday, tuesday, wedneeday, thursday, friday]]);
  else return missingWeekConfiguration();
};
