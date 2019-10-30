import { inject } from "mobx-react";
import * as React from "react";

import { Component } from "../base/Component";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";

/**
 * Title bar component props.
 */
interface TitleBarProps {
  /**
   * Callback function that is called on close button click.
   */
  onClose: () => void;

  /**
   * Title bar title text.
   */
  title: string;

  /**
   * Whether title bar's background should be transparent.
   */
  transparent?: boolean;
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
      <Bar transparent={this.props.transparent === true}>
        <Title>{this.props.title}</Title>
        <Close onClick={this.props.onClose}>✗</Close>
      </Bar>
    );
  }
}

/**
 * Bar component props.
 */
interface BarProps {
  /**
   * Whether the background should be transparent.
   */
  transparent: boolean;
}

/**
 * Title bar component.
 */
const Bar = styled.div<BarProps>`
  width: 100%;
  height: ${({ theme }) => theme.height};

  display: flex;
  justify-items: flex-end;

  position: sticky;
  z-index: 1;
  top: 0;

  background-color: ${({ theme, transparent }) =>
    transparent ? "transparent" : theme.backgroundColor};
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
