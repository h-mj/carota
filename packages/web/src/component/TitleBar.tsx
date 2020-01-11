import { inject } from "mobx-react";
import * as React from "react";

import { Component } from "../base/Component";
import { styled } from "../styling/theme";
import { DeleteButton } from "./DeleteButton";

/**
 * Title bar component props.
 */
interface TitleBarProps {
  /**
   * Callback function that is called on close button click.
   */
  onClose: () => void;

  /**
   * Whether the title bar is used by the scanner.
   */
  scanner?: boolean;

  /**
   * Title bar title text.
   */
  title: string;
}

/**
 * Title bar component that is used to close underlying scene.
 */
@inject("viewStore")
export class TitleBar extends Component<TitleBarProps> {
  /**
   * Renders the title bar alongside close button.
   */
  public render() {
    return (
      <Bar scanner={this.props.scanner === true}>
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
   * Whether the title bar is used by scanner.
   */
  scanner: boolean;
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

  background-color: ${({ theme, scanner }) =>
    scanner ? "transparent" : theme.backgroundColor};
  border-bottom: solid 1px
    ${({ theme, scanner }) => (scanner ? "white" : theme.borderColor)};
  box-sizing: border-box;

  color: ${({ theme, scanner }) => (scanner ? "white" : theme.colorSecondary)};
`;

/**
 * Title text container.
 */
const Title = styled.div`
  padding-left: ${({ theme }) => theme.padding};

  display: flex;
  flex-grow: 1;
  align-items: center;
`;

/**
 * Close button component.
 */
const Close = styled(DeleteButton)`
  margin-left: auto;

  height: ${({ theme }) => theme.height};
  padding: 0 ${({ theme }) => theme.padding};
  box-sizing: content-box;
`;
