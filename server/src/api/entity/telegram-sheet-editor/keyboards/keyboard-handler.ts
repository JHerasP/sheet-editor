import { caseGuard } from "../../../../../TS_tools/general-utility";
import { cronConfiguration, SheetController } from "../../sheet/SheetController";
import { TWeekDay } from "../../sheet/weekConfiguration";
import NEW_TELEGRAM_KEYBOARD, { TMenus } from "./index";

export const getKeyboard = (
  command: TMenus,
  sheetController: SheetController,
  cronStatus: cronConfiguration,
  selectedDay?: TWeekDay
) => {
  const seats = Object.entries(sheetController.getWeekConfig())
    .map(([key, value]) => `- ${key} : ${value.seat} \n`)
    .join("");

  const sheetValues = Object.entries(sheetController.getSheetWeekValues())
    .map(([key, value]) => `- ${key} : ${value} \n`)
    .join("");

  switch (command) {
    case "Sheet":
      return { message: "📖 Sheet configuration", keyboard: NEW_TELEGRAM_KEYBOARD.sheetMenu };
    case "Cron":
      return { message: "⌚ Cron configuration", keyboard: NEW_TELEGRAM_KEYBOARD.cronMenu };
    case "Get values":
      return { message: `🗃 Sheet values : \n\n${sheetValues}`, keyboard: NEW_TELEGRAM_KEYBOARD.sheetMenu };
    case "Fill sheet":
      return { message: "Tell me what you want to do ヾ(•ω•`)o", keyboard: NEW_TELEGRAM_KEYBOARD.mainMenu };
    case "Monday":
    case "Tuesday":
    case "Wednesday":
    case "Thursday":
    case "Friday":
      return {
        message: `🗃 Sheet values: \n\n${seats} \n 🪑 Select a seat for ${selectedDay}`,
        keyboard: NEW_TELEGRAM_KEYBOARD.seatsMenu,
      };
    case "Edit configuration":
    case "A1":
    case "A2":
    case "A3":
    case "A4":
    case "A5":
    case "B1":
    case "B2":
    case "B3":
    case "B4":
    case "B5":
    case "C1":
    case "C2":
    case "C3":
    case "D1":
    case "D2":
    case "D3":
    case "Teletrabajo":
    case "Presencial":
    case "Vacaciones":
    case "Remove":
    case "No sabe":
      return {
        message: `📎 Sheet configuration : \n\n${seats} \n 📅 Select a day`,
        keyboard: NEW_TELEGRAM_KEYBOARD.daysMenu,
      };
    case "Turn on":
    case "Turn off":
      return { message: "⌚ Cron configuration", keyboard: NEW_TELEGRAM_KEYBOARD.cronMenu };
    case "Status":
      return {
        message: `📡 Cron Status \n\n Running: ${cronStatus.isRunning} \n Error: ${cronStatus.hasError}`,
        keyboard: NEW_TELEGRAM_KEYBOARD.cronStatusMenu,
      };
    case "Get error":
      return {
        message: `📡 Cron Status \n\n Running: ${cronStatus.isRunning} \n Errors: ${cronStatus.hasError}`,
        keyboard: NEW_TELEGRAM_KEYBOARD.cronStatusMenu,
      };
    case "Employee":
      return {
        message: `🎭 Who are you? :`,
        keyboard: NEW_TELEGRAM_KEYBOARD.employeeNamesMenu,
      };

    case "Return":
      return { message: "Tell me what you want to do ヾ(•ω•`)o", keyboard: NEW_TELEGRAM_KEYBOARD.mainMenu };
    default:
      caseGuard(command);
      return undefined;
  }
};
