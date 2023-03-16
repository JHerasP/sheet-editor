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

export type TWeekConfigValues = { seat: TSeatOption; cell: string };
export type TWeekConfiguration = Record<TWeekDay, TWeekConfigValues>;
export type TWeekValues = Record<TWeekDay, TSeatOption>;

export const weekValuesInit: TWeekValues = {
  Monday: "No sabe",
  Tuesday: "No sabe",
  Wednesday: "No sabe",
  Thursday: "No sabe",
  Friday: "No sabe",
};

export const weekConfigurationInit: Record<TWeekDay, { seat: TSeatOption; cell: string }> = {
  Monday: { seat: weekValuesInit.Monday, cell: "" },
  Tuesday: { seat: weekValuesInit.Tuesday, cell: "" },
  Wednesday: { seat: weekValuesInit.Wednesday, cell: "" },
  Thursday: { seat: weekValuesInit.Thursday, cell: "" },
  Friday: { seat: weekValuesInit.Friday, cell: "" },
};
