import { Invitation } from "../model/Invitation";
import { Rpc, success } from "../utility/rpc";

/**
 * Store which manages `Invitation` models.
 */
export class InvitationsStore {
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
