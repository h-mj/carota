import { MealData } from "api/src/entity/Meal";

import { MealModel } from "../model/MealModel";
import { Store } from "./Store";

/**
 * Store that stores and manages meal models.
 */
export class MealsStore extends Store<MealModel, MealData> {}
