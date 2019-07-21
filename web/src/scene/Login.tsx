import { ErrorReasons } from "api";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Scene } from "./Scene";
import { Button } from "../component/Button";
import { Head } from "../component/Head";
import { TextField } from "../component/TextField";
import { Center } from "../component/collection/container";
import { Controls, Form, Main, Title } from "../component/collection/form";
import { any, insert } from "../utility/form";

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
  reasons: Partial<Record<ErrorReasons, string>>;
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
   * Page title.
   */
  title: string;

  /**
   * Submit button text.
   */
  submit: string;
}

/**
 * Scene that authenticates user using their email and password and on success
 * redirects to home page.
 */
@inject("auth", "views")
@observer
export class Login extends Scene<"Login", {}, LoginTranslation> {
  /**
   * Object that contains values of each input.
   */
  @observable private values = {
    email: "",
    password: ""
  };

  /**
   * Object that contains a reason string of occurred error of each input.
   *
   * These reasons are used to retrieve translated error messages of each input
   * that will be rendered next to the input itself.
   */
  @observable private reasons: Partial<Record<InputNames, ErrorReasons>> = {};

  /**
   * Renders the form and all of its inputs.
   */
  public render() {
    return (
      <Center>
        <Head title={this.translation.title} />
        <Form noValidate={true} onSubmit={this.handleSubmit}>
          <Title>{this.translation.title}</Title>
          <Main>
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
          </Main>
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

    const reasons = {
      email: this.values.email.trim() === "" ? "empty" : undefined,
      password: this.values.password === "" ? "empty" : undefined
    } as const;

    const skip = any(reasons);

    const error = await this.props.views!.load(
      skip ? undefined : this.props.auth!.login(this.values)
    );

    if (error === undefined && !skip) {
      // Update current scene so it matches the URL, since login scene overrides
      // it.
      this.props.views!.update();
    }

    if (error !== undefined && error.code === 401 /* Unauthorized */) {
      this.props.views!.notify("loginInvalidCredentials", {});
    }

    this.reasons = insert(reasons, error);
  };
}
