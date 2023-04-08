import { SheetController } from "../sheet/SheetController";

export function createConfigurationsFromEmployees(nameList: string[]) {
  const employeeConfigs: Record<string, SheetController> = {};

  nameList.forEach((name) => (employeeConfigs[name] = new SheetController()));

  return employeeConfigs;
}
