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

export const PHISICAL_SEAT_OPTIONS = SEAT_OPTIONS.filter(
  (seat: TSeatOption) =>
    !(
      seat === "Teletrabajo" ||
      seat === "No sabe" ||
      seat === "Vacaciones" ||
      seat === "Presencial" ||
      seat === "Remove"
    )
);

export const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

export type TSeatOption = typeof SEAT_OPTIONS[number];
export type TWeekDay = typeof WEEKDAYS[number];

export type TWeekConfiguration = Record<TWeekDay, { seat: TSeatOption | " "; cell: string }>;
export type TWeekValues = Record<TWeekDay, TSeatOption>;

export const weekValuesInit: TWeekValues = {
  Monday: "Teletrabajo",
  Tuesday: "Presencial",
  Wednesday: "Teletrabajo",
  Thursday: "Teletrabajo",
  Friday: "Presencial",
};

export const weekConfigurationInit: Record<TWeekDay, { seat: TSeatOption; cell: string }> = {
  Monday: { seat: weekValuesInit.Monday, cell: "L13" },
  Tuesday: { seat: weekValuesInit.Tuesday, cell: "M13" },
  Wednesday: { seat: weekValuesInit.Wednesday, cell: "N13" },
  Thursday: { seat: weekValuesInit.Thursday, cell: "O13" },
  Friday: { seat: weekValuesInit.Friday, cell: "P13" },
};
