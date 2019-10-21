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
      previous.nextId = meal.id;
      await this.save(previous);
    }

    meal.date = date;
    meal.nextId = next === undefined ? null : next.id;
    return await this.save(meal);
  }

  public async unlink(meal: Meal) {
    const previous = await meal.previous;
    const nextId = meal.nextId;

    meal.date = null;
    meal.nextId = null;
    await this.save(meal);

    if (previous !== undefined) {
      previous.nextId = nextId;
      meal.previous = Promise.resolve(undefined);
      await this.save(previous);
    }
  }
}
