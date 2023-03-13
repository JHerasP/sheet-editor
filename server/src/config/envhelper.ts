import { ENV } from "./env";
import cron from "node-cron";

export function validateENV(env: typeof ENV) {
  checkValidCron(env.cronExpresion);
  checkValidSheetInfo(env.sheetConfig);
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
