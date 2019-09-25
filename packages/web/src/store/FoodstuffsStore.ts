import { Body, FoodstuffDto } from "api";
import { action } from "mobx";

import { FoodstuffModel } from "../model/FoodstuffModel";
import { post } from "../utility/client";
import { Store } from "./Store";

/**
 * Store that stores and manages foodstuff models.
 */
export class FoodstuffsStore extends Store<FoodstuffModel, FoodstuffDto> {
  /**
   * Creates or updates existing foodstuff
   *
   * @param body Foodstuff save request data transfer object.
   */
  public async save(body: Body<"foodstuff", "save">) {
    const response = await post("foodstuff", "save", body);

    if ("error" in response) {
      return response.error;
    }

    this.add(response.data);

    return undefined;
  }

  /**
   * Makes a search foodstuff request with specified query.
   *
   * @param query Foodstuff search query.
   */
  public async search(query: string) {
    const response = await post("foodstuff", "search", { query });

    if ("error" in response) {
      return response.error;
    }

    this.clear();
    response.data.map(this.add);

    return undefined;
  }

  /**
   * Makes a foodstuff deletion request.
   *
   * @param id ID of a foodstuff which to deleted.
   */
  @action
  public async delete(id: string) {
    const response = await post("foodstuff", "remove", { id });

    if ("error" in response) {
      return response.error;
    }

    this.remove(id);

    return undefined;
  }
}
