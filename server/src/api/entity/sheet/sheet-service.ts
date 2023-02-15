import { google } from "googleapis";
import { awaitResolver } from "../../../../TS_tools/general-utility";

import { ENV } from "../../../config";

async function authSheets() {
  const googleAuth = new google.auth.GoogleAuth({
    keyFile: "keys.env",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const authClient = await googleAuth.getClient();

  const sheets = google.sheets({ version: "v4", auth: authClient });

  return sheets;
}

export const getSheetValues = async () => {
  const [sheets] = await awaitResolver(authSheets());

  if (!ENV.sheetConfig.id) return;
  if (!sheets) return;

  const [getRows] = await awaitResolver(
    sheets.spreadsheets.values.get({
      spreadsheetId: ENV.sheetConfig.id,
      range: `${ENV.sheetConfig.name}${ENV.sheetConfig.readCells}`,
    })
  );

  if (getRows) return getRows.data;
  return undefined;
};

export const postSheetValues = async (values: string[][]) => {
  const [sheets] = await awaitResolver(authSheets());
  if (!sheets) return;
  if (!ENV.sheetConfig.id) return;

  const sheetValues = sheets.spreadsheets.values;

  const [_, err] = await awaitResolver(
    sheetValues.update({
      spreadsheetId: ENV.sheetConfig.id,
      range: `${ENV.sheetConfig.name}${ENV.sheetConfig.writeCells}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: values,
      },
    })
  );
  if (err) throw [postSheetValues.name, err];
};
