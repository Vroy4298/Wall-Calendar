export interface Holiday {
  name: string;
  emoji: string;
}

/** Keyed by "MM-DD" */
export const HOLIDAYS: Record<string, Holiday> = {
  "01-01": { name: "New Year's Day", emoji: "🎊" },
  "02-14": { name: "Valentine's Day", emoji: "❤️" },
  "03-17": { name: "St. Patrick's Day", emoji: "🍀" },
  "04-22": { name: "Earth Day", emoji: "🌍" },
  "05-05": { name: "Cinco de Mayo", emoji: "🌮" },
  "06-21": { name: "Summer Solstice", emoji: "☀️" },
  "07-04": { name: "Independence Day", emoji: "🎆" },
  "09-01": { name: "Labor Day", emoji: "🛠️" },
  "10-31": { name: "Halloween", emoji: "🎃" },
  "11-11": { name: "Veterans Day", emoji: "🎖️" },
  "11-27": { name: "Thanksgiving", emoji: "🦃" },
  "12-24": { name: "Christmas Eve", emoji: "🎅" },
  "12-25": { name: "Christmas Day", emoji: "🎄" },
  "12-31": { name: "New Year's Eve", emoji: "🥂" },
};

export function getHoliday(date: Date): Holiday | null {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return HOLIDAYS[`${month}-${day}`] ?? null;
}
