import { inject, observer, Provider } from "mobx-react";
import * as React from "react";
import { render } from "react-dom";
import { createGlobalStyle } from "styled-components";
import { SceneNames, SCENES, Stage } from "./scene";
import { Scene } from "./scene/Scene";
import { Alerts } from "./component/Alerts";
import { Loader } from "./component/Loader";
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
  }
`;

/**
 * The root component.
 */
@inject("scenes")
@observer
class Application extends React.Component<InjectedProps> {
  public render() {
    const { alerts, waiting, main } = this.props.scenes!;

    return (
      <>
        <GlobalStyle hideOverflow={waiting} />
        {this.renderSceneComponent(main)}
        <Loader isLoading={waiting} />
        <Alerts alerts={alerts} />
      </>
    );
  }

  /**
   * Returns scene component that matches given stage.
   *
   * @param stage Given stage.
   */
  private renderSceneComponent(stage: Stage<SceneNames>) {
    const SceneComponent: typeof Scene = SCENES[stage.sceneName];

    return <SceneComponent parameters={stage.parameters} />;
  }
}

render(
  <Provider {...STORES}>
    <Application />
  </Provider>,
  document.getElementById("root")
);
