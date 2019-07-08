import { action } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Scene } from "./Scene";
import { Form, FormSubmitHandler } from "../component/Form";
import { Compact } from "../component/container/Compact";
import { Notification } from "../component/NotificationContainer";
import { setTimeout } from "../utility/promises";

/**
 * Scene that renders a form used for signing in.
 */
@inject("auth", "views")
@observer
export class Login extends Scene<"Login"> {
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
      <Compact>
        <Form autoFocus name="login" onSubmit={this.handleSubmit} />
      </Compact>
    );
  }

  /**
   * Sends login credentials to server and either redirects user to correct
   * stage or displays occurred errors.
   */
  @action
  private handleSubmit: FormSubmitHandler<"login"> = async values => {
    this.props.views!.wait(Login.WAIT_REASON);

    const { email, password } = values;

    const [error] = await Promise.all([
      this.props.auth!.login({
        email: email || "",
        password: password || ""
      }),
      setTimeout(1)
    ]);

    this.props.views!.done(Login.WAIT_REASON);

    if (error === undefined) {
      this.props.views!.update(); // Update stage to match current URL.
    } else if (error.code === 401) {
      this.props.views!.notify(new Notification("loginInvalidCredentials", {}));
    }

    return error;
  };
}
