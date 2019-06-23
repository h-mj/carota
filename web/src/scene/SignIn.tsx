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
import { Loader } from "../component/Loader";
import { UNIT } from "../styling/sizes";
import { createFormErrorsReasons, setTimeout } from "../utility/forms";

/**
 * Union of all form input names this scene uses.
 */
type InputNames = "email" | "password";

/**
 * Scene that renders a form used for signing in.
 */
@inject("auth", "scenes")
@observer
export class SignIn extends Scene<"signIn"> {
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
   * Whether or not form is waiting for server response.
   */
  @observable private loading: boolean = false;

  /**
   * Renders a sign in form.
   */
  public render() {
    return (
      <Container>
        <Form
          inputNames={["email", "password"]}
          name="signIn"
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          reasons={this.reasons}
          values={this.values}
        />

        {this.loading && <Loader translucent={true} />}
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
    this.loading = true;

    const [error] = await Promise.all([
      this.props.auth!.login(this.values),
      setTimeout(1)
    ]);

    if (error === undefined) {
      return this.props.scenes!.redirect({
        sceneName: "home",
        parameters: {}
      });
    }

    if (error.code === 401) {
      this.props.scenes!.pushAlert("signInInvalidCredentials", {});
    }

    this.reasons = createFormErrorsReasons(error, this.values);

    this.loading = false;
  };
}

const Container = styled.div`
  width: 100%;
  max-width: ${7 * UNIT}rem;
  padding: ${UNIT / 2}rem;
  box-sizing: border-box;
  margin: 0 auto;
`;
