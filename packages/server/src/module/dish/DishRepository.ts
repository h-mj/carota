import { EntityRepository, Repository } from "typeorm";

import { Meal } from "../meal/Meal";
import { Dish } from "./Dish";

@EntityRepository(Dish)
export class DishRepository extends Repository<Dish> {
  public async ordered(meal: Meal) {
    const dishes = await this.find({ meal });
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
      previous.nextId = dish.id;
      await this.save(previous);
    }

    dish.meal = meal;
    dish.nextId = next !== undefined ? next.id : null;
    return await this.save(dish);
  }

  public async unlink(dish: Dish) {
    const previous = await dish.previous;
    const nextId = dish.nextId;

    dish.mealId = null;
    dish.nextId = null;
    await this.save(dish);

    if (previous !== undefined) {
      previous.nextId = nextId;
      dish.previous = Promise.resolve(undefined);
      await this.save(previous);
    }
  }
}
