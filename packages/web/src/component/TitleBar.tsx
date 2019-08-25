import * as React from "react";

import { Component } from "../base/Component";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";

/**
 * Title bar component props.
 */
interface TitleBarProps {
  /**
   * Close button click callback function.
   */
  onClose: () => void;
}

/**
 * Title bar component that is used to close underlying scene.
 */
export class TitleBar extends Component<TitleBarProps> {
  /**
   * Renders the title bar alongside close button.
   */
  public render() {
    return (
      <Bar>
        <Close onClick={this.handleClick}>✗</Close>
      </Bar>
    );
  }

  /**
   * Calls `onClose` prop callback function on close button click.
   */
  private handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    this.props.onClose();
  };
}

/**
 * Title bar component.
 */
const Bar = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.height};

  border-bottom: solid 1px ${({ theme }) => theme.borderColor};
`;

/**
 * Close button component.
 */
const Close = styled.button`
  ${RESET};

  float: right;

  width: ${({ theme }) => theme.height};
  height: ${({ theme }) => theme.height};

  color: ${({ theme }) => theme.secondaryColor};
  font-size: 1.5rem;

  cursor: pointer;
`;
