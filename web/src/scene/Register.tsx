import { AuthRegisterBody, Languages } from "api";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { SceneContext } from "./SceneContext";
import { Scene } from "./Scene";
import { Alert } from "../component/Alert";
import { Compact } from "../component/container/Compact";
import { Form, FormChangeHandler, FormSubmitHandler } from "../component/Form";

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
   * scene or displays occurred errors.
   */
  @action
  private handleSubmit: FormSubmitHandler<"register"> = async values => {
    const { auth, parameters, views } = this.props;

    const error = views!.load(
      auth!.register({
        ...values,
        invitationId: parameters!.invitationId
      } as AuthRegisterBody), // Let backend handle the validation for now.);
      1
    );

    if (error === undefined) {
      views!.redirect(SceneContext.HOME);
    }

    return error;
  };

  /**
   * Checks whether ot not `invitationId` in `parameters` props is valid and
   * assigns corresponding boolean value to `valid` field.
   */
  private async checkInvitationIdValidity() {
    const { auth, parameters, views } = this.props;

    this.isValid =
      parameters === undefined
        ? false
        : await views!.load(auth!.check(parameters));
  }
}
