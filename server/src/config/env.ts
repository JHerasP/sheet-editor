import dotenv from "dotenv";

const envFound = dotenv.config();
if (envFound.error) throw new Error("🔴 Couldn't find .env file 🔴");

const envInfo = process.env;

const ENV = {
  port: envInfo.PROJECT_PORT,
  cronExpresion: envInfo.CRON_EXPRESION,
  esetCronExpresion: envInfo.RESET_CRON_EXPRESION,
  sheetConfig: {
    id: envInfo.SHEET_ID,
    name: envInfo.SHEET_NAME,
    readCells: envInfo.SHEET_RANGE_READ,
    writeCells: envInfo.SHEET_RANGE_WRITE,
    employeeName: envInfo.EMPLOYEE_NAME,
    monday: envInfo.WEEK_MONDAY,
    tuesday: envInfo.WEEK_TUESDAY,
    wedneeday: envInfo.WEEK_WEDNESDAY,
    thursday: envInfo.WEEK_THURSDAY,
    friday: envInfo.WEEK_FRIDAY,
  },
};
const freezedENV = Object.freeze(ENV);
export { freezedENV as ENV };
