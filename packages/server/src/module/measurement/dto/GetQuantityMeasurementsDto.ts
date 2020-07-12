import { deviate, Success } from "deviator";

import { QUANTITIES } from "../Measurement";

export const getQuantityMeasurementsDtoValidator = deviate()
  .object()
  .shape({
    accountId: deviate().optional().string().guid(),
    quantity: deviate().options(QUANTITIES),
  });

export type GetQuantityMeasurementsDto = Success<
  typeof getQuantityMeasurementsDtoValidator
>;
