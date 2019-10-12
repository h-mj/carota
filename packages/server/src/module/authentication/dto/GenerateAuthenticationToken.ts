import { deviate, Success } from "deviator";

// prettier-ignore
export const generateAuthenticationTokenDtoValidator = deviate().object().shape({
  email: deviate().string().trim().lowercase().notEmpty(),
  password: deviate().string().notEmpty()
});

export type GenerateAuthenticationTokenDto = Success<
  typeof generateAuthenticationTokenDtoValidator
>;
