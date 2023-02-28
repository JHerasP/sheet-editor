import { sheets_v4 } from "googleapis";
import cron from "node-cron";
import { normalice } from "../../../../TS_tools/general-utility";
import { ENV } from "../../../config";
import { printException } from "../../utils/print";
type sheetValues = sheets_v4.Schema$ValueRange;
const SHEET_INFO = ENV.sheetConfig;

export function checkValidCron(cronTimer?: string) {
  if (!cronTimer) return "";
  else if (cron.validate(cronTimer)) return cronTimer;
  else return "";
}

export function notValidCron() {
  printException(notValidCron.name, "Cron configuration is not valid");
}

export function notValidTelegramInfo() {
  printException(notValidTelegramInfo.name, "Missing telegram info");
}

export function sheetNotFound() {
  throw [sheetNotFound.name, "Sheet not found"];
}

export function checkSheetValues(sheet: sheetValues) {
  if (sheet.values?.length) return sheet.values[0];
  else return false;
}

export function sheetNoValues() {
  throw [sheetNoValues.name, "The sheet has no values"];
}

export function checkIfIsMyRow(cell: string): boolean {
  const name = cell;

  if (!SHEET_INFO.employeeName) return false;

  return normalice(name) === normalice(SHEET_INFO.employeeName);
}

export function notValidRow() {
  throw [notValidRow.name, "The obtained row does not match the user"];
}

export function checkIfRowHasValues(cells: string[]): boolean {
  return cells.length > 2;
}

export function rowFilledAlready() {
  throw [rowFilledAlready.name, "The row is valid but it has values"];
}
