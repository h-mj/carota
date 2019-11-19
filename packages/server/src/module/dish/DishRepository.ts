import { EntityRepository, Repository } from "typeorm";

import { ordered } from "../../utility/entities";
import { Meal } from "../meal/Meal";
import { Dish } from "./Dish";

@EntityRepository(Dish)
export class DishRepository extends Repository<Dish> {
  public async ordered(meal: Meal) {
    return ordered(
      await this.find({ where: { mealId: meal.id }, relations: ["foodstuff"] })
    );
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
