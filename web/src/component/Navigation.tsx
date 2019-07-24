import { inject, observer } from "mobx-react";
import * as React from "react";
import { SceneNames } from "../scene/Scene";
import { Component } from "./Component";
import { Anchor } from "./Anchor";
import { DURATION } from "../styling/animations";
import { styled } from "../styling/theme";

/**
 * Navigation bar component that is used to navigate to different parts of the
 * application by clicking on anchor elements inside it.
 */
@inject("views")
@observer
export class Navigation extends Component<{}, Record<SceneNames, string>> {
  /**
   * Renders a navigation bar with anchors to contexts provided by `ViewsStore`.
   */
  public render() {
    const {
      main: { sceneName },
      navigation
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
              selected={sceneName === context.sceneName}
            >
              {this.translation[context.sceneName]}
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
  padding: 0 calc(${({ theme }) => theme.PADDING} / 2);
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
  height: ${({ theme }) => theme.HEIGHT};
  padding: 0 calc(${({ theme }) => theme.PADDING} / 2);

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ selected, theme }) =>
    selected ? theme.PRIMARY_COLOR : theme.SECONDARY_COLOR};
  text-decoration: none;
  white-space: nowrap;

  transition: ${DURATION}s;
`;
