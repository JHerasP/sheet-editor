import { ENV } from "./env";
import cron from "node-cron";

export function validateENV(env: typeof ENV) {
  checkValidCron(env.cronExpresion);
  checkValidSheetInfo(env.sheetConfig);
  checkValidTelegramInfo(env.telegram);
  checkValidEmployeeInfo(env.employeeNames);
}

function checkValidCron(cronTimer?: string) {
  if (!cronTimer) throw Error("Missing cron");
  if (!cron.validate(cronTimer)) throw Error("Cron is invalid");
}

function checkValidSheetInfo(sheetConfig: typeof ENV["sheetConfig"]) {
  Object.values(sheetConfig).forEach((config) => {
    if (!config) throw new Error(`${config} is missing`);
  });
}

function checkValidTelegramInfo(sheetConfig: typeof ENV["telegram"]) {
  Object.entries(sheetConfig).forEach(([key, config]) => {
    if (!config) throw new Error(`${key} is missing`);
  });
}

function checkValidEmployeeInfo(sheetConfig: typeof ENV["employeeNames"]) {
  if (!sheetConfig) throw Error("Missing employee names");
}
