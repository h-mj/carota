import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { Scene } from "./Scene";
import { InputChangeHandler, InputValueType } from "../component/Input";
import {
  Form,
  FormErrorReasons,
  FormSubmitHandler,
  FormValues
} from "../component/Form";
import { UNIT } from "../styling/sizes";
import { createFormErrorsReasons } from "../utility/forms";
import { Languages } from "api";

/**
 * Union of all form input names this scene uses.
 */
type InputNames = "email" | "language" | "name" | "password";

/**
 * Scene that renders a form used for registration.
 */
@inject("auth", "scenes")
@observer
export class Register extends Scene<"register"> {
  /**
   * Form input field values.
   */
  @observable private values: FormValues<InputNames> = {
    email: "",
    language: "",
    name: "",
    password: ""
  };

  /**
   * Form input field error reasons.
   */
  @observable private reasons: FormErrorReasons<InputNames> = {};

  /**
   * Renders a registration form.
   */
  public render() {
    return (
      <Container>
        <Form
          inputNames={["language", "name", "email", "password"]}
          name="register"
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
    value: InputValueType<InputNames>
  ) => {
    (this.values[name] as string) = value;
  };

  @action
  private onSubmit: FormSubmitHandler = async () => {
    const { email, language, name, password } = this.values;
    const { invitationId } = this.props.parameters;

    const error = await this.props.auth!.register({
      email,
      language: language as Languages,
      name,
      password,
      invitationId
    });

    if (error === undefined) {
      return this.props.scenes!.redirect({
        sceneName: "home",
        parameters: {}
      });
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
