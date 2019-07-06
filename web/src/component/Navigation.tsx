import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { StateProps } from "./Component";
import { Anchor } from "./Anchor";
import { InjectedProps } from "../store/Store";
import { DURATION } from "../styling/animations";
import { LIGHT } from "../styling/light";
import { UNIT_HEIGHT } from "../styling/sizes";

/**
 * Navigation bar component that is used to navigate to different parts of the
 * application.
 */
@inject("views")
@observer
export class Navigation extends React.Component<InjectedProps> {
  /**
   * Renders a navigation bar with anchors to stages provided by `ViewsStore`.
   */
  public render() {
    const {
      main: { sceneName: currentSceneName },
      navigation,
      translation: { scenes: sceneTranslation }
    } = this.props.views!;

    if (navigation === undefined) {
      return null;
    }

    return (
      <Container>
        <Bar>
          {navigation.map((stage, index) => (
            <Item
              key={index}
              stage={stage}
              state={
                currentSceneName === stage.sceneName ? "focused" : "default"
              }
            >
              {sceneTranslation[stage.sceneName].title}
            </Item>
          ))}
        </Bar>
      </Container>
    );
  }
}

/**
 * Navigation component container.
 */
const Container = styled.div`
  overflow-x: auto;
  flex-shrink: 0;
`;

/**
 * Bar that contains navigation anchor components.
 */
const Bar = styled.nav`
  display: inline-flex;
  padding: 0 ${UNIT_HEIGHT / 4}rem;
  box-sizing: border-box;
`;

/**
 * One of the navigation bar items.
 */
const Item = styled(Anchor)<StateProps>`
  height: ${UNIT_HEIGHT}rem;
  padding: 0 ${UNIT_HEIGHT / 4}rem;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${props => LIGHT[props.state].color};
  text-decoration: none;
  white-space: nowrap;

  transition: ${DURATION}s;
`;
