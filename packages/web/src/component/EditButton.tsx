import * as React from "react";

import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";
import { Pencil } from "./collection/icons";

/**
 * Edit button component props.
 */
interface EditProps {
  /**
   * On click callback function.
   */
  onClick?: () => void;
}

/**
 * Edit button component.
 */
export class EditButton extends React.Component<EditProps> {
  /**
   * Renders the Edit button.
   */
  public render() {
    return (
      <Button onClick={this.props.onClick}>
        <Pencil />
      </Button>
    );
  }
}

/**
 * Edit button that enables meal entry editing.
 */
const Button = styled.button`
  ${RESET};

  width: ${({ theme }) => theme.heightHalf};
  height: ${({ theme }) => theme.heightHalf};

  flex-shrink: 0;

  line-height: 50%;
  text-align: center;

  cursor: pointer;
`;
