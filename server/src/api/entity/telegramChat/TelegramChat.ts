import TelegramBot from "node-telegram-bot-api";
import { ENV } from "../../../config";
import NEW_TELEGRAM_KEYBOARD from "../keyboards/index";
import { SheetController } from "../sheet/SheetController";
import { TelegramSheetEditor } from "../telegram-sheet-editor/TelegramSheetEditor";
const TKA = NEW_TELEGRAM_KEYBOARD;

export class TelegramChat {
  private telegramBot: TelegramBot;
  private configurations: Record<string, SheetController>;
  private userList: Set<number>;

  constructor(telegramBot: TelegramBot, nameList: string[]) {
    this.telegramBot = telegramBot;
    this.configurations = createConfigurations(nameList);
    this.userList = new Set();

    this.textSubscribers();
  }

  private textSubscribers() {
    this.telegramBot.onText(/start/, async (msg) => {
      const chatId = msg.chat.id;
      const userId = msg.from?.id;
      if (!userId) return;

      this.telegramBot.sendMessage(chatId, "Tell me what you want to do ヾ(•ω•`)o", {
        reply_markup: {
          inline_keyboard: TKA.employeeNamesMenu,
        },
      });
    });

    this.telegramBot.on("callback_query", async (callbackQuery) => {
      const command = callbackQuery.data;
      const userId = callbackQuery.from?.id;

      const newUser = !this.userList.has(userId);

      if (command && command.includes(ENV.telegram.secretCode)) {
        if (newUser) {
          console.info("🆗", "New user", userId);

          this.userList.add(userId);
          new TelegramSheetEditor(
            userId,
            command.replace(ENV.telegram.secretCode, ""),
            this.telegramBot,
            this.configurations,
            "1".toString()
          );
        }
        this.telegramBot
          .editMessageText("TKA.mainMenu" || "", {
            chat_id: callbackQuery.from.id,
            message_id: callbackQuery.message?.message_id,
            reply_markup: {
              inline_keyboard: TKA.mainMenu,
            },
          })
          .catch(() => undefined);
      }
    });
  }
}
const createConfigurations = (nameList: string[]) => {
  const target: Record<string, SheetController> = {};
  nameList.forEach((name) => {
    target[name] = new SheetController();
  });
  return target;
};
