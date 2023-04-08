import TelegramBot from "node-telegram-bot-api";
import { TelegramChat } from "./src/api/entity/telegramChat/TelegramChat";
import { ENV } from "./src/config";
const { telegram, employeeNames } = ENV;
const { token } = telegram;
const nameList = employeeNames;

const telegramBot = new TelegramBot(token, { polling: true });
new TelegramChat(telegramBot, nameList);
console.info("✅", "Sheet editor rdy to sheet  ┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻ ");
