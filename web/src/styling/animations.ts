import { keyframes } from "styled-components";

/**
 * Default animation/transition duration in seconds.
 */
export const DURATION = 0.125;

/**
 * Default animation/duration timing function.
 */
export const TIMING_FUNCTION = "cubic-bezier(0.4, 0.0, 0.2, 1)";

/**
 * Default transition rule value.
 */
export const TRANSITION = `${DURATION}s ${TIMING_FUNCTION}`;

/**
 * Animation that fades a component in.
 */
export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

/**
 * Animation that fades a component out.
 */
export const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

/**
 * Animation that scales a component in.
 */
export const scaleIn = keyframes`
  from { transform: scale(0); }
  to { transform: scale(1); }
  }
`;

/**
 * Animation that scales a component out.
 */
export const scaleOut = keyframes`
  from { transform: scale(1); }
  to { transform: scale(0); }
  }
`;
