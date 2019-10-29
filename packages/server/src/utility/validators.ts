import { deviate, err, ok } from "deviator";
import { DateTime } from "luxon";

/**
 * Valid ISO date validator.
 */
export const validDate = (input: string) => {
  const date = DateTime.fromISO(input);

  return date.isValid ? ok(date.toISODate()) : err("invalidDate");
};

/**
 * EAN-13 barcode validator.
 */
export const isBarcode = deviate()
  .string()
  .trim()
  .regexp(/^\d{13}$/);
