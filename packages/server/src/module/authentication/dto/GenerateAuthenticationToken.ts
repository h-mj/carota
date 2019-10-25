import { deviate, Success } from "deviator";

// prettier-ignore
export const generateAuthenticationTokenDtoValidator = deviate().object().shape({
  email: deviate().string().trim().lowercase().nonempty(),
  password: deviate().string().nonempty()
});

export type GenerateAuthenticationTokenDto = Success<
  typeof generateAuthenticationTokenDtoValidator
>;
