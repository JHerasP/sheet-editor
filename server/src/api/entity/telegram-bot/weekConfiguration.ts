import { arrayToButtons } from "../../utils/telegram";

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
  "Remove",
] as const;
export const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

export type seatOption = typeof seatOptions[number];
export type weekDay = typeof weekDays[number];

export type TWeekConfiguration = Record<weekDay, seatOption | " ">;

export const seatText = arrayToButtons([...seatOptions]);
export const weekConfiguration: Record<weekDay, seatOption> = {
  Monday: "Teletrabajo",
  Tuesday: "Presencial",
  Wednesday: "Teletrabajo",
  Thursday: "Teletrabajo",
  Friday: "Presencial",
};
