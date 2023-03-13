import { GaxiosError, GaxiosResponse } from "gaxios";
import { sheets_v4 } from "googleapis";
import { awaitResolver } from "../../../../TS_tools/general-utility";
import { ENV } from "../../../config";
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
        spreadsheetId: sheetId!,
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
