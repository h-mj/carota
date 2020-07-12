import { deviate } from "deviator";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Language, Sex } from "server";

import { SceneComponent, SceneComponentProps } from "../base/SceneComponent";
import { Button } from "../component/Button";
import { Center } from "../component/Center";
import { Controls, Form, Title } from "../component/collection/form";
import { Group } from "../component/Group";
import { Head } from "../component/Head";
import { Select } from "../component/Select";
import { TextField } from "../component/TextField";
import { any, append, ErrorsFor } from "../utility/form";

/**
 * Text field name type that is union of all text field names inside
 * `TEXT_FIELDS` array.
 */
type TextFieldNames = "name" | "birthDate" | "email" | "password";

/**
 * Maps select input name to its options.
 */
const SELECT_OPTIONS = {
  language: ["English", "Estonian", "Russian"],
  sex: ["Female", "Male"],
} as const;

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
  options: Record<Language, string>;
}

/**
 * Sex selection field translation.
 */
interface SexSelectTranslation extends TextFieldTranslation {
  /**
   * Translations of sex options.
   */
  options: Record<Sex, string>;
}

/**
 * Register scene translation.
 */
interface RegisterTranslation {
  /**
   * Registration form input translations.
   */
  inputs: Record<TextFieldNames, TextFieldTranslation> &
    Record<"language", LanguageSelectTranslation> &
    Record<"sex", SexSelectTranslation>;

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
  Record<"language", Language | undefined> &
  Record<"sex", Sex | undefined>;

/**
 * Transformation function that transforms `RegisterValues` into
 * `AccountRegisterBody`.
 */
// prettier-ignore
const toBody = deviate<RegisterValues>().shape({
  language: deviate<Language | undefined>().defined(),
  name: deviate<string>().trim().nonempty(),
  sex: deviate<Sex | undefined>().defined(),
  birthDate: deviate<string>().nonempty(),
  email: deviate<string>().trim().nonempty().email(),
  password: deviate<string>().nonempty().minLength(8)
});

/**
 * Scene that used to create a new account by filling in registration form.
 */
@inject("accountStore", "invitationStore", "viewStore")
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
    sex: undefined,
    birthDate: "",
    email: "",
    password: "",
  };

  /**
   * Object that contains error reasons of occurred errors of each input.
   */
  @observable private reasons: Partial<ErrorsFor<RegisterValues>> = {};

  /**
   * Creates `Register` scene, sets the name of the scene and initiates
   * invitation ID verification.
   */
  public constructor(props: SceneComponentProps<"Register">) {
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
              options={SELECT_OPTIONS.language.map((language) => ({
                label: this.translation.inputs.language.options[language],
                value: language,
              }))}
              required={true}
              value={this.values.language}
            />
            {this.renderTextField("name")}
            <Select
              errorMessage={
                this.reasons.sex !== undefined
                  ? this.translation.inputs.sex.reasons[this.reasons.sex]
                  : undefined
              }
              invalid={this.reasons.sex !== undefined}
              label={this.translation.inputs.sex.label}
              name="sex"
              onChange={this.handleSexChange}
              options={SELECT_OPTIONS.sex.map((sex) => ({
                label: this.translation.inputs.sex.options[sex],
                value: sex,
              }))}
              required={true}
              value={this.values.sex}
            />
            {this.renderTextField("birthDate")}
            {this.renderTextField("email")}
            {this.renderTextField("password")}
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
   * Renders text field with specified name.
   */
  public renderTextField(name: TextFieldNames) {
    return (
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
        type={name === "name" ? "text" : name === "birthDate" ? "date" : name}
        value={this.values[name]}
      />
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
    value: Language | undefined
  ) => {
    this.values[name] = value;
    this.props.viewStore!.language = value || "English";
  };

  /**
   * Updates `sex` field of `values` object on sex select option change.
   */
  @action
  private handleSexChange = (name: "sex", value: Sex | undefined) => {
    this.values[name] = value;
  };

  /**
   * Prevents default form submit event and executes custom registration logic
   * instead.
   */
  @action
  private handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();

    const result = toBody(this.values);

    const error = await this.props.viewStore!.load(
      result.ok
        ? this.props.accountStore!.create({
            ...result.value,
            invitationId: this.props.scene!.parameters!.invitationId,
          })
        : undefined
    );

    if (result.ok && error === undefined) {
      this.props.viewStore!.index();
    }

    this.reasons = append(result.ok ? {} : result.value, error);
  };

  /**
   * Verifies invitation ID inside router parameters.
   */
  @action
  private verify = async () => {
    if (this.props.scene === undefined) {
      return this.props.viewStore!.unknown();
    }

    const { parameters } = this.props.scene;

    if (
      parameters === undefined ||
      !GUID_V4_REGEX.test(parameters.invitationId)
    ) {
      return this.props.viewStore!.unknown();
    }

    const result = await this.props.viewStore!.load(
      this.props.invitationStore!.get(parameters.invitationId)
    );

    if (!result.ok) {
      return this.props.viewStore!.unknown();
    }

    this.loaded = true;
  };
}
