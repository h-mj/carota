import { TRANSITION } from "../../styling/animations";
import { BORDER_RADIUS, UNIT_HEIGHT } from "../../styling/sizes";
import { StateProps, styled } from "../../styling/theme";

/**
 * Component that contains any input component.
 */
export const Field = styled.div<StateProps>`
  position: relative;

  display: flex;
  align-items: center;

  height: ${UNIT_HEIGHT}rem;

  border-radius: ${BORDER_RADIUS}rem;
  box-shadow: 0 0 0 1px, inset 0 0 0 1px;

  background-color: ${props => props.theme.states[props.state].backgroundColor};

  color: ${props => props.theme.states[props.state].color};
  font-size: 1rem;
  letter-spacing: -0.011rem;

  transition: ${TRANSITION};
`;
