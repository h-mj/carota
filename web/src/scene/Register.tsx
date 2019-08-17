import { AuthRegisterBody, ErrorReasons, Languages } from "api";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Alert } from "../component/Alert";
import { Button } from "../component/Button";
import { Center } from "../component/collection/container";
import { Controls, Form, Group, Title } from "../component/collection/form";
import { Head } from "../component/Head";
import { Select } from "../component/Select";
import { TextField } from "../component/TextField";
import { ErrorReasonsFor, any, append } from "../utility/form";
import { from } from "../utility/shift";

/**
 * Array of text field names within registration form.
 */
const TEXT_FIELDS = ["name", "email", "password"] as const;

/**
 * Text field name type that is union of all text field names inside
 * `TEXT_FIELDS` array.
 */
type TextFieldNames = typeof TEXT_FIELDS[number];

/**
 * Text field translation.
 */
interface TextFieldTranslation {
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
 * Language selection field translation.
 */
interface LanguageSelectTranslation extends TextFieldTranslation {
  /**
   * Translations of language options.
   */
  options: Record<Languages, string>;
}

/**
 * Register scene translation.
 */
interface RegisterTranslation {
  /**
   * Registration form input translations.
   */
  inputs: Record<TextFieldNames, TextFieldTranslation> &
    Record<"language", LanguageSelectTranslation>;

  /**
   * Form submit button text.
   */
  submit: string;

  /**
   * Page title.
   */
  title: string;
}

/**
 * Regular expression that matches valid GUID v4.
 */
const GUID_V4_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

/**
 * Register form input values.
 */
type RegisterValues = Record<TextFieldNames, string> &
  Record<"language", Languages | undefined>;

/**
 * Blueprint object that is used to transform `RegisterValues` into
 * `AuthRegisterBody` without `invitationId` property.
 */
// prettier-ignore
const BLUEPRINT = {
  language: from<Languages | undefined>().string().build(),
  name: from<string>().trim().notEmpty().build(),
  email: from<string>().trim().notEmpty().build(),
  password: from<string>().notEmpty().build()
};

/**
 * Transformation function that transforms `RegisterValues` into
 * `AuthRegisterBody` without `invitation` property.
 */
// prettier-ignore
const TRANSFORMATION = from<RegisterValues>()
  .construct<Omit<AuthRegisterBody, "invitationId">, typeof BLUEPRINT>(BLUEPRINT)
  .build();

/**
 * Scene that used to create a new account by filling in registration form.
 */
@inject("auth", "invitations", "views")
@observer
export class Register extends SceneComponent<
  "Register",
  {},
  RegisterTranslation
> {
  /**
   * Whether or not invitation within route parameters is valid.
   */
  @observable private valid?: boolean;

  /**
   * Object that contains values of each input.
   */
  @observable private values: RegisterValues = {
    language: undefined,
    name: "",
    email: "",
    password: ""
  };

  /**
   * Object that contains error reasons of occurred errors of each input.
   */
  @observable private reasons: Partial<ErrorReasonsFor<RegisterValues>> = {};

  /**
   * Creates `Register` scene, sets the name of the scene and initiates
   * invitation ID verification.
   */
  public constructor(props: DefaultSceneComponentProps<"Register">) {
    super("Register", props);
    this.verify();
  }

  /**
   * Renders registration form.
   */
  public render() {
    if (this.valid === undefined) {
      return null;
    }

    if (!this.valid) {
      return <Alert name="invalidInvitation" parameters={{}} />;
    }

    return (
      <Center>
        <Head title={this.translation.title} />
        <Form noValidate={true} onSubmit={this.handleSubmit}>
          <Title>{this.translation.title}</Title>
          <Group>
            <Select
              errorMessage={
                this.reasons.language !== undefined
                  ? this.translation.inputs.language.reasons[
                      this.reasons.language!
                    ]
                  : undefined
              }
              invalid={this.reasons.language !== undefined}
              label={this.translation.inputs.language.label}
              name="language"
              onChange={this.handleLanguageChange}
              options={(["English", "Estonian", "Russian"] as const).map(
                language => ({
                  label: this.translation.inputs.language.options[language],
                  value: language
                })
              )}
              required={true}
              value={this.values["language"]}
            />

            {TEXT_FIELDS.map(name => (
              <TextField
                key={name}
                errorMessage={
                  this.reasons[name] !== undefined
                    ? this.translation.inputs[name].reasons[this.reasons[name]!]
                    : undefined
                }
                invalid={this.reasons[name] !== undefined}
                label={this.translation.inputs[name].label}
                name={name}
                onChange={this.handleTextFieldChange}
                required={true}
                type={name === "name" ? "text" : name}
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
   * Updates `values` object on text field value change.
   */
  @action
  private handleTextFieldChange = (name: TextFieldNames, value: string) => {
    this.values[name] = value;
  };

  /**
   * Updates `language` field of `values` object on language select option change.
   */
  @action
  private handleLanguageChange = (
    name: "language",
    value: Languages | undefined
  ) => {
    this.values[name] = value;
    this.props.views!.language = value || "English";
  };

  /**
   * Prevents default form submit event and executes custom registration logic
   * instead.
   */
  @action
  private handleSubmit: React.FormEventHandler<
    HTMLFormElement
  > = async event => {
    event.preventDefault();

    const result = TRANSFORMATION(this.values);
    const error = await this.props.views!.load(
      result.kind === "Ok"
        ? this.props.auth!.register({
            ...result.value,
            invitationId: this.props.parameters!.invitationId
          })
        : undefined
    );

    if (result.kind === "Ok" && error === undefined) {
      this.props.views!.home();
    }

    this.reasons = append(result.kind === "Err" ? result.value : {}, error);
  };

  /**
   * Verifies invitation ID inside router parameters.
   */
  @action
  private verify = async () => {
    const { parameters } = this.props;

    if (
      parameters === undefined ||
      !GUID_V4_REGEX.test(parameters.invitationId)
    ) {
      this.valid = false;
    } else {
      const invitation = await this.props.views!.load(
        this.props.invitations!.fetch(parameters.invitationId)
      );

      this.valid = invitation !== undefined;
    }
  };
}
