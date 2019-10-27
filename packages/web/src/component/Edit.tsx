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
export class Edit extends React.Component<EditProps> {
  /**
   * Renders the Edit button.
   */
  public render() {
    return (
      <EditButton onClick={this.props.onClick}>
        <Pencil />
      </EditButton>
    );
  }
}

/**
 * Edit button that enables meal entry editing.
 */
const EditButton = styled.button`
  ${RESET};

  width: ${({ theme }) => theme.heightHalf};
  height: ${({ theme }) => theme.heightHalf};

  flex-shrink: 0;

  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.borderColor};

  color: ${({ theme }) => theme.colorSecondary};
  line-height: 50%;
  text-align: center;

  cursor: pointer;
`;
