import { Body } from "api";
import { Store } from "./Store";
import { Food } from "../model/Food";
import { post } from "../utility/client";

/**
 * Store that stores and manages food models.
 */
export class FoodsStore extends Store<Food> {
  /**
   * Creates or updates existing food product.
   */
  public async save(body: Body<"food", "save">) {
    const response = await post("food", "save", body);

    if ("error" in response) {
      return response.error;
    }

    this.add(response.data);

    return undefined;
  }

  /**
   * Replaces current food data with found food data.
   *
   * @param body Food find request body.
   */
  public async search(body: Body<"food", "search">) {
    const response = await post("food", "search", body);

    if ("error" in response) {
      return response.error;
    }

    this.clear();
    response.data.map(this.add);

    return undefined;
  }
}
