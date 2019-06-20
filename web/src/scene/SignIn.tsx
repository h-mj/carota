import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { Scene } from "./Scene";
import { InputChangeHandler } from "../component/Input";
import {
  Form,
  FormErrorReasons,
  FormSubmitHandler,
  FormValues
} from "../component/Form";
import { UNIT } from "../styling/sizes";
import { createFormErrorsReasons } from "../utility/forms";

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
   * Renders a sign in form.
   */
  public render() {
    return (
      <Container>
        <Form
          names={["email", "password"]}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          reasons={this.reasons}
          type="signIn"
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
    const error = await this.props.auth!.login(this.values);

    if (error === undefined) {
      return this.props.scenes!.redirect("signIn", {});
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
