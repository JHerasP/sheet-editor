import cron from "node-cron";
import { ENV } from "../../../config";
import { TelegramChat } from "../telegram-bot/TelegramChat";
import { postSheetValues } from "./sheet-service";
import { SheetController } from "./SheetController";
const { cronExpresion } = ENV;

export const startService = (sheetController: SheetController, telegramChat: TelegramChat, cronName: string) => {
  const job = cron.schedule(
    cronExpresion,
    () => {
      if (!sheetController.getCronConfiguration().isRunning) return;

      postSheetValues(sheetController.getWeekConfig())
        .then(() => telegramChat.removeCron())
        .catch((err) => sheetController.setCronConfiguration({ isRunning: true, hasError: true, lastError: err }));
    },
    { name: cronName }
  );

  job.stop();

  console.info("✅", "Sheet editor rdy to sheet  ┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻ ");
};
