import { Languages } from "api";
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
import { Group } from "../component/Group";
import { Head } from "../component/Head";
import { Select } from "../component/Select";
import { TextField } from "../component/TextField";
import { any, append, ErrorsFor } from "../utility/form";

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
  reasons: Partial<Record<string, string>>;
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
 * Transformation function that transforms `RegisterValues` into
 * `AccountRegisterBody`.
 */
// prettier-ignore
const toBody = deviate<RegisterValues>().shape({
  language: deviate<Languages | undefined>().defined(),
  name: deviate<string>().trim().notEmpty(),
  email: deviate<string>().trim().notEmpty().email(),
  password: deviate<string>().notEmpty().minLen(8)
});

/**
 * Scene that used to create a new account by filling in registration form.
 */
@inject("accounts", "invitations", "views")
@observer
export class Register extends SceneComponent<
  "Register",
  {},
  RegisterTranslation
> {
  /**
   * Whether or not invitation ID has been checked.
   */
  @observable private loaded = false;

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
  @observable private reasons: Partial<ErrorsFor<RegisterValues>> = {};

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
    if (!this.loaded) {
      return null;
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

    const result = toBody(this.values);
    const error = await this.props.views!.load(
      result.ok
        ? this.props.accounts!.register({
            ...result.value,
            invitationId: this.props.scene.parameters!.invitationId
          })
        : undefined
    );

    if (result.ok && error === undefined) {
      this.props.views!.index();
    }

    this.reasons = append(result.ok ? {} : result.value, error);
  };

  /**
   * Verifies invitation ID inside router parameters.
   */
  @action
  private verify = async () => {
    const { parameters } = this.props.scene;

    if (
      parameters === undefined ||
      !GUID_V4_REGEX.test(parameters.invitationId)
    ) {
      return this.props.views!.unknown();
    }

    const invitation = await this.props.views!.load(
      this.props.invitations!.fetch(parameters.invitationId)
    );

    if (invitation === undefined) {
      return this.props.views!.unknown();
    }

    this.loaded = true;
  };
}
