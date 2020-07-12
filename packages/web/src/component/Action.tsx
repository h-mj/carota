import * as React from "react";

import { RESET } from "../styling/stylesheets";
import { css, styled } from "../styling/theme";
import { Plus } from "./collection/icons";

/**
 * Action component props
 */
interface ActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Whether the button should be fixed and positioned at the bottom right.
   */
  fixed?: boolean;

  /**
   * Component that will be rendered inside the action button.
   */
  icon?: JSX.Element;
}

/**
 * Button component that is used to initiate some kind of action.
 */
export const Action: React.FunctionComponent<ActionProps> = (props) => (
  <ActionButton {...props}>{props.icon || <Plus />}</ActionButton>
);

/**
 * Button fixed positioning style.
 */
const fixedStyle = css`
  position: fixed;
  right: ${({ theme }) => theme.heightHalf};
  bottom: ${({ theme }) => theme.heightHalf};
`;

/**
 * Circular button component.
 */
export const ActionButton = styled.button<ActionProps>`
  ${RESET};

  z-index: 1;

  width: ${({ theme }) => theme.height};
  height: ${({ theme }) => theme.height};

  border-radius: 50%;
  background-color: ${({ theme }) => theme.colorActive};

  cursor: pointer;

  & > * {
    display: block;
    width: 100%;
    height: 1rem;
  }

  ${({ fixed }) => fixed && fixedStyle};
`;
