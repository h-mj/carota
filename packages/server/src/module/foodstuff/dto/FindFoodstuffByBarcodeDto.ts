import { deviate, Success } from "deviator";

import { isBarcode } from "../../../utility/validators";

// prettier-ignore
export const findFoodstuffByBarcodeValidator = deviate().object().shape({
  barcode: isBarcode
});

export type FindFoodstuffByBarcode = Success<
  typeof findFoodstuffByBarcodeValidator
>;
