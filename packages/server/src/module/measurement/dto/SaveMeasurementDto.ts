import { deviate, Success } from "deviator";

import { isValidDate } from "../../../utility/validators";
import { QUANTITIES } from "../Measurement";

// prettier-ignore
export const saveMeasurementDtoValidator = deviate().object().shape({
  quantity: deviate().options(QUANTITIES),
  date: deviate().string().then(isValidDate),
  value: deviate().number().positive().round(2)
});

export type SaveMeasurementDto = Success<typeof saveMeasurementDtoValidator>;
