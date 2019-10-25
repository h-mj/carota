import { deviate } from "deviator";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Button } from "../component/Button";
import { Center } from "../component/Center";
import { Controls, Form, Title } from "../component/collection/form";
import { Logo } from "../component/collection/icons";
import { Group } from "../component/Group";
import { Head } from "../component/Head";
import { TextField } from "../component/TextField";
import { styled } from "../styling/theme";
import { any, append, ErrorsFor } from "../utility/form";

/**
 * Array of input names within login form.
 */
const INPUTS = ["email", "password"] as const;

/**
 * Input name type that is union of all input names inside `INPUTS` array.
 */
type InputNames = typeof INPUTS[number];

/**
 * Translation of a single input.
 */
interface InputTranslation {
  /**
   * Text field label text.
   */
  label: string;

  /**
   * Error messages of various error reasons input may have.
   */
  reasons: Partial<Record<string, string>>;
}

/**
 * Translation of login scene.
 */
interface LoginTranslation {
  /**
   * Input translations.
   */
  inputs: Record<InputNames, InputTranslation>;

  /**
   * Invalid credentials notification text.
   */
  invalidCredentials: string;

  /**
   * Page title.
   */
  title: string;

  /**
   * Submit button text.
   */
  submit: string;
}

/**
 * Login form values object type.
 */
type LoginValues = Record<InputNames, string>;

/**
 * Function that transforms `LoginValues` into `AccountLoginBody`.
 */
const toBody = deviate<LoginValues>().shape({
  email: deviate<string>()
    .trim()
    .nonempty(),
  password: deviate<string>().nonempty()
});

/**
 * Scene that authenticates user using their email and password and on success
 * redirects to home page.
 */
@inject("accounts", "views")
@observer
export class Login extends SceneComponent<"Login", {}, LoginTranslation> {
  /**
   * Object that contains values of each input.
   */
  @observable private values: LoginValues = {
    email: "",
    password: ""
  };

  /**
   * Object that contains a reason string of occurred error of each input.
   */
  @observable private reasons: ErrorsFor<LoginValues> = {};

  /**
   * Sets the name of this scene.
   */
  public constructor(props: DefaultSceneComponentProps<"Login">) {
    super("Login", props);
  }

  /**
   * Renders the form and all of its inputs.
   */
  public render() {
    return (
      <Center>
        <Head title={this.translation.title} />
        <Form noValidate={true} onSubmit={this.handleSubmit}>
          <Group>
            <LogoContainer>
              <Logo />
            </LogoContainer>

            <Title>{this.translation.title}</Title>
          </Group>

          <Group>
            {INPUTS.map((name, index) => (
              <TextField
                key={name}
                autoFocus={index === 0}
                errorMessage={
                  this.reasons[name] !== undefined
                    ? this.translation.inputs[name].reasons[this.reasons[name]!]
                    : undefined
                }
                invalid={this.reasons[name] !== undefined}
                label={this.translation.inputs[name].label}
                name={name}
                onChange={this.handleChange}
                required={true}
                type={name}
                value={this.values[name]}
              />
            ))}
          </Group>

          <Controls>
            <Button invalid={any(this.reasons)}>
              {this.translation.submit}
            </Button>
          </Controls>
        </Form>
      </Center>
    );
  }

  /**
   * Updates `values` object when text field value changes.
   */
  @action
  private handleChange = (name: InputNames, value: string) => {
    this.values[name] = value;
  };

  /**
   * Prevents default form submit event and executes custom sign in logic
   * instead.
   */
  @action
  private handleSubmit: React.FormEventHandler<
    HTMLFormElement
  > = async event => {
    event.preventDefault();

    const result = toBody(this.values);
    const error = await this.props.views!.load(
      result.ok ? this.props.accounts!.login(result.value) : undefined
    );

    if (result.ok && error === undefined) {
      // Update current scene so it matches the URL, since login scene overrides
      // it.
      this.props.views!.refresh();
    }

    if (error !== undefined && error.status === 401 /* Unauthorized */) {
      this.props.views!.notify(this.translation.invalidCredentials, "error");
    }

    this.reasons = append(result.ok ? {} : result.value, error);
  };
}

/**
 * Component that contains the logo.
 */
const LogoContainer = styled.div`
  width: ${({ theme }) => theme.padding};
  margin-left: auto;
  margin-right: auto;
`;
