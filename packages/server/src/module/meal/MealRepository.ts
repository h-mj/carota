import { EntityRepository, Repository } from "typeorm";

import { Meal } from "./Meal";

@EntityRepository(Meal)
export class MealRepository extends Repository<Meal> {}
