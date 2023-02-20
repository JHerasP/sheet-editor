import { parseExpression } from "cron-parser";
import cron from "node-cron";
import { ENV } from "../../../config";
import { formatDate } from "../../utils/formatDates";
import { printCronAction, printException, printCronInfo } from "../../utils/print";
import { cronHandler } from "./sheet-cron-handler";
import { checkValidCron, notValidCron, notValidTelegramInfo } from "./sheet-error-handler";
import TelegramBot from "node-telegram-bot-api";
const { cronExpresion, resetCronExpresion, telegram } = ENV;
const { chatId, token } = telegram;

export const startCron = () => {
  const validCrom = checkValidCron(cronExpresion);
  const validResetCrom = checkValidCron(resetCronExpresion);

  if (!validCrom || !validResetCrom) return notValidCron();
  if (!token || !chatId) return notValidTelegramInfo();

  const newDate = formatDate(new Date());
  const bot = new TelegramBot(token, { polling: true });
  let jobRunning = true;

  printCronInfo(startCron.name, `Cron started at ${newDate}`);

  const job = cron.schedule(validCrom, () => {
    printCronAction();

    cronHandler()
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
