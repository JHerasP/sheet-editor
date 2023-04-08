import cron from "node-cron";
import TelegramBot from "node-telegram-bot-api";
import { awaitResolver } from "../../../../TS_tools/general-utility";
import { TMenus } from "../keyboards";
import { getKeyboard } from "../keyboards/keyboard-handler";
import { sheetCron } from "../sheet";
import { SheetController } from "../sheet/SheetController";
import { TSeatOption, TWeekDay } from "../sheet/weekConfiguration";
import { setEmployeeCells, showOperationDone } from "./telegra-sheet-editor-helper";
import { queryHandler } from "./telegramEditorHandler";

export class TelegramSheetEditor {
  private userId: number;
  private userKey: string;
  private telegramBot: TelegramBot;
  private sheetController: Record<string, SheetController>;
  private selectedDay?: TWeekDay;
  private selectedSeat?: TSeatOption;
  private cronName: string;

  constructor(
    userId: number,
    userKey: string,
    telegramBot: TelegramBot,
    sheetController: Record<string, SheetController>,
    cronName: string
  ) {
    this.userId = userId;
    this.userKey = userKey;
    this.telegramBot = telegramBot;
    this.sheetController = sheetController;
    this.cronName = cronName;
    this.textSubscribers();

    sheetCron.startService(this.sheetController[this.userKey], this, cronName);
  }

  locateCells() {
    return setEmployeeCells(this, this.userKey);
  }

  setSelectedDay(day: TWeekDay) {
    this.selectedDay = day;
  }

  setSelectedSeat(seat: TSeatOption) {
    this.selectedSeat = seat;
  }

  saveWeekConfig() {
    const actualConfig = this.sheetController[this.userKey].getWeekConfig();
    if (this.selectedDay && this.selectedSeat)
      this.sheetController[this.userKey].setWeekConfig(this.selectedDay, {
        seat: this.selectedSeat,
        cell: actualConfig[this.selectedDay].cell,
      });
  }

  saveWeekCellsConfig(day: TWeekDay, cell: string) {
    const actualConfig = this.sheetController[this.userKey].getWeekConfig();

    this.sheetController[this.userKey].setWeekConfig(day, {
      seat: actualConfig[day].seat,
      cell: cell,
    });
  }

  enableCron() {
    const task = cron.getTasks();

    task.get(this.cronName)?.start();
    this.sheetController[this.userKey].setCronConfiguration({ isRunning: true, hasError: false, lastError: "" });
  }

  removeCron() {
    const task = cron.getTasks();
    task.get(this.cronName)?.stop();

    this.sheetController[this.userKey].setCronConfiguration({ isRunning: false, hasError: false, lastError: "" });
  }

  getStatusCron() {
    return this.sheetController[this.userKey].getCronConfiguration();
  }

  readSheetValues() {
    return this.sheetController[this.userKey].readSheetValues();
  }

  writeSheet() {
    return this.sheetController[this.userKey].writeSheet();
  }

  private textSubscribers() {
    this.telegramBot.on("callback_query", async (callbackQuery) => {
      if (this.userId !== callbackQuery.from.id) return;
      const command = callbackQuery.data as TMenus;
      const callbackId = callbackQuery.id;

      const [, err] = await awaitResolver<any, Error>(queryHandler(this, command));

      if (err) return this.telegramBot.answerCallbackQuery(callbackId || "", { text: err.message, show_alert: true });
      else {
        if (showOperationDone(command))
          this.telegramBot.answerCallbackQuery(callbackId || "", { text: "Operation done (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧" });
      }

      const keyBoard = getKeyboard(command, this.sheetController[this.userKey], this.getStatusCron(), this.selectedDay);
      if (!keyBoard) return;

      this.telegramBot
        .editMessageText(keyBoard?.message, {
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
