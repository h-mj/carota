import { Languages } from "api";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { Scene, SceneProps } from "./Scene";
import { Error } from "../component/Error";
import {
  Form,
  FormErrorReasons,
  FormSubmitHandler,
  FormValues
} from "../component/Form";
import { InputChangeHandler, InputValueType } from "../component/Input";
import { UNIT } from "../styling/sizes";
import { createFormErrorsReasons, setTimeout } from "../utility/forms";

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
   * Whether or not `invitationId` in `parameters` props is valid. `undefined`
   * if the value has not been retrieved yet.
   */
  @observable private isValid?: boolean;

  /**
   * Waiting reason that is used to show loader component when waiting for
   * server response.
   */
  private static WAIT_REASON = "register";

  /**
   * Creates a new instance of `Register` scene.
   *
   * Calls an async function that checks whether
   */
  public constructor(props: SceneProps<"register">) {
    super(props);

    this.checkInvitationIdValidity();
  }

  /**
   * Renders a registration form.
   */
  public render() {
    if (this.isValid === undefined) {
      return null;
    }

    if (!this.isValid) {
      return <Error name="invalidInvitation" parameters={{}} />;
    }

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

    this.props.scenes!.wait(Register.WAIT_REASON);

    const [error] = await Promise.all([
      this.props.auth!.register({
        email,
        language: language as Languages, // Ignore that language could be `""` if nothing is selected.
        name,
        password,
        invitationId
      }),
      setTimeout(1)
    ]);

    this.props.scenes!.done(Register.WAIT_REASON);

    if (error === undefined) {
      return this.props.scenes!.redirect({
        sceneName: "home",
        parameters: {}
      });
    }

    this.reasons = createFormErrorsReasons(error, this.values);
  };

  /**
   * Checks whether ot not `invitationId` in `parameters` props is valid and
   * assigns boolean value to `valid` field.
   */
  private async checkInvitationIdValidity() {
    this.props.scenes!.wait(Register.WAIT_REASON);
    this.isValid = await this.props.auth!.check(this.props.parameters);
    this.props.scenes!.done(Register.WAIT_REASON);
  }
}

const Container = styled.div`
  width: 100%;
  max-width: ${7 * UNIT}rem;
  padding: ${UNIT / 2}rem;
  box-sizing: border-box;
  margin: 0 auto;
`;
