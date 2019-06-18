import { observer } from "mobx-react";
import * as React from "react";
import { Button } from "./Button";
import { Input, InputChangeHandler, InputName } from "./Input";

/**
 * Form input errors type that maps input name to its error message. `undefined`
 * if there's are no errors.
 */
export type FormErrors<TName extends InputName> = { [P in TName]?: string };

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
   * Mapping between input name and its error message.
   */
  errors: FormErrors<TName>;

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
   * Mapping between input name and its value.
   */
  values: FormValues<TName>;
}

/**
 * Form component that is a collection of inputs specified by an array of names.
 */
@observer
export class Form<TName extends InputName> extends React.Component<
  FormProps<TName>
> {
  public render() {
    const { errors, names, onChange, values } = this.props;

    return (
      <form noValidate={true} onSubmit={this.handleSubmit}>
        {names.map(name => (
          <Input
            key={name}
            error={errors[name]}
            name={name}
            onChange={onChange}
            value={values[name]}
          />
        ))}

        <Button />
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
