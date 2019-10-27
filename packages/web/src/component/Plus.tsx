import * as React from "react";

import { RESET } from "../styling/stylesheets";
import { css, styled } from "../styling/theme";

/**
 * Plus component props
 */
interface PlusProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Whether plus button should be positioned at the bottom right.
   */
  fixed?: boolean;
}

/**
 * Button component that is used to add some item to somewhere.
 */
export const Plus: React.FunctionComponent<PlusProps> = props => (
  <PlusButton {...props}>+</PlusButton>
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
 * Circular button with `+` label.
 */
export const PlusButton = styled.button<PlusProps>`
  ${RESET};

  z-index: 1;

  width: ${({ theme }) => theme.height};
  height: ${({ theme }) => theme.height};

  border-radius: 50%;
  background-color: ${({ theme }) => theme.colorOrange};

  color: ${({ theme }) => theme.colorPrimary};
  font-feature-settings: "case";
  font-size: 2rem;
  text-align: center;

  cursor: pointer;

  ${({ fixed }) => fixed && fixedStyle};
`;
