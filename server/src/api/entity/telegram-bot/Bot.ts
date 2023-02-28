import TelegramBot from "node-telegram-bot-api";
import { awaitResolver } from "../../../../TS_tools/general-utility";
import BOT_REGREX from "../../utils/regrex";
import { postSheetValues } from "../sheet/sheet-service";
import TELEGRAM_KEYBOARD from "./keyboard";
import { seatOption, TWeekConfiguration, weekConfiguration, weekDay } from "./weekConfiguration";
const { config, weekDays, weekOptions, writeSheet } = BOT_REGREX;
const TK = TELEGRAM_KEYBOARD;

export class SheetController {
  private sheetConfiguration: TWeekConfiguration = weekConfiguration;
  private telegramBot: TelegramBot;

  constructor(telegramBot: TelegramBot) {
    this.telegramBot = telegramBot;
  }

  getWeekConfig() {
    return this.sheetConfiguration;
  }

  setWeekConfig(key: weekDay, value: seatOption) {
    if (value !== "Remove") this.sheetConfiguration[key] = value;
    /**
     * TODO
     * I havent found an easy way to make a regrex expression from telegram to detect empty spaces as a message response.
     * However, I have to send a blank space to google's API in order to empty a cell.
     */ else this.sheetConfiguration[key] = " " as seatOption;
  }

  sendActualConfig(chatId: number) {
    const message = Object.entries(this.sheetConfiguration)
      .map(([key, value]) => `- ${key} : ${value} \n`)
      .join("");

    return this.telegramBot.sendMessage(chatId, `Actual config:\n${message}`);
  }

  textSubscribers() {
    let selectedDay: weekDay | undefined;
    let selectedValue: seatOption | undefined;

    this.telegramBot.onText(config, async (msg) => {
      const chatId = msg.chat.id;
      await this.sendActualConfig(chatId);
      this.telegramBot.sendMessage(chatId, "Select a day of the week", TK.weekDays);
    });

    this.telegramBot.onText(weekDays, (msg) => {
      const chatId = msg.chat.id;
      selectedDay = msg.text as weekDay;

      this.telegramBot.sendMessage(chatId, "Select a seat", TK.seats);
    });

    this.telegramBot.onText(weekOptions, async (msg) => {
      const chatId = msg.chat.id;
      selectedValue = msg.text as seatOption;

      if (selectedDay && selectedValue) this.setWeekConfig(selectedDay, selectedValue);

      await this.telegramBot.sendMessage(chatId, "Config saved!");
      await this.sendActualConfig(chatId);
      this.telegramBot.sendMessage(chatId, "/config");
    });

    this.telegramBot.onText(writeSheet, async (msg) => {
      const chatId = msg.chat.id;

      const [_, error] = await awaitResolver(this.writeSheet());

      if (!error) this.telegramBot.sendMessage(chatId, "Everything good");
      else this.telegramBot.sendMessage(chatId, "Burp");

      this.telegramBot.sendMessage(chatId, "/config");
    });
  }

  async writeSheet() {
    const { Monday, Tuesday, Wednesday, Thursday, Friday } = this.sheetConfiguration;
    await postSheetValues([[Monday, Tuesday, Wednesday, Thursday, Friday]]);
  }
}
