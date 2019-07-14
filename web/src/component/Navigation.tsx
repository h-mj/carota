import { inject, observer } from "mobx-react";
import * as React from "react";
import { Anchor } from "./Anchor";
import { InjectedProps } from "../store/Store";
import { DURATION } from "../styling/animations";
import { UNIT_HEIGHT } from "../styling/sizes";
import { styled } from "../styling/theme";

/**
 * Navigation bar component that is used to navigate to different parts of the
 * application.
 */
@inject("views")
@observer
export class Navigation extends React.Component<InjectedProps> {
  /**
   * Renders a navigation bar with anchors to contexts provided by `ViewsStore`.
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
          {navigation.map((context, index) => (
            <Item
              key={index}
              context={context}
              selected={currentSceneName === context.sceneName}
            >
              {sceneTranslation[context.sceneName].title}
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
 * Item component props.
 */
interface ItemProps {
  /**
   * Whether or not this item is selected.
   */
  selected: boolean;
}

/**
 * One of the navigation bar items.
 */
const Item = styled(Anchor)<ItemProps>`
  height: ${UNIT_HEIGHT}rem;
  padding: 0 ${UNIT_HEIGHT / 4}rem;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${props =>
    props.theme[props.selected ? "colorPrimary" : "colorSecondary"]};
  text-decoration: none;
  white-space: nowrap;

  transition: ${DURATION}s;
`;
