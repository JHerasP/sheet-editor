import { parseExpression } from "cron-parser";
import cron from "node-cron";
import { ENV } from "../../../config";
import { formatDate } from "../../utils/formatDates";
import { printCronAction, printCronInfo, printException } from "../../utils/print";
import getBot from "../telegram-bot/Bot";
import { cronHandler } from "./sheet-cron-handler";
import { checkValidCron, notValidCron, notValidTelegramInfo } from "./sheet-error-handler";
const { cronExpresion, resetCronExpresion, telegram } = ENV;
const { chatId, token } = telegram;

export const startCron = () => {
  const { configData, bot } = getBot();
  const validCrom = checkValidCron(cronExpresion);
  const validResetCrom = checkValidCron(resetCronExpresion);

  if (!validCrom || !validResetCrom) return notValidCron();
  if (!token || !chatId) return notValidTelegramInfo();

  const newDate = formatDate(new Date());
  let jobRunning = true;

  printCronInfo(startCron.name, `Cron started at ${newDate}`);

  const job = cron.schedule(validCrom, () => {
    printCronAction();

    cronHandler(configData)
      .then(() => {
        jobRunning = false;
        job.stop();
        const interval = parseExpression(validResetCrom).next().toDate();

        const menssage = `(ﾉ◕ヮ◕)ﾉ Sheet edited, setting Cron to sleep until ${formatDate(interval)}`;

        bot.sendMessage(chatId, menssage);
        printCronInfo(cron.schedule.name, menssage);
      })
      .catch(([functionName, errorMessage]) => printException(functionName, errorMessage));
  });

  cron.schedule(validResetCrom, () => {
    if (jobRunning) return;
    job.start();
    jobRunning = true;

    const restartCromDate = formatDate(new Date());
    printCronInfo("Restarting cron", `Cron restarted at ${restartCromDate}`);
  });
};
