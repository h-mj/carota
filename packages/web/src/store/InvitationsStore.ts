import { InvitationData } from "api";

import { InvitationModel } from "../model/InvitationModel";
import { post } from "../utility/client";
import { Store } from "./Store";

/**
 * Store that stores and manages invitation models.
 */
export class InvitationsStore extends Store<InvitationModel, InvitationData> {
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
