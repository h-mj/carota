import { deviate, ok, Success } from "deviator";

import { UNITS } from "../Foodstuff";

const quantity = deviate()
  .number()
  .min(0)
  .then(input => ok(Math.round(100 * input) / 100));

const optionalQuantity = deviate()
  .optional()
  .then(quantity);

// prettier-ignore
export const saveFoodstuffDtoValidator = deviate().object().shape({
  id: deviate().optional().string().guid(),
  name: deviate().string().trim().nonempty(),
  barcode: deviate().optional().string().trim().regexp(/^\d{13}$/),
  unit: deviate().options(UNITS),
  quantity: optionalQuantity,
  pieceQuantity: optionalQuantity,
  nutritionDeclaration: deviate().object().shape({
    energy: quantity,
    fat: quantity,
    saturates: optionalQuantity,
    monoUnsaturates: optionalQuantity,
    polyunsaturates: optionalQuantity,
    carbohydrate: quantity,
    sugars: optionalQuantity,
    polyols: optionalQuantity,
    starch: optionalQuantity,
    fibre: optionalQuantity,
    protein: quantity,
    salt: optionalQuantity
  }),
});

export type SaveFoodstuffDto = Success<typeof saveFoodstuffDtoValidator>;
