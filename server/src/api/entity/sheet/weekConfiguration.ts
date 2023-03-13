import { arrayToButtons as arrayToTelegramButtons } from "../../utils/telegram";

export const SEAT_OPTIONS = [
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

export const PHISICAL_SEAT_OPTIONS = SEAT_OPTIONS.filter((seat: TSeatOption) => {
  if (
    seat === "Teletrabajo" ||
    seat === "No sabe" ||
    seat === "Vacaciones" ||
    seat === "Presencial" ||
    seat === "Remove"
  )
    return false;
  return true;
});

export const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

export type TSeatOption = typeof SEAT_OPTIONS[number];
export type TWeekDay = typeof WEEKDAYS[number];

export type TWeekConfiguration = Record<TWeekDay, { seat: TSeatOption | " "; cell: string }>;
export type TWeekValues = Record<TWeekDay, TSeatOption>;

export const seatText = arrayToTelegramButtons([...SEAT_OPTIONS]);

export const weekConfigurationInit: Record<TWeekDay, { seat: TSeatOption; cell: string }> = {
  Monday: { seat: "Teletrabajo", cell: "L13" },
  Tuesday: { seat: "Teletrabajo", cell: "M13" },
  Wednesday: { seat: "Teletrabajo", cell: "N13" },
  Thursday: { seat: "Teletrabajo", cell: "O13" },
  Friday: { seat: "Teletrabajo", cell: "P13" },
};

export const weekValuesInit: TWeekValues = {
  Monday: "Teletrabajo",
  Tuesday: "Teletrabajo",
  Wednesday: "Teletrabajo",
  Thursday: "Teletrabajo",
  Friday: "Teletrabajo",
};
