import { EntityRepository, Repository } from "typeorm";

import { Meal } from "../meal/Meal";
import { Dish } from "./Dish";

@EntityRepository(Dish)
export class DishRepository extends Repository<Dish> {
  public async ordered(meal: Meal) {
    const dishes = await this.find({ mealId: meal.id });
    const reversed = new Map(dishes.map(dish => [dish.nextId, dish]));

    const order: Dish[] = [];
    let current = reversed.get(null);

    while (current !== undefined) {
      order.push(current);
      current = reversed.get(current.id);
    }

    return order.reverse();
  }

  public async link(dish: Dish, meal: Meal, previous?: Dish, next?: Dish) {
    if (previous !== undefined) {
      await this.createQueryBuilder()
        .update(Dish)
        .set({ nextId: dish.id })
        .where({ id: previous.id })
        .execute();
    }

    await this.createQueryBuilder()
      .update(Dish)
      .set({ mealId: meal.id, nextId: next !== undefined ? next.id : null })
      .where({ id: dish.id })
      .execute();
  }

  public async unlink(dish: Dish) {
    await this.createQueryBuilder()
      .update(Dish)
      .set({ mealId: null, nextId: null })
      .where({ id: dish.id })
      .execute();

    await this.createQueryBuilder()
      .update(Dish)
      .set({ nextId: dish.nextId })
      .where({ nextId: dish.id })
      .execute();
  }
}
