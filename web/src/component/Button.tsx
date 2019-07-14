import * as React from "react";
import { RESET } from "../styling/stylesheets";
import { BORDER_RADIUS, UNIT_HEIGHT } from "../styling/sizes";
import { getState, styled, StateProps } from "../styling/theme";

/**
 * Button component properties.
 */
interface ButtonProps {
  /**
   * Whether or not button is disabled.
   */
  disabled?: boolean;

  /**
   * Whether or not button is invalid.
   */
  invalid?: boolean;
}

/**
 * Button component.
 */
export class Button extends React.Component<ButtonProps> {
  /**
   * Renders button component inside a field component.
   */
  public render() {
    const { children, disabled, invalid } = this.props;

    return (
      <ButtonElement
        disabled={disabled}
        state={getState(disabled, true, invalid)}
      >
        {children}
      </ButtonElement>
    );
  }
}

/**
 * The actual button element.
 */
const ButtonElement = styled.button<StateProps>`
  ${RESET};

  width: 100%;
  height: ${UNIT_HEIGHT}rem;

  border-radius: ${BORDER_RADIUS}rem;
  background-color: ${props => props.theme.states[props.state].borderColor};

  color: ${props => props.theme.states[props.state].backgroundColor};

  cursor: pointer;
`;
