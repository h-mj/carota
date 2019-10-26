import { EntityRepository, Repository } from "typeorm";

import { Account } from "../account/Account";
import { Meal } from "./Meal";

@EntityRepository(Meal)
export class MealRepository extends Repository<Meal> {
  public async ordered(account: Account, date: string) {
    const meals = await this.find({ account, date });
    const reversed = new Map(meals.map(meal => [meal.nextId, meal]));

    const order: Meal[] = [];
    let current = reversed.get(null);

    while (current !== undefined) {
      order.push(current);
      current = reversed.get(current.id);
    }

    return order.reverse();
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
