import { deviate, Success } from "deviator";

import { LANGUAGES } from "../Account";

export const setAccountLanguageDtoValidator = deviate()
  .object()
  .shape({
    language: deviate().options(LANGUAGES),
  });

export type SetAccountLanguageDto = Success<
  typeof setAccountLanguageDtoValidator
>;
