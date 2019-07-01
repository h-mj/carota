import { inject, observer, Provider } from "mobx-react";
import * as React from "react";
import { render } from "react-dom";
import { createGlobalStyle } from "styled-components";
import { Stage, Stages } from "./scene/Stage";
import { NotificationContainer } from "./component/NotificationContainer";
import { Loader } from "./component/Loader";
import { Navigation } from "./component/Navigation";
import { InjectedProps, STORES } from "./store";
import { BACKGROUND, FOREGROUND } from "./styling/colors";

/**
 * Global style properties.
 */
interface GlobalStyleProps {
  /**
   * Whether or not body overflow must be hidden.
   */
  hideOverflow: boolean;
}

/**
 * Global style that contains styling defined in global stylesheet.
 */
const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
  @import url("https://rsms.me/inter/inter.css");

  html {
    background-color: ${BACKGROUND};
    color: ${FOREGROUND};

    font-family: "Inter", sans-serif;
    font-size: 16px;
    letter-spacing: -.011rem;
  }

  body {
    margin: 0;
    overflow: ${props => (props.hideOverflow ? "hidden" : "auto")};
  }

  html, body, #root {
    height: 100%;
  }

  #root {
    position: relative;
    display: flex;
    flex-direction: column;
  }
`;

/**
 * Array of navigable stages using the navigation bar.
 */
export const NAVIGATION_STAGES: Readonly<Array<Stages>> = [
  new Stage("Home", {}, {}),
  new Stage("Diet", {}, {}),
  new Stage("Measurements", {}, {}),
  new Stage("History", {}, {}),
  new Stage("Administration", {}, {}),
  new Stage("Settings", {}, {}),
  new Stage("Logout", {}, {})
];

/**
 * The root component.
 */
@inject("view")
@observer
class Application extends React.Component<InjectedProps> {
  public render() {
    const { main, notifications, showNavigation, waiting } = this.props.view!;

    return (
      <>
        <GlobalStyle hideOverflow={waiting} />
        {showNavigation && <Navigation stages={NAVIGATION_STAGES} />}
        {main.render()}
        <Loader isLoading={waiting} />
        <NotificationContainer notifications={notifications} />
      </>
    );
  }
}

render(
  <Provider {...STORES}>
    <Application />
  </Provider>,
  document.getElementById("root")
);
