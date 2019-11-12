import { deviate, Success } from "deviator";

import { SIZES } from "../Measurement";

// prettier-ignore
export const getSizeMeasurementsDtoValidator = deviate().object().shape({
  accountId: deviate().optional().string().guid(),
  size: deviate().options(SIZES)
});

export type GetSizeMeasurementsDto = Success<
  typeof getSizeMeasurementsDtoValidator
>;
