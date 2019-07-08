import { styled } from "../styling/theme";

/**
 * Component that fills entire browser viewport.
 */
export const Overlay = styled.div`
  position: fixed;
  z-index: 1000;

  width: 100%;
  height: 100%;
`;
