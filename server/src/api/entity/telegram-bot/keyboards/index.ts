import { cronMenu, TCronMenu } from "./cron-menu-keyboard";
import { cronStatusMenu, TCronStatusMenu } from "./cron-status-menu-keyboard";
import { employeeMenu, TEmployeeMenu } from "./employee-menu-keyboard";
import { getKeyboard } from "./keyboard-handler";
import { mainMenu, TMainMenu } from "./main-menu-keyboard";
import { employeeNamesMenu } from "./names-menu-keyboard";
import { seatsMenu, TSeatsMenu } from "./seats-menu-keyboard";
import { sheetMenu, TSheetMenu } from "./sheet-menu-keyboard";
import { weekMenu, TWeekMenu } from "./week-menu-keyboard";

const NEW_TELEGRAM_KEYBOARD = {
  mainMenu: mainMenu,
  sheetMenu: sheetMenu,
  cronMenu: cronMenu,
  employeeMenu: employeeMenu,
  employeeNamesMenu: employeeNamesMenu,
  daysMenu: weekMenu,
  seatsMenu: seatsMenu,
  cronStatusMenu: cronStatusMenu,
};

type TMenus = TMainMenu | TSheetMenu | TWeekMenu | TSeatsMenu | TCronMenu | TCronStatusMenu | TEmployeeMenu;

export type { TMenus };

export default Object.freeze(NEW_TELEGRAM_KEYBOARD);
export { getKeyboard };
