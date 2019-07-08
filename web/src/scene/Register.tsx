import { AuthRegisterBody, Languages } from "api";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Scene } from "./Scene";
import { Stage } from "./Stage";
import { Alert } from "../component/Alert";
import { Compact } from "../component/container/Compact";
import { Form, FormChangeHandler, FormSubmitHandler } from "../component/Form";
import { setTimeout } from "../utility/promises";

/**
 * Scene that renders a form used for registration.
 */
@inject("auth", "views")
@observer
export class Register extends Scene<"Register"> {
  /**
   * Whether or not `invitationId` in `parameters` props is valid. `undefined`
   * if the value has not been retrieved yet.
   */
  @observable private isValid?: boolean;

  /**
   * Waiting reason that is used to show loader component when waiting for
   * server response.
   */
  private static WAIT_REASON = "register";

  /**
   * Creates a new instance of `Register` scene.
   *
   * Calls an async function that checks whether
   */
  public constructor(props: any) {
    super(props);

    this.checkInvitationIdValidity();
  }

  /**
   * Renders a registration form.
   */
  public render() {
    if (this.isValid === undefined) {
      return null;
    } else if (!this.isValid) {
      return <Alert name="invalidInvitation" parameters={{}} />;
    }

    return (
      <Compact>
        <Form
          autoFocus
          name="register"
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
        />
      </Compact>
    );
  }

  /**
   * Updates interface language when language input changes.
   */
  @action
  private handleChange: FormChangeHandler<"register"> = (name, value) => {
    if (name === "language") {
      this.props.views!.language = value as Languages;
    }
  };

  /**
   * Sends registration form data to server and either redirects user to home
   * stage or displays occurred errors.
   */
  @action
  private handleSubmit: FormSubmitHandler<"register"> = async values => {
    const { invitationId } = this.props.parameters!;

    this.props.views!.wait(Register.WAIT_REASON);

    const [error] = await Promise.all([
      this.props.auth!.register({
        ...values,
        invitationId
      } as AuthRegisterBody), // Let backend handle the validation for now.
      setTimeout(1)
    ]);

    this.props.views!.done(Register.WAIT_REASON);

    if (error === undefined) {
      this.props.views!.redirect(Stage.HOME);
    }

    return error;
  };

  /**
   * Checks whether ot not `invitationId` in `parameters` props is valid and
   * assigns corresponding boolean value to `valid` field.
   */
  private async checkInvitationIdValidity() {
    if (this.props.parameters === undefined) {
      this.isValid = false;
    } else {
      this.props.views!.wait(Register.WAIT_REASON);
      this.isValid = await this.props.auth!.check(this.props.parameters);
      this.props.views!.done(Register.WAIT_REASON);
    }
  }
}
