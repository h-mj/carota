import * as React from "react";

import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";

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
    return <EditButton onClick={this.props.onClick}>↺</EditButton>;
  }
}

/**
 * Edit button that enables meal entry editing.
 */
const EditButton = styled.button`
  ${RESET};

  margin-left: ${({ theme }) => theme.paddingSecondaryHalf};
  color: ${({ theme }) => theme.colorSecondary};
  cursor: pointer;
`;
