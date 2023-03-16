import TelegramBot from "node-telegram-bot-api";
import { SheetController } from "./src/api/entity/sheet/SheetController";
import { TelegramSheetEditor } from "./src/api/entity/telegram-bot/TelegramChat";
import { ENV } from "./src/config";
const { telegram } = ENV;
const { token } = telegram;

const cronName = "writter";
const sheetController = new SheetController();
const telegramBot = new TelegramBot(token, { polling: true });
new TelegramSheetEditor(telegramBot, sheetController, cronName);
