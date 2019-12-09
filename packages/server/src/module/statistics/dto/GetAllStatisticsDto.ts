import { deviate, Success } from "deviator";

// prettier-ignore
export const getAllStatisticsDtoValidator = deviate().object().shape({
  accountId: deviate().optional().string().guid()
});

export type GetAllStatisticsDto = Success<typeof getAllStatisticsDtoValidator>;
