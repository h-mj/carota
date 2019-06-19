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
import styled from "styled-components";

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
      <Container>
        <Form
          errors={this.errors}
          names={["email", "password"]}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          values={this.values}
        />
      </Container>
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

const Container = styled.div`
  width: 100%;
  max-width: 32rem;
  padding: 2rem;
  box-sizing: border-box;
  margin: 0 auto;
`;
