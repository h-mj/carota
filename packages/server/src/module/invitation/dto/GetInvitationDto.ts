import { deviate, Success } from "deviator";

// prettier-ignore
export const getInvitationDtoValidator = deviate().object().shape({
  id: deviate().string().guid()
});

export type GetInvitationDto = Success<typeof getInvitationDtoValidator>;
