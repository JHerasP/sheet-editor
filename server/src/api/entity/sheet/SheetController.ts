import {
  TSeatOption,
  TWeekConfiguration,
  TWeekDay,
  TWeekValues,
  weekConfigurationInit,
  weekValuesInit,
} from "./weekConfiguration";
import { getSheetValues, postSheetValues } from "./sheet-service";

export type cronConfiguration = { isRunning: boolean; hasError: boolean; lastError: string };

export class SheetController {
  private weekConfiguration: TWeekConfiguration = weekConfigurationInit;
  private cronConfiguration: cronConfiguration = { isRunning: false, hasError: false, lastError: "" };
  private sheetValues: TWeekValues = weekValuesInit;

  getWeekConfig() {
    return this.weekConfiguration;
  }

  setWeekConfig(key: TWeekDay, value: TSeatOption) {
    if (value !== "Remove") this.weekConfiguration[key].seat = value;
    else this.weekConfiguration[key].seat = " " as TSeatOption;
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
