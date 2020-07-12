import { deviate, Success } from "deviator";

export const getAllStatisticsDtoValidator = deviate().object().shape({
  accountId: deviate().optional().string().guid(),
});

export type GetAllStatisticsDto = Success<typeof getAllStatisticsDtoValidator>;
