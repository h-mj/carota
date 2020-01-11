import { Invitation } from "../model/Invitation";
import { Rpc, success } from "../utility/rpc";
import { Store } from "./Store";

/**
 * Invitation managing store.
 */
export class InvitationStore extends Store {
  /**
   * Creates and returns invitation model from received invitation data transfer
   * object of invitation with specified ID.
   */
  public async get(id: string) {
    const result = await Rpc.call("invitation", "get", { id });

    if (!result.ok) {
      return result;
    }

    return success(new Invitation(result.value));
  }
}
