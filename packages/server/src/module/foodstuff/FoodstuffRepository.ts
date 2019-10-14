import { EntityRepository, Repository } from "typeorm";

import { Foodstuff } from "./Foodstuff";

@EntityRepository(Foodstuff)
export class FoodstuffRepository extends Repository<Foodstuff> {}
