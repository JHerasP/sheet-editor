import TelegramBot from "node-telegram-bot-api";
import { ENV } from "../../../config";
const { telegram } = ENV;
const { token } = telegram;
const seatOptions = [
  "Teletrabajo",
  "Presencial",
  "Vacaciones",
  "No sabe",
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "B1",
  "B2",
  "B3",
  "B4",
  "B5",
  "C1",
  "C2",
  "C3",
  "D1",
  "D2",
  "D3",
] as const;
type seatOption = typeof seatOptions[number];

const seatText = seatOptions.map((option) => ({ text: option }));

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
type weekDay = typeof weekDays[number];

export type TConfigData = Record<weekDay, seatOption>;

const configData: Record<weekDay, seatOption> = {
  Monday: "Teletrabajo",
  Tuesday: "Presencial",
  Wednesday: "Teletrabajo",
  Thursday: "Teletrabajo",
  Friday: "Presencial",
};

const bot = new TelegramBot(token || "", { polling: true });

function getBot() {
  let selectedDay: string | undefined;
  let selectedValue: string | undefined;

  bot.onText(/config/, (msg) => {
    const chatId = msg.chat.id;
    const keyBoard: TelegramBot.KeyboardButton[][] = [
      [{ text: "Monday" }, { text: "Tuesday" }, { text: "Wednesday" }, { text: "Thursday" }, { text: "Friday" }],
    ];

    const contactKeyboardTwo: TelegramBot.SendMessageOptions = {
      reply_markup: {
        force_reply: true,
        resize_keyboard: true,
        one_time_keyboard: true,
        keyboard: keyBoard,
      },
    };
    const message = Object.entries(configData).map(([key, value]) => `- ${key} : ${value} \n`);
    const m = message.join("");

    bot.sendMessage(chatId, `Actual config:\n${m}`);
    bot.sendMessage(chatId, "Select a day of the week", contactKeyboardTwo);
  });

  bot.onText(
    /^(?:sun(?:day)?|mon(?:day)?|tue(?:sday)?|wed(?:nesday)?|thu(?:rsday)?|fri(?:day)?|sat(?:urday)?)$/i,
    (msg) => {
      const chatId = msg.chat.id;
      selectedDay = msg.text;

      const arrat = [...seatText];

      const petete = arrat.splice(4);
      const peteteA = petete.splice(5);
      const peteteB = peteteA.splice(5);
      const peteteC = peteteB.splice(3);
      const peteteD = peteteC.splice(3);
      const keyBoard: TelegramBot.KeyboardButton[][] = [arrat, petete, peteteA, peteteB, peteteC, peteteD];

      const contactKeyboardTwo: TelegramBot.SendMessageOptions = {
        reply_markup: {
          force_reply: true,
          resize_keyboard: true,
          one_time_keyboard: true,
          keyboard: keyBoard,
        },
      };

      console.log(seatText);

      bot.sendMessage(chatId, "Select a seat", contactKeyboardTwo);
    }
  );

  bot.onText(/^(?:[A-D][1-9]?|No sabe?|Vacaciones?|Presencial?|Teletrabajo?)$/, (msg) => {
    const chatId = msg.chat.id;
    selectedValue = msg.text;

    if (selectedDay && selectedValue) {
      configData[selectedDay] = selectedValue;
    }

    bot.sendMessage(chatId, "Config saved!");
    const message = Object.entries(configData).map(([key, value]) => `- ${key} : ${value} \n`);
    const m = message.join("");

    bot.sendMessage(chatId, `Actual config:\n${m}`);
    bot.sendMessage(chatId, "/config");
  });

  return { configData, bot };
}

export default getBot;
