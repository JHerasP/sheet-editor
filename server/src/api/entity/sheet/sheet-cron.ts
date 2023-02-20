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
  printCronInfo(startCron.name, `Cron started at ${newDate}`);

  const job = cron.schedule(validCrom, () => {
    printCronAction();

    cronHandler()
      .then(() => {
        job.stop();
        const interval = parseExpression(validResetCrom).next().toDate();

        printCronInfo(cron.schedule.name, `Sheet eddited, setting Cron to sleep until ${formatDate(interval)}`);
      })
      .catch(([functionName, errorMessage]) => printCronException(functionName, errorMessage));
  });

  cron.schedule(validResetCrom, () => {
    job.start();

    const restartCromDate = formatDate(new Date());
    printCronInfo("Restarting cron", `Cron restarted at ${restartCromDate}`);
  });
};
