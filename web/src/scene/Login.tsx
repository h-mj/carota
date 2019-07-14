import { AuthLoginBody } from "api";
import { action } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Scene } from "./Scene";
import { Compact } from "../component/container/Compact";
import { Form, FormSubmitHandler } from "../component/Form";
import { Head } from "../component/Head";
import { Logo } from "../component/icon/Logo";
import { Notification } from "../component/NotificationContainer";
import { resolveAfterTimeout } from "../utility/promises";
import { UNIT_HEIGHT } from "../styling/sizes";
import { styled } from "../styling/theme";

/**
 * Login scene translation.
 */
interface LoginTranslation {
  /**
   * Page title.
   */
  title: string;
}

/**
 * Scene that renders a form used for signing in.
 */
@inject("auth", "views")
@observer
export class Login extends Scene<"Login", {}, LoginTranslation> {
  /**
   * Renders a sign in form.
   */
  public render() {
    return (
      <Compact>
        <Head title={this.translation.title} />
        <LogoContainer>
          <Logo />
          {this.props.views!.translation.components.Head.title}
        </LogoContainer>
        <Form autoFocus name="login" onSubmit={this.handleSubmit} />
      </Compact>
    );
  }

  /**
   * Sends login credentials to server and either redirects user to correct
   * scene or displays occurred errors.
   */
  @action
  private handleSubmit: FormSubmitHandler<"login"> = async values => {
    const { auth, views } = this.props;

    const symbol = views!.wait("Login request");

    const [error] = await Promise.all([
      auth!.login(values as AuthLoginBody), // Let backend handle the validation for now.
      resolveAfterTimeout(1)
    ]);

    views!.done(symbol);

    if (error === undefined) {
      views!.update(); // Update scene to match current URL.
    } else if (error.code === 401) {
      views!.notify(new Notification("loginInvalidCredentials", {}));
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
  margin: ${UNIT_HEIGHT / 2}rem auto;

  & > * {
    flex-shrink: 0;
    margin-right: ${UNIT_HEIGHT / 16}rem;
  }

  color: ${({ theme }) => theme.colorPrimary};
`;
