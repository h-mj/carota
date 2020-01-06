import { EntityRepository, Repository } from "typeorm";

import { ordered } from "../../utility/entities";
import { Account } from "../account/Account";
import { Meal } from "./Meal";

/**
 * Repository responsible for managing `Meal` entities.
 */
@EntityRepository(Meal)
export class MealRepository extends Repository<Meal> {
  /**
   * Returns an array of ordered meals of specified `account` at specified `date`.
   */
  public async findOrderedOf(account: Account, date: string) {
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

  /**
   * Links specified meal in meal linked list of specified `date` between
   * `previous` and `next` meals.
   */
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

  /**
   * Unlinks specified meal from the meal linked list.
   */
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
