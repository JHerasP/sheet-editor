import dotenv from "dotenv";
import { validateENV } from "./envhelper";

const envFound = dotenv.config();
if (envFound.error) throw new Error("🔴 Couldn't find .env file 🔴");

const envInfo = process.env;

const ENV = {
  cronExpresion: envInfo.CRON_EXPRESION!,
  sheetConfig: {
    id: envInfo.SHEET_ID!,
    name: envInfo.SHEET_NAME!,
    readCells: envInfo.SHEET_RANGE_READ!,
    writeCells: envInfo.SHEET_RANGE_WRITE!,
  },
  telegram: {
    token: envInfo.TELEGRAM_TOKEN!,
    secretCode: envInfo.SECRET_CODE!,
  },
  employeeNames: envInfo.EMPLOYEE_NAMES?.split(",")!,
} as const;

validateENV(ENV);

const freezedENV = Object.freeze(ENV);
export { freezedENV as ENV };
