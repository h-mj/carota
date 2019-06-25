import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Scene } from "./Scene";
import {
  Form,
  FormErrorReasons,
  FormSubmitHandler,
  FormValues
} from "../component/Form";
import { InputChangeHandler } from "../component/Input";
import { Notification } from "../component/NotificationContainer";
import { Thin } from "../component/Thin";
import { createFormErrorsReasons, setTimeout } from "../utility/forms";

/**
 * Union of all form input names this scene uses.
 */
type InputNames = "email" | "password";

/**
 * Scene that renders a form used for signing in.
 */
@inject("auth", "view")
@observer
export class Login extends Scene<"login"> {
  /**
   * Form input field values.
   */
  @observable private values: FormValues<InputNames> = {
    email: "",
    password: ""
  };

  /**
   * Form input field error reasons.
   */
  @observable private reasons: FormErrorReasons<InputNames> = {};

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
        <Form
          inputNames={["email", "password"]}
          name="login"
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          reasons={this.reasons}
          values={this.values}
        />
      </Thin>
    );
  }

  /**
   * Updates changed field value.
   */
  @action
  private onChange: InputChangeHandler<InputNames> = (
    name: InputNames,
    value: string
  ) => {
    this.values[name] = value;
  };

  /**
   * Sends login credentials to server and either redirects user to correct
   * stage or displays occurred errors.
   */
  @action
  private onSubmit: FormSubmitHandler = async () => {
    this.props.view!.wait(Login.WAIT_REASON);

    const [error] = await Promise.all([
      this.props.auth!.login(this.values),
      setTimeout(1)
    ]);

    this.props.view!.done(Login.WAIT_REASON);

    if (error === undefined) {
      return this.props.view!.update(); // Update stage to match current URL.
    }

    if (error.code === 401) {
      this.props.view!.notify(new Notification("loginInvalidCredentials", {}));
    }

    this.reasons = createFormErrorsReasons(error, this.values);
  };
}
