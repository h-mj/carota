import { action, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { InputChangeHandler } from "../component/Input";
import {
  Form,
  FormErrors,
  FormValues,
  FormSubmitHandler
} from "../component/Form";

/**
 * Union of all forum input names this scene uses.
 */
type Name = "email" | "password";

/**
 * Scene that renders a form used for signing in.
 */
@observer
export class SignIn extends React.Component {
  @observable private values: FormValues<Name> = {
    email: "",
    password: ""
  };
  @observable private errors: FormErrors<Name> = {};

  public render() {
    return (
      <Form
        errors={this.errors}
        names={["email", "password"]}
        onChange={this.onChange}
        onSubmit={this.onSubmit}
        values={this.values}
      />
    );
  }

  @action
  private onChange: InputChangeHandler<Name> = (name: Name, value: string) => {
    this.values[name] = value;
  };

  private onSubmit: FormSubmitHandler = () => {
    console.log(this.values.email + ": " + this.values.password);
  };
}
