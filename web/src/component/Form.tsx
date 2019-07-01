import { Error, ErrorReasons } from "api";
import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { Component } from "./Component";
import { Button } from "./Button";
import { Input, InputChangeHandler, InputNames, InputValues } from "./Input";
import { UNIT } from "../styling/sizes";

/**
 * Returns parameters as array of input names.
 */
const withInputs = <TInputNames extends InputNames>(...names: TInputNames[]) =>
  names;

/**
 * Defines form names and their corresponding input name arrays.
 */
const FORM_INPUT_NAMES = {
  login: withInputs("email", "password"),
  register: withInputs("language", "name", "email", "password")
};

/**
 * Union of all form names.
 */
type FormNames = keyof typeof FORM_INPUT_NAMES;

/**
 * Union of input names of form named `TFormName`.
 */
type FormInputNames<
  TFormName extends FormNames = FormNames
> = typeof FORM_INPUT_NAMES[TFormName][number];

/**
 * Checks whether or not `inputName` is one of form `formName` inputs.
 *
 * @param inputName
 * @param formName
 */
const isFormInputName = <TFormName extends FormNames>(
  formName: TFormName,
  inputName: string
): inputName is FormInputNames<TFormName> => {
  return (FORM_INPUT_NAMES[formName] as string[]).includes(inputName);
};

/**
 * Type that maps all input names of form named `TFormName` to their value
 * types.
 */
type FormValues<TFormName extends FormNames = FormNames> = {
  [InputName in FormInputNames<TFormName>]?: InputValues<InputName>
};

/**
 * Type that maps all input names of form named `TFormName` to error reason
 * type.
 */
type FormErrorReasons<TFormName extends FormNames = FormNames> = {
  [InputName in FormInputNames<TFormName>]?: ErrorReasons
};

/**
 * Creates a new `FormErrorReasons<TFormName>` object from given API `Error`
 * object.
 *
 * If occurred error field name is not one of the form input names, it is
 * ignored.
 *
 * @param formName Form name for which error reasons object is created.
 * @param error Occurred API error.
 */
const createFormErrorReasons = <TFormName extends FormNames>(
  formName: TFormName,
  error: Error | undefined
): FormErrorReasons<TFormName> => {
  const reasons: FormErrorReasons<TFormName> = {};

  if (error === undefined || error.details === undefined) {
    return reasons;
  }

  for (const detail of error.details) {
    const { field } = detail.location;

    if (field === undefined || !isFormInputName(formName, field)) {
      continue;
    }

    reasons[field] = detail.reason;
  }

  return reasons;
};

/**
 * Returns whether or not there are any erroneous input fields.
 *
 * @param reasons Error reasons object.
 */
const anyErrors = <TFormName extends FormNames>(
  reasons: Readonly<FormErrorReasons<TFormName>>
) => {
  return Object.keys(reasons).length !== 0;
};

/**
 * Form input change handler of form named `TFormName`.
 */
export type FormChangeHandler<
  TFormName extends FormNames = FormNames
> = InputChangeHandler<InputValues<FormInputNames<TFormName>>>;

/**
 * Form submit handler of form named `TFormName`.
 */
export type FormSubmitHandler<TFormName extends FormNames = FormNames> = (
  values: FormValues<TFormName>
) => Promise<Error | undefined>;

/**
 * Form component props.
 */
interface FormProps<TFormName extends FormNames = FormNames> {
  /**
   * Whether or not first input should be in the focus automatically.
   */
  autoFocus?: boolean;

  /**
   * Form name.
   */
  name: TFormName;

  /**
   * Callback function that is called when one of the inputs was changed.
   */
  onChange?: FormChangeHandler<TFormName>;

  /**
   * Callback function that is called when form is submitted.
   */
  onSubmit?: FormSubmitHandler<TFormName>;

  /**
   * Object that maps input name to its reason. Used only as initial value for
   * internal `reasons` field.
   */
  reasons?: FormErrorReasons<TFormName>;

  /**
   * Object that maps input name to its value. Used only as initial value for
   * internal `values` field.
   */
  values?: FormValues<TFormName>;
}

/**
 * Translations of different form names.
 */
type FormsTranslation = { [FormName in FormNames]: FormTranslation };

/**
 * Form translation.
 */
interface FormTranslation {
  title: string;
  submit: string;
}

/**
 * Form component used to automatically create forms by specifing form name.
 *
 * This component manages each inputs value and error reason, meaning it does
 * not require `values` and `reasons` props. These props, if provided, will be
 * used as initial values. It is impossible to retrieve error reasons object,
 * but values are provided as `onSubmit` callback function parameter.
 */
@inject("translations")
@observer
export class Form<TFormName extends FormNames = FormNames> extends Component<
  FormProps<TFormName>,
  FormsTranslation
> {
  /**
   * Form input values.
   */
  @observable private values: FormValues<TFormName> = this.props.values || {};

  /**
   * Form input error reasons.
   */
  @observable private reasons: FormErrorReasons<TFormName> =
    this.props.reasons || {};

  /**
   * Renders form component alogside with its inputs.
   */
  public render() {
    const { autoFocus, name } = this.props;

    const inputNames = FORM_INPUT_NAMES[name] as Array<
      FormInputNames<TFormName>
    >;

    return (
      <FormElement noValidate={true} onSubmit={this.handleSubmit}>
        <Title>{this.translation[name].title}</Title>

        {inputNames.map((inputName, index) => (
          <Input
            autoFocus={index === 0 && autoFocus}
            key={inputName}
            name={inputName}
            onChange={this.handleChange}
            reason={this.reasons[inputName]}
            value={this.values[inputName]}
          />
        ))}

        <Button hasError={anyErrors(this.reasons)}>
          {this.translation[name].submit}
        </Button>
      </FormElement>
    );
  }

  /**
   * Updates changed input value and calls `onChange` prop if defined.
   */
  private handleChange: FormChangeHandler<TFormName> = (name, value) => {
    this.values[name as FormInputNames<TFormName>] = value;
    this.props.onChange && this.props.onChange(name, value);
  };

  /**
   * Prevents default submit event and calls `onSubmit` property if it is
   * defined.
   */
  private handleSubmit: React.FormEventHandler<
    HTMLFormElement
  > = async event => {
    event.preventDefault();

    const { name, onSubmit } = this.props;

    if (onSubmit === undefined) {
      return;
    }

    this.reasons = createFormErrorReasons(name, await onSubmit(this.values));
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
