import { inject, observer } from "mobx-react";
import * as React from "react";
import { InjectedProps } from "../store/Store";
import { createGlobalStyle, LIGHT, ThemeProvider } from "../styling/theme";

/**
 * Renders `GlobalStyle` component and renders it's children wrapped in `ThemeProvider`.
 */
@inject("views")
@observer
export class Theme extends React.Component<InjectedProps> {
  public render() {
    return (
      <ThemeProvider theme={LIGHT}>
        <>
          <GlobalStyle hideOverflow={this.props.views!.hideOverflow} />
          {this.props.children}
        </>
      </ThemeProvider>
    );
  }
}

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
    background-color: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.colorSecondary};

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
