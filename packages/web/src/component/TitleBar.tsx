import { inject } from "mobx-react";
import * as React from "react";

import { Component } from "../base/Component";
import { Scene, Scenes } from "../base/Scene";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";

/**
 * Title bar component props.
 */
interface TitleBarProps {
  /**
   * Either scene that will be popped from the scene stack or close callback
   * function that will be called on close button click.
   */
  close: Scenes | (() => void);

  /**
   * Title bar title text.
   */
  title: string;
}

/**
 * Title bar component that is used to close underlying scene.
 */
@inject("views")
export class TitleBar extends Component<TitleBarProps> {
  /**
   * Renders the title bar alongside close button.
   */
  public render() {
    return (
      <Bar>
        <Title>{this.props.title}</Title>
        <Close onClick={this.handleClick}>✗</Close>
      </Bar>
    );
  }

  /**
   * Calls `onClose` prop callback function on close button click.
   */
  private handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (this.props.close instanceof Scene) {
      this.props.views!.pop(this.props.close);
    } else {
      this.props.close();
    }
  };
}

/**
 * Title bar component.
 */
const Bar = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.height};

  display: flex;
  justify-items: flex-end;

  position: sticky;
  z-index: 1;
  top: 0;

  background-color: ${({ theme }) => theme.backgroundColor};
  border-bottom: solid 1px ${({ theme }) => theme.borderColor};
  box-sizing: border-box;
`;

/**
 * Title text container.
 */
const Title = styled.div`
  padding-left: ${({ theme }) => theme.padding};

  display: flex;
  flex-grow: 1;
  align-items: center;

  color: ${({ theme }) => theme.colorSecondary};
`;

/**
 * Close button component.
 */
const Close = styled.button`
  ${RESET};

  height: ${({ theme }) => theme.height};

  margin-left: auto;
  padding: 0 ${({ theme }) => theme.padding};

  color: ${({ theme }) => theme.colorSecondary};
  font-size: 1.5rem;
  text-align: center;

  cursor: pointer;
`;
