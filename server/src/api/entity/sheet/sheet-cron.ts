import cron from "node-cron";
import { ENV } from "../../../config";
import { TelegramSheetEditor } from "../telegram-sheet-editor/TelegramSheetEditor";
import { postSheetValues } from "./sheet-service";
import { SheetController } from "./SheetController";
const { cronExpresion } = ENV;

export const startService = (sheetController: SheetController, telegramChat: TelegramSheetEditor, cronName: string) => {
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
};
