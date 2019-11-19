import { EntityRepository, Repository } from "typeorm";

import { ordered } from "../../utility/entities";
import { Account } from "../account/Account";
import { Meal } from "./Meal";

@EntityRepository(Meal)
export class MealRepository extends Repository<Meal> {
  public async ordered(account: Account, date: string) {
    const meals = ordered(
      await this.find({
        where: { accountId: account.id, date },
        relations: ["dishes", "dishes.foodstuff"]
      })
    );

    for (const meal of meals) {
      meal.dishes = Promise.resolve(ordered(await meal.dishes));
    }

    return meals;
  }

  public async link(meal: Meal, date: string, previous?: Meal, next?: Meal) {
    if (previous !== undefined) {
      await this.createQueryBuilder()
        .update(Meal)
        .set({ nextId: meal.id })
        .where({ id: previous.id })
        .execute();
    }

    await this.createQueryBuilder()
      .update(Meal)
      .set({ nextId: next !== undefined ? next.id : null, date })
      .where({ id: meal.id })
      .execute();
  }

  public async unlink(meal: Meal) {
    await this.createQueryBuilder()
      .update(Meal)
      .set({ date: null, nextId: null })
      .where({ id: meal.id })
      .execute();

    await this.createQueryBuilder()
      .update(Meal)
      .set({ nextId: meal.nextId })
      .where({ nextId: meal.id })
      .execute();
  }
}
