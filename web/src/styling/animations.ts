import { keyframes } from "styled-components";

/**
 * Default transition duration in seconds.
 */
export const TRANSITION_DURATION = .125;

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
