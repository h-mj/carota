import { deviate, Success } from "deviator/lib/deviator";

import { ValidationPipe } from "../../../pipe/ValidationPipe";

// prettier-ignore
const getInvitationDtoValidator = deviate().object().shape({
  id: deviate().string().guid()
})

export type GetInvitationDto = Success<typeof getInvitationDtoValidator>;

export const getInvitationDtoValidationPipe = new ValidationPipe(
  getInvitationDtoValidator
);
