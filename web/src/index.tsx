import { inject, observer, Provider } from "mobx-react";
import * as React from "react";
import { render } from "react-dom";
import { createGlobalStyle } from "styled-components";
import { Navigation } from "./component/Navigation";
import { NotificationContainer } from "./component/NotificationContainer";
import { Loader } from "./component/Loader";
import { InjectedProps } from "./store/Store";
import { auth } from "./store/AuthStore";
import { foods } from "./store/FoodsStore";
import { views } from "./store/ViewsStore";
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
 * The root component.
 */
@inject("views")
@observer
class Application extends React.Component<InjectedProps> {
  public render() {
    const { main, hideOverflow } = this.props.views!;

    return (
      <>
        <GlobalStyle hideOverflow={hideOverflow} />
        <Navigation />
        {main.render()}
        <Loader />
        <NotificationContainer />
      </>
    );
  }
}

/**
 * Object that contains all stores which are provided to other components by
 * `Provider` component in `index.tsx`.
 */
const STORES: Readonly<Required<InjectedProps>> = {
  auth,
  foods,
  views
};

render(
  <Provider {...STORES}>
    <Application />
  </Provider>,
  document.getElementById("root")
);
