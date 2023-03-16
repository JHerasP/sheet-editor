import TelegramBot from "node-telegram-bot-api";
import NEW_TELEGRAM_KEYBOARD from "../keyboards/index";
import { SheetController } from "../sheet/SheetController";
import { TelegramSheetEditor } from "../telegram-sheet-editor/TelegramSheetEditor";
const TKA = NEW_TELEGRAM_KEYBOARD;

export class TelegramChat {
  private telegramBot: TelegramBot;
  private userID: number | undefined;

  constructor(telegramBot: TelegramBot) {
    this.telegramBot = telegramBot;

    this.textSubscribers();
  }

  private textSubscribers() {
    this.telegramBot.onText(/start/, async (msg) => {
      const chatId = msg.chat.id;
      this.userID = msg.from?.id;

      if (this.userID) {
        const cronName = this.userID.toString();
        const sheetController = new SheetController();

        new TelegramSheetEditor(this.userID, this.telegramBot, sheetController, cronName);
      }

      this.telegramBot.sendMessage(chatId, "Tell me what you want to do ヾ(•ω•`)o", {
        reply_markup: {
          inline_keyboard: TKA.mainMenu,
        },
      });
    });
  }
}
