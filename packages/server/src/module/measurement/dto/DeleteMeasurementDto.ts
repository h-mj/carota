import { deviate, Success } from "deviator";

// prettier-ignore
export const deleteMeasurementDtoValidator = deviate().object().shape({
  id: deviate().string().guid()
});

export type DeleteMeasurementDto = Success<
  typeof deleteMeasurementDtoValidator
>;
