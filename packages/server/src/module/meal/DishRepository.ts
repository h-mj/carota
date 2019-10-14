import { EntityRepository, Repository } from "typeorm";

import { Dish } from "./Dish";

@EntityRepository(Dish)
export class DishRepository extends Repository<Dish> {}
