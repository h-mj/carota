import { Error, ErrorReasons } from "api";
import { inject, observer } from "mobx-react";
import styled from "styled-components";
import * as React from "react";
import { Button } from "./Button";
import { Input, InputChangeHandler, InputNames, InputValues } from "./Input";
import { InjectedProps } from "../store";
import { UNIT } from "../styling/sizes";
import { anyErrors, createFormErrorsReasons } from "../utility/forms";
import { action, observable } from "mobx";

/**
 * Type that maps form name to union of names of its inputs.
 */
export interface FormInputNames {
  login: "email" | "password";
  register: "email" | "language" | "name" | "password";
}

/**
 * Union of all form names which is used to retrieve appropriate translations
 * for title and submit button texts.
 */
export type FormNames = keyof FormInputNames;

/**
 * Object that holds input name arrays for each form name.
 */
const FORM_INPUTS: Readonly<
  { [FormName in FormNames]: FormInputNames[FormName][] }
> = {
  login: ["email", "password"],
  register: ["language", "name", "email", "password"]
};

/**
 * Input errors type that maps input name to its error reason. `undefined`
 * if input doesn't have any errors.
 */
export type InputErrorReasons<TInputNames extends InputNames> = {
  [InputName in TInputNames]?: ErrorReasons
};

/**
 * Input errors type of given form.
 */
export type FormErrorReasons<TFormName extends FormNames> = InputErrorReasons<
  FormInputNames[TFormName]
>;

export type InputValuesX<TInputNames extends InputNames> = {
  [InputName in TInputNames]?: InputValues<InputName>
};

/**
 * Input values type of given form.
 */
export type FormValues<TFormName extends FormNames> = InputValuesX<
  FormInputNames[TFormName]
>;

/**
 * Form submit callback function type.
 */
export interface FormSubmitHandler<TFormName extends FormNames> {
  (values: FormValues<TFormName>): Promise<Error | undefined>;
}

/**
 * From component properties.
 */
interface FormProps<TFormName extends FormNames> {
  /**
   * Form name that is used to retrieve appropriate translations for title and
   * submit button texts.
   */
  name: FormNames;

  /**
   * Input change callback function.
   */
  onChange?: InputChangeHandler<InputValues<FormInputNames[TFormName]>>;

  /**
   * Form submit callback function.
   */
  onSubmit?: FormSubmitHandler<TFormName>;
}

/**
 * Form component that is a collection of inputs specified by an array of names.
 */
@inject("translations")
@observer
export class Form<TFormName extends FormNames> extends React.Component<
  FormProps<TFormName> & InjectedProps
> {
  /**
   * Form input field values.
   */
  @observable private values: FormValues<TFormName> = {};

  /**
   * Form input field error reasons.
   */
  @observable private reasons: FormErrorReasons<TFormName> = {};

  /**
   * Renders a form component.
   */
  public render() {
    const { name, translations } = this.props;
    const { submit, title } = translations!.translation.forms[name];

    return (
      <FormElement noValidate={true} onSubmit={this.handleSubmit}>
        <Title>{title}</Title>

        {(FORM_INPUTS[name] as FormInputNames[TFormName][]).map(
          (inputName, index) => (
            <Input
              autoFocus={index === 0}
              key={inputName}
              name={inputName}
              onChange={this.handleChange}
              reason={this.reasons[inputName]}
              value={this.values[inputName] as any}
            />
          )
        )}

        <Button hasError={anyErrors(this.reasons)}>{submit}</Button>
      </FormElement>
    );
  }

  /**
   * Updates changed input value.
   */
  @action
  private handleChange: InputChangeHandler<
    InputValues<FormInputNames[TFormName]>
  > = (name, value) => {
    (this.values[name as FormInputNames[TFormName]] as InputValues<
      FormInputNames[TFormName]
    >) = value;

    this.props.onChange !== undefined && this.props.onChange(name, value);
  };

  /**
   * Prevents default submit event and calls `onSubmit` property if it is
   * defined.
   */
  private handleSubmit: React.FormEventHandler<
    HTMLFormElement
  > = async event => {
    event.preventDefault();

    if (this.props.onSubmit === undefined) {
      return;
    }

    this.reasons = createFormErrorsReasons(
      await this.props.onSubmit(this.values),
      this.values
    );
  };
}

/**
 * Actual form element.
 */
const FormElement = styled.form`
  & > * {
    margin-bottom: ${UNIT / 4}rem;
  }

  & > *:first-child,
  & > *:last-child {
    margin-bottom: 0;
  }
`;

/**
 * Title message component on top of the form.
 */
const Title = styled.div`
  height: ${UNIT}rem;
  padding-bottom: ${UNIT}rem;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 2.5rem;
  letter-spacing: -0.022rem;
  text-align: center;
`;
