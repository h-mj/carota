import { err, ok } from "deviator";
import { DateTime } from "luxon";

export const validDate = (input: string) => {
  const date = DateTime.fromISO(input);

  return date.isValid ? ok(date.toISODate()) : err("invalidDate");
};
