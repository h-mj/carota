import { inject } from "mobx-react";
import { Scene } from "./Scene";
import { SceneContext } from "./SceneContext";
import { resolveAfterTimeout } from "../utility/promises";

/**
 * Scene that, when constructed, logs user out after some timeout.
 */
@inject("auth", "views")
export class Logout extends Scene<"Logout"> {
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
    const { auth, views: view } = this.props;

    const symbol = view!.wait("Logout timeout");

    await resolveAfterTimeout(1);

    auth!.logout();
    view!.redirect(SceneContext.HOME);

    view!.done(symbol);
  }
}
