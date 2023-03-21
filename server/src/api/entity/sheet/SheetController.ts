import { getSheetValues, postSheetValues } from "./sheet-service";
import {
  createWeekConfiguration,
  TSeatOption,
  TWeekConfiguration,
  TWeekConfigValues,
  TWeekDay,
  TWeekValues,
  weekValuesInit,
} from "./weekConfiguration";

export type cronConfiguration = { isRunning: boolean; hasError: boolean; lastError: string };

export class SheetController {
  private weekConfiguration: TWeekConfiguration = createWeekConfiguration();
  private cronConfiguration: cronConfiguration = { isRunning: false, hasError: false, lastError: "" };
  private sheetValues: TWeekValues = { ...weekValuesInit };

  getWeekConfig() {
    return this.weekConfiguration;
  }

  setWeekConfig(key: TWeekDay, value: TWeekConfigValues) {
    // TODO Find a way to empty cells
    if (value.seat === "Remove") this.weekConfiguration[key].seat = " " as TSeatOption;
    else this.weekConfiguration[key].seat = value.seat;

    if (value.cell) this.weekConfiguration[key].cell = value.cell;
  }

  getCronConfiguration() {
    return this.cronConfiguration;
  }

  setCronConfiguration(configuration: cronConfiguration) {
    this.cronConfiguration = configuration;
  }

  async readSheetValues() {
    const sheetValues = await getSheetValues(this.weekConfiguration);
    this.sheetValues = sheetValues;
  }

  getSheetWeekValues() {
    return this.sheetValues;
  }

  async writeSheet() {
    return postSheetValues(this.weekConfiguration);
  }
}
