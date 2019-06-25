import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { Stage, Stages } from "../scene/Stage";
import { Anchor } from "./Anchor";
import { TRANSITION_DURATION } from "../styling/animations";
import { ACTIVE, DEFAULT_LABEL } from "../styling/colors";
import { UNIT } from "../styling/sizes";
import { InjectedProps } from "../store";

/**
 * Array of navigable stages using the navigation bar.
 */
const NAVIGABLE_STAGES: Readonly<Array<Stages>> = [
  new Stage("home", {}, {}),
  new Stage("diet", {}, {}),
  new Stage("measurements", {}, {}),
  new Stage("history", {}, {}),
  new Stage("administration", {}, {}),
  new Stage("settings", {}, {}),
  new Stage("logout", {}, {})
];

/**
 * Navigation bar component that is used to navigate to different parts of the
 * application.
 */
@inject("translations", "view")
@observer
export class Navigation extends React.Component<InjectedProps> {
  /**
   * Renders a navigation bar with anchors to stages defined in `NAVIGABLE_STAGES`.
   */
  public render() {
    const currentSceneName = this.props.view!.main.sceneName;
    const sceneTranslation = this.props.translations!.translation.scenes;

    return (
      <Container>
        <Bar>
          {NAVIGABLE_STAGES.map((stage, index) => (
            <Item
              key={index}
              stage={stage}
              isActive={currentSceneName === stage.sceneName}
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
  padding: 0 ${UNIT / 4}rem;
  box-sizing: border-box;
`;

/**
 * Item component props.
 */
interface ItemProps {
  /**
   * Whether or not this item is active.
   */
  isActive: boolean;
}

/**
 * One of the navigation bar items.
 */
const Item = styled(Anchor)<ItemProps>`
  height: ${UNIT}rem;
  padding: 0 ${UNIT / 4}rem;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${props => (props.isActive ? ACTIVE : DEFAULT_LABEL)};
  text-decoration: none;
  white-space: nowrap;

  transition: ${TRANSITION_DURATION}s;

  &:hover {
    color: ${ACTIVE};
  }
`;
