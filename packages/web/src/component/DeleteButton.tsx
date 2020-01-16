import * as React from "react";

import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";

/**
 * Delete button component props.
 */
interface DeleteButtonProps {
  /**
   * Class name of the button. Used by styled-components to style the `Button`
   * component.
   */
  className?: string;

  /**
   * On click callback function.
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * Delete button component.
 */
export class DeleteButton extends React.Component<DeleteButtonProps> {
  /**
   * Renders the delete button.
   */
  public render() {
    return (
      <Button className={this.props.className} onClick={this.props.onClick}>
        ✗
      </Button>
    );
  }
}

/**
 * Button element with X symbol as its text.
 */
const Button = styled.button.attrs({ type: "button" })`
  ${RESET};

  width: ${({ theme }) => theme.heightHalf};
  height: ${({ theme }) => theme.heightHalf};

  flex-shrink: 0;

  color: ${({ theme }) => theme.colorSecondary};
  font-size: 1.6rem;
  letter-spacing: -0.019rem;
  line-height: 50%;
  text-align: center;

  cursor: pointer;
`;
