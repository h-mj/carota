import { keyframes } from "styled-components";

/**
 * Default transition duration in seconds.
 */
export const TRANSITION_DURATION = 0.1;

/**
 * Default transition.
 */
export const TRANSITION = `transition: ${TRANSITION_DURATION}s;`;

/**
 * Animation that fades a component in.
 */
export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

/**
 * Animation that scales a component in.
 */
export const scaleIn = keyframes`
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
`;

/**
 * Animation that scales a component out.
 */
export const scaleOut = keyframes`
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
`;
