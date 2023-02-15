import { formatDate } from "./formatDates";

export function printCronException(functionName: string, ...args: string[]) {
  console.info();
  console.info(`🔸 🔸 🔸 ${functionName} 🔸 🔸 🔸`);
  console.info();
  args.forEach((arg) => console.info(`  ➡  ${arg}`));
  console.info();
  console.info(`🔸 🔸 🔸 ${functionName} 🔸 🔸 🔸`);
  console.info();
}

export function printCronInfo(functionName: string, ...args: string[]) {
  console.info();
  console.info(`🟢 🟢 🟢 ${functionName} 🟢 🟢 🟢`);
  console.info();
  args.forEach((arg) => console.info(`  ➡  ${arg}`));
  console.info();
  console.info(`🟢 🟢 🟢 ${functionName} 🟢 🟢 🟢`);
  console.info();
}

export function printCronAction() {
  const newDate = formatDate(new Date());
  console.info();
  console.info(`♿  Cron action - ${newDate}`);
  console.info();
}
