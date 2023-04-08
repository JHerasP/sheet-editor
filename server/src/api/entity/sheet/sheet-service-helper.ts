import { GaxiosError, GaxiosResponse } from "gaxios";
import { google, sheets_v4 } from "googleapis";
import { ENV } from "../../../config";
import { getSheetColumnValues } from "./sheet-service";
import { PHISICAL_SEAT_OPTIONS, TSeatOption, TWeekConfiguration, TWeekDay } from "./weekConfiguration";

export async function authSheets() {
  const googleAuth = new google.auth.GoogleAuth({
    keyFile: "keys.env",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const authClient = await googleAuth.getClient();

  const sheets = google.sheets({ version: "v4", auth: authClient });

  return sheets;
}

export const compareWithNewValue = (
  actualValue: GaxiosResponse<sheets_v4.Schema$ValueRange> | null,
  newValue: TSeatOption
): boolean => {
  if (actualValue && actualValue.data.values) {
    const val: TSeatOption = actualValue.data.values[0][0];

    return val === newValue;
  }

  return false;
};

export function removeNonPhisicalSeats(columns: TSeatOption[][], i: number) {
  return columns[i].filter(
    (seat: TSeatOption) =>
      !(
        seat === "Teletrabajo" ||
        seat === "No sabe" ||
        seat === "Vacaciones" ||
        seat === "Presencial" ||
        seat === "Remove"
      )
  );
}

export function getSingleCellValue(sheets: sheets_v4.Sheets, sheetId: string, cell: string) {
  return sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: `${ENV.sheetConfig.name}!${cell}` });
}

export function writeCells(
  nonDuplicatedColumns: TWeekConfiguration,
  sheetValues: sheets_v4.Resource$Spreadsheets$Values,
  sheetId: string
) {
  const cellsToUpdate = Object.values(nonDuplicatedColumns).map(async (dayInfo) => {
    const promise = sheetValues.update({
      spreadsheetId: sheetId,
      range: dayInfo.cell,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[dayInfo.seat]],
      },
    });
    return promise;
  });

  return Promise.all(cellsToUpdate).catch((err: GaxiosError) => {
    throw new Error(`${err.message}`);
  });
}

export async function removeDuplicatesFromColumns(
  columnValues: Promise<TSeatOption[]>[],
  daysToEdit: TWeekConfiguration
) {
  const nonDuplicatedColumns = { ...daysToEdit };
  const remmainingSeats: { day: TWeekDay | ""; seats: string[] } = { day: "", seats: [] };
  await Promise.all(columnValues)
    .then((columns) => {
      Object.entries(daysToEdit).forEach(async (dayInfo, i) => {
        const [day, value] = dayInfo as [TWeekDay, { seat: TSeatOption; cell: string }];
        const phisicalSeats = removeNonPhisicalSeats(columns, i);

        const duplicatedSeat = phisicalSeats.find((seat) => seat === value.seat);

        if (duplicatedSeat) {
          delete nonDuplicatedColumns[day];
          remmainingSeats.day = day;
          remmainingSeats.seats = PHISICAL_SEAT_OPTIONS.filter((val) => !phisicalSeats.includes(val));
        }
      });
    })
    .catch(() => {
      throw new Error("There was an error getting sheet values");
    });
  return { nonDuplicatedColumns, remmainingSeats };
}

export function getColumnValues(daysToEdit: TWeekConfiguration) {
  return Object.values(daysToEdit).map(async (dayInfo) => {
    const range = `${dayInfo.cell[0]}1:${dayInfo.cell[0]}50`;

    return getSheetColumnValues(range);
  });
}

export async function removeDuplicatesFromUserCells(
  weekConfig: TWeekConfiguration,
  sheets: sheets_v4.Sheets,
  sheetId: string
) {
  const differentValues: TWeekConfiguration = { ...weekConfig };
  const cellValues = Object.values(weekConfig).map(async (dayInfo) =>
    getSingleCellValue(sheets, sheetId, dayInfo.cell)
  );

  await Promise.all(cellValues)
    .then((cellValue) => {
      Object.entries(weekConfig).forEach(async (dayInfo, i) => {
        const [day, value] = dayInfo as [TWeekDay, { seat: TSeatOption; cell: string }];
        const actualValue = cellValue[i];
        const isEqual = compareWithNewValue(actualValue, value.seat);

        if (isEqual) delete differentValues[day];
      });
    })
    .catch(() => {
      throw new Error("There was an error getting sheet values");
    });

  return differentValues;
}
