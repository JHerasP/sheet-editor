import cron from "node-cron";
import TelegramBot from "node-telegram-bot-api";
import { awaitResolver } from "../../../../TS_tools/general-utility";
import { SheetController } from "../sheet/SheetController";
import { getKeyboard, TMenus } from "./keyboards";
import NEW_TELEGRAM_KEYBOARD from "./keyboards/index";
import { queryHandler } from "./telegramEditorHandler";
import { TSeatOption, TWeekConfigValues, TWeekDay } from "../sheet/weekConfiguration";
import { sheetCron } from "../sheet";
import { ENV } from "../../../config";
const TKA = NEW_TELEGRAM_KEYBOARD;

export class TelegramSheetEditor {
  private telegramBot: TelegramBot;
  private sheetController: SheetController;
  private selectedDay?: TWeekDay;
  private selectedSeat?: TSeatOption;
  private cronName: string;

  constructor(telegramBot: TelegramBot, sheetController: SheetController, cronName: string) {
    this.telegramBot = telegramBot;
    this.sheetController = sheetController;
    this.cronName = cronName;
    this.textSubscribers();
    sheetCron.startService(sheetController, this, cronName);
  }

  setSelectedDay(day: TWeekDay) {
    this.selectedDay = day;
  }

  setSelectedSeat(seat: TSeatOption) {
    this.selectedSeat = seat;
  }

  saveWeekConfig() {
    if (this.selectedDay && this.selectedSeat)
      this.sheetController.setWeekConfig(this.selectedDay, { seat: this.selectedSeat, cell: "" });
  }

  saveWeekCellsConfig(day: TWeekDay, values: TWeekConfigValues) {
    this.sheetController.setWeekConfig(day, values);
  }

  enableCron() {
    const task = cron.getTasks();

    task.get(this.cronName)?.start();
    this.sheetController.setCronConfiguration({ isRunning: true, hasError: false, lastError: "" });
  }

  removeCron() {
    const task = cron.getTasks();
    task.get(this.cronName)?.stop();

    this.sheetController.setCronConfiguration({ isRunning: false, hasError: false, lastError: "" });
  }

  getStatusCron() {
    return this.sheetController.getCronConfiguration();
  }

  readSheetValues() {
    return this.sheetController.readSheetValues();
  }

  writeSheet() {
    return this.sheetController.writeSheet();
  }

  private textSubscribers() {
    this.telegramBot.onText(/start/, async (msg) => {
      const chatId = msg.chat.id;

      this.telegramBot.sendMessage(chatId, "Tell me what you want to do ヾ(•ω•`)o", {
        reply_markup: {
          inline_keyboard: TKA.mainMenu,
        },
      });
    });

    this.telegramBot.on("callback_query", async (callbackQuery) => {
      const command = callbackQuery.data as TMenus;
      const callbackId = callbackQuery.id;

      const [, err] = await awaitResolver<any, Error>(queryHandler(this, command));

      if (err) this.telegramBot.answerCallbackQuery(callbackId || "", { text: err.message, show_alert: true });
      else {
        if (showOperationDone(command))
          this.telegramBot.answerCallbackQuery(callbackId || "", { text: "Operation done (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧" });
      }

      const keyBoard = getKeyboard(command, this.sheetController, this.getStatusCron(), this.selectedDay);
      if (!keyBoard) return;

      this.telegramBot
        .editMessageText(keyBoard?.message || "", {
          chat_id: callbackQuery.from.id,
          message_id: callbackQuery.message?.message_id,
          reply_markup: {
            inline_keyboard: keyBoard?.keyboard,
          },
        })
        .catch(() => undefined);
    });
  }
}

const showOperationDone = (command: TMenus) => {
  if (
    command === "Get values" ||
    command === "Fill sheet" ||
    command === "Turn on" ||
    command === "Turn off" ||
    command.includes(ENV.telegram.secretCode)
  )
    return true;
  else return false;
};
