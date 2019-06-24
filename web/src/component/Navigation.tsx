import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { Anchor } from "./Anchor";
import { TRANSITION_DURATION } from "../styling/animations";
import { ACTIVE, DEFAULT_LABEL } from "../styling/colors";
import { UNIT } from "../styling/sizes";
import { Stage } from "../scene";
import { InjectedProps } from "../store";

/**
 * Stage list where it is possible to navigate to using navigation component.
 */
const NAVIGABLE_STAGES: Readonly<Array<Stage>> = [
  { sceneName: "home", parameters: {}, props: {} },
  { sceneName: "diet", parameters: {}, props: {} },
  { sceneName: "measurements", parameters: {}, props: {} },
  { sceneName: "history", parameters: {}, props: {} },
  { sceneName: "administration", parameters: {}, props: {} },
  { sceneName: "settings", parameters: {}, props: {} },
  { sceneName: "logout", parameters: {}, props: {} }
];

/**
 * Navigation bar component that is used to navigate to different parts of the
 * application.
 */
@inject("scenes", "translations")
@observer
export class Navigation extends React.Component<InjectedProps> {
  /**
   * Renders a navigation bar with anchors to stages defined in `NAVIGABLE_STAGES`.
   */
  public render() {
    const currentSceneName = this.props.scenes!.main.sceneName;
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
