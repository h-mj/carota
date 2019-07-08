import { action } from "mobx";
import { inject, observer, Provider } from "mobx-react";
import * as React from "react";
import { render } from "react-dom";
import styled, { createGlobalStyle } from "styled-components";
import { Loader } from "./component/Loader";
import { Navigation } from "./component/Navigation";
import { NotificationContainer } from "./component/NotificationContainer";
import { Overlay } from "./component/Overlay";
import { InjectedProps } from "./store/Store";
import { auth } from "./store/AuthStore";
import { foods } from "./store/FoodsStore";
import { views } from "./store/ViewsStore";
import { LIGHT } from "./styling/light";
import { UNIT_HEIGHT } from "./styling/sizes";

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
    background-color: ${LIGHT.default.backgroundColor};
    color: ${LIGHT.default.color};

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
    const { hideOverflow, main, side } = this.props.views!;

    return (
      <>
        <GlobalStyle hideOverflow={hideOverflow} />

        <Navigation />
        {main.render("main")}

        {side !== undefined && (
          <Overlay onClick={this.handleOverlayClick}>
            <Side>{side.render("side")}</Side>
          </Overlay>
        )}

        <Loader />
        <NotificationContainer />
      </>
    );
  }

  @action
  private handleOverlayClick: React.MouseEventHandler<
    HTMLDivElement
  > = event => {
    if (event.target === event.currentTarget) {
      this.props.views!.refocus();
    }
  };
}

/**
 * Component that contains the side stage.
 */
const Side = styled.div`
  max-width: ${8 * UNIT_HEIGHT}rem;
  width: 100%;
  height: 100%;

  overflow: auto;

  background-color: ${LIGHT.backgroundColor};
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.22);
`;

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
