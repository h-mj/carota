import { inject } from "mobx-react";
import { Scene } from "./Scene";
import { Stage } from "./Stage";
import { setTimeout } from "../utility/forms";

/**
 * Scene that, when constructed, logs user out after some timeout.
 */
@inject("auth", "view")
export class Logout extends Scene<"logout"> {
  /**
   * Waiting reason that is used to show loader component when waiting for timeout.
   */
  private static WAIT_REASON = "logout";

  /**
   * Executes `logout` function, that logs user out.
   */
  public constructor(props: any) {
    super(props);

    this.logout();
  }

  /**
   * Renders nothing.
   */
  public render() {
    return null;
  }

  /**
   * Function that logs user out and redirects to home page after some timeout.
   */
  private async logout() {
    const { auth, view } = this.props;

    view!.wait(Logout.WAIT_REASON);

    await setTimeout(1);

    auth!.logout();
    view!.redirect(Stage.HOME);

    view!.done(Logout.WAIT_REASON);
  }
}
