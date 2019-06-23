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
  { sceneName: "home", parameters: {} },
  { sceneName: "diet", parameters: {} },
  { sceneName: "measurements", parameters: {} },
  { sceneName: "history", parameters: {} },
  { sceneName: "administration", parameters: {} },
  { sceneName: "settings", parameters: {} },
  { sceneName: "logout", parameters: {} }
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
    );
  }
}

/**
 * Bar that contains navigation anchor components.
 */
const Bar = styled.nav`
  height: ${UNIT}rem;
  display: grid;
  align-items: center;
  grid-gap: ${UNIT / 2}rem;
  padding: 0 ${UNIT / 2}rem;
  grid-template-columns: min-content;
  grid-auto-flow: column;
  grid-auto-columns: min-content;
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
  color: ${props => (props.isActive ? ACTIVE : DEFAULT_LABEL)};
  text-decoration: none;
  white-space: nowrap;

  transition: ${TRANSITION_DURATION}s;

  &:hover {
    color: ${ACTIVE};
  }
`;
