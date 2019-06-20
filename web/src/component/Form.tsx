import { ErrorReasons } from "api";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Button } from "./Button";
import { Input, InputChangeHandler, InputNames } from "./Input";
import { InjectedProps } from "../store";
import { anyErrors } from "../utility/forms";
import styled from "styled-components";
import { UNIT } from "../styling/sizes";

/**
 * Scenes that use form component and should have appropriate translations.
 */
export type FormSceneNames = "signIn";

/**
 * Form input errors type that maps input name to its error message. `undefined`
 * if there's are no errors.
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
   * List of all field names in order.
   */
  names: TInputNames[];

  /**
   * Change callback function.
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
   * Scene name which uses this component.
   */
  scene: FormSceneNames;

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
      names,
      onChange,
      reasons,
      scene,
      translations,
      values
    } = this.props;

    const { submit, title } = translations!.translation.forms[scene];

    return (
      <form noValidate={true} onSubmit={this.handleSubmit}>
        {title !== undefined && <Title>{title}</Title>}

        {names.map((name, index) => (
          <Input
            autoFocus={index === 0}
            key={name}
            name={name}
            onChange={onChange}
            reason={reasons[name]}
            value={values[name]}
          />
        ))}

        <Button hasError={anyErrors(reasons)}>{submit}</Button>
      </form>
    );
  }

  /**
   * Prevents forms default submit event and calls `onSubmit` property if
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
 * Title message on top of the form.
 */
const Title = styled.div`
  height: ${1.5 * UNIT}rem;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 1.5rem;
`;
