import { GaxiosError, GaxiosResponse } from "gaxios";
import { sheets_v4 } from "googleapis";
import { awaitResolver, normalice } from "../../../../TS_tools/general-utility";
import { ENV } from "../../../config";
import { nextLetter } from "../../utils/tools";
import {
  authSheets,
  getColumnValues,
  removeDuplicatesFromColumns as removeDuplicateColumns,
  removeDuplicatesFromUserCells as removeDuplicatesFromUserRow,
  writeCells,
} from "./sheet-service-helper";
import { TSeatOption, TWeekConfiguration, TWeekDay, TWeekValues } from "./weekConfiguration";

export const getSheetValues = async (weekConfig: TWeekConfiguration): Promise<TWeekValues> => {
  const [sheets] = await awaitResolver(authSheets());
  const sheetId = ENV.sheetConfig.id;
  if (!sheets) throw new Error(`No sheet`);

  const weekValues: Partial<TWeekValues> = {};

  for (const [day, value] of Object.entries(weekConfig)) {
    const key = day as TWeekDay;
    const options = value as { seat: TSeatOption; cell: string };

    await sheets.spreadsheets.values
      .get({
        spreadsheetId: sheetId,
        range: `${ENV.sheetConfig.name}!${options.cell}`,
      })
      .then((res) => {
        if (res.data.values) {
          const val = res.data.values[0][0];

          weekValues[key] = val;
        } else weekValues[key] = undefined;
      })
      .catch((error) => {
        throw new Error(`${key}: ${error}`);
      });
  }

  return weekValues as TWeekValues;
};

export const postSheetValues = async (weekConfig: TWeekConfiguration) => {
  const [sheets] = await awaitResolver(authSheets());
  const sheetId = ENV.sheetConfig.id;
  if (!sheets) throw new Error(`No sheet`);

  const sheetValues = sheets.spreadsheets.values;

  const daysToEdit = await removeDuplicatesFromUserRow(weekConfig, sheets, sheetId);

  const columnValues = getColumnValues(daysToEdit);

  const { nonDuplicatedColumns, remmainingSeats } = await removeDuplicateColumns(columnValues, daysToEdit);

  if (remmainingSeats.day)
    throw new Error(
      `${remmainingSeats.day}: \n The seat is arelady used, try these: \n ${remmainingSeats.seats.join()}`
    );

  return writeCells(nonDuplicatedColumns, sheetValues, sheetId);
};

export const getSheetColumnValues = async (range: string): Promise<TSeatOption[]> => {
  const [sheets] = await awaitResolver(authSheets());
  const sheetId = ENV.sheetConfig.id;
  if (!sheets) throw new Error(`No sheet`);

  const promise = sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${ENV.sheetConfig.name}!${range}`,
  }) as Promise<GaxiosResponse<sheets_v4.Schema$ValueRange>>;

  const [res, err] = await awaitResolver<GaxiosResponse<sheets_v4.Schema$ValueRange>, GaxiosError>(promise);

  if (err) throw new Error(`Error at reading the sheet`);
  if (res.data && res.data.values) return res.data.values.flat() as TSeatOption[];

  return ["Remove"] as TSeatOption[];
};

const employeesColumnLetter = "K";
export const getNamesColumn = async (userName: string) => {
  const [sheets] = await awaitResolver(authSheets());
  const sheetId = ENV.sheetConfig.id;
  if (!sheets) throw new Error(`No sheet`);

  const names = await getSheetColumnValues(`${employeesColumnLetter}1:${employeesColumnLetter}100`)
    .then((x) => x)
    .catch(() => {
      throw new Error(`Error when getting the cell values`);
    });

  const existName = names?.some((name) => normalice(name) === normalice(userName));

  if (!existName) throw new Error(`Name ${userName} not found`);

  let rowNumber = "";
  let emptyCells = 0;

  for (let i = 1; i < 100; i++) {
    if (emptyCells > 10) break;
    await sheets.spreadsheets.values
      .get({
        spreadsheetId: sheetId,
        range: `${ENV.sheetConfig.name}!${employeesColumnLetter}${i}`,
      })
      .then((res) => {
        if (res.data.values) {
          const val = res.data.values[0][0];
          if (normalice(val) === normalice(userName)) rowNumber = `${i}`;
        } else emptyCells++;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  const mondayLetter = nextLetter(employeesColumnLetter);
  const tuesdayLetter = nextLetter(mondayLetter);
  const wedNesdayLetter = nextLetter(tuesdayLetter);
  const thursdayLetter = nextLetter(wedNesdayLetter);
  const fridayLetter = nextLetter(thursdayLetter);

  const weekConfig: Record<TWeekDay, string> = {
    Monday: `${mondayLetter}${rowNumber}`,
    Tuesday: `${tuesdayLetter}${rowNumber}`,
    Wednesday: `${wedNesdayLetter}${rowNumber}`,
    Thursday: `${thursdayLetter}${rowNumber}`,
    Friday: `${fridayLetter}${rowNumber}`,
  };

  return weekConfig;
};
