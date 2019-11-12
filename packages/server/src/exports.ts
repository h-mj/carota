import { ErrorResponse } from "./base/filter/ErrorResponder";
import { DataResponse } from "./base/GlobalInterceptor";
import { AccountController } from "./module/account/AccountController";
import { AuthenticationController } from "./module/authentication/AuthenticationController";
import { DishController } from "./module/dish/DishController";
import { FoodstuffController } from "./module/foodstuff/FoodstuffController";
import { InvitationController } from "./module/invitation/InvitationController";
import { MealController } from "./module/meal/MealController";
import { MeasurementController } from "./module/measurement/MeasurementController";

interface Controllers {
  account: AccountController;
  authentication: AuthenticationController;
  dish: DishController;
  foodstuff: FoodstuffController;
  invitation: InvitationController;
  meal: MealController;
  measurement: MeasurementController;
}

interface Transaction<TBody, TData> {
  body: TBody;
  data: TData;
}

type Rpc = {
  [Controller in keyof Controllers]: {
    [Endpoint in keyof Controllers[Controller]]: Controllers[Controller][Endpoint] extends (
      dto: infer IInput,
      ...other: any
    ) => Promise<infer IOutput>
      ? Transaction<IInput, IOutput>
      : never;
  };
};

export type Controller = keyof Rpc;

export type Endpoint<TController extends Controller> = keyof Rpc[TController];

export type Body<
  TController extends Controller,
  TEndpoint extends Endpoint<TController>
> = Rpc[TController][TEndpoint] extends Transaction<infer IBody, infer _>
  ? IBody
  : never;

export type Data<
  TController extends Controller,
  TEndpoint extends Endpoint<TController>
> = Rpc[TController][TEndpoint] extends Transaction<infer _, infer IData>
  ? IData
  : never;

export type Response<
  TController extends Controller,
  TEndpoint extends Endpoint<TController>
> = DataResponse<Data<TController, TEndpoint>> | ErrorResponse;

export { ErrorDto } from "./base/error/HttpError";
export {
  AccountDto,
  Language,
  Rights,
  Sex,
  Type
} from "./module/account/Account";
export { DishDto } from "./module/dish/Dish";
export { FoodstuffDto, Unit } from "./module/foodstuff/Foodstuff";
export { NutritionDeclarationDto } from "./module/foodstuff/NutritionDeclaration";
export { InvitationDto } from "./module/invitation/Invitation";
export { MealDto } from "./module/meal/Meal";
