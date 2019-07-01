import { action } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Scene } from "./Scene";
import { Form, FormSubmitHandler } from "../component/Form";
import { Notification } from "../component/NotificationContainer";
import { Thin } from "../component/container/Thin";
import { setTimeout } from "../utility/forms";

/**
 * Scene that renders a form used for signing in.
 */
@inject("auth", "view")
@observer
export class Login extends Scene<"login"> {
  /**
   * Waiting reason that is used to show loader component when waiting for
   * server response.
   */
  private static WAIT_REASON = "login";

  /**
   * Renders a sign in form.
   */
  public render() {
    return (
      <Thin>
        <Form name="login" onSubmit={this.handleSubmit} />
      </Thin>
    );
  }

  /**
   * Sends login credentials to server and either redirects user to correct
   * stage or displays occurred errors.
   */
  @action
  private handleSubmit: FormSubmitHandler<"login"> = async values => {
    this.props.view!.wait(Login.WAIT_REASON);

    const [error] = await Promise.all([
      this.props.auth!.login(values as any),
      setTimeout(1)
    ]);

    this.props.view!.done(Login.WAIT_REASON);

    if (error === undefined) {
      this.props.view!.update(); // Update stage to match current URL.
    } else if (error.code === 401) {
      this.props.view!.notify(new Notification("loginInvalidCredentials", {}));
    }

    return error;
  };
}
