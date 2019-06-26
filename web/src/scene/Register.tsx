import { Languages } from "api";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Scene } from "./Scene";
import { Stage } from "./Stage";
import { Error } from "../component/Error";
import { Form, FormSubmitHandler } from "../component/Form";
import { Thin } from "../component/container/Thin";
import { setTimeout } from "../utility/forms";

/**
 * Scene that renders a form used for registration.
 */
@inject("auth", "view")
@observer
export class Register extends Scene<"register"> {
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
    }

    if (!this.isValid) {
      return <Error name="invalidInvitation" parameters={{}} />;
    }

    return (
      <Thin>
        <Form name="register" onSubmit={this.onSubmit} />
      </Thin>
    );
  }

  /**
   * Sends registration form data to server and either redirects user to home
   * stage or displays occurred errors.
   */
  @action
  private onSubmit: FormSubmitHandler<"register"> = async values => {
    const { email, language, name, password } = values;
    const { invitationId } = this.props.parameters!;

    this.props.view!.wait(Register.WAIT_REASON);

    const [error] = await Promise.all([
      this.props.auth!.register({
        email,
        language: language as Languages, // Ignore that language could be `""` if nothing is selected.
        name,
        password,
        invitationId
      }),
      setTimeout(1)
    ]);

    this.props.view!.done(Register.WAIT_REASON);

    if (error === undefined) {
      this.props.view!.redirect(Stage.HOME);
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
      this.props.view!.wait(Register.WAIT_REASON);
      this.isValid = await this.props.auth!.check(this.props.parameters);
      this.props.view!.done(Register.WAIT_REASON);
    }
  }
}
