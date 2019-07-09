import { AuthLoginBody } from "api";
import { action } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Scene } from "./Scene";
import { Form, FormSubmitHandler } from "../component/Form";
import { Compact } from "../component/container/Compact";
import { Logo } from "../component/icon/Logo";
import { Notification } from "../component/NotificationContainer";
import { setTimeout } from "../utility/promises";
import { UNIT_HEIGHT } from "../styling/sizes";
import { styled } from "../styling/theme";

/**
 * Scene that renders a form used for signing in.
 */
@inject("auth", "views")
@observer
export class Login extends Scene<"Login"> {
  /**
   * Waiting reason that is used to show loader component when waiting for
   * server response.
   */
  private static WAIT_REASON = "login";

  /**
   * Renders a sign in form.
   */
  public render() {
    return (
      <Compact>
        <LogoContainer>
          <Logo width={`${UNIT_HEIGHT}rem`} height={`${UNIT_HEIGHT}rem`} />
        </LogoContainer>
        <Form autoFocus name="login" onSubmit={this.handleSubmit} />
      </Compact>
    );
  }

  /**
   * Sends login credentials to server and either redirects user to correct
   * stage or displays occurred errors.
   */
  @action
  private handleSubmit: FormSubmitHandler<"login"> = async values => {
    this.props.views!.wait(Login.WAIT_REASON);

    const [error] = await Promise.all([
      this.props.auth!.login(values as AuthLoginBody), // Let backend handle the validation for now.
      setTimeout(1)
    ]);

    this.props.views!.done(Login.WAIT_REASON);

    if (error === undefined) {
      this.props.views!.update(); // Update stage to match current URL.
    } else if (error.code === 401) {
      this.props.views!.notify(new Notification("loginInvalidCredentials", {}));
    }

    return error;
  };
}

/**
 * Container that contains a logo.
 */
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: ${2 * UNIT_HEIGHT}rem;
  height: ${2 * UNIT_HEIGHT}rem;
  margin: ${UNIT_HEIGHT}rem auto;
`;
