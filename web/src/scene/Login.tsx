import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { Scene } from "./Scene";
import {
  Form,
  FormErrorReasons,
  FormSubmitHandler,
  FormValues
} from "../component/Form";
import { InputChangeHandler } from "../component/Input";
import { UNIT } from "../styling/sizes";
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
      <Container>
        <Form
          inputNames={["email", "password"]}
          name="login"
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          reasons={this.reasons}
          values={this.values}
        />
      </Container>
    );
  }

  @action
  private onChange: InputChangeHandler<InputNames> = (
    name: InputNames,
    value: string
  ) => {
    this.values[name] = value;
  };

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
      this.props.view!.pushAlert("loginInvalidCredentials", {});
    }

    this.reasons = createFormErrorsReasons(error, this.values);
  };
}

const Container = styled.div`
  width: 100%;
  max-width: ${7 * UNIT}rem;
  padding: ${UNIT / 2}rem;
  box-sizing: border-box;
  margin: 0 auto;
`;
