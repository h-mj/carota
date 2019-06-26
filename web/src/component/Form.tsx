import { Error, ErrorReasons } from "api";
import { inject, observer } from "mobx-react";
import styled from "styled-components";
import * as React from "react";
import { Button } from "./Button";
import { Input, InputChangeHandler, InputValueType } from "./Input";
import { InjectedProps } from "../store";
import { UNIT } from "../styling/sizes";
import {
  anyErrors,
  createFormErrorsReasons,
  createFormValues
} from "../utility/forms";
import { action, observable } from "mobx";

/**
 * Type that maps form name to union of names of its inputs.
 */
interface FormInputNames {
  login: "email" | "password";
  nutritionInformation:
    | "energy"
    | "fat"
    | "saturates"
    | "monoUnsaturates"
    | "polyunsaturates"
    | "carbohydrate"
    | "sugars"
    | "polyols"
    | "starch"
    | "fibre"
    | "protein"
    | "salt";
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
  nutritionInformation: [
    "energy",
    "fat",
    "saturates",
    "monoUnsaturates",
    "polyunsaturates",
    "carbohydrate",
    "sugars",
    "polyols",
    "starch",
    "fibre",
    "protein",
    "salt"
  ],
  register: ["language", "name", "email", "password"]
};

/**
 * Form input errors type that maps input name to its error reason. `undefined`
 * if input doesn't have any errors.
 */
export type FormErrorReasons<TFormName extends FormNames> = {
  [InputName in FormInputNames[TFormName]]?: ErrorReasons
};

/**
 * Form input values type that maps input name to its value.
 */
export type FormValues<TFormName extends FormNames> = {
  [InputName in FormInputNames[TFormName]]: InputValueType<InputName>
};

/**
 * InputChangeHandler type based on form name.
 */
export type FormInputChangeHandler<
  TFormName extends FormNames
> = InputChangeHandler<FormInputNames[TFormName]>;

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
  onChange?: FormInputChangeHandler<TFormName>;

  /**
   * Form submit callback function.
   */
  onSubmit?: FormSubmitHandler<TFormName>;

  /**
   * Whether or not all inputs should be tabular.
   */
  tabular?: boolean;
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
  @observable private values = createFormValues(FORM_INPUTS[this.props.name]);

  /**
   * Form input field error reasons.
   */
  @observable private reasons: FormErrorReasons<TFormName> = {};

  /**
   * Renders a form component.
   */
  public render() {
    const { name, tabular, translations } = this.props;
    const { submit, title } = translations!.translation.forms[name];

    return (
      <FormElement noValidate={true} onSubmit={this.handleSubmit}>
        {title !== undefined && <Title>{title}</Title>}

        {(FORM_INPUTS[name] as FormInputNames[TFormName][]).map(
          (inputName, index) => (
            <Input
              autoFocus={index === 0}
              key={inputName}
              name={inputName}
              onChange={this.handleChange}
              reason={this.reasons[inputName]}
              tabular={tabular}
              value={this.values[inputName]}
            />
          )
        )}

        <Button hasError={anyErrors(this.reasons)}>{submit}</Button>
      </FormElement>
    );
  }

  /**
   * Updates changed field value.
   */
  @action
  private handleChange: FormInputChangeHandler<TFormName> = (name, value) => {
    (this.values[name] as string) = value;
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

  & > *:last-child {
    margin-bottom: 0;
  }
`;

/**
 * Title message component on top of the form.
 */
const Title = styled.div`
  height: ${2 * UNIT}rem;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 2rem;
  letter-spacing: -0.022em;
  text-align: center;
`;
