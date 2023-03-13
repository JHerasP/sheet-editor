import { normalice } from "../../../../TS_tools/general-utility";
import { ENV } from "../../../config";
const SHEET_INFO = ENV.sheetConfig;

export function checkIfIsMyRow(cell: string): boolean {
  const name = cell;

  if (!SHEET_INFO.employeeName) return false;

  return normalice(name) === normalice(SHEET_INFO.employeeName);
}

export function checkIfRowHasValues(cells: string[]): boolean {
  return cells.length > 2;
}
