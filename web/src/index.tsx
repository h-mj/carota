import { inject, Provider } from "mobx-react";
import * as React from "react";
import { render } from "react-dom";
import { createGlobalStyle } from "styled-components";
import { SCENES } from "./scene";
import { InjectedProps, STORES } from "./store";
import { BACKGROUND, FOREGROUND } from "./styling/colors";

/**
 * Global style that contains styling defined in global stylesheet.
 */
const GlobalStyle = createGlobalStyle`
  @import url("https://rsms.me/inter/inter.css");

  html {
    background-color: ${BACKGROUND};
    color: ${FOREGROUND};

    font-family: "Inter", sans-serif;
    font-size: 16px;
    letter-spacing: -0.011rem;
  }

  body {
    margin: 0;
  }
`;

/**
 * The root component.
 */
@inject("scenes")
class Application extends React.Component<InjectedProps> {
  public render() {
    const Main = SCENES[this.props.scenes!.main];

    return <Main />;
  }
}

render(
  <>
    <GlobalStyle />
    <Provider {...STORES}>
      <Application />
    </Provider>
  </>,
  document.getElementById("root")
);
