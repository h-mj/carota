import { Body } from "api";
import { action } from "mobx";

import { Food } from "../model/Food";
import { post } from "../utility/client";
import { Store } from "./Store";

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
  public async search(query: string) {
    const response = await post("food", "search", { query });

    if ("error" in response) {
      return response.error;
    }

    this.clear();
    response.data.map(this.add);

    return undefined;
  }

  /**
   * Makes a food deletion request.
   *
   * @param id Food Id which will be deleted.
   */
  @action
  public async delete(id: string) {
    const response = await post("food", "delete", { id });

    if ("error" in response) {
      return response.error;
    }

    this.remove(id);

    return undefined;
  }
}
