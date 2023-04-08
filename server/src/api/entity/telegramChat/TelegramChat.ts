import TelegramBot from "node-telegram-bot-api";
import { telegramTools } from "../../utils";
import { hasSecretCode, removeSecretCode } from "../../utils/tools";
import NEW_TELEGRAM_KEYBOARD from "../keyboards/index";
import { SheetController } from "../sheet/SheetController";
import { TelegramSheetEditor } from "../telegram-sheet-editor/TelegramSheetEditor";
import { createConfigurationsFromEmployees } from "./telegramChatHelper";
const TKA = NEW_TELEGRAM_KEYBOARD;

export class TelegramChat {
  private telegramBot: TelegramBot;
  private sheetConfigurations: Record<string, SheetController>;
  private loggedUsers: Set<number>;

  constructor(telegramBot: TelegramBot, employeeList: string[]) {
    this.telegramBot = telegramBot;
    this.sheetConfigurations = createConfigurationsFromEmployees(employeeList);
    this.loggedUsers = new Set();
    this.textSubscribers();
  }

  private textSubscribers() {
    this.telegramBot.onText(/start/, async (msg) => {
      const chatId = msg.chat.id;
      const userId = msg.from?.id;
      if (!userId) return;

      telegramTools.sendMessage(this.telegramBot, chatId, "Who are you? ヾ(•ω•`)o", TKA.employeeNamesMenu);
    });

    this.telegramBot.on("callback_query", async (callbackQuery) => {
      const command = callbackQuery.data || "";
      const userId = callbackQuery.from.id;
      const callbackId = callbackQuery.id;
      const messageId = callbackQuery.message?.message_id;
      const newUser = !this.loggedUsers.has(userId);

      if (hasSecretCode(command)) {
        if (newUser) {
          console.info("🆗", "New user", command, userId);

          this.loggedUsers.add(userId);

          const sheetEditor = new TelegramSheetEditor(
            userId,
            removeSecretCode(command),
            this.telegramBot,
            this.sheetConfigurations,
            userId.toString()
          );

          telegramTools.editMessage(
            this.telegramBot,
            userId,
            `Hello ${removeSecretCode(command)} o(*^▽^*)┛ \n\n I am looking for your cells, please wait... \n`,
            [],
            messageId
          );

          await sheetEditor
            .locateCells()
            .then(() =>
              this.telegramBot
                .answerCallbackQuery(callbackId, { text: "Operation done (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧" })
                .catch(() => undefined)
            )
            .catch(() =>
              this.telegramBot
                .answerCallbackQuery(callbackId, { text: "Something went wrong (* ￣︿￣)" })
                .catch(() => undefined)
            );
        }

        this.telegramBot
          .editMessageText("Tell me what you want toooooo do ヾ(•ω•`)o", {
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
