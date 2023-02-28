import { KeyboardButton, SendMessageOptions } from "node-telegram-bot-api";
import { arrayToButtons } from "../../utils/telegram";
import { seatText, weekDays } from "./weekConfiguration";

const daysButtons: KeyboardButton[][] = [arrayToButtons([...weekDays])];

const daysKeyboard: SendMessageOptions = {
  reply_markup: {
    force_reply: true,
    resize_keyboard: true,
    one_time_keyboard: true,
    keyboard: daysButtons,
  },
};

const fristRow = [...seatText];
const secondRow = fristRow.splice(4);
const thirdRow = secondRow.splice(5);
const fourthRow = thirdRow.splice(5);
const fifthRow = fourthRow.splice(3);
const sixthRow = fifthRow.splice(3);

const seatButtons: KeyboardButton[][] = [fristRow, secondRow, thirdRow, fourthRow, fifthRow, sixthRow];

const seatsKeyboard: SendMessageOptions = {
  reply_markup: {
    force_reply: true,
    resize_keyboard: true,
    one_time_keyboard: true,
    keyboard: seatButtons,
  },
};

const TELEGRAM_KEYBOARD = {
  weekDays: daysKeyboard,
  seats: seatsKeyboard,
};

export default Object.freeze(TELEGRAM_KEYBOARD);
