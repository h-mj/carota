import { deviate, Success } from "deviator";

export const getInvitationDtoValidator = deviate().object().shape({
  id: deviate().string().guid(),
});

export type GetInvitationDto = Success<typeof getInvitationDtoValidator>;
