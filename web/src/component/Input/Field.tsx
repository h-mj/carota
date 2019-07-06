import styled from "styled-components";
import { StateProps } from "../Component";
import { LIGHT } from "../../styling/light";
import { TRANSITION } from "../../styling/animations";
import { BORDER_RADIUS, UNIT_HEIGHT } from "../../styling/sizes";

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

  background-color: ${props => LIGHT[props.state].backgroundColor};

  color: ${props => LIGHT[props.state].color};
  font-size: 1rem;
  letter-spacing: -0.011rem;

  transition: ${TRANSITION};
`;
