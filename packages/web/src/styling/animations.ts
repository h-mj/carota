import { keyframes } from "styled-components";

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
