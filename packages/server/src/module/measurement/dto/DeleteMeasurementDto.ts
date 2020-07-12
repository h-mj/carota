import { deviate, Success } from "deviator";

export const deleteMeasurementDtoValidator = deviate().object().shape({
  id: deviate().string().guid(),
});

export type DeleteMeasurementDto = Success<
  typeof deleteMeasurementDtoValidator
>;
