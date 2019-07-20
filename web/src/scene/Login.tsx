import { ErrorReasons } from "api";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Scene } from "./Scene";
import { Button } from "../component/Button";
import { Head } from "../component/Head";
import { TextField } from "../component/TextField";
import { styled } from "../styling/theme";
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
  @observable private values: Record<InputNames, string> = {
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

/**
 * Component that takes up whole screen and centers its children.
 */
const Center = styled.div`
  width: 100%;
  min-height: 100%;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
`;

/**
 * Form element that contains email and password text fields alongside submit
 * button.
 */
const Form = styled.form`
  min-height: calc(9 * ${({ theme }) => theme.HEIGHT});
  max-width: ${({ theme }) => theme.FORM_WIDTH};
  width: 100%;

  padding: ${({ theme }) => theme.PADDING};
  box-sizing: border-box;

  transition: ${({ theme }) => theme.TRANSITION};

  & > * {
    margin-bottom: ${({ theme }) => theme.PADDING};
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

/**
 * Component that displays title text.
 */
const Title = styled.div`
  color: ${({ theme }) => theme.PRIMARY_COLOR};
  font-size: 1.5rem;
  text-align: center;
`;

/**
 * Component that contains email and password text fields.
 */
const Main = styled.div`
  width: 100%;

  & > * {
    margin-bottom: calc(${({ theme }) => theme.PADDING} / 3);
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

/**
 * Component that contains the submit button.
 */
const Controls = styled.div`
  display: flex;
  justify-content: right;
`;
