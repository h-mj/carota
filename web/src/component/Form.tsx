import { ErrorReasons } from "api";
import { inject, observer } from "mobx-react";
import styled from "styled-components";
import * as React from "react";
import { Button } from "./Button";
import { Input, InputChangeHandler, InputNames } from "./Input";
import { InjectedProps } from "../store";
import { UNIT } from "../styling/sizes";
import { anyErrors } from "../utility/forms";

/**
 * Union of all form names which is used to retrieve appropriate translations
 * for title and submit button texts.
 */
export type FormNames = "signIn";

/**
 * Form input errors type that maps input name to its error reason. `undefined`
 * if input doesn't have any errors.
 */
export type FormErrorReasons<TInputNames extends InputNames> = {
  [InputName in TInputNames]?: ErrorReasons
};

/**
 * Form input values type that maps input name to its value.
 */
export type FormValues<TInputNames extends InputNames> = {
  [InputName in TInputNames]: string
};

/**
 * Form submit callback function type.
 */
export interface FormSubmitHandler {
  (): void;
}

/**
 * From component properties.
 */
interface FormProps<TInputNames extends InputNames> {
  /**
   * List of all field names in order from top to bottom.
   */
  inputNames: TInputNames[];

  /**
   * Form name that is used to retrieve appropriate translations for title and
   * submit button texts.
   */
  name: FormNames;

  /**
   * Input change callback function.
   */
  onChange?: InputChangeHandler<TInputNames>;

  /**
   * Submit callback function.
   */
  onSubmit?: FormSubmitHandler;

  /**
   * Mapping between input name and its error reason.
   */
  reasons: FormErrorReasons<TInputNames>;

  /**
   * Mapping between input name and its value.
   */
  values: FormValues<TInputNames>;
}

/**
 * Form component that is a collection of inputs specified by an array of names.
 */
@inject("translations")
@observer
export class Form<TInputNames extends InputNames> extends React.Component<
  FormProps<TInputNames> & InjectedProps
> {
  public render() {
    const {
      inputNames,
      name,
      onChange,
      reasons,
      translations,
      values
    } = this.props;

    const { submit, title } = translations!.translation.forms[name];

    return (
      <form noValidate={true} onSubmit={this.handleSubmit}>
        {title !== undefined && <Title>{title}</Title>}

        {inputNames.map((inputName, index) => (
          <Input
            autoFocus={index === 0}
            key={inputName}
            name={inputName}
            onChange={onChange}
            reason={reasons[inputName]}
            value={values[inputName]}
          />
        ))}

        <Button hasError={anyErrors(reasons)}>{submit}</Button>
      </form>
    );
  }

  /**
   * Prevents default submit event and calls `onSubmit` property if it is
   * defined.
   */
  private handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();

    if (this.props.onSubmit === undefined) {
      return;
    }

    this.props.onSubmit();
  };
}

/**
 * Title message component on top of the form.
 */
const Title = styled.div`
  height: ${1.5 * UNIT}rem;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 1.5rem;
`;
