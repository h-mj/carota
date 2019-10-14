import { deviate, Success } from "deviator";

import { UNITS } from "../Foodstuff";

const quantity = deviate()
  .number()
  .ge(0)
  .round(2);

const optionalQuantity = deviate()
  .optional()
  .append(quantity);

// prettier-ignore
export const saveFoodstuffDtoValidator = deviate().object().shape({
  id: deviate().optional().string().guid(),
  name: deviate().string().trim().notEmpty(),
  barcode: deviate().optional().string().trim().regex(/^\d{13}$/),
  unit: deviate().string().options(UNITS),
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
