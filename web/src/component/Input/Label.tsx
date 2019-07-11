import { TRANSITION } from "../../styling/animations";
import { UNIT_HEIGHT } from "../../styling/sizes";
import { StateProps, styled } from "../../styling/theme";

/**
 * Input label component.
 */
export const Label = styled.div<StateProps>`
  position: absolute;
  top: -${UNIT_HEIGHT / 8}rem;
  left: ${UNIT_HEIGHT / 4 - UNIT_HEIGHT / 16}rem;

  display: flex;
  align-items: center;

  height: ${UNIT_HEIGHT / 4}rem;

  padding: 0 ${UNIT_HEIGHT / 16}rem;

  background-color: ${({ theme }) => theme.backgroundColor};

  color: ${props => props.theme.states[props.state].color};
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0;
  white-space: nowrap;

  pointer-events: none;

  transition: ${TRANSITION};
`;
