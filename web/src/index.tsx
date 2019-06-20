import { inject, observer, Provider } from "mobx-react";
import * as React from "react";
import { render } from "react-dom";
import { createGlobalStyle } from "styled-components";
import { SceneNames, SCENES, Stage } from "./scene";
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
@observer
class Application extends React.Component<InjectedProps> {
  public render() {
    return this.getSceneComponent(this.props.scenes!.main);
  }

  /**
   * Returns scene component that matches given stage.
   *
   * @param stage Given stage.
   */
  private getSceneComponent(stage: Stage<SceneNames>) {
    const Scene = SCENES[stage.sceneName];

    return <Scene parameters={stage.parameters} />;
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
