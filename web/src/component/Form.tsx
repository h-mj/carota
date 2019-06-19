import { ErrorReason } from "api";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Button } from "./Button";
import { Input, InputChangeHandler, InputName } from "./Input";
import { FormScene } from "../scene";
import { InjectedProps } from "../store";
import { anyErrors } from "../utility/forms";
import styled from "styled-components";
import { UNIT } from "../styling/sizes";

/**
 * Form input errors type that maps input name to its error message. `undefined`
 * if there's are no errors.
 */
export type FormErrorReasons<TName extends InputName> = {
  [P in TName]?: ErrorReason
};

/**
 * Form input values type that maps input name to its value.
 */
export type FormValues<TName extends InputName> = { [P in TName]: string };

/**
 * Form submit callback function type.
 */
export interface FormSubmitHandler {
  (): void;
}

/**
 * From component properties.
 */
interface FormProps<TName extends InputName> {
  /**
   * List of all field names in order.
   */
  names: TName[];

  /**
   * Change callback function.
   */
  onChange?: InputChangeHandler<TName>;

  /**
   * Submit callback function.
   */
  onSubmit?: FormSubmitHandler;

  /**
   * Mapping between input name and its error reason.
   */
  reasons: FormErrorReasons<TName>;

  /**
   * Scene name which uses this component.
   */
  scene: FormScene;

  /**
   * Mapping between input name and its value.
   */
  values: FormValues<TName>;
}

/**
 * Form component that is a collection of inputs specified by an array of names.
 */
@inject("translations")
@observer
export class Form<TName extends InputName> extends React.Component<
  FormProps<TName> & InjectedProps
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
