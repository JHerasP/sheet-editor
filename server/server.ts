import TelegramBot from "node-telegram-bot-api";
import { TelegramChat } from "./src/api/entity/telegramChat/TelegramChat";
import { ENV } from "./src/config";
const { telegram } = ENV;
const { token } = telegram;

const telegramBot = new TelegramBot(token, { polling: true });
new TelegramChat(telegramBot);
