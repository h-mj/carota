import { deviate, Success } from "deviator";

import { isBarcode } from "../../../utility/validators";

export const findFoodstuffByBarcodeValidator = deviate().object().shape({
  barcode: isBarcode,
});

export type FindFoodstuffByBarcode = Success<
  typeof findFoodstuffByBarcodeValidator
>;
