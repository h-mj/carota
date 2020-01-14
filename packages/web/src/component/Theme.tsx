import { inject, observer } from "mobx-react";
import * as React from "react";

import { Component } from "../base/Component";
import { ThemeProvider, createGlobalStyle } from "../styling/theme";

/**
 * Renders `GlobalStyle` component and renders it's children wrapped in
 * `ThemeProvider` which will provide the theme definition to its children.
 */
@inject("viewStore")
@observer
export class Theme extends Component {
  /**
   * Renders `ThemeProvider` that provides theme definition to all children
   * components alongside global theme component.
   */
  public render() {
    return (
      <ThemeProvider theme={this.props.viewStore!.theme}>
        <>
          <GlobalStyle />
          {this.props.children}
        </>
      </ThemeProvider>
    );
  }
}

/**
 * Global style that contains styling defined in global stylesheet.
 */
const GlobalStyle = createGlobalStyle`
  html {
    background-color: ${({ theme }) => theme.backgroundColor};
    color: ${({ theme }) => theme.colorSecondary};

    font-family: "Inter", sans-serif;
    font-size: 16px;
    letter-spacing: -0.011rem;
  }

  @supports (font-variation-settings: normal) {
    html { font-family: 'Inter var', sans-serif; }
  }

  body {
    margin: 0;
  }

  html, body, #root {
    height: 100%;
  }
`;
