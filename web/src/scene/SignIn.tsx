import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { InputChangeHandler } from "../component/Input";
import {
  Form,
  FormErrorReasons,
  FormValues,
  FormSubmitHandler
} from "../component/Form";
import styled from "styled-components";
import { InjectedProps } from "../store";
import { createFormErrorsReasons } from "../utility/forms";
import { UNIT } from "../styling/sizes";

/**
 * Union of all forum input names this scene uses.
 */
type Name = "email" | "password";

/**
 * Scene that renders a form used for signing in.
 */
@inject("auth")
@observer
export class SignIn extends React.Component<InjectedProps> {
  /**
   * Form input field values.
   */
  @observable private values: FormValues<Name> = {
    email: "",
    password: ""
  };

  /**
   * Form input field error reasons.
   */
  @observable private reasons: FormErrorReasons<Name> = {};

  public render() {
    return (
      <Container>
        <Form
          names={["email", "password"]}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          reasons={this.reasons}
          scene="signIn"
          values={this.values}
        />
      </Container>
    );
  }

  @action
  private onChange: InputChangeHandler<Name> = (name: Name, value: string) => {
    this.values[name] = value;
  };

  @action
  private onSubmit: FormSubmitHandler = async () => {
    const error = await this.props.auth!.login(this.values);

    if (error === undefined) {
      return;
    }

    this.reasons = createFormErrorsReasons(error, this.values);
  };
}

const Container = styled.div`
  width: 100%;
  max-width: ${7 * UNIT}rem;
  padding: 0 ${UNIT / 2}rem;
  box-sizing: border-box;
  margin: 0 auto;
`;
