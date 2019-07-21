import { Store } from "./Store";
import { Invitation } from "../model/Invitation";
import { post } from "../utility/client";

/**
 * Store that stores and manages invitation models.
 */
export class InvitationsStore extends Store<Invitation> {
  /**
   * Fetches invitation data of invitation with ID `id`, creates and saves
   * corresponding invitation model and returns it.
   *
   * @param id Invitation ID.
   */
  public fetch = async (id: string) => {
    const response = await post("invitation", "get", { id });

    if ("error" in response) {
      return undefined;
    }

    return this.add(response.data);
  };
}
