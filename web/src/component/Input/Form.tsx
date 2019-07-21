import { Error } from "api";
import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Component } from "../Component";
import { Button } from "./Button";
import {
  getDefaultValue,
  Input,
  InputChangeHandler,
  InputErrorReasons,
  InputNames,
  InputValues
} from "./Input";
import { UNIT_HEIGHT } from "../../styling/sizes";
import { styled } from "../../styling/theme";
import { any, insert } from "../../utility/form";

/**
 * Returns function input name type parameters as array.
 */
const withInputs = <TInputNames extends InputNames>(...names: TInputNames[]) =>
  names;

/**
 * Defines form names and their corresponding input name arrays.
 */
const FORM_INPUT_NAMES = {
  foodInformation: withInputs("name", "barcode", "unit", "nutritionDeclaration")
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
 * Type that maps all input names of form named `TFormName` to their value
 * types.
 */
export type FormValues<TFormName extends FormNames = FormNames> = {
  [InputName in FormInputNames<TFormName>]: InputValues<InputName>
};

/**
 * Creates default `FormValues` object of form named `formName`.
 */
const createFormDefaultValues = <TFormName extends FormNames>(
  formName: TFormName
) => {
  const values: Record<string, InputValues<InputNames>> = {};

  for (const inputName of FORM_INPUT_NAMES[formName]) {
    values[inputName] = getDefaultValue(inputName);
  }

  return values as FormValues<TFormName>;
};

/**
 * Type that maps all input names of form named `TFormName` to error reason
 * type.
 */
type FormErrorReasons<TFormName extends FormNames = FormNames> = {
  [InputName in FormInputNames<TFormName>]?: InputErrorReasons<InputName>
};

/**
 * Form input change handler of form named `TFormName`.
 */
export type FormChangeHandler<
  TFormName extends FormNames = FormNames
> = InputChangeHandler<
  FormInputNames<TFormName>,
  InputValues<FormInputNames<TFormName>>
>;

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
  reasons?: Readonly<FormErrorReasons<TFormName>>;

  /**
   * Object that maps input name to its value. Used only as initial value for
   * internal `values` field.
   */
  values?: Readonly<FormValues<TFormName>>;
}

/**
 * Form translation.
 */
interface FormTranslation {
  /**
   * Submit button text.
   */
  submit: string;
}

/**
 * Form component used to automatically create forms by specifying form name.
 *
 * This component manages each inputs value and error reason, meaning it does
 * not require `values` and `reasons` props. These props, if provided, will be
 * used as initial values. It is impossible to retrieve error reasons object,
 * but values are provided as `onSubmit` callback function parameter.
 */
@inject("views")
@observer
export class Form<TFormName extends FormNames = FormNames> extends Component<
  FormProps<TFormName>,
  Record<FormNames, FormTranslation>
> {
  /**
   * Form input values.
   */
  @observable private values: FormValues<TFormName> =
    this.props.values || createFormDefaultValues(this.props.name);

  /**
   * Form input error reasons.
   */
  @observable private reasons: FormErrorReasons<TFormName> =
    this.props.reasons || {};

  /**
   * Renders form component alongside with its inputs.
   */
  public render() {
    const { autoFocus, name } = this.props;

    const inputNames = FORM_INPUT_NAMES[name] as Array<
      FormInputNames<TFormName>
    >;

    return (
      <FormElement noValidate={true} onSubmit={this.handleSubmit}>
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

        <Button invalid={any(this.reasons)}>
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

    const { onSubmit } = this.props;

    if (onSubmit === undefined) {
      return;
    }

    insert((this.reasons = {}), await onSubmit(this.values));
  };
}

/**
 * Actual form element.
 */
const FormElement = styled.form`
  & > * {
    margin-bottom: ${UNIT_HEIGHT / 4}rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
