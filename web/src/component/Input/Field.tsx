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

  color: ${props => props.theme.states[props.state].borderColor};
  border-radius: ${BORDER_RADIUS}rem;
  box-shadow: 0 0 0
      ${props =>
        props.state === "disabled" || props.state === "default" ? 0.5 : 1}px,
    inset 0 0 0
      ${props =>
        props.state === "disabled" || props.state === "default" ? 0.5 : 1}px;

  background-color: ${props => props.theme.states[props.state].backgroundColor};

  font-size: 1rem;
  letter-spacing: -0.011rem;

  transition: ${TRANSITION};
`;
