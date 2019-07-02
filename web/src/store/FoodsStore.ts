import { Body } from "api";
import { Store } from "./Store";
import { Food } from "../model/Food";
import { post } from "../utility/client";

/**
 * Store that stores and manages food models.
 */
export class FoodsStore extends Store<Food> {
  /**
   * Replaces current food data with found food data.
   *
   * @param body Food find request body.
   */
  public async find(body: Body<"food", "find">) {
    const response = await post("food", "find", body);

    if ("error" in response) {
      return response.error;
    }

    this.clear();
    response.data.map(this.add);

    return undefined;
  }
}

/**
 * The only `FoodsStore` class instance and which is provided to all components
 */
export const foods = new FoodsStore(Food);
