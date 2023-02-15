import { parseExpression } from "cron-parser";
import cron from "node-cron";
import { ENV } from "../../../config";
import { formatDate } from "../../utils/formatDates";
import { printCronAction, printCronException, printCronInfo } from "../../utils/print";
import { cronHandler } from "./sheet-cron-handler";
import { checkValidCron, notValidCron } from "./sheet-error-handler";

export const startCron = () => {
  const validCrom = checkValidCron(ENV.cronExpresion);
  const validResetCrom = checkValidCron(ENV.esetCronExpresion);

  if (!validCrom || !validResetCrom) return notValidCron();

  const newDate = formatDate(new Date());
  printCronInfo(startCron.name, `Crom started at ${newDate}`);

  let sleepCron = false;

  cron.schedule(validCrom, () => {
    if (sleepCron) return;
    printCronAction();

    cronHandler()
      .then(() => {
        sleepCron = true;
        const interval = parseExpression(validResetCrom).next().toDate();

        printCronInfo(cron.schedule.name, `Sheet eddited, setting Cron to sleep until ${formatDate(interval)}`);
      })
      .catch(([functionName, errorMessage]) => printCronException(functionName, errorMessage));
  });

  cron.schedule(validResetCrom, () => {
    if (sleepCron) {
      const restartCromDate = formatDate(new Date());
      printCronInfo("Restarting crom", `Crom restarted at ${restartCromDate}`);
      sleepCron = false;
    }
  });
};
